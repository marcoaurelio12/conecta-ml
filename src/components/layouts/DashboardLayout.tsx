
import React from 'react';
import AuthenticatedLayout from './AuthenticatedLayout';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <AuthenticatedLayout>
      {children}
    </AuthenticatedLayout>
  );
};

export default DashboardLayout;
