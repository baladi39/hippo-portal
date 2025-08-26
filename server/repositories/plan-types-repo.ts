import { PlanService } from "../services/plan-service";

/**
 * Plan Type DTO for frontend consumption
 */
export interface PlanTypeDto {
  id: number;
  name: string;
  category: string;
}

/**
 * Plan Types Repository - handles business logic for plan types
 * Transforms service layer data for frontend consumption
 */
export class PlanTypesRepo {
  constructor(private planService: PlanService) {}

  /**
   * Find all active plan types
   */
  async findAll(): Promise<PlanTypeDto[]> {
    try {
      const planTypes = await this.planService.fetchPlanTypes();
      return planTypes.map(this.mapToPlanTypeDto);
    } catch (error) {
      console.error("Error in PlanTypesRepo.findAll:", error);
      throw error;
    }
  }

  /**
   * Find a plan type by ID
   */
  async findById(planTypeId: number): Promise<PlanTypeDto | null> {
    try {
      const planType = await this.planService.fetchPlanTypeById(planTypeId);
      return planType ? this.mapToPlanTypeDto(planType) : null;
    } catch (error) {
      console.error(`Error in PlanTypesRepo.findById(${planTypeId}):`, error);
      throw error;
    }
  }

  /**
   * Map plan type service model to DTO for client consumption
   */
  private mapToPlanTypeDto(planType: {
    plan_type_id: number;
    plan_type_name: string;
    category: string;
  }): PlanTypeDto {
    return {
      id: planType.plan_type_id,
      name: planType.plan_type_name,
      category: planType.category,
    };
  }
}
