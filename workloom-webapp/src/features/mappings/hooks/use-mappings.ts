import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { mappingsAPI } from '../api/mappings';
import { CreateMappingData, ExportFormat } from '@/types';

export const useMappings = () => {
  const queryClient = useQueryClient();

  const { data: mappings, isLoading } = useQuery({
    queryKey: ['mappings'],
    queryFn: mappingsAPI.getMappings,
  });

  const createMappingMutation = useMutation({
    mutationFn: mappingsAPI.createMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  const deleteMappingMutation = useMutation({
    mutationFn: mappingsAPI.deleteMapping,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  return {
    mappings: mappings || [],
    isLoading,
    createMapping: createMappingMutation.mutate,
    deleteMapping: deleteMappingMutation.mutate,
    isCreating: createMappingMutation.isPending,
    isDeleting: deleteMappingMutation.isPending,
    createError: createMappingMutation.error?.message,
    deleteError: deleteMappingMutation.error?.message,
  };
};

export const useMapping = (id: string) => {
  const queryClient = useQueryClient();

  const { data: mapping, isLoading } = useQuery({
    queryKey: ['mappings', id],
    queryFn: () => mappingsAPI.getMapping(id),
    enabled: !!id,
  });

  const runMappingMutation = useMutation({
    mutationFn: () => mappingsAPI.runMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', id] });
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  const pauseMappingMutation = useMutation({
    mutationFn: () => mappingsAPI.pauseMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', id] });
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  const resumeMappingMutation = useMutation({
    mutationFn: () => mappingsAPI.resumeMapping(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mappings', id] });
      queryClient.invalidateQueries({ queryKey: ['mappings'] });
    },
  });

  return {
    mapping,
    isLoading,
    runMapping: runMappingMutation.mutate,
    pauseMapping: pauseMappingMutation.mutate,
    resumeMapping: resumeMappingMutation.mutate,
    isRunning: runMappingMutation.isPending,
    isPausing: pauseMappingMutation.isPending,
    isResuming: resumeMappingMutation.isPending,
    runError: runMappingMutation.error?.message,
  };
};

export const useMappingExport = () => {
  const exportMappingMutation = useMutation({
    mutationFn: ({ id, format }: { id: string; format: ExportFormat }) => 
      mappingsAPI.exportMapping(id, format),
    onSuccess: (blob, variables) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mapping-export.${variables.format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
  });

  return {
    exportMapping: exportMappingMutation.mutate,
    isExporting: exportMappingMutation.isPending,
    exportError: exportMappingMutation.error?.message,
  };
};
