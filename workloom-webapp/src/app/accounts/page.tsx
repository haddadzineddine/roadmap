'use client';

import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAccounts } from '@/features/accounts/hooks/use-accounts';
import { PROVIDER_CONFIGS, AccountProvider } from '@/features/accounts/types';
import Link from 'next/link';
import { Plus, Settings, Trash2, ExternalLink } from 'lucide-react';

function AccountsContent() {
  const { accounts, isLoading, deleteAccount } = useAccounts();

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

  const getProviderConfig = (provider: string) => {
    return PROVIDER_CONFIGS[provider as AccountProvider] || {
      name: provider,
      icon: '🔌',
      color: 'bg-gray-100 text-gray-800',
      description: 'Unknown provider'
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">External Accounts</h1>
            <p className="text-gray-600 mt-2">Manage your connected accounts and integrations</p>
          </div>
          <Link href="/accounts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Connect Account
            </Button>
          </Link>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-4xl mb-4">🔗</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No accounts connected</h3>
              <p className="text-gray-500 mb-6">
                Connect your external accounts to enable data collection and CRM integration
              </p>
              <Link href="/accounts/new">
                <Button>Connect Your First Account</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                {accounts.length} account{accounts.length !== 1 ? 's' : ''} connected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accounts.map((account) => {
                  const providerConfig = getProviderConfig(account.provider);
                  
                  return (
                    <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="text-2xl">{providerConfig.icon}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{account.accountName}</h3>
                            <Badge className={providerConfig.color}>
                              {providerConfig.name}
                            </Badge>
                            {account.status === 'ERROR' && (
                              <Badge variant="destructive" className="text-xs">
                                Error
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">
                            {account.username && `${account.username} • `}
                            Connected {new Date(account.createdAt).toLocaleDateString()}
                            {account.lastUsedAt && ` • Last used ${new Date(account.lastUsedAt).toLocaleDateString()}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={account.isActive ? 'default' : 'secondary'}>
                          {account.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Link href={`/accounts/${account.id}`}>
                          <Button variant="ghost" size="sm" title="Account Settings">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteAccount(account.id)}
                          title="Delete Account"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Integrations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
            <CardDescription>Connect more accounts to expand your capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(PROVIDER_CONFIGS).map(([provider, config]) => {
                const isConnected = accounts.some(a => a.provider === provider);
                
                return (
                  <div key={provider} className="border rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{config.icon}</span>
                          <div>
                            <h4 className="font-medium">{config.name}</h4>
                            <p className="text-sm text-gray-500">{config.description}</p>
                          </div>
                        </div>
                        {isConnected ? (
                          <Badge variant="secondary">Connected</Badge>
                        ) : (
                          <Link href={`/accounts/new?provider=${provider.toLowerCase()}`}>
                            <Button size="sm">Connect</Button>
                          </Link>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {config.capabilities.slice(0, 3).map((capability) => (
                          <Badge 
                            key={capability} 
                            variant="outline" 
                            className={`text-xs ${config.color}`}
                          >
                            {capability.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                      
                      {isConnected && (
                        <Link 
                          href={`/accounts/${accounts.find(a => a.provider === provider)?.id}`}
                          className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Manage Settings
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function AccountsPage() {
  return (
    <ProtectedRoute>
      <AccountsContent />
    </ProtectedRoute>
  );
}