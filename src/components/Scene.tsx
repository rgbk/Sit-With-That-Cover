import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Cover } from './Cover';
import type { ViewMode, FoilType, TypographySettings } from '../types';

interface SceneProps {
  viewMode: ViewMode;
  openAngle: number;
  animationSpeed: number;
  paperColorHex: string;
  paperTexture: boolean;
  textureIntensity: number;
  foilType: FoilType;
  foilColor: string;
  debossEnabled: boolean;
  debossDepth: number;
  frontTypography: TypographySettings;
  backTypography: TypographySettings;
  spineTypography: TypographySettings;
}

export function Scene({
  viewMode,
  openAngle,
  animationSpeed,
  paperColorHex,
  paperTexture,
  textureIntensity,
  foilType,
  foilColor,
  debossEnabled,
  debossDepth,
  frontTypography,
  backTypography,
  spineTypography,
}: SceneProps) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.3}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {/* Environment for reflections (important for foil effect) */}
      <Environment preset="studio" />

      {/* Camera controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        autoRotate={false}
      />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Cover */}
      <Cover
        viewMode={viewMode}
        openAngle={openAngle}
        animationSpeed={animationSpeed}
        paperColor={paperColorHex}
        paperTexture={paperTexture}
        textureIntensity={textureIntensity}
        foilType={foilType}
        foilColor={foilColor}
        debossEnabled={debossEnabled}
        debossDepth={debossDepth}
        frontTypography={frontTypography}
        backTypography={backTypography}
        spineTypography={spineTypography}
      />
    </>
  );
}
