
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Menu, ArrowLeft } from 'lucide-react';
import Scene from '@/components/Scene';
import RenderControls from '@/components/RenderControls';
import LoadingTransition from '@/components/LoadingTransition';
import { ShapeType, getShapeById } from '@/lib/shapes';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const ShapeViewer: React.FC = () => {
  const { shapeId: shapeIdParam } = useParams<{ shapeId?: string }>();
  const shapeId = (shapeIdParam ?? 'cube') as ShapeType;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [controlsOpen, setControlsOpen] = useState(false);
  const { toast } = useToast();
  
  // Rendering states
  const [wireframe, setWireframe] = useState(false);
  // Z-buffer / depth testing toggle (created here as UI state).
  // When false, we disable depthTest/depthWrite on the mesh material to demonstrate hidden-surface removal artifacts.
  const [depthTestEnabled, setDepthTestEnabled] = useState(true);
  const [ambient, setAmbient] = useState(true);
  const [diffuse, setDiffuse] = useState(true);
  const [specular, setSpecular] = useState(false);
  const [shapeColor, setShapeColor] = useState('#ffffff');
  const [background, setBackground] = useState('space');
  const [showLightHelpers, setShowLightHelpers] = useState(false);

  // Rotation state
  const [rotationPaused, setRotationPaused] = useState(false);

  useEffect(() => {
    try {
      // Validate shape ID
      getShapeById(shapeId);

      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Invalid shape ID:', error);
      navigate('/');
    }
  }, [shapeId, navigate]);

  const handleGoBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const toggleControls = useCallback(() => {
    setControlsOpen(prev => !prev);
  }, []);

  const handleWireframeChange = useCallback((value: boolean) => {
    setWireframe(value);
  }, []);

  const handleDepthTestEnabledChange = useCallback((value: boolean) => {
    setDepthTestEnabled(value);
  }, []);

  const handleAmbientChange = useCallback((value: boolean) => {
    setAmbient(value);
  }, []);

  const handleDiffuseChange = useCallback((value: boolean) => {
    setDiffuse(value);
  }, []);

  const handleSpecularChange = useCallback((value: boolean) => {
    setSpecular(value);
  }, []);

  const handleShapeColorChange = useCallback((value: string) => {
    setShapeColor(value);
  }, []);

  const handleBackgroundChange = useCallback((value: string) => {
    setBackground(value);
  }, []);
  
  const handleShowLightHelpersChange = useCallback((value: boolean) => {
    setShowLightHelpers(value);
  }, []);
  

  const handleRotationPauseChange = useCallback((value: boolean) => {
    setRotationPaused(value);
  }, []);

  const shapeDisplayName = getShapeById(shapeId).name;

  return (
    <LoadingTransition isLoading={isLoading}>
      <div className="relative min-h-screen bg-background">
        <header className="absolute top-0 left-0 right-0 z-10 px-4 py-4 sm:px-6 flex justify-between items-center">
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleGoBack}
            className="h-10 w-10 rounded-full border"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-medium">
            {shapeDisplayName}
          </h1>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleControls}
            className="h-10 w-10 rounded-full border"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        
        <div className="h-screen w-screen">
          <Scene
            shapeId={shapeId}
            wireframe={wireframe}
            // Used here: pass the toggle down into the renderer.
            depthTestEnabled={depthTestEnabled}
            ambient={ambient}
            diffuse={diffuse}
            specular={specular}
            shapeColor={shapeColor}
            background={background}
            showLightHelpers={showLightHelpers}
            rotationPaused={rotationPaused}
          />
        </div>
        
        <RenderControls
          isOpen={controlsOpen}
          onClose={() => setControlsOpen(false)}
          wireframe={wireframe}
          setWireframe={handleWireframeChange}
          // Used here: control panel switch reads/writes this state.
          depthTestEnabled={depthTestEnabled}
          setDepthTestEnabled={handleDepthTestEnabledChange}
          ambient={ambient}
          setAmbient={handleAmbientChange}
          diffuse={diffuse}
          setDiffuse={handleDiffuseChange}
          specular={specular}
          setSpecular={handleSpecularChange}
          shapeColor={shapeColor}
          setShapeColor={handleShapeColorChange}
          background={background}
          setBackground={handleBackgroundChange}
          showLightHelpers={showLightHelpers}
          setShowLightHelpers={handleShowLightHelpersChange}
          onBack={handleGoBack}
          rotationPaused={rotationPaused}
          setRotationPaused={handleRotationPauseChange}
        />
      </div>
    </LoadingTransition>
  );
};

export default ShapeViewer;
