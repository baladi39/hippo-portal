# Service Actions Architecture - Copilot Instructions

This document outlines the pattern for creating service actions in the Trademate Admin Web application, following the Model-Repository-Service pattern with Next.js Server Actions.

## 📁 Directory Structure

```
app/dashboard/{feature}/
├── actions.ts          # Server actions (exported functions for client use)
├── page.tsx           # React page component

server/
├── models/
│   └── {feature}-model.ts     # TypeScript interfaces and types
├── repositories/
│   └── {feature}-repo.ts      # Data access layer (Repository pattern)
└── services/
    └── {feature}-service.ts   # Business logic and API calls (Service layer)
```

## 🏗️ Architecture Pattern

### 1. **Model Layer** (`server/models/{feature}-model.ts`)

Define TypeScript interfaces for:

- **API Response Models**: Raw data structure from backend API
- **DTO Models**: Clean data transfer objects for frontend consumption
- **Filter/Request Models**: Parameters for API requests
- **Response Wrappers**: Standardized API response format

```typescript
// Example: server/models/bid-model.ts
export interface BidModel {
  // Raw API response structure
  client: {
    first_name: string;
    last_name: string;
    id: number;
    picture_ulr: string | null;
    user_type: string;
  };
  information: {
    ban_reason: string | null;
    closed_at: string | null;
    created_at: string | null;
    description: string;
    id: number;
    images: string[];
    is_banned: boolean;
    status: string;
    timeframe: string;
    work_type: string;
  };
  bidders: Array<{
    amount: number;
    first_name: string | null;
    last_name: string | null;
    picture_ulr: string | null;
    status: string;
    user_type: string;
  }>;
}

export interface BidDto {
  // Clean DTO for frontend
  id: number;
  clientId: number;
  clientName: string;
  clientAvatar: string | null;
  bidders: Array<{
    amount: number;
    name: string | null;
    picture: string | null;
    status: string;
    userType: string;
  }>;
  description: string;
  status: string;
  workType: string;
  timeframe: string;
  created_at: string | null;
  closed_at: string | null;
  is_banned: boolean;
  ban_reason: string | null;
  images: string[];
}

export interface BidsResponse {
  message: string;
  results: {
    bids: BidModel[];
    total_count: number;
  };
  success: boolean;
}

export interface BidFilters {
  status?: string;
  work_type?: string;
  work_type_id?: number;
  timeframe?: string;
  offset?: number;
  page_size?: number;
  search_term?: string;
  bid_id?: string;
  limit?: number;
}
```

### 2. **Service Layer** (`server/services/{feature}-service.ts`)

Handles HTTP requests and business logic:

- **API Communication**: Fetch data from external APIs
- **Authentication**: Use TokenService for access tokens
- **Error Handling**: Consistent error formatting
- **Request Building**: Construct URLs and headers

```typescript
// Example: server/services/bid-service.ts
import env from "@/lib/env";
import { TokenService } from "@/lib/token-service";
import { MainResponseModel } from "../models/api-reponse-model";
import { BidFilters, BidModel, BidsResponse } from "../models/bid-model";

export class BidService {
  private tokenService: TokenService;
  private readonly baseUrl = `${env.NEXT_PUBLIC_API_URL}/bids`;

  constructor() {
    this.tokenService = TokenService.getInstance();
  }

  /**
   * Fetch all bids with optional filters
   */
  async fetchBids(filters?: BidFilters): Promise<BidsResponse> {
    const accessToken = await this.tokenService.getAccessToken();

    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    // Construct query parameters
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });
    }

    const queryString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";

    try {
      const response = await fetch(`${this.baseUrl}${queryString}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        throw new Error("Unauthorized: Please check your credentials.");
      }

      if (!response.ok) {
        let errorMessage = `Error fetching bids: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Validate response format
      if (!data.success || !data.results || !Array.isArray(data.results.bids)) {
        throw new Error("Invalid API response format");
      }

      return data as BidsResponse;
    } catch (error) {
      console.error("Error in fetchBids:", error);
      throw error instanceof Error
        ? error
        : new Error(`Error fetching bids: ${error}`);
    }
  }

  /**
   * Update bid status
   */
  async updateBidStatus(bidId: number, status: string): Promise<BidModel> {
    const accessToken = await this.tokenService.getAccessToken();

    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    try {
      const response = await fetch(`${this.baseUrl}/${bidId}/status`, {
        method: "PATCH",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      });

      if (!response.ok) {
        let errorMessage = `Error updating bid status: ${response.status} ${response.statusText}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as MainResponseModel;

      if (!data.success) {
        throw new Error(data.message || "API returned success: false");
      }

      return data.results as BidModel;
    } catch (error) {
      console.error(`Error updating bid status for ID ${bidId}:`, error);
      throw error instanceof Error
        ? error
        : new Error(`Error updating bid status: ${error}`);
    }
  }
}
```

### 3. **Repository Layer** (`server/repositories/{feature}-repo.ts`)

Data access and transformation layer:

- **Data Mapping**: Transform API models to DTOs
- **Business Logic**: Repository-specific operations
- **Abstraction**: Hide service implementation details from actions

```typescript
// Example: server/repositories/bids-repo.ts
import { BidService } from "../services/bid-service";
import {
  BidDto,
  BidModel,
  BidsResponse,
  BidFilters,
} from "../models/bid-model";

