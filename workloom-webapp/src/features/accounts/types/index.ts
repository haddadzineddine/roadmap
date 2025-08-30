export type AccountProvider = 'LINKEDIN' | 'SALESFORCE' | 'HUBSPOT';
export type AccountStatus = 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'TESTING';

// Base account interface
export interface Account {
  id: string;
  provider: AccountProvider;
  accountName: string;
  username?: string;
  status: AccountStatus;
  isActive: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  errorMessage?: string;
}

// LinkedIn specific types
export interface LinkedInCredentials {
  username: string;
  password: string;
  cookies?: string; // Serialized cookies for session management
  sessionToken?: string;
  csrfToken?: string;
  userAgent?: string;
  proxy?: {
    host: string;
    port: number;
    username?: string;
    password?: string;
  };
}

export interface LinkedInAccount extends Account {
  provider: 'LINKEDIN';
  credentials: LinkedInCredentials;
  scrapingConfig: {
    dailyLimit: number;
    requestDelay: number; // milliseconds between requests
    enableRotation: boolean;
    respectRateLimits: boolean;
  };
  stats: {
    profilesScraped: number;
    dailyUsage: number;
    lastResetDate: string;
    successRate: number;
  };
}

// Salesforce specific types
export interface SalesforceCredentials {
  username: string;
  securityToken: string;
  clientId?: string;
  clientSecret?: string;
  instanceUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SalesforceAccount extends Account {
  provider: 'SALESFORCE';
  credentials: SalesforceCredentials;
  config: {
    objectMappings: {
      lead: boolean;
      contact: boolean;
      account: boolean;
    };
    customFields: Array<{
      salesforceField: string;
      linkedinField: string;
      isRequired: boolean;
    }>;
    duplicateHandling: 'SKIP' | 'UPDATE' | 'CREATE_NEW';
  };
  stats: {
    recordsImported: number;
    recordsExported: number;
    lastSyncAt?: string;
    syncErrors: number;
  };
}

// HubSpot specific types
export interface HubSpotCredentials {
  apiKey: string;
  portalId?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface HubSpotAccount extends Account {
  provider: 'HUBSPOT';
  credentials: HubSpotCredentials;
  config: {
    objectMappings: {
      contacts: boolean;
      companies: boolean;
      deals: boolean;
    };
    customProperties: Array<{
      hubspotProperty: string;
      linkedinField: string;
      isRequired: boolean;
    }>;
    duplicateHandling: 'SKIP' | 'UPDATE' | 'CREATE_NEW';
    enableWorkflows: boolean;
  };
  stats: {
    contactsImported: number;
    contactsExported: number;
    lastSyncAt?: string;
    syncErrors: number;
  };
}

// Union type for all account types
export type AccountUnion = LinkedInAccount | SalesforceAccount | HubSpotAccount;

// Create account data types
export interface CreateLinkedInAccountData {
  provider: 'LINKEDIN';
  accountName: string;
  credentials: LinkedInCredentials;
  scrapingConfig?: Partial<LinkedInAccount['scrapingConfig']>;
}

export interface CreateSalesforceAccountData {
  provider: 'SALESFORCE';
  accountName: string;
  credentials: Pick<SalesforceCredentials, 'username' | 'securityToken'>;
  config?: Partial<SalesforceAccount['config']>;
}

export interface CreateHubSpotAccountData {
  provider: 'HUBSPOT';
  accountName: string;
  credentials: Pick<HubSpotCredentials, 'apiKey'>;
  config?: Partial<HubSpotAccount['config']>;
}

export type CreateAccountData = CreateLinkedInAccountData | CreateSalesforceAccountData | CreateHubSpotAccountData;

// Update account data types
export type UpdateAccountData = Partial<CreateAccountData>;

// Connection test types
export interface ConnectionTestResult {
  success: boolean;
  message: string;
  details?: {
    responseTime?: number;
    apiVersion?: string;
    remainingQuota?: number;
    permissions?: string[];
  };
}

// Data import/export types
export interface ImportDataRequest {
  accountId: string;
  source: 'CRM' | 'MANUAL';
  filters?: {
    createdAfter?: string;
    modifiedAfter?: string;
    tags?: string[];
    properties?: string[];
  };
}

export interface ExportDataRequest {
  accountId: string;
  destination: 'CRM';
  profileIds: string[];
  mappingConfig?: {
    fieldMappings: Record<string, string>;
    createNewRecords: boolean;
    updateExisting: boolean;
  };
}

export interface DataOperationResult {
  success: boolean;
  message: string;
  stats: {
    processed: number;
    successful: number;
    failed: number;
    skipped: number;
  };
  errors?: Array<{
    recordId?: string;
    error: string;
  }>;
}

// LinkedIn scraping specific types
export interface LinkedInScrapingJob {
  id: string;
  accountId: string;
  type: 'PROFILE_SEARCH' | 'COMPANY_EMPLOYEES' | 'SINGLE_PROFILE';
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  config: {
    searchQuery?: string;
    companyUrl?: string;
    profileUrl?: string;
    maxResults?: number;
    filters?: {
      location?: string;
      industry?: string;
      experience?: string;
    };
  };
  results: {
    profilesFound: number;
    profilesScraped: number;
    profilesFailed: number;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  errorMessage?: string;
}

// Provider configurations
export const PROVIDER_CONFIGS = {
  LINKEDIN: {
    name: 'LinkedIn',
    icon: '🔗',
    description: 'Profile data collection and scraping',
    color: 'bg-blue-100 text-blue-800',
    capabilities: ['SCRAPING', 'PROFILE_MONITORING', 'BULK_DISCOVERY'],
    supportedOperations: ['IMPORT_PROFILES', 'MONITOR_CHANGES', 'SEARCH_PROFILES']
  },
  SALESFORCE: {
    name: 'Salesforce',
    icon: '☁️',
    description: 'CRM integration and data sync',
    color: 'bg-cyan-100 text-cyan-800',
    capabilities: ['CRM_SYNC', 'LEAD_CREATION', 'DATA_EXPORT'],
    supportedOperations: ['IMPORT_CONTACTS', 'EXPORT_PROFILES', 'SYNC_DATA']
  },
  HUBSPOT: {
    name: 'HubSpot',
    icon: '🟠',
    description: 'Marketing automation and CRM',
    color: 'bg-orange-100 text-orange-800',
    capabilities: ['CRM_SYNC', 'WORKFLOW_TRIGGERS', 'CONTACT_ENRICHMENT'],
    supportedOperations: ['IMPORT_CONTACTS', 'EXPORT_PROFILES', 'TRIGGER_WORKFLOWS']
  }
} as const;
