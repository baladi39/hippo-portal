/**
 * Raw Carrier model from database
 */
export interface CarrierModel {
  carrier_id: number;
  company_name: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Carrier DTO for frontend consumption
 */
export interface CarrierDto {
  carrierId: number;
  companyName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Carrier creation/update data
 */
export interface CreateCarrierData {
  company_name: string;
  is_active?: boolean;
}

export interface UpdateCarrierData extends Partial<CreateCarrierData> {
  carrier_id: number;
}

/**
 * Search and filter parameters for carriers
 */
export interface CarrierFilters {
  searchTerm?: string;
  isActive?: boolean;
  offset?: number;
  limit?: number;
}

/**
 * API Response types for carriers
 */
export interface CarriersResponse {
  message: string;
  success: boolean;
  results: {
    carriers: CarrierModel[];
    total_count: number;
  };
}

export interface CarrierResponse {
  message: string;
  success: boolean;
  results: CarrierModel;
}
