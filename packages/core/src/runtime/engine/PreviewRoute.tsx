import React from 'react';
import { PreviewEntry } from '../../admin/PreviewEntry';
import { ThemeLoader } from '../../lib/ThemeLoader';

export interface PreviewRouteProps {
  tenantCss: string;
  adminCss: string;
}

export const PreviewRoute: React.FC<PreviewRouteProps> = ({ tenantCss, adminCss }) => (
  <ThemeLoader mode="tenant" tenantCss={tenantCss} adminCss={adminCss}>
    <PreviewEntry />
  </ThemeLoader>
);
