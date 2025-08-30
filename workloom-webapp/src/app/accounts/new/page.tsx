"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AccountProviderSelector } from "@/features/accounts/components/account-provider-selector";
import { LinkedInAccountForm } from "@/features/accounts/components/linkedin-account-form";
import { SalesforceAccountForm } from "@/features/accounts/components/salesforce-account-form";
import { HubSpotAccountForm } from "@/features/accounts/components/hubspot-account-form";
import { useAccounts } from "@/features/accounts/hooks/use-accounts";
import { AccountProvider, CreateAccountData } from "@/features/accounts/types";

function NewAccountContent() {
  const [selectedProvider, setSelectedProvider] = useState<AccountProvider | undefined>();
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { accounts, createAccount, isCreating } = useAccounts();

  useEffect(() => {
    const providerParam = searchParams.get("provider");
    if (providerParam) {
      const provider = providerParam.toUpperCase() as AccountProvider;
      if (['LINKEDIN', 'SALESFORCE', 'HUBSPOT'].includes(provider)) {
        setSelectedProvider(provider);
      }
    }
  }, [searchParams]);

  const handleCreateAccount = async (data: CreateAccountData) => {
    try {
      setError("");
      await createAccount(data);
      router.push("/accounts");
    } catch (error: any) {
      setError(error?.message || "Failed to create account");
    }
  };

  const connectedProviders = accounts.map(account => account.provider as AccountProvider);

  const renderAccountForm = () => {
    if (!selectedProvider) return null;

    switch (selectedProvider) {
      case 'LINKEDIN':
        return (
          <LinkedInAccountForm
            onSubmit={handleCreateAccount}
            isLoading={isCreating}
          />
        );
      case 'SALESFORCE':
        return (
          <SalesforceAccountForm
            onSubmit={handleCreateAccount}
            isLoading={isCreating}
          />
        );
      case 'HUBSPOT':
        return (
          <HubSpotAccountForm
            onSubmit={handleCreateAccount}
            isLoading={isCreating}
          />
        );
      default:
        return null;
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Connect External Account</h1>
          <p className="text-gray-600 mt-2">Add a new account to enable data collection and integration</p>
        </div>

        <div className="max-w-4xl">
          {error && (
            <Card className="mb-6 border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="text-red-700 text-sm">{error}</div>
              </CardContent>
            </Card>
          )}

          {!selectedProvider ? (
            <AccountProviderSelector
              selectedProvider={selectedProvider}
              onSelectProvider={setSelectedProvider}
              connectedProviders={connectedProviders}
            />
          ) : (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Account Configuration</CardTitle>
                      <CardDescription>
                        Configure your {selectedProvider.toLowerCase()} integration
                      </CardDescription>
                    </div>
                    <Link 
                      href="/accounts/new" 
                      className="text-sm text-blue-600 hover:underline"
                      onClick={() => setSelectedProvider(undefined)}
                    >
                      Change Provider
                    </Link>
                  </div>
                </CardHeader>
              </Card>

              {renderAccountForm()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewAccountPage() {
  return (
    <ProtectedRoute>
      <NewAccountContent />
    </ProtectedRoute>
  );
}
