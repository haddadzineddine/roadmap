import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { accountsAPI } from '../api/accounts';
import { 
  CreateAccountData, 
  UpdateAccountData,
  ImportDataRequest,
  ExportDataRequest,
  LinkedInScrapingJob
} from '../types';

export const useAccounts = () => {
  const queryClient = useQueryClient();

  const { data: accounts, isLoading } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsAPI.getAccounts,
  });

  const createAccountMutation = useMutation({
    mutationFn: accountsAPI.createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: accountsAPI.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const toggleAccountMutation = useMutation({
    mutationFn: accountsAPI.toggleAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  return {
    accounts: accounts || [],
    isLoading,
    createAccount: createAccountMutation.mutate,
    deleteAccount: deleteAccountMutation.mutate,
    toggleAccount: toggleAccountMutation.mutate,
    isCreating: createAccountMutation.isPending,
    isDeleting: deleteAccountMutation.isPending,
    isToggling: toggleAccountMutation.isPending,
    createError: createAccountMutation.error?.message,
    deleteError: deleteAccountMutation.error?.message,
  };
};

export const useAccount = (id: string) => {
  const queryClient = useQueryClient();

  const { data: account, isLoading } = useQuery({
    queryKey: ['accounts', id],
    queryFn: () => accountsAPI.getAccount(id),
    enabled: !!id,
  });

  const updateAccountMutation = useMutation({
    mutationFn: (data: UpdateAccountData) => 
      accountsAPI.updateAccount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', id] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
  });

  const testConnectionMutation = useMutation({
    mutationFn: () => accountsAPI.testConnection(id),
  });

  return {
    account,
    isLoading,
    updateAccount: updateAccountMutation.mutate,
    testConnection: testConnectionMutation.mutate,
    isUpdating: updateAccountMutation.isPending,
    isTesting: testConnectionMutation.isPending,
    updateError: updateAccountMutation.error?.message,
    testResult: testConnectionMutation.data,
    testError: testConnectionMutation.error?.message,
  };
};

// Hook for LinkedIn-specific operations
export const useLinkedInAccount = (accountId: string) => {
  const queryClient = useQueryClient();

  // Start scraping job
  const startScrapingMutation = useMutation({
    mutationFn: (config: LinkedInScrapingJob['config']) =>
      accountsAPI.linkedin.startScrapingJob(accountId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-jobs', accountId] });
    },
  });

  // Get scraping jobs
  const { data: scrapingJobs, isLoading: isLoadingJobs } = useQuery({
    queryKey: ['linkedin-jobs', accountId],
    queryFn: () => accountsAPI.linkedin.getScrapingJobs(accountId),
    enabled: !!accountId,
  });

  // Cancel scraping job
  const cancelJobMutation = useMutation({
    mutationFn: (jobId: string) =>
      accountsAPI.linkedin.cancelScrapingJob(accountId, jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-jobs', accountId] });
    },
  });

  // Get LinkedIn stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['linkedin-stats', accountId],
    queryFn: () => accountsAPI.linkedin.getStats(accountId),
    enabled: !!accountId,
  });

  // Update scraping config
  const updateConfigMutation = useMutation({
    mutationFn: (config: any) =>
      accountsAPI.linkedin.updateConfig(accountId, config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts', accountId] });
    },
  });

  // Validate session
  const validateSessionMutation = useMutation({
    mutationFn: () => accountsAPI.linkedin.validateSession(accountId),
  });

  // Search profiles
  const searchProfilesMutation = useMutation({
    mutationFn: ({ searchQuery, filters }: { searchQuery: string; filters?: any }) =>
      accountsAPI.linkedin.searchProfiles(accountId, searchQuery, filters),
  });

  return {
    scrapingJobs: scrapingJobs || [],
    stats,
    isLoadingJobs,
    isLoadingStats,
    
    // Actions
    startScraping: startScrapingMutation.mutate,
    cancelJob: cancelJobMutation.mutate,
    updateConfig: updateConfigMutation.mutate,
    validateSession: validateSessionMutation.mutate,
    searchProfiles: searchProfilesMutation.mutate,
    
    // States
    isStartingScraping: startScrapingMutation.isPending,
    isCancelingJob: cancelJobMutation.isPending,
    isUpdatingConfig: updateConfigMutation.isPending,
    isValidatingSession: validateSessionMutation.isPending,
    isSearchingProfiles: searchProfilesMutation.isPending,
    
    // Results
    searchResults: searchProfilesMutation.data,
    sessionValidation: validateSessionMutation.data,
    
    // Errors
    scrapingError: startScrapingMutation.error?.message,
    configError: updateConfigMutation.error?.message,
    sessionError: validateSessionMutation.error?.message,
    searchError: searchProfilesMutation.error?.message,
  };
};

// Hook for CRM operations
export const useCRMOperations = (accountId: string) => {
  const queryClient = useQueryClient();

  // Import data from CRM
  const importDataMutation = useMutation({
    mutationFn: (request: Omit<ImportDataRequest, 'accountId'>) =>
      accountsAPI.crm.importData({ ...request, accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-operations', accountId] });
    },
  });

  // Export data to CRM
  const exportDataMutation = useMutation({
    mutationFn: (request: Omit<ExportDataRequest, 'accountId'>) =>
      accountsAPI.crm.exportData({ ...request, accountId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-operations', accountId] });
    },
  });

  // Get operation history
  const { data: operationHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['crm-operations', accountId],
    queryFn: () => accountsAPI.crm.getOperationHistory(accountId),
    enabled: !!accountId,
  });

  // Preview import
  const previewImportMutation = useMutation({
    mutationFn: (filters?: any) =>
      accountsAPI.crm.previewImport(accountId, filters),
  });

  // Get field mappings
  const { data: fieldMappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ['field-mappings', accountId],
    queryFn: () => accountsAPI.crm.getFieldMappings(accountId),
    enabled: !!accountId,
  });

  // Update field mappings
  const updateMappingsMutation = useMutation({
    mutationFn: (mappings: Record<string, string>) =>
      accountsAPI.crm.updateFieldMappings(accountId, mappings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-mappings', accountId] });
    },
  });

  return {
    operationHistory: operationHistory || [],
    fieldMappings,
    isLoadingHistory,
    isLoadingMappings,
    
    // Actions
    importData: importDataMutation.mutate,
    exportData: exportDataMutation.mutate,
    previewImport: previewImportMutation.mutate,
    updateMappings: updateMappingsMutation.mutate,
    
    // States
    isImporting: importDataMutation.isPending,
    isExporting: exportDataMutation.isPending,
    isPreviewing: previewImportMutation.isPending,
    isUpdatingMappings: updateMappingsMutation.isPending,
    
    // Results
    importResult: importDataMutation.data,
    exportResult: exportDataMutation.data,
    previewData: previewImportMutation.data,
    
    // Errors
    importError: importDataMutation.error?.message,
    exportError: exportDataMutation.error?.message,
    previewError: previewImportMutation.error?.message,
    mappingsError: updateMappingsMutation.error?.message,
  };
};

// Hook for Salesforce-specific operations
export const useSalesforceOperations = (accountId: string) => {
  const queryClient = useQueryClient();

  // Get Salesforce objects
  const { data: objects, isLoading: isLoadingObjects } = useQuery({
    queryKey: ['salesforce-objects', accountId],
    queryFn: () => accountsAPI.salesforce.getObjects(accountId),
    enabled: !!accountId,
  });

  // Get object fields
  const getObjectFieldsMutation = useMutation({
    mutationFn: (objectType: string) =>
      accountsAPI.salesforce.getObjectFields(accountId, objectType),
  });

  // Sync records
  const syncRecordsMutation = useMutation({
    mutationFn: (recordIds: string[]) =>
      accountsAPI.salesforce.syncRecords(accountId, recordIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-operations', accountId] });
    },
  });

  return {
    objects: objects || [],
    isLoadingObjects,
    
    // Actions
    getObjectFields: getObjectFieldsMutation.mutate,
    syncRecords: syncRecordsMutation.mutate,
    
    // States
    isGettingFields: getObjectFieldsMutation.isPending,
    isSyncing: syncRecordsMutation.isPending,
    
    // Results
    objectFields: getObjectFieldsMutation.data,
    syncResult: syncRecordsMutation.data,
    
    // Errors
    fieldsError: getObjectFieldsMutation.error?.message,
    syncError: syncRecordsMutation.error?.message,
  };
};

// Hook for HubSpot-specific operations
export const useHubSpotOperations = (accountId: string) => {
  const queryClient = useQueryClient();

  // Get HubSpot properties
  const getPropertiesMutation = useMutation({
    mutationFn: (objectType: string) =>
      accountsAPI.hubspot.getProperties(accountId, objectType),
  });

  // Get workflows
  const { data: workflows, isLoading: isLoadingWorkflows } = useQuery({
    queryKey: ['hubspot-workflows', accountId],
    queryFn: () => accountsAPI.hubspot.getWorkflows(accountId),
    enabled: !!accountId,
  });

  // Trigger workflow
  const triggerWorkflowMutation = useMutation({
    mutationFn: ({ workflowId, contactIds }: { workflowId: string; contactIds: string[] }) =>
      accountsAPI.hubspot.triggerWorkflow(accountId, workflowId, contactIds),
  });

  // Create contacts
  const createContactsMutation = useMutation({
    mutationFn: (profiles: any[]) =>
      accountsAPI.hubspot.createContacts(accountId, profiles),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-operations', accountId] });
    },
  });

  return {
    workflows: workflows || [],
    isLoadingWorkflows,
    
    // Actions
    getProperties: getPropertiesMutation.mutate,
    triggerWorkflow: triggerWorkflowMutation.mutate,
    createContacts: createContactsMutation.mutate,
    
    // States
    isGettingProperties: getPropertiesMutation.isPending,
    isTriggeringWorkflow: triggerWorkflowMutation.isPending,
    isCreatingContacts: createContactsMutation.isPending,
    
    // Results
    properties: getPropertiesMutation.data,
    workflowResult: triggerWorkflowMutation.data,
    contactsResult: createContactsMutation.data,
    
    // Errors
    propertiesError: getPropertiesMutation.error?.message,
    workflowError: triggerWorkflowMutation.error?.message,
    contactsError: createContactsMutation.error?.message,
  };
};
