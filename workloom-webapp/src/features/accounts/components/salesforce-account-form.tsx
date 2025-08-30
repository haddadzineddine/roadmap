'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Eye, EyeOff, ExternalLink, Plus, X } from 'lucide-react';
import { CreateSalesforceAccountData, UpdateAccountData } from '../types';

interface SalesforceAccountFormProps {
  initialData?: Partial<CreateSalesforceAccountData>;
  onSubmit: (data: CreateSalesforceAccountData | UpdateAccountData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function SalesforceAccountForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  isEdit = false 
}: SalesforceAccountFormProps) {
  const [showToken, setShowToken] = useState(false);
  const [customField, setCustomField] = useState({ salesforceField: '', linkedinField: '', isRequired: false });
  
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || '',
    credentials: {
      username: initialData?.credentials?.username || '',
      securityToken: initialData?.credentials?.securityToken || '',
    },
    config: {
      objectMappings: {
        lead: initialData?.config?.objectMappings?.lead ?? true,
        contact: initialData?.config?.objectMappings?.contact ?? true,
        account: initialData?.config?.objectMappings?.account ?? false,
      },
      customFields: initialData?.config?.customFields || [],
      duplicateHandling: initialData?.config?.duplicateHandling || 'UPDATE' as const,
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateSalesforceAccountData = {
      provider: 'SALESFORCE',
      accountName: formData.accountName,
      credentials: {
        username: formData.credentials.username,
        securityToken: formData.credentials.securityToken,
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

  const addCustomField = () => {
    if (customField.salesforceField && customField.linkedinField) {
      updateFormData('config.customFields', [
        ...formData.config.customFields,
        { ...customField }
      ]);
      setCustomField({ salesforceField: '', linkedinField: '', isRequired: false });
    }
  };

  const removeCustomField = (index: number) => {
    const newFields = formData.config.customFields.filter((_, i) => i !== index);
    updateFormData('config.customFields', newFields);
  };

  const commonLinkedInFields = [
    'name', 'firstName', 'lastName', 'jobTitle', 'company', 'location', 
    'industry', 'email', 'phone', 'profileUrl', 'summary', 'experience',
    'education', 'skills', 'connections'
  ];

  const commonSalesforceFields = [
    'FirstName', 'LastName', 'Email', 'Phone', 'Title', 'Company', 
    'City', 'State', 'Country', 'Industry', 'Description', 'LeadSource',
    'Website', 'LinkedIn__c'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ☁️ Salesforce Integration
          </CardTitle>
          <CardDescription>
            Connect to your Salesforce CRM for lead and contact management
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              placeholder="e.g., Sales CRM - Production"
              value={formData.accountName}
              onChange={(e) => updateFormData('accountName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Salesforce Username *</Label>
            <Input
              id="username"
              type="email"
              placeholder="your-username@company.com"
              value={formData.credentials.username}
              onChange={(e) => updateFormData('credentials.username', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="securityToken">Security Token *</Label>
            <div className="relative">
              <Input
                id="securityToken"
                type={showToken ? 'text' : 'password'}
                placeholder="Your Salesforce security token"
                value={formData.credentials.securityToken}
                onChange={(e) => updateFormData('credentials.securityToken', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm text-blue-600 bg-blue-50 p-3 rounded">
              <ExternalLink className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                Find this in Salesforce: Setup → My Personal Information → Reset Security Token
                <br />
                <a 
                  href="https://help.salesforce.com/s/articleView?id=sf.user_security_token.htm" 
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
            Choose which Salesforce objects to sync LinkedIn data with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Leads</Label>
                <p className="text-sm text-gray-500">
                  Create leads from new LinkedIn profiles
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.lead}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.lead', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Contacts</Label>
                <p className="text-sm text-gray-500">
                  Sync with existing contacts or create new ones
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.contact}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.contact', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Accounts</Label>
                <p className="text-sm text-gray-500">
                  Create or link company accounts
                </p>
              </div>
              <Switch
                checked={formData.config.objectMappings.account}
                onCheckedChange={(checked) => updateFormData('config.objectMappings.account', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duplicate Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Duplicate Handling</CardTitle>
          <CardDescription>
            How to handle existing records when importing LinkedIn data
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              {formData.config.duplicateHandling === 'SKIP' && 'Skip records that already exist in Salesforce'}
              {formData.config.duplicateHandling === 'UPDATE' && 'Update existing records with new LinkedIn data'}
              {formData.config.duplicateHandling === 'CREATE_NEW' && 'Always create new records, even if duplicates exist'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Field Mappings */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mappings</CardTitle>
          <CardDescription>
            Map LinkedIn profile fields to custom Salesforce fields
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new field mapping */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <div className="space-y-2">
              <Label>LinkedIn Field</Label>
              <Select 
                value={customField.linkedinField} 
                onValueChange={(value) => setCustomField(prev => ({ ...prev, linkedinField: value }))}
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
              <Label>Salesforce Field</Label>
              <Select 
                value={customField.salesforceField} 
                onValueChange={(value) => setCustomField(prev => ({ ...prev, salesforceField: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select field" />
                </SelectTrigger>
                <SelectContent>
                  {commonSalesforceFields.map(field => (
                    <SelectItem key={field} value={field}>{field}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={customField.isRequired}
                onCheckedChange={(checked) => setCustomField(prev => ({ ...prev, isRequired: checked }))}
              />
              <Label htmlFor="required" className="text-sm">Required</Label>
            </div>

            <Button 
              type="button" 
              onClick={addCustomField}
              disabled={!customField.linkedinField || !customField.salesforceField}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Existing field mappings */}
          {formData.config.customFields.length > 0 && (
            <div className="space-y-2">
              <Label>Current Mappings</Label>
              <div className="space-y-2">
                {formData.config.customFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{field.linkedinField}</Badge>
                      <span>→</span>
                      <Badge variant="outline">{field.salesforceField}</Badge>
                      {field.isRequired && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCustomField(index)}
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

      {/* Integration Info */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-green-900">What this enables</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-green-700 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Automatic lead/contact creation from mapping results</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Sync profile data with existing Salesforce records</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Update contact information when changes are detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span>Maintain data consistency between platforms</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.accountName.trim() || !formData.credentials.username || !formData.credentials.securityToken}
          className="flex-1"
        >
          {isLoading ? 'Connecting...' : isEdit ? 'Update Integration' : 'Connect Salesforce'}
        </Button>
      </div>
    </form>
  );
}
