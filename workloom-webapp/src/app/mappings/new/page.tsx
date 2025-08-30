'use client';

import { Navbar } from '@/components/layout/navbar';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { CreateMappingForm } from '@/features/mappings/components/create-mapping-form';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function NewMappingContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/mappings" className="inline-flex items-center text-blue-600 hover:underline mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Mappings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Mapping</h1>
          <p className="text-gray-600 mt-2">Set up criteria to map LinkedIn profiles</p>
        </div>

        <CreateMappingForm />
      </div>
    </div>
  );
}

export default function NewMappingPage() {
  return (
    <ProtectedRoute>
      <NewMappingContent />
    </ProtectedRoute>
  );
}