import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import '@/styles/global.scss';
import './styles/animations.css';
import { router } from './router';

import { initTelegramApp } from '@/utils/telegram';

initTelegramApp();

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },
    },
});

const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Root element not found');
}

createRoot(rootElement).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </StrictMode>,
);
