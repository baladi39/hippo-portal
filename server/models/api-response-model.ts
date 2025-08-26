/**
 * Common API response interface
 */
export interface MainResponseModel {
  message: string;
  success: boolean;
  results?: any;
}

/**
 * Paginated response interface
 */
export interface PaginatedResponse<T> {
  message: string;
  success: boolean;
  results: {
    data: T[];
    total_count: number;
    page?: number;
    page_size?: number;
  };
}
