'use client';

import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useMapping, useMappingExport } from '@/features/mappings/hooks/use-mappings';
import Link from 'next/link';
import { ArrowLeft, Users, TrendingUp, Activity, Download, Play } from 'lucide-react';
import { useParams } from 'next/navigation';

function MappingDetailContent() {
  const params = useParams();
  const mappingId = params.id as string;
  
  const { mapping, isLoading, runMapping, isRunning } = useMapping(mappingId);
  const { exportMapping, isExporting } = useMappingExport();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!mapping) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mapping Not Found</h2>
            <p className="text-gray-600 mb-4">The mapping you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/mappings">
              <Button>Back to Mappings</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleExport = (format: 'xlsx' | 'csv') => {
    exportMapping({ id: mappingId, format });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/mappings" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mappings
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{mapping.name}</h1>
              <p className="text-gray-600 mt-2">
                Created {new Date(mapping.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={getStatusColor(mapping.status)}>
                {mapping.status.toLowerCase()}
              </Badge>
              <Button onClick={() => runMapping()} disabled={isRunning}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Now'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profiles</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mapping.profiles?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mapping.runs?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departures</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Mapping Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>Mapping criteria and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-500">Job Title</h4>
                <p className="text-sm">{mapping.jobTitle || 'Any'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Company</h4>
                <p className="text-sm">{mapping.company || 'Any'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Country</h4>
                <p className="text-sm">{mapping.country || 'Any'}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Last Run</h4>
                <p className="text-sm">
                  {mapping.lastRunAt 
                    ? new Date(mapping.lastRunAt).toLocaleString()
                    : 'Never'
                  }
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-gray-500">Next Scheduled Run</h4>
                <p className="text-sm">
                  {mapping.nextRunAt 
                    ? new Date(mapping.nextRunAt).toLocaleString()
                    : 'Not scheduled'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recent Profiles */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Profiles</CardTitle>
                  <CardDescription>Latest LinkedIn profiles found</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('xlsx')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Exporting...' : 'Excel'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleExport('csv')}
                    disabled={isExporting}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!mapping.profiles || mapping.profiles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No profiles found yet</p>
                  <p className="text-sm text-gray-400 mt-1">Run the mapping to start collecting profiles</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mapping.profiles.slice(0, 10).map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <a 
                            href={profile.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                          >
                            {profile.name}
                          </a>
                        </TableCell>
                        <TableCell className="text-sm">{profile.jobTitle || '-'}</TableCell>
                        <TableCell className="text-sm">{profile.company || '-'}</TableCell>
                        <TableCell className="text-sm">{profile.location || '-'}</TableCell>
                        <TableCell className="text-sm text-gray-500">
                          {new Date(profile.lastSeen).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
              {mapping.profiles && mapping.profiles.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline">View All Profiles</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Run History */}
        {mapping.runs && mapping.runs.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Run History</CardTitle>
              <CardDescription>Previous mapping execution results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Found</TableHead>
                    <TableHead>New Profiles</TableHead>
                    <TableHead>Departures</TableHead>
                    <TableHead>Job Changes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mapping.runs.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="text-sm">
                        {new Date(run.runDate).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(run.status)}>
                          {run.status.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>{run.totalFound}</TableCell>
                      <TableCell>{run.newProfiles}</TableCell>
                      <TableCell>{run.departures}</TableCell>
                      <TableCell>{run.jobChanges}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function MappingDetailPage() {
  return (
    <ProtectedRoute>
      <MappingDetailContent />
    </ProtectedRoute>
  );
}
