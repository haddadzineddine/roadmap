import { api } from '@/lib/api-client';
import { 
  Account, 
  CreateAccountData, 
  UpdateAccountData, 
  ConnectionTestResult,
  ImportDataRequest,
  ExportDataRequest,
  DataOperationResult,
  LinkedInScrapingJob
} from '../types';

export const accountsAPI = {
  // Basic account operations
  getAccounts: (): Promise<Account[]> => {
    return api.get('/accounts');
  },

  getAccount: (id: string): Promise<Account> => {
    return api.get(`/accounts/${id}`);
  },

  createAccount: (data: CreateAccountData): Promise<Account> => {
    return api.post('/accounts', data);
  },

  updateAccount: (id: string, data: UpdateAccountData): Promise<Account> => {
    return api.put(`/accounts/${id}`, data);
  },

  deleteAccount: (id: string): Promise<void> => {
    return api.delete(`/accounts/${id}`);
  },

  toggleAccount: (id: string): Promise<Account> => {
    return api.post(`/accounts/${id}/toggle`);
  },

  // Connection testing
  testConnection: (id: string): Promise<ConnectionTestResult> => {
    return api.post(`/accounts/${id}/test`);
  },

  // LinkedIn scraping operations
  linkedin: {
    // Start a scraping job
    startScrapingJob: (accountId: string, config: LinkedInScrapingJob['config']): Promise<LinkedInScrapingJob> => {
      return api.post(`/accounts/${accountId}/linkedin/scrape`, config);
    },

    // Get scraping job status
    getScrapingJob: (accountId: string, jobId: string): Promise<LinkedInScrapingJob> => {
      return api.get(`/accounts/${accountId}/linkedin/jobs/${jobId}`);
    },

    // List scraping jobs for an account
    getScrapingJobs: (accountId: string): Promise<LinkedInScrapingJob[]> => {
      return api.get(`/accounts/${accountId}/linkedin/jobs`);
    },

    // Cancel a scraping job
    cancelScrapingJob: (accountId: string, jobId: string): Promise<void> => {
      return api.post(`/accounts/${accountId}/linkedin/jobs/${jobId}/cancel`);
    },

    // Get account statistics
    getStats: (accountId: string): Promise<Account['stats']> => {
      return api.get(`/accounts/${accountId}/linkedin/stats`);
    },

    // Update scraping configuration
    updateConfig: (accountId: string, config: any): Promise<Account> => {
      return api.put(`/accounts/${accountId}/linkedin/config`, config);
    },

    // Validate session/cookies
    validateSession: (accountId: string): Promise<{ valid: boolean; expiresAt?: string }> => {
      return api.post(`/accounts/${accountId}/linkedin/validate-session`);
    },

    // Get profile by LinkedIn URL
    getProfile: (accountId: string, profileUrl: string): Promise<any> => {
      return api.post(`/accounts/${accountId}/linkedin/profile`, { profileUrl });
    },

    // Search profiles
    searchProfiles: (accountId: string, searchQuery: string, filters?: any): Promise<any[]> => {
      return api.post(`/accounts/${accountId}/linkedin/search`, { searchQuery, filters });
    }
  },

  // CRM data operations
  crm: {
    // Import data from CRM
    importData: (request: ImportDataRequest): Promise<DataOperationResult> => {
      return api.post(`/accounts/${request.accountId}/crm/import`, request);
    },

    // Export data to CRM
    exportData: (request: ExportDataRequest): Promise<DataOperationResult> => {
      return api.post(`/accounts/${request.accountId}/crm/export`, request);
    },

    // Get import/export history
    getOperationHistory: (accountId: string): Promise<DataOperationResult[]> => {
      return api.get(`/accounts/${accountId}/crm/operations`);
    },

    // Test CRM connection with data preview
    previewImport: (accountId: string, filters?: any): Promise<{ records: any[]; totalCount: number }> => {
      return api.post(`/accounts/${accountId}/crm/preview-import`, { filters });
    },

    // Get field mappings
    getFieldMappings: (accountId: string): Promise<{ available: string[]; current: Record<string, string> }> => {
      return api.get(`/accounts/${accountId}/crm/field-mappings`);
    },

    // Update field mappings
    updateFieldMappings: (accountId: string, mappings: Record<string, string>): Promise<void> => {
      return api.put(`/accounts/${accountId}/crm/field-mappings`, { mappings });
    }
  },

  // Salesforce specific operations
  salesforce: {
    // Get Salesforce objects and fields
    getObjects: (accountId: string): Promise<any[]> => {
      return api.get(`/accounts/${accountId}/salesforce/objects`);
    },

    // Get custom fields for an object
    getObjectFields: (accountId: string, objectType: string): Promise<any[]> => {
      return api.get(`/accounts/${accountId}/salesforce/objects/${objectType}/fields`);
    },

    // Sync specific records
    syncRecords: (accountId: string, recordIds: string[]): Promise<DataOperationResult> => {
      return api.post(`/accounts/${accountId}/salesforce/sync`, { recordIds });
    }
  },

  // HubSpot specific operations
  hubspot: {
    // Get HubSpot properties
    getProperties: (accountId: string, objectType: string): Promise<any[]> => {
      return api.get(`/accounts/${accountId}/hubspot/properties/${objectType}`);
    },

    // Get workflows
    getWorkflows: (accountId: string): Promise<any[]> => {
      return api.get(`/accounts/${accountId}/hubspot/workflows`);
    },

    // Trigger workflow
    triggerWorkflow: (accountId: string, workflowId: string, contactIds: string[]): Promise<DataOperationResult> => {
      return api.post(`/accounts/${accountId}/hubspot/workflows/${workflowId}/trigger`, { contactIds });
    },

    // Create contacts from LinkedIn profiles
    createContacts: (accountId: string, profiles: any[]): Promise<DataOperationResult> => {
      return api.post(`/accounts/${accountId}/hubspot/contacts`, { profiles });
    }
  }
};
