'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Play, Pause, Eye, Trash2 } from 'lucide-react';
import { Mapping } from '@/types';

interface MappingCardProps {
  mapping: Mapping;
  onRun?: (id: string) => void;
  onPause?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function MappingCard({ mapping, onRun, onPause, onDelete }: MappingCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <Link 
              href={`/mappings/${mapping.id}`}
              className="hover:underline"
            >
              {mapping.name}
            </Link>
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/mappings/${mapping.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Link>
              </DropdownMenuItem>
              {onRun && (
                <DropdownMenuItem onClick={() => onRun(mapping.id)}>
                  <Play className="h-4 w-4 mr-2" />
                  Run Now
                </DropdownMenuItem>
              )}
              {mapping.status === 'IN_PROGRESS' && onPause && (
                <DropdownMenuItem onClick={() => onPause(mapping.id)}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(mapping.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(mapping.status)}>
              {mapping.status.toLowerCase()}
            </Badge>
            <span className="text-sm text-gray-500">
              {mapping.profilesCount || 0} profiles
            </span>
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            {mapping.jobTitle && <div>Job: {mapping.jobTitle}</div>}
            {mapping.company && <div>Company: {mapping.company}</div>}
            {mapping.country && <div>Country: {mapping.country}</div>}
            {!mapping.jobTitle && !mapping.company && !mapping.country && (
              <div className="text-gray-400">No specific criteria</div>
            )}
          </div>

          <div className="text-xs text-gray-400">
            Last updated: {new Date(mapping.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
