import { supabase } from "@/lib/supabase";
import {
  CarrierFilters,
  CarrierModel,
  CarriersResponse,
  CreateCarrierData,
} from "../models/carrier-model";

export class CarrierService {
  /**
   * Fetch all carriers with optional filters
   */
  async fetchCarriers(filters?: CarrierFilters): Promise<CarriersResponse> {
    try {
      let query = supabase.from("carriers").select("*");

      // Apply filters
      if (filters?.searchTerm) {
        query = query.ilike("company_name", `%${filters.searchTerm}%`);
      }

      if (filters?.isActive !== undefined) {
        query = query.eq("is_active", filters.isActive);
      }

      // Apply pagination
      if (filters?.offset !== undefined) {
        query = query.range(
          filters.offset,
          filters.offset + (filters.limit || 50) - 1
        );
      }

      // Order by company name
      query = query.order("company_name", { ascending: true });

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching carriers:", error);
        throw new Error(`Error fetching carriers: ${error.message}`);
      }

      return {
        message: "Carriers fetched successfully",
        success: true,
        results: {
          carriers: data as CarrierModel[],
          total_count: count || 0,
        },
      };
    } catch (error) {
      console.error("Error in fetchCarriers:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching carriers: ${error}`);
    }
  }

  /**
   * Fetch a carrier by ID
   */
  async fetchCarrierById(carrierId: number): Promise<CarrierModel> {
    try {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .eq("carrier_id", carrierId)
        .single();

      if (error) {
        console.error(`Error fetching carrier ID ${carrierId}:`, error);
        throw new Error(`Error fetching carrier: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Carrier with ID ${carrierId} not found`);
      }

      return data as CarrierModel;
    } catch (error) {
      console.error(`Error in fetchCarrierById(${carrierId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching carrier: ${error}`);
    }
  }

  /**
   * Create a new carrier
   */
  async createCarrier(carrierData: CreateCarrierData): Promise<CarrierModel> {
    try {
      const { data, error } = await supabase
        .from("carriers")
        .insert([carrierData])
        .select()
        .single();

      if (error) {
        console.error("Error creating carrier:", error);
        throw new Error(`Error creating carrier: ${error.message}`);
      }

      return data as CarrierModel;
    } catch (error) {
      console.error("Error in createCarrier:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error creating carrier: ${error}`);
    }
  }

  /**
   * Update a carrier
   */
  async updateCarrier(
    carrierId: number,
    carrierData: Partial<CreateCarrierData>
  ): Promise<CarrierModel> {
    try {
      const { data, error } = await supabase
        .from("carriers")
        .update(carrierData)
        .eq("carrier_id", carrierId)
        .select()
        .single();

      if (error) {
        console.error(`Error updating carrier ID ${carrierId}:`, error);
        throw new Error(`Error updating carrier: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Carrier with ID ${carrierId} not found`);
      }

      return data as CarrierModel;
    } catch (error) {
      console.error(`Error in updateCarrier(${carrierId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error updating carrier: ${error}`);
    }
  }

  /**
   * Delete a carrier (soft delete by setting is_active to false)
   */
  async deleteCarrier(carrierId: number): Promise<CarrierModel> {
    try {
      const { data, error } = await supabase
        .from("carriers")
        .update({ is_active: false })
        .eq("carrier_id", carrierId)
        .select()
        .single();

      if (error) {
        console.error(`Error deleting carrier ID ${carrierId}:`, error);
        throw new Error(`Error deleting carrier: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Carrier with ID ${carrierId} not found`);
      }

      return data as CarrierModel;
    } catch (error) {
      console.error(`Error in deleteCarrier(${carrierId}):`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error deleting carrier: ${error}`);
    }
  }

  /**
   * Get all active carriers for dropdown/select options
   */
  async fetchActiveCarriers(): Promise<CarrierModel[]> {
    try {
      const { data, error } = await supabase
        .from("carriers")
        .select("*")
        .eq("is_active", true)
        .order("company_name", { ascending: true });

      if (error) {
        console.error("Error fetching active carriers:", error);
        throw new Error(`Error fetching active carriers: ${error.message}`);
      }

      return data as CarrierModel[];
    } catch (error) {
      console.error("Error in fetchActiveCarriers:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching active carriers: ${error}`);
    }
  }
}
