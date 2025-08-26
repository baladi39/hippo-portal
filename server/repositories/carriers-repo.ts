import {
  CarrierDto,
  CarrierFilters,
  CarrierModel,
  CreateCarrierData,
} from "../models/carrier-model";
import { CarrierService } from "../services/carrier-service";

export class CarriersRepo {
  constructor(private carrierService: CarrierService) {}

  /**
   * Find all carriers with optional filters
   */
  async findAll(filters?: CarrierFilters): Promise<{
    carriers: CarrierDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.carrierService.fetchCarriers(filters);
      const carrierDtos = response.results.carriers.map(this.mapToCarrierDto);

      return {
        carriers: carrierDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in CarriersRepo.findAll:", error);
      throw error;
    }
  }

  /**
   * Find a carrier by ID
   */
  async findById(carrierId: number): Promise<CarrierDto> {
    try {
      const carrier = await this.carrierService.fetchCarrierById(carrierId);
      return this.mapToCarrierDto(carrier);
    } catch (error) {
      console.error(`Error in CarriersRepo.findById(${carrierId}):`, error);
      throw error;
    }
  }

  /**
   * Create a new carrier
   */
  async create(carrierData: CreateCarrierData): Promise<CarrierDto> {
    try {
      const carrier = await this.carrierService.createCarrier(carrierData);
      return this.mapToCarrierDto(carrier);
    } catch (error) {
      console.error("Error in CarriersRepo.create:", error);
      throw error;
    }
  }

  /**
   * Update a carrier
   */
  async update(
    carrierId: number,
    carrierData: Partial<CreateCarrierData>
  ): Promise<CarrierDto> {
    try {
      const carrier = await this.carrierService.updateCarrier(
        carrierId,
        carrierData
      );
      return this.mapToCarrierDto(carrier);
    } catch (error) {
      console.error(`Error in CarriersRepo.update(${carrierId}):`, error);
      throw error;
    }
  }

  /**
   * Delete a carrier (soft delete)
   */
  async delete(carrierId: number): Promise<CarrierDto> {
    try {
      const carrier = await this.carrierService.deleteCarrier(carrierId);
      return this.mapToCarrierDto(carrier);
    } catch (error) {
      console.error(`Error in CarriersRepo.delete(${carrierId}):`, error);
      throw error;
    }
  }

  /**
   * Find all active carriers for dropdowns
   */
  async findAllActive(): Promise<CarrierDto[]> {
    try {
      const carriers = await this.carrierService.fetchActiveCarriers();
      return carriers.map(this.mapToCarrierDto);
    } catch (error) {
      console.error("Error in CarriersRepo.findAllActive:", error);
      throw error;
    }
  }

  /**
   * Map API carrier model to DTO for the client
   */
  private mapToCarrierDto(carrier: CarrierModel): CarrierDto {
    return {
      carrierId: carrier.carrier_id,
      companyName: carrier.company_name,
      isActive: carrier.is_active,
      createdAt: carrier.created_at,
      updatedAt: carrier.updated_at,
    };
  }
}
