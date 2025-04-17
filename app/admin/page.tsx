"use client";

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PageLayout from '../components/PageLayout';

// Dynamically import the admin content component with no SSR
const AdminContentDynamic = dynamic(
  () => import('../components/AdminContent'),
  { ssr: false }
);

// Loading component for suspense fallback
function AdminLoader() {
  return (
    <PageLayout>
      <div className="container-custom py-12">
        <div className="text-center">
          <h1>Loading Admin Dashboard...</h1>
          <div className="mt-8 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// Export the admin page with suspense
export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoader />}>
      <AdminContentDynamic />
    </Suspense>
  );
}