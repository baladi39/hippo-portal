import {
  AccountDto,
  AccountFilters,
  AccountModel,
  AccountWithPlansDto,
  DashboardSummary,
  PlanDto,
  PlanFilters,
  PlanWithAccountModel,
} from "../models/account-model";
import { AccountService } from "../services/account-service";

/**
 * Accounts Repository - handles business logic and data transformation
 * between the service layer and the frontend
 */
export class AccountsRepo {
  constructor(private accountService: AccountService) {}

  /**
   * Find all accounts with optional filters
   */
  async findAll(filters?: AccountFilters): Promise<{
    accounts: AccountDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.accountService.fetchAccounts(filters);
      const accountDtos = response.results.accounts.map(this.mapToAccountDto);

      return {
        accounts: accountDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in AccountsRepo.findAll:", error);
      throw error;
    }
  }

  /**
   * Find account by ID
   */
  async findById(accountId: number): Promise<AccountDto> {
    try {
      const account = await this.accountService.fetchAccountById(accountId);
      return this.mapToAccountDto(account);
    } catch (error) {
      console.error(`Error in AccountsRepo.findById(${accountId}):`, error);
      throw error;
    }
  }

  /**
   * Find all plans with account information
   */
  async findAllPlansWithAccounts(filters?: PlanFilters): Promise<{
    plans: PlanDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.accountService.fetchPlansWithAccounts(
        filters
      );
      const planDtos = response.results.plans.map(this.mapToPlanDto);

      return {
        plans: planDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in AccountsRepo.findAllPlansWithAccounts:", error);
      throw error;
    }
  }

