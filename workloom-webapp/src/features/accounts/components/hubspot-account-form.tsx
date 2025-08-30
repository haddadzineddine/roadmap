'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ExternalLink, Plus, X, Zap } from 'lucide-react';
import { CreateHubSpotAccountData, UpdateAccountData } from '../types';

interface HubSpotAccountFormProps {
  initialData?: Partial<CreateHubSpotAccountData>;
  onSubmit: (data: CreateHubSpotAccountData | UpdateAccountData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function HubSpotAccountForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  isEdit = false 
}: HubSpotAccountFormProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [customProperty, setCustomProperty] = useState({ hubspotProperty: '', linkedinField: '', isRequired: false });
  
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || '',
    credentials: {
      apiKey: initialData?.credentials?.apiKey || '',
    },
    config: {
      objectMappings: {
        contacts: initialData?.config?.objectMappings?.contacts ?? true,
        companies: initialData?.config?.objectMappings?.companies ?? true,
        deals: initialData?.config?.objectMappings?.deals ?? false,
      },
      customProperties: initialData?.config?.customProperties || [],
      duplicateHandling: initialData?.config?.duplicateHandling || 'UPDATE' as const,
      enableWorkflows: initialData?.config?.enableWorkflows ?? true,
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateHubSpotAccountData = {
      provider: 'HUBSPOT',
      accountName: formData.accountName,
      credentials: {
        apiKey: formData.credentials.apiKey,
      },
      config: formData.config,
    };

    onSubmit(submitData);
  };

  const updateFormData = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const addCustomProperty = () => {
    if (customProperty.hubspotProperty && customProperty.linkedinField) {
      updateFormData('config.customProperties', [
        ...formData.config.customProperties,
        { ...customProperty }
      ]);
      setCustomProperty({ hubspotProperty: '', linkedinField: '', isRequired: false });
    }
  };

  const removeCustomProperty = (index: number) => {
    const newProperties = formData.config.customProperties.filter((_, i) => i !== index);
    updateFormData('config.customProperties', newProperties);
  };

  const commonLinkedInFields = [
    'name', 'firstName', 'lastName', 'jobTitle', 'company', 'location', 
    'industry', 'email', 'phone', 'profileUrl', 'summary', 'experience',
    'education', 'skills', 'connections', 'headline'
  ];

  const commonHubSpotProperties = [
    'firstname', 'lastname', 'email', 'phone', 'jobtitle', 'company', 
    'city', 'state', 'country', 'industry', 'about_us', 'hs_lead_status',
    'website', 'linkedin_bio', 'linkedin_connections', 'linkedinbio'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🟠 HubSpot Integration
          </CardTitle>
          <CardDescription>
            Connect to your HubSpot CRM for marketing automation and contact management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              placeholder="e.g., Marketing Hub - Production"
              value={formData.accountName}
              onChange={(e) => updateFormData('accountName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apiKey">HubSpot Private App Token *</Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? 'text' : 'password'}
                placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                value={formData.credentials.apiKey}
                onChange={(e) => updateFormData('credentials.apiKey', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded">
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                Create a private app in HubSpot: Settings → Integrations → Private Apps
                <br />
                <a 
                  href="https://developers.hubspot.com/docs/api/private-apps" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline"
                >
                  View instructions
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Object Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Object Mappings</CardTitle>
          <CardDescription>
            Choose which HubSpot objects to sync LinkedIn data with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Contacts</Label>
                <p className="text-sm text-gray-500">
                  Create and update contacts from LinkedIn profiles
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.contacts}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.contacts', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Companies</Label>
                <p className="text-sm text-gray-500">
                  Create company records from LinkedIn company data
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.companies}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.companies', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Deals</Label>
                <p className="text-sm text-gray-500">
                  Create potential deals from high-value profiles
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.deals}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.deals', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Marketing Automation
          </CardTitle>
          <CardDescription>
            Configure automated workflows and lead scoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Enable Workflow Triggers</Label>
              <p className="text-sm text-gray-500">
                Automatically trigger HubSpot workflows when new profiles are added
              </p>
            </div>
            <Switch
              checked={formData.config.enableWorkflows}
              onCheckedChange={(checked) => updateFormData('config.enableWorkflows', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="duplicateHandling">Duplicate Strategy</Label>
            <Select 
              value={formData.config.duplicateHandling} 
              onValueChange={(value: any) => updateFormData('config.duplicateHandling', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SKIP">Skip Duplicates</SelectItem>
                <SelectItem value="UPDATE">Update Existing</SelectItem>
                <SelectItem value="CREATE_NEW">Always Create New</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              {formData.config.duplicateHandling === 'SKIP' && 'Skip contacts that already exist in HubSpot'}
              {formData.config.duplicateHandling === 'UPDATE' && 'Update existing contacts with new LinkedIn data'}
              {formData.config.duplicateHandling === 'CREATE_NEW' && 'Always create new contacts, even if duplicates exist'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Property Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Property Mappings</CardTitle>
          <CardDescription>
            Map LinkedIn profile fields to custom HubSpot properties
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new property mapping */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div className="space-y-2">
              <Label>LinkedIn Field</Label>
              <Select 
                value={customProperty.linkedinField} 
                onValueChange={(value) => setCustomProperty(prev => ({ ...prev, linkedinField: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {commonLinkedInFields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>HubSpot Property</Label>
              <Select 
                value={customProperty.hubspotProperty} 
                onValueChange={(value) => setCustomProperty(prev => ({ ...prev, hubspotProperty: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {commonHubSpotProperties.map(prop => (
                    <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={customProperty.isRequired}
                onCheckedChange={(checked) => setCustomProperty(prev => ({ ...prev, isRequired: checked }))}
              />
              <Label htmlFor="required" className="text-sm">Required</Label>
            </div>

            <Button 
              type="button" 
              onClick={addCustomProperty}
              disabled={!customProperty.linkedinField || !customProperty.hubspotProperty}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Existing property mappings */}
          {formData.config.customProperties.length > 0 && (
            <div className="space-y-2">
              <Label>Current Mappings</Label>
              <div className="space-y-2">
                {formData.config.customProperties.map((property, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{property.linkedinField}</Badge>
                      <span>→</span>
                      <Badge variant="outline">{property.hubspotProperty}</Badge>
                      {property.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomProperty(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Integration Benefits */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-900">Marketing Automation Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-orange-700 space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Automatically nurture new LinkedIn contacts with email sequences</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Score leads based on LinkedIn profile data and engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Trigger personalized campaigns based on job title and company</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-orange-600" />
              <span>Create dynamic lists for targeted marketing campaigns</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.accountName.trim() || !formData.credentials.apiKey}
          className="flex-1"
        >
          {isLoading ? 'Connecting...' : isEdit ? 'Update Integration' : 'Connect HubSpot'}
        </Button>
      </div>
    </form>
  );
}
