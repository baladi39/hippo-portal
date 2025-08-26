"use server";

import { AccountDto } from "@/server/models/account-model";
import { CarrierFilters } from "@/server/models/carrier-model";
import { AccountsRepo } from "@/server/repositories/accounts-repo";
import { CarriersRepo } from "@/server/repositories/carriers-repo";
import { AccountService } from "@/server/services/account-service";
import { CarrierService } from "@/server/services/carrier-service";

const carrierService = new CarrierService();
const carriersRepo = new CarriersRepo(carrierService);

const accountService = new AccountService();
const accountsRepo = new AccountsRepo(accountService);

// Optional: Re-export types for client use
export interface Carrier {
  carrierId: number;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CarriersResponse {
  message: string;
  carriers: Carrier[];
  total_count: number;
  success: boolean;
}

// Re-export account types for client use
export type { AccountDto };

/**
 * Fetch all carriers with optional filters
 */
export const fetchCarriers = async (filters?: CarrierFilters) => {
  try {
    return await carriersRepo.findAll(filters);
  } catch (error) {
    console.error("Error fetching carriers:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch carriers");
  }
};

/**
 * Fetch all active carriers for dropdown/select options
 */
export const fetchActiveCarriers = async () => {
  try {
    return await carriersRepo.findAllActive();
  } catch (error) {
    console.error("Error fetching active carriers:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch active carriers");
  }
};

/**
 * Fetch a specific carrier by ID
 */
export const fetchCarrierById = async (carrierId: number) => {
  try {
    return await carriersRepo.findById(carrierId);
  } catch (error) {
    console.error(`Error fetching carrier ID ${carrierId}:`, error);
    throw error instanceof Error ? error : new Error("Failed to fetch carrier");
  }
};

/**
 * Fetch account by ID
 */
export const fetchAccountById = async (
  accountId: number
): Promise<AccountDto> => {
  try {
    return await accountsRepo.findById(accountId);
  } catch (error) {
    console.error(`Error fetching account ID ${accountId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account by ID");
  }
};

/**
 * Fetch account by name - searches for exact or partial match
 */
export const fetchAccountByName = async (
  accountName: string
): Promise<AccountDto | null> => {
  try {
    const result = await accountsRepo.findAll({
      searchTerm: accountName,
      limit: 10,
    });

    // Look for exact match first
    const exactMatch = result.accounts.find(
      (account) =>
        account.accountName.toLowerCase() === accountName.toLowerCase()
    );

    if (exactMatch) {
      return exactMatch;
    }

    // If no exact match, return the first partial match
    if (result.accounts.length > 0) {
      return result.accounts[0];
    }

    return null;
  } catch (error) {
    console.error(`Error fetching account by name "${accountName}":`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to fetch account by name");
  }
};

/**
 * Search accounts by name - returns multiple matches
 */
export const searchAccountsByName = async (
  searchTerm: string
): Promise<AccountDto[]> => {
  try {
    const result = await accountsRepo.findAll({ searchTerm, limit: 20 });
    return result.accounts;
  } catch (error) {
    console.error(`Error searching accounts by name "${searchTerm}":`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to search accounts");
  }
};
export const createCarrier = async (carrierData: {
  company_name: string;
  is_active?: boolean;
}) => {
  try {
    return await carriersRepo.create(carrierData);
  } catch (error) {
    console.error("Error creating carrier:", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to create carrier");
  }
};

/**
 * Update an existing carrier
 */
export const updateCarrier = async (
  carrierId: number,
  carrierData: Partial<{ company_name: string; is_active: boolean }>
) => {
  try {
    return await carriersRepo.update(carrierId, carrierData);
  } catch (error) {
    console.error(`Error updating carrier ID ${carrierId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update carrier");
  }
};

/**
 * Delete a carrier (soft delete by setting is_active to false)
 */
export const deleteCarrier = async (carrierId: number) => {
  try {
    return await carriersRepo.delete(carrierId);
  } catch (error) {
    console.error(`Error deleting carrier ID ${carrierId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to delete carrier");
  }
};
