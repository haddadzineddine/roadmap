'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, Eye, EyeOff, Info } from 'lucide-react';
import { CreateLinkedInAccountData, UpdateAccountData } from '../types';

interface LinkedInAccountFormProps {
  initialData?: Partial<CreateLinkedInAccountData>;
  onSubmit: (data: CreateLinkedInAccountData | UpdateAccountData) => void;
  isLoading?: boolean;
  isEdit?: boolean;
}

export function LinkedInAccountForm({ 
  initialData, 
  onSubmit, 
  isLoading = false, 
  isEdit = false 
}: LinkedInAccountFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    accountName: initialData?.accountName || '',
    credentials: {
      username: initialData?.credentials?.username || '',
      password: initialData?.credentials?.password || '',
      cookies: initialData?.credentials?.cookies || '',
      userAgent: initialData?.credentials?.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      proxy: {
        host: initialData?.credentials?.proxy?.host || '',
        port: initialData?.credentials?.proxy?.port || 8080,
        username: initialData?.credentials?.proxy?.username || '',
        password: initialData?.credentials?.proxy?.password || '',
      }
    },
    scrapingConfig: {
      dailyLimit: initialData?.scrapingConfig?.dailyLimit || 500,
      requestDelay: initialData?.scrapingConfig?.requestDelay || 2000,
      enableRotation: initialData?.scrapingConfig?.enableRotation || false,
      respectRateLimits: initialData?.scrapingConfig?.respectRateLimits || true,
    }
  });

  const [useProxy, setUseProxy] = useState(
    Boolean(initialData?.credentials?.proxy?.host)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: CreateLinkedInAccountData = {
      provider: 'LINKEDIN',
      accountName: formData.accountName,
      credentials: {
        username: formData.credentials.username,
        password: formData.credentials.password,
        cookies: formData.credentials.cookies || undefined,
        userAgent: formData.credentials.userAgent || undefined,
        proxy: useProxy && formData.credentials.proxy.host ? {
          host: formData.credentials.proxy.host,
          port: formData.credentials.proxy.port,
          username: formData.credentials.proxy.username || undefined,
          password: formData.credentials.proxy.password || undefined,
        } : undefined,
      },
      scrapingConfig: formData.scrapingConfig,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔗 LinkedIn Account Configuration
          </CardTitle>
          <CardDescription>
            Configure your LinkedIn account for profile scraping and data collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name *</Label>
            <Input
              id="accountName"
              placeholder="e.g., Primary LinkedIn Account"
              value={formData.accountName}
              onChange={(e) => updateFormData('accountName', e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              A friendly name to identify this LinkedIn account
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">LinkedIn Email *</Label>
            <Input
              id="username"
              type="email"
              placeholder="your.email@example.com"
              value={formData.credentials.username}
              onChange={(e) => updateFormData('credentials.username', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">LinkedIn Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Your LinkedIn password"
                value={formData.credentials.password}
                onChange={(e) => updateFormData('credentials.password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                Your credentials are encrypted and stored securely. We recommend using a dedicated LinkedIn account for scraping.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scraping Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Scraping Settings</CardTitle>
          <CardDescription>
            Configure rate limits and behavior for LinkedIn data collection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Profile Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="1"
                max="2000"
                value={formData.scrapingConfig.dailyLimit}
                onChange={(e) => updateFormData('scrapingConfig.dailyLimit', parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Maximum profiles to scrape per day (recommended: 500)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requestDelay">Request Delay (ms)</Label>
              <Input
                id="requestDelay"
                type="number"
                min="1000"
                max="10000"
                value={formData.scrapingConfig.requestDelay}
                onChange={(e) => updateFormData('scrapingConfig.requestDelay', parseInt(e.target.value))}
              />
              <p className="text-sm text-gray-500">
                Delay between requests (recommended: 2000ms)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Respect Rate Limits</Label>
                <p className="text-sm text-gray-500">
                  Automatically adjust speed based on LinkedIn's responses
                </p>
              </div>
              <Switch
                checked={formData.scrapingConfig.respectRateLimits}
                onCheckedChange={(checked) => updateFormData('scrapingConfig.respectRateLimits', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Enable Session Rotation</Label>
                <p className="text-sm text-gray-500">
                  Use multiple sessions to distribute requests
                </p>
              </div>
              <Switch
                checked={formData.scrapingConfig.enableRotation}
                onCheckedChange={(checked) => updateFormData('scrapingConfig.enableRotation', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Optional advanced configuration for power users
              </CardDescription>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </CardHeader>
        {showAdvanced && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cookies">Session Cookies (Optional)</Label>
              <Textarea
                id="cookies"
                placeholder="Paste your LinkedIn session cookies here for better authentication..."
                rows={3}
                value={formData.credentials.cookies}
                onChange={(e) => updateFormData('credentials.cookies', e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Export cookies from your browser to maintain session state
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userAgent">User Agent</Label>
              <Input
                id="userAgent"
                placeholder="Custom user agent string..."
                value={formData.credentials.userAgent}
                onChange={(e) => updateFormData('credentials.userAgent', e.target.value)}
              />
            </div>

            {/* Proxy Configuration */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Use Proxy</Label>
                  <p className="text-sm text-gray-500">
                    Route requests through a proxy server
                  </p>
                </div>
                <Switch
                  checked={useProxy}
                  onCheckedChange={setUseProxy}
                />
              </div>

              {useProxy && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                  <div className="space-y-2">
                    <Label htmlFor="proxyHost">Proxy Host</Label>
                    <Input
                      id="proxyHost"
                      placeholder="proxy.example.com"
                      value={formData.credentials.proxy.host}
                      onChange={(e) => updateFormData('credentials.proxy.host', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proxyPort">Proxy Port</Label>
                    <Input
                      id="proxyPort"
                      type="number"
                      placeholder="8080"
                      value={formData.credentials.proxy.port}
                      onChange={(e) => updateFormData('credentials.proxy.port', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proxyUsername">Proxy Username (Optional)</Label>
                    <Input
                      id="proxyUsername"
                      placeholder="username"
                      value={formData.credentials.proxy.username}
                      onChange={(e) => updateFormData('credentials.proxy.username', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proxyPassword">Proxy Password (Optional)</Label>
                    <Input
                      id="proxyPassword"
                      type="password"
                      placeholder="password"
                      value={formData.credentials.proxy.password}
                      onChange={(e) => updateFormData('credentials.proxy.password', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Security Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h4 className="font-medium text-blue-900">Security & Compliance</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• All credentials are encrypted using industry-standard AES-256 encryption</p>
                <p>• We strictly follow LinkedIn's rate limits and terms of service</p>
                <p>• Data collection is limited to publicly available profile information</p>
                <p>• You can revoke access and delete stored credentials at any time</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.accountName.trim() || !formData.credentials.username || !formData.credentials.password}
          className="flex-1"
        >
          {isLoading ? 'Saving...' : isEdit ? 'Update Account' : 'Create Account'}
        </Button>
      </div>
    </form>
  );
}
