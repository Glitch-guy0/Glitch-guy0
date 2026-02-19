import { createRoute, createRouter, redirect } from '@tanstack/react-router';
import { Route as rootRoute } from './Root';
import { BackendComponent } from './Backend';
import { FrontendComponent } from './Frontend';
import { EmbeddedComponent } from './Embedded';
import { DevOpsComponent } from './DevOps';

// Define child routes
const backendRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/backend',
  component: BackendComponent,
});

const frontendRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/frontend',
  component: FrontendComponent,
});

const embeddedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/embedded',
  component: EmbeddedComponent,
});

const devopsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/devops',
  component: DevOpsComponent,
});

// Index route (redirect to backend)
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/backend' });
  },
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  backendRoute,
  frontendRoute,
  embeddedRoute,
  devopsRoute,
]);

// Create router
export const router = createRouter({ routeTree });

// Register module augmentation for types safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