export class BidsRepo {
  constructor(private bidService: BidService) {}

  /**
   * Find all bids with optional filters
   */
  async findAll(filters?: BidFilters): Promise<{
    bids: BidDto[];
    total_count: number;
    message: string;
    success: boolean;
  }> {
    try {
      const response = await this.bidService.fetchBids(filters);
      const bidDtos = response.results.bids.map(this.mapToBidDto);

      return {
        bids: bidDtos,
        total_count: response.results.total_count,
        message: response.message,
        success: response.success,
      };
    } catch (error) {
      console.error("Error in BidsRepo.findAll:", error);
      throw error;
    }
  }

  /**
   * Find a bid by ID
   */
  async findById(bidId: number): Promise<BidDto> {
    try {
      const bid = await this.bidService.fetchBidById(bidId);
      return this.mapToBidDto(bid);
    } catch (error) {
      console.error(`Error in BidsRepo.findById(${bidId}):`, error);
      throw error;
    }
  }

  /**
   * Update bid status
   */
  async updateStatus(bidId: number, status: string): Promise<BidDto> {
    try {
      const bid = await this.bidService.updateBidStatus(bidId, status);
      return this.mapToBidDto(bid);
    } catch (error) {
      console.error(
        `Error in BidsRepo.updateStatus(${bidId}, ${status}):`,
        error,
      );
      throw error;
    }
  }

  /**
   * Map API bid model to DTO for the client
   */
  private mapToBidDto(bid: BidModel): BidDto {
    // Map bidders array
    const bidders = bid.bidders
      ? bid.bidders.map((bidder) => ({
          amount: bidder.amount,
          name:
            bidder.first_name && bidder.last_name
              ? `${bidder.first_name} ${bidder.last_name}`
              : bidder.name,
          picture: bidder.picture_ulr,
          status: bidder.status,
          userType: bidder.user_type,
        }))
      : [];

    return {
      id: bid.information.id,
      clientId: bid.client.id,
      clientName: `${bid.client.first_name} ${bid.client.last_name}`,
      clientAvatar: bid.client.picture_ulr,
      bidders: bidders,
      description: bid.information.description,
      status: bid.information.status,
      workType: bid.information.work_type,
      timeframe: bid.information.timeframe,
      created_at: bid.information.created_at,
      closed_at: bid.information.closed_at,
      is_banned: bid.information.is_banned,
      ban_reason: bid.information.ban_reason,
      images: bid.information.images,
    };
  }
}
```

### 4. **Actions Layer** (`app/dashboard/{feature}/actions.ts`)

Next.js Server Actions for client consumption:

- **Server Actions**: Use `"use server"` directive
- **Instance Creation**: Create service and repository instances
- **Client Interface**: Export functions for React components
- **Error Handling**: Catch and re-throw with context

```typescript
// Example: app/dashboard/bids/actions.ts
"use server";

import env from "@/lib/env";
import { TokenService } from "@/lib/token-service";
import { BidFilters } from "@/server/models/bid-model";
import { BidsRepo } from "@/server/repositories/bids-repo";
import { BidService } from "@/server/services/bid-service";

const bidService = new BidService();
const bidsRepo = new BidsRepo(bidService);

// Optional: Re-export types for client use
export interface Bid {
  client: {
    first_name: string;
    last_name: string;
    id: number;
    picture_ulr: string | null;
    user_type: string;
  };
  information: {
    ban_reason: string | null;
    closed_at: string | null;
    created_at: string | null;
    description: string;
    id: number;
    images: string[];
    is_banned: boolean;
    status: string;
    timeframe: string;
    work_type: string;
  };
  bidders: Array<{
    amount: number;
    first_name: string | null;
    last_name: string | null;
    picture_ulr: string | null;
    status: string;
    user_type: string;
  }>;
}

