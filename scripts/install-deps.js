#!/usr/bin/env node
/**
 * PAAN MANDI — Additional Package Installation Script
 * Run: node scripts/install-deps.js
 */

const { execSync } = require('child_process');

const dependencies = [
  '@supabase/supabase-js@^2',
  '@supabase/ssr@^0',
  'react-hook-form@^7',
  '@hookform/resolvers@^3',
  'zod@^3',
  'razorpay@^2',
  'resend@^4',
  'lucide-react@^0.469',
  'clsx@^2',
  'tailwind-merge@^2',
  'date-fns@^3',
  'sonner@^1',
  '@radix-ui/react-dialog@^1',
  '@radix-ui/react-dropdown-menu@^2',
  '@radix-ui/react-select@^2',
  '@radix-ui/react-tabs@^1',
  '@radix-ui/react-checkbox@^1',
  '@radix-ui/react-label@^2',
  '@radix-ui/react-slot@^1',
  '@radix-ui/react-tooltip@^1',
  '@radix-ui/react-separator@^1',
  '@radix-ui/react-accordion@^1',
  '@radix-ui/react-avatar@^1',
  '@radix-ui/react-badge@^1',
  'sharp@^0',
  'next-seo@^6',
  'slugify@^1',
];

const devDependencies = [
  'vitest@^2',
  '@vitejs/plugin-react@^4',
  '@testing-library/react@^16',
  '@testing-library/user-event@^14',
  '@testing-library/jest-dom@^6',
  'jsdom@^25',
  '@playwright/test@^1',
  'msw@^2',
];

console.log('Installing production dependencies...');
execSync(`npm install ${dependencies.join(' ')}`, { stdio: 'inherit' });

console.log('\nInstalling development dependencies...');
execSync(`npm install -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });

console.log('\nAll dependencies installed successfully!');