  /**
   * Search plans with account information (for the main accounts page)
   */
  async searchPlansWithAccounts(searchTerm: string): Promise<{
    plans: PlanDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      // Get all plans first, then filter client-side for complex search
      const response = await this.accountService.fetchPlansWithAccounts();

      const filteredPlans = response.results.plans.filter((plan) => {
        const accountName = plan.account.account.toLowerCase();
        const carrier = plan.carrier.toLowerCase();
        const planType = plan.plan_type.toLowerCase();
        const search = searchTerm.toLowerCase();

        return (
          accountName.includes(search) ||
          carrier.includes(search) ||
          planType.includes(search)
        );
      });

      const planDtos = filteredPlans.map(this.mapToPlanDto);

      return {
        plans: planDtos,
        total_count: filteredPlans.length,
        message: "Plans searched successfully",
        success: true,
      };
    } catch (error) {
      console.error("Error in AccountsRepo.searchPlansWithAccounts:", error);
      throw error;
    }
  }

  /**
   * Find accounts with their plans summary
   */
  async findAccountsWithPlans(): Promise<AccountWithPlansDto[]> {
    try {
      const [accountsResponse, plansResponse] = await Promise.all([
        this.accountService.fetchAccounts(),
        this.accountService.fetchPlansWithAccounts(),
      ]);

      const accounts = accountsResponse.results.accounts;
      const plans = plansResponse.results.plans;

      return accounts.map((account) => {
        const accountPlans = plans.filter(
          (p) => p.account_id === account.account_id
        );
        const today = new Date();
        const thirtyDaysFromNow = new Date(
          today.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        const upcomingRenewals = accountPlans.filter((plan) => {
          const renewalDate = new Date(plan.renewal_date);
          return renewalDate >= today && renewalDate <= thirtyDaysFromNow;
        }).length;

        return {
          accountId: account.account_id,
          accountName: account.account,
          accountOfficeDivision: account.state,
          accountPrimarySalesLead: "TBD", // Future field
          accountClassification: "TBD", // Future field
          plans: accountPlans.map((plan) => this.mapToPlanDto(plan)),
          totalPlans: accountPlans.length,
          upcomingRenewals,
        };
      });
    } catch (error) {
      console.error("Error in AccountsRepo.findAccountsWithPlans:", error);
      throw error;
    }
  }

  /**
   * Generate dashboard summary statistics
   */
  async generateDashboardSummary(): Promise<DashboardSummary> {
    try {
      const response = await this.accountService.fetchPlansWithAccounts();
      const plans = response.results.plans;

      const today = new Date();
      const thirtyDaysFromNow = new Date(
        today.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      const ninetyDaysFromNow = new Date(
        today.getTime() + 90 * 24 * 60 * 60 * 1000
      );

      const summary: DashboardSummary = {
        plans: {
          upForRenewal: 0,
          expiredNoAction: 0,
          newBusiness: 0,
        },
        products: {
          upForRenewal: 0,
          expiredNoAction: 0,
          newBusiness: 0,
        },
        recordAssignments: {
          dueToday: 0,
          pastDue: 0,
          upcoming: 0,
        },
        activities: {
          dueToday: 0,
          pastDue: 0,
          upcoming: 0,
        },
        requests: {
          dueToday: 0,
          pastDue: 0,
          responses: 0,
        },
      };

      plans.forEach((plan) => {
        const renewalDate = new Date(plan.renewal_date);
        const effectiveDate = new Date(plan.effective_date);

        // Plans up for renewal (within 30 days)
        if (renewalDate >= today && renewalDate <= thirtyDaysFromNow) {
          summary.plans.upForRenewal++;
        }

        // Expired plans with no action (past renewal date)
        if (renewalDate < today && plan.status === "active") {
          summary.plans.expiredNoAction++;
        }

        // New business (effective date within last 90 days)
        const ninetyDaysAgo = new Date(
          today.getTime() - 90 * 24 * 60 * 60 * 1000
        );
        if (effectiveDate >= ninetyDaysAgo && effectiveDate <= today) {
          summary.plans.newBusiness++;
        }
      });

      // Products summary (similar logic to plans for now)
      summary.products = { ...summary.plans };

      return summary;
    } catch (error) {
      console.error("Error in AccountsRepo.generateDashboardSummary:", error);
      throw error;
    }
  }

  /**
   * Update account information
   */
  async updateAccount(
    accountId: number,
    updates: Partial<AccountDto>
  ): Promise<AccountDto> {
    try {
      // Convert DTO updates back to model format
      const modelUpdates: Partial<AccountModel> = {
        account: updates.accountName,
        state: updates.state,
        sba: updates.sba,
        commission_1_basis: updates.commissionBasis1,
        commission_2_basis: updates.commissionBasis2,
        flat_fee: updates.flatFee,
        percentage: updates.percentage,
      };

      const updatedAccount = await this.accountService.updateAccount(
        accountId,
        modelUpdates
      );
      return this.mapToAccountDto(updatedAccount);
    } catch (error) {
      console.error(
        `Error in AccountsRepo.updateAccount(${accountId}):`,
        error
      );
      throw error;
    }
  }

  /**
   * Create new account
   */
  async createAccount(
    accountData: Omit<AccountDto, "accountId" | "createdDate" | "updatedDate">
  ): Promise<AccountDto> {
    try {
      const modelData: Omit<
        AccountModel,
        "account_id" | "created_date" | "updated_date"
      > = {
        account: accountData.accountName,
        sba: accountData.sba,
        state: accountData.state,
        commission_1_basis: accountData.commissionBasis1,
        commission_2_basis: accountData.commissionBasis2,
        flat_fee: accountData.flatFee,
        percentage: accountData.percentage,
      };

      const newAccount = await this.accountService.createAccount(modelData);
      return this.mapToAccountDto(newAccount);
    } catch (error) {
      console.error("Error in AccountsRepo.createAccount:", error);
      throw error;
    }
  }

  /**
   * Map Account model to DTO for client consumption
   */
  private mapToAccountDto(account: AccountModel): AccountDto {
    return {
      accountId: account.account_id,
      accountName: account.account,
      sba: account.sba,
      state: account.state,
      officeDivision: account.state, // Using state as office division for now
      primarySalesLead: "TBD", // Future field
      classification: "TBD", // Future field
      commissionBasis1: account.commission_1_basis,
      commissionBasis2: account.commission_2_basis,
      flatFee: account.flat_fee,
      percentage: account.percentage,
      createdDate: account.created_date,
      updatedDate: account.updated_date,
    };
  }

  /**
   * Map Plan with Account model to Plan DTO for client consumption
   */
  private mapToPlanDto(planWithAccount: PlanWithAccountModel): PlanDto {
    return {
      planId: planWithAccount.plan_id,
      accountId: planWithAccount.account_id,
      accountName: planWithAccount.account.account,
      accountOfficeDivision: planWithAccount.account.state,
      accountPrimarySalesLead: "TBD", // Future field
      accountClassification: "TBD", // Future field
      carrier: planWithAccount.carrier,
      planType: planWithAccount.plan_type,
      planName: planWithAccount.carrier, // Using carrier as plan name for now
      policyGroupNumber: planWithAccount.policy_group_number,
      effectiveDate: planWithAccount.effective_date,
      renewalDate: planWithAccount.renewal_date,
      cancellationDate: planWithAccount.cancellation_date,
      status: planWithAccount.status,
      enrollment: "TBD", // Future field
      annualRevenue: "TBD", // Future field
      createdDate: planWithAccount.created_date,
      updatedDate: planWithAccount.updated_date,
    };
  }
}
