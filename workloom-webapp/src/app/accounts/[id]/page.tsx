'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, TestTube, Activity, Settings, Database, Zap } from 'lucide-react';
import Link from 'next/link';
import { LinkedInAccountForm } from '@/features/accounts/components/linkedin-account-form';
import { SalesforceAccountForm } from '@/features/accounts/components/salesforce-account-form';
import { HubSpotAccountForm } from '@/features/accounts/components/hubspot-account-form';
import { useAccount } from '@/features/accounts/hooks/use-accounts';
import { AccountProvider, UpdateAccountData, PROVIDER_CONFIGS } from '@/features/accounts/types';

function AccountDetailContent() {
  const router = useRouter();
  const params = useParams();
  const accountId = params.id as string;
  const { 
    account, 
    isLoading, 
    updateAccount, 
    testConnection, 
    isUpdating, 
    isTesting, 
    testResult, 
    testError,
    updateError 
  } = useAccount(accountId);

  const [activeTab, setActiveTab] = useState('settings');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Account not found</h3>
              <p className="text-gray-500 mb-6">The account you're looking for doesn't exist.</p>
              <Link href="/accounts">
                <Button>Back to Accounts</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleUpdateAccount = async (data: UpdateAccountData) => {
    await updateAccount(data);
  };

  const handleTestConnection = () => {
    testConnection();
  };

  const providerConfig = PROVIDER_CONFIGS[account.provider as AccountProvider];

  const renderAccountForm = () => {
    switch (account.provider) {
      case 'LINKEDIN':
        return (
          <LinkedInAccountForm
            initialData={account as any}
            onSubmit={handleUpdateAccount}
            isLoading={isUpdating}
            isEdit={true}
          />
        );
      case 'SALESFORCE':
        return (
          <SalesforceAccountForm
            initialData={account as any}
            onSubmit={handleUpdateAccount}
            isLoading={isUpdating}
            isEdit={true}
          />
        );
      case 'HUBSPOT':
        return (
          <HubSpotAccountForm
            initialData={account as any}
            onSubmit={handleUpdateAccount}
            isLoading={isUpdating}
            isEdit={true}
          />
        );
      default:
        return null;
    }
  };

  const renderStats = () => {
    if (!('stats' in account)) return null;

    const stats = (account as any).stats;

    if (account.provider === 'LINKEDIN') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.profilesScraped || 0}</p>
                  <p className="text-sm text-gray-500">Profiles Scraped</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.dailyUsage || 0}</p>
                  <p className="text-sm text-gray-500">Today's Usage</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{Math.round((stats?.successRate || 0) * 100)}%</p>
                  <p className="text-sm text-gray-500">Success Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Last Reset</p>
                  <p className="text-sm text-gray-500">
                    {stats?.lastResetDate ? new Date(stats.lastResetDate).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (account.provider === 'SALESFORCE' || account.provider === 'HUBSPOT') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.recordsImported || stats?.contactsImported || 0}</p>
                  <p className="text-sm text-gray-500">Records Imported</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.recordsExported || stats?.contactsExported || 0}</p>
                  <p className="text-sm text-gray-500">Records Exported</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{stats?.syncErrors || 0}</p>
                  <p className="text-sm text-gray-500">Sync Errors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/accounts" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Accounts
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{providerConfig.icon}</span>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{account.accountName}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={providerConfig.color}>
                    {providerConfig.name}
                  </Badge>
                  <Badge variant={account.isActive ? 'default' : 'secondary'}>
                    {account.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                  {account.status === 'ERROR' && (
                    <Badge variant="destructive">Error</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleTestConnection}
                disabled={isTesting}
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>
          </div>

          {(testResult || testError) && (
            <Card className={`mt-4 ${testResult?.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardContent className="pt-6">
                <div className={`text-sm ${testResult?.success ? 'text-green-700' : 'text-red-700'}`}>
                  {testResult?.message || testError}
                </div>
                {testResult?.details && (
                  <div className="mt-2 text-xs text-gray-600">
                    {testResult.details.responseTime && (
                      <span>Response time: {testResult.details.responseTime}ms</span>
                    )}
                    {testResult.details.remainingQuota && (
                      <span className="ml-4">Quota remaining: {testResult.details.remainingQuota}</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {updateError && (
            <Card className="mt-4 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-red-700 text-sm">{updateError}</div>
              </CardContent>
            </Card>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
            {account.provider === 'LINKEDIN' && (
              <TabsTrigger value="scraping" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                Scraping
              </TabsTrigger>
            )}
            {(account.provider === 'SALESFORCE' || account.provider === 'HUBSPOT') && (
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Data Sync
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Overview</CardTitle>
                <CardDescription>
                  Statistics and performance metrics for this account
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderStats()}
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Account Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Provider:</span>
                        <span>{providerConfig.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Username:</span>
                        <span>{account.username || 'Not set'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Created:</span>
                        <span>{new Date(account.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Used:</span>
                        <span>
                          {account.lastUsedAt 
                            ? new Date(account.lastUsedAt).toLocaleDateString() 
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-1">
                      {providerConfig.capabilities.map((capability) => (
                        <Badge 
                          key={capability} 
                          variant="outline" 
                          className={`text-xs ${providerConfig.color}`}
                        >
                          {capability.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {renderAccountForm()}
          </TabsContent>

          {account.provider === 'LINKEDIN' && (
            <TabsContent value="scraping" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scraping Jobs</CardTitle>
                  <CardDescription>
                    View and manage LinkedIn scraping operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Scraping job management will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {(account.provider === 'SALESFORCE' || account.provider === 'HUBSPOT') && (
            <TabsContent value="sync" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Synchronization</CardTitle>
                  <CardDescription>
                    Manage data import/export operations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    Data sync management will be implemented here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}

export default function AccountDetailPage() {
  return (
    <ProtectedRoute>
      <AccountDetailContent />
    </ProtectedRoute>
  );
}
