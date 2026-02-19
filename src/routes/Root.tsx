import { useState, useEffect, useMemo } from 'react';
import { createRootRoute, Outlet, useLocation, useNavigate } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { Scene } from '@/components/3d';
import { LoadingScreen, BackgroundText } from '@/components/ui';
import { ExpertiseFactory } from '@/core/ExpertiseFactory';
import { ExpertiseType } from '@/interfaces';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Simulate loading delay
  useEffect(() => {
    // Wait for 2.5 seconds to simulate loading assets
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Determine current expertise based on path
  const currentConfig = useMemo(() => {
    const configs = ExpertiseFactory.getAllConfigs();
    // Default to BACKEND if path is root or unknown
    const found = configs.find((c) => c.path === location.pathname);
    return found || ExpertiseFactory.getConfig(ExpertiseType.BACKEND);
  }, [location.pathname]);

  const handleWheelClick = () => {
    if (!isLoaded) return;

    // Find next expertise
    const nextConfig = ExpertiseFactory.getNextExpertise(currentConfig.id);
    navigate({ to: nextConfig.path });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <Scene
        isLoaded={isLoaded}
        targetRotation={currentConfig.rotation}
        onWheelClick={handleWheelClick}
      />

      {/* Content Overlay */}
      <div className={`relative z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
         {/* Only show outlet content when loaded */}
         {isLoaded && <Outlet />}
      </div>

      {/* Background Text Overlay */}
      {isLoaded && (
        <BackgroundText text={currentConfig.title} />
      )}
    </>
  );
}
