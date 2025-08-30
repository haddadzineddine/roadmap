'use client';

import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMappings } from '@/features/mappings/hooks/use-mappings';
import { MappingCard } from '@/features/mappings/components/mapping-card';
import Link from 'next/link';
import { Plus } from 'lucide-react';

function MappingsContent() {
  const { mappings, isLoading, deleteMapping } = useMappings();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mappings</h1>
            <p className="text-gray-600 mt-2">Manage your LinkedIn profile mappings</p>
          </div>
          <Link href="/mappings/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Mapping
            </Button>
          </Link>
        </div>

        {mappings.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mappings yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first mapping to start tracking LinkedIn profiles
              </p>
              <Link href="/mappings/new">
                <Button>Create Your First Mapping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Your Mappings</CardTitle>
              <CardDescription>
                {mappings.length} mapping{mappings.length !== 1 ? 's' : ''} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mappings.map((mapping) => (
                  <MappingCard 
                    key={mapping.id} 
                    mapping={mapping}
                    onDelete={deleteMapping}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MappingsPage() {
  return (
    <ProtectedRoute>
      <MappingsContent />
    </ProtectedRoute>
  );
}