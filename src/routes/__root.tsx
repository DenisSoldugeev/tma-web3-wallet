import { Footer } from '@components/ui/Footer';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

import './root.scss';

export const Route = createRootRoute({
    component: RootComponent,
});

function RootComponent() {
    return (
        <>
            <div className="page-content">
                <Outlet/>
            </div>
            <Footer/>
            {import.meta.env.DEV && <TanStackRouterDevtools/>}
        </>
    );
}