export interface BidsResponse {
  message: string;
  results: {
    bids: Bid[];
    total_count: number;
  };
  success: boolean;
}

/**
 * Fetch all bids with optional filters
 */
export const fetchBids = async (filters?: BidFilters) => {
  try {
    return await bidsRepo.findAll(filters);
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error instanceof Error ? error : new Error("Failed to fetch bids");
  }
};

/**
 * Fetch a specific bid by ID
 */
export const fetchBidById = async (bidId: number) => {
  try {
    return await bidsRepo.findById(bidId);
  } catch (error) {
    console.error(`Error fetching bid ID ${bidId}:`, error);
    throw error instanceof Error ? error : new Error("Failed to fetch bid");
  }
};

/**
 * Update bid status
 */
export const updateBidStatus = async (bidId: number, status: string) => {
  try {
    return await bidsRepo.updateStatus(bidId, status);
  } catch (error) {
    console.error(`Error updating bid status for ID ${bidId}:`, error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update bid status");
  }
};

/**
 * Ban a bid with reason
 */
export const banBid = async (bidId: number, banReason: string) => {
  try {
    // Direct API call for complex operations (alternative to repository)
    const accessToken = await TokenService.getInstance().getAccessToken();

    if (!accessToken) {
      throw new Error("No valid access token available");
    }

    const apiUrl = `${env.NEXT_PUBLIC_API_URL}/bids/${bidId}/ban`;
    console.log(`Sending ban request to: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason: banReason }),
      cache: "no-store",
    });

    if (!response.ok) {
      let errorMessage = `Error banning bid: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.error("Error parsing error response:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "API returned success: false");
    }

    return data.results;
  } catch (error) {
    console.error(`Error banning bid ID ${bidId}:`, error);
    throw error instanceof Error
      ? error
      : new Error(`Error banning bid: ${error}`);
  }
};
```

## 🔧 Implementation Guidelines

### Common Patterns

1. **Token Service Usage**:

   ```typescript
   const accessToken = await TokenService.getInstance().getAccessToken();
   if (!accessToken) {
     throw new Error("No valid access token available");
   }
   ```

2. **Error Handling Pattern**:

   ```typescript
   try {
     // API call
   } catch (error) {
     console.error("Context-specific error message:", error);
     throw error instanceof Error ? error : new Error("Fallback error message");
   }
   ```

3. **Fetch Configuration**:

   ```typescript
   const response = await fetch(url, {
     method: "GET", // or POST, PATCH, DELETE
     headers: {
       accept: "application/json",
       Authorization: `Bearer ${accessToken}`,
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data), // for POST/PATCH
     cache: "no-store",
   });
   ```

4. **Query Parameter Building**:
   ```typescript
   const queryParams = new URLSearchParams();
   if (filters) {
     Object.entries(filters).forEach(([key, value]) => {
       if (value !== undefined && value !== null && value !== "") {
         queryParams.append(key, String(value));
       }
     });
   }
   const queryString = queryParams.toString()
     ? `?${queryParams.toString()}`
     : "";
   ```

### Naming Conventions

- **Models**: `{Feature}Model`, `{Feature}Dto`, `{Feature}Filters`, `{Feature}Response`
- **Services**: `{Feature}Service` (class)
- **Repositories**: `{Feature}Repo` (class)
- **Actions**: `fetch{Feature}`, `update{Feature}`, `create{Feature}`, `delete{Feature}`

### File Organization

```
server/
├── models/
│   ├── api-reponse-model.ts      # Common response interface
│   └── {feature}-model.ts         # Feature-specific interfaces
├── repositories/
│   └── {feature}-repo.ts          # Repository classes
└── services/
    └── {feature}-service.ts       # Service classes

app/dashboard/{feature}/
├── actions.ts                     # Server actions
└── page.tsx                      # React components
```

## 🚀 Quick Start Template

When creating new service actions:

1. **Create Model** (`server/models/{feature}-model.ts`)
2. **Create Service** (`server/services/{feature}-service.ts`)
3. **Create Repository** (`server/repositories/{feature}-repo.ts`)
4. **Create Actions** (`app/dashboard/{feature}/actions.ts`)

Follow the established patterns for consistency across the codebase.

## 📋 Best Practices

- **Always use TokenService** for authenticated requests
- **Implement proper error handling** at each layer
- **Use DTOs** to transform API responses for frontend consumption
- **Add detailed logging** for debugging
- **Validate API responses** before returning data
- **Use TypeScript interfaces** for type safety
- **Follow the established naming conventions**
- **Keep actions thin** - delegate to repositories/services
- **Handle edge cases** (missing tokens, network errors, invalid responses)
