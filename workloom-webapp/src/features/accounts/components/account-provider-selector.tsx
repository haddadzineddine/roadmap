'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AccountProvider, PROVIDER_CONFIGS } from '../types';

interface AccountProviderSelectorProps {
  selectedProvider?: AccountProvider;
  onSelectProvider: (provider: AccountProvider) => void;
  connectedProviders?: AccountProvider[];
}

export function AccountProviderSelector({ 
  selectedProvider, 
  onSelectProvider, 
  connectedProviders = [] 
}: AccountProviderSelectorProps) {
  const providers = Object.entries(PROVIDER_CONFIGS) as [AccountProvider, typeof PROVIDER_CONFIGS[AccountProvider]][];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium">Choose Provider</h3>
        <p className="text-sm text-gray-500">
          Select the platform you want to connect to
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {providers.map(([provider, config]) => {
          const isConnected = connectedProviders.includes(provider);
          const isSelected = selectedProvider === provider;
          
          return (
            <Card 
              key={provider}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-blue-500 border-blue-200' : 'hover:border-gray-300'
              }`}
              onClick={() => onSelectProvider(provider)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <CardTitle className="text-base">{config.name}</CardTitle>
                      {isConnected && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          Connected
                        </Badge>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                <CardDescription className="text-sm">
                  {config.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Capabilities</h5>
                    <div className="flex flex-wrap gap-1">
                      {config.capabilities.map((capability) => (
                        <Badge 
                          key={capability} 
                          variant="outline" 
                          className={`text-xs ${config.color}`}
                        >
                          {capability.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Operations</h5>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {config.supportedOperations.slice(0, 3).map((operation) => (
                        <li key={operation} className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {operation.replace('_', ' ').toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button 
                    variant={isSelected ? "default" : "outline"} 
                    size="sm" 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProvider(provider);
                    }}
                  >
                    {isSelected ? 'Selected' : 'Select'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedProvider && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{PROVIDER_CONFIGS[selectedProvider].icon}</span>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  {PROVIDER_CONFIGS[selectedProvider].name} Integration
                </h4>
                <p className="text-sm text-blue-700 mb-3">
                  {PROVIDER_CONFIGS[selectedProvider].description}
                </p>
                
                {selectedProvider === 'LINKEDIN' && (
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Automated profile data collection with respect for rate limits</p>
                    <p>• Session management with cookie support for reliability</p>
                    <p>• Proxy support for distributed scraping</p>
                    <p>• Real-time profile monitoring and change detection</p>
                  </div>
                )}
                
                {selectedProvider === 'SALESFORCE' && (
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Seamless lead and contact creation from LinkedIn profiles</p>
                    <p>• Custom field mapping for your Salesforce schema</p>
                    <p>• Duplicate handling with configurable merge strategies</p>
                    <p>• Bulk data sync with error handling and retry logic</p>
                  </div>
                )}
                
                {selectedProvider === 'HUBSPOT' && (
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>• Contact and company creation with LinkedIn data enrichment</p>
                    <p>• Automatic workflow triggers for lead nurturing</p>
                    <p>• Custom property mapping for detailed segmentation</p>
                    <p>• Integration with HubSpot's marketing automation tools</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
