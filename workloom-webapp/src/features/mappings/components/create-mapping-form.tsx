'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMappings } from '../hooks/use-mappings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function CreateMappingForm() {
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [country, setCountry] = useState('');
  
  const { createMapping, isCreating, createError } = useMappings();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    createMapping({
      name,
      jobTitle: jobTitle || undefined,
      company: company || undefined,
      country: country || undefined,
    });
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Mapping Configuration</CardTitle>
          <CardDescription>
            Define the criteria for your LinkedIn profile mapping. You can specify job titles, 
            companies, and countries to target specific professional segments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Mapping Name *</Label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Senior Developers in Tech Companies"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Give your mapping a descriptive name to identify it easily
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                type="text"
                placeholder="e.g., Software Engineer, Product Manager, CEO"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Target profiles with specific job titles (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                type="text"
                placeholder="e.g., Google, Microsoft, Startup"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Filter by company name or type (optional)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                type="text"
                placeholder="e.g., United States, United Kingdom, Germany"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Target profiles from specific countries (optional)
              </p>
            </div>

            {createError && (
              <div className="text-red-500 text-sm">
                {createError}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isCreating || !name.trim()}
              >
                {isCreating ? 'Creating...' : 'Create Mapping'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h4 className="font-medium">Create your mapping</h4>
              <p className="text-sm text-gray-600">Define criteria to target specific LinkedIn profiles</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h4 className="font-medium">Run the mapping</h4>
              <p className="text-sm text-gray-600">Our system will find and collect matching profiles</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h4 className="font-medium">Track changes</h4>
              <p className="text-sm text-gray-600">Monitor profile changes, new arrivals, and departures over time</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">4</div>
            <div>
              <h4 className="font-medium">Export & integrate</h4>
              <p className="text-sm text-gray-600">Export results to Excel/CSV or integrate with your CRM</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
