import { api } from '@/lib/api-client';
import { 
  Mapping, 
  CreateMappingData, 
  LinkedInProfile, 
  MappingRun, 
  MappingRunResult,
  PaginatedResponse,
  ExportFormat 
} from '@/types';

export const mappingsAPI = {
  // Mappings CRUD
  getMappings: (): Promise<Mapping[]> => {
    return api.get('/mappings');
  },

  getMapping: (id: string): Promise<Mapping & { profiles: LinkedInProfile[]; runs: MappingRun[] }> => {
    return api.get(`/mappings/${id}`);
  },

  createMapping: (data: CreateMappingData): Promise<Mapping> => {
    return api.post('/mappings', data);
  },

  updateMapping: (id: string, data: Partial<CreateMappingData>): Promise<Mapping> => {
    return api.put(`/mappings/${id}`, data);
  },

  deleteMapping: (id: string): Promise<void> => {
    return api.delete(`/mappings/${id}`);
  },

  // Mapping operations
  runMapping: (id: string): Promise<MappingRunResult> => {
    return api.post(`/mappings/${id}/run`);
  },

  pauseMapping: (id: string): Promise<Mapping> => {
    return api.post(`/mappings/${id}/pause`);
  },

  resumeMapping: (id: string): Promise<Mapping> => {
    return api.post(`/mappings/${id}/resume`);
  },

  // Profiles
  getMappingProfiles: (
    mappingId: string, 
    params?: { limit?: number; offset?: number }
  ): Promise<PaginatedResponse<LinkedInProfile>> => {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    
    return api.get(`/mappings/${mappingId}/profiles?${queryParams}`);
  },

  // Export
  exportMapping: (id: string, format: ExportFormat): Promise<Blob> => {
    return api.get(`/mappings/${id}/export?format=${format}`, {
      responseType: 'blob',
    });
  },

  // Runs
  getMappingRuns: (mappingId: string): Promise<MappingRun[]> => {
    return api.get(`/mappings/${mappingId}/runs`);
  },
};
