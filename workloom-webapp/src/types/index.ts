export interface BaseEntity {
  uuid: string;
}

// Mapping types
export type MappingStatus = 'CREATED' | 'IN_PROGRESS' | 'PAUSED' | 'FAILED' | 'COMPLETED';

export interface Mapping extends BaseEntity {
  name: string;
  jobTitle?: string;
  company?: string;
  country?: string;
  status: MappingStatus;
  lastRunAt?: string;
  nextRunAt?: string;
  userId: string;
  profilesCount?: number;
  runsCount?: number;
}

export interface CreateMappingData {
  name: string;
  jobTitle?: string;
  company?: string;
  country?: string;
}

// LinkedIn Profile types
export interface LinkedInProfile extends BaseEntity {
  linkedInId: string;
  name: string;
  jobTitle?: string;
  company?: string;
  location?: string;
  profileUrl: string;
  imageUrl?: string;
  lastSeen: string;
  mappingId: string;
}

// Mapping Run types
export type MappingRunStatus = 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
export type ProfileChangeType = 'NEW_ARRIVAL' | 'DEPARTURE' | 'JOB_CHANGE';

export interface MappingRun extends BaseEntity {
  runDate: string;
  status: MappingRunStatus;
  totalFound: number;
  newProfiles: number;
  departures: number;
  jobChanges: number;
  mappingId: string;
}

export interface MappingRunResult {
  totalFound: number;
  newProfiles: number;
  departures: number;
  jobChanges: number;
}

// External Account types (deprecated - use Account types from @/features/accounts/types)
export type ExternalProvider = 'LINKEDIN' | 'SALESFORCE' | 'HUBSPOT';

export interface ExternalAccount extends BaseEntity {
  id: string;
  provider: ExternalProvider;
  accountName: string;
  username?: string;
  isActive: boolean;
  userId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'TESTING';
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  errorMessage?: string;
}

export interface CreateExternalAccountData {
  provider: ExternalProvider;
  accountName: string;
  username?: string;
  credentials?: {
    password?: string;
    apiKey?: string;
  };
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

// Export formats
export type ExportFormat = 'xlsx' | 'csv';

// CRM formats
export type CRMFormat = 'json' | 'salesforce' | 'hubspot';
