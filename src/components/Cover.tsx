import { useMemo, useRef, useEffect } from 'react';
import { useSpring, animated } from '@react-spring/three';
import * as THREE from 'three';
import { COVER_DIMENSIONS, type ViewMode, type FoilType, type TypographySettings } from '../types';

interface CoverProps {
  viewMode: ViewMode;
  openAngle: number;
  animationSpeed: number;
  paperColor: string;
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

// Scale factor: mm to scene units (1mm = 0.01 units)
const SCALE = 0.01;

// Scaled dimensions
const DIMS = {
  frontW: COVER_DIMENSIONS.frontWidth * SCALE,
  frontH: COVER_DIMENSIONS.frontHeight * SCALE,
  backW: COVER_DIMENSIONS.backWidth * SCALE,
  backH: COVER_DIMENSIONS.backHeight * SCALE,
  flapH: COVER_DIMENSIONS.flapHeight * SCALE,
  flapW: COVER_DIMENSIONS.flapWidth * SCALE,
  beltW: COVER_DIMENSIONS.beltWidth * SCALE,
  beltH: COVER_DIMENSIONS.beltHeight * SCALE,
  slotW: COVER_DIMENSIONS.slotWidth * SCALE,
  spine: COVER_DIMENSIONS.spineDepth * SCALE,
  thickness: 0.015, // Paper thickness
};

export function Cover({
  viewMode,
  openAngle,
  animationSpeed,
  paperColor,
  paperTexture,
  textureIntensity,
  foilType,
  foilColor,
  debossEnabled: _debossEnabled,
  debossDepth: _debossDepth,
  frontTypography,
  backTypography,
  spineTypography,
}: CoverProps) {
  // Create paper texture
  const textureCanvas = useMemo(() => {
    if (!paperTexture) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill with base color
    ctx.fillStyle = '#888888';
    ctx.fillRect(0, 0, 512, 512);

    // Add noise for paper texture (Colorplan has a slight texture)
    const imageData = ctx.getImageData(0, 0, 512, 512);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 30 * textureIntensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas;
  }, [paperTexture, textureIntensity]);

  const bumpMap = useMemo(() => {
    if (!textureCanvas) return null;
    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  }, [textureCanvas]);

  // Calculate rotations based on view mode
  const getRotations = () => {
    switch (viewMode) {
      case 'closed':
        return {
          frontRot: 0,
          backRot: 0,
          frontFlapRot: Math.PI * 0.5,  // Folded in 90 degrees
          backFlapRot: -Math.PI * 0.5,
        };
      case 'open':
        const angle = (openAngle * Math.PI) / 180;
        return {
          frontRot: -angle / 2,
          backRot: angle / 2,
          frontFlapRot: Math.PI * 0.5,
          backFlapRot: -Math.PI * 0.5,
        };
      case 'flat':
        return {
          frontRot: -Math.PI / 2,
          backRot: Math.PI / 2,
          frontFlapRot: 0,
          backFlapRot: 0,
        };
      default:
        return {
          frontRot: 0,
          backRot: 0,
          frontFlapRot: Math.PI * 0.5,
          backFlapRot: -Math.PI * 0.5,
        };
    }
  };

  const rotations = getRotations();

  // Animated springs
  const frontSpring = useSpring({
    rotation: [0, rotations.frontRot, 0] as [number, number, number],
    config: {
      mass: 1,
      tension: 170 * animationSpeed,
      friction: 26,
    },
  });

  const backSpring = useSpring({
    rotation: [0, rotations.backRot, 0] as [number, number, number],
    config: {
      mass: 1,
      tension: 170 * animationSpeed,
      friction: 26,
    },
  });

  const frontFlapSpring = useSpring({
    rotation: [0, rotations.frontFlapRot, 0] as [number, number, number],
    config: {
      mass: 1,
      tension: 170 * animationSpeed,
      friction: 26,
    },
  });

  const backFlapSpring = useSpring({
    rotation: [0, rotations.backFlapRot, 0] as [number, number, number],
    config: {
      mass: 1,
      tension: 170 * animationSpeed,
      friction: 26,
    },
  });

  // Paper material properties
  const getMaterialProps = () => {
    const baseProps = {
      color: paperColor,
      roughness: 0.85,
      metalness: 0,
      bumpMap: bumpMap,
      bumpScale: textureIntensity * 0.005,
    };

    return baseProps;
  };

  // Foil material properties
  const getFoilMaterialProps = () => {
    switch (foilType) {
      case 'gloss':
        return {
          color: foilColor,
          roughness: 0.1,
          metalness: 0.1,
          envMapIntensity: 2,
        };
      case 'matte':
        return {
          color: foilColor,
          roughness: 0.6,
          metalness: 0,
          envMapIntensity: 0.5,
        };
      case 'silver':
        return {
          color: '#c0c0c0',
          roughness: 0.15,
          metalness: 0.9,
          envMapIntensity: 3,
        };
      case 'gold':
        return {
          color: '#d4af37',
          roughness: 0.2,
          metalness: 0.85,
          envMapIntensity: 2.5,
        };
      case 'copper':
        return {
          color: '#b87333',
          roughness: 0.25,
          metalness: 0.8,
          envMapIntensity: 2,
        };
      case 'holographic':
        return {
          color: '#ffffff',
          roughness: 0.05,
          metalness: 0.95,
          envMapIntensity: 4,
        };
      default:
        return null;
    }
  };

  const materialProps = getMaterialProps();
  const foilMaterialProps = getFoilMaterialProps();

  // Text rendering will use a canvas texture
  const frontTextTexture = useTextTexture(frontTypography, DIMS.frontW, DIMS.frontH, foilMaterialProps?.color || '#ffffff');
  const backTextTexture = useTextTexture(backTypography, DIMS.backW, DIMS.backH, foilMaterialProps?.color || '#ffffff');
  const spineTextTexture = useTextTexture(spineTypography, DIMS.spine, DIMS.frontH, foilMaterialProps?.color || '#ffffff', true);

  return (
    <group>
      {/* SPINE - the center connecting piece */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[DIMS.spine, DIMS.frontH, DIMS.thickness]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {/* Spine text overlay */}
      {spineTextTexture && foilMaterialProps && (
        <mesh position={[0, 0, DIMS.thickness / 2 + 0.001]}>
          <planeGeometry args={[DIMS.spine, DIMS.frontH]} />
          <meshStandardMaterial
            map={spineTextTexture}
            transparent
            {...foilMaterialProps}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* FRONT PANEL - rotates from the right edge of spine */}
      <animated.group
        position={[DIMS.spine / 2, 0, 0]}
        rotation={frontSpring.rotation as unknown as [number, number, number]}
      >
        {/* Front cover */}
        <mesh position={[DIMS.frontW / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[DIMS.frontW, DIMS.frontH, DIMS.thickness]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Front text overlay */}
        {frontTextTexture && foilMaterialProps && (
          <mesh position={[DIMS.frontW / 2, 0, DIMS.thickness / 2 + 0.001]}>
            <planeGeometry args={[DIMS.frontW, DIMS.frontH]} />
            <meshStandardMaterial
              map={frontTextTexture}
              transparent
              {...foilMaterialProps}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* FRONT FLAP - folds inward from right edge of front */}
        <animated.group
          position={[DIMS.frontW, 0, 0]}
          rotation={frontFlapSpring.rotation as unknown as [number, number, number]}
        >
          <mesh position={[DIMS.flapW / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[DIMS.flapW, DIMS.flapH, DIMS.thickness]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>

          {/* Belt on front flap */}
          <mesh position={[DIMS.flapW / 2, -DIMS.flapH / 2 - DIMS.beltH / 2, 0]} castShadow>
            <boxGeometry args={[DIMS.beltW, DIMS.beltH, DIMS.thickness]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
        </animated.group>
      </animated.group>

      {/* BACK PANEL - rotates from the left edge of spine */}
      <animated.group
        position={[-DIMS.spine / 2, 0, 0]}
        rotation={backSpring.rotation as unknown as [number, number, number]}
      >
        {/* Back cover */}
        <mesh position={[-DIMS.backW / 2, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[DIMS.backW, DIMS.backH, DIMS.thickness]} />
          <meshStandardMaterial {...materialProps} />
        </mesh>

        {/* Back text overlay */}
        {backTextTexture && foilMaterialProps && (
          <mesh position={[-DIMS.backW / 2, 0, -DIMS.thickness / 2 - 0.001]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[DIMS.backW, DIMS.backH]} />
            <meshStandardMaterial
              map={backTextTexture}
              transparent
              {...foilMaterialProps}
              depthWrite={false}
            />
          </mesh>
        )}

        {/* BACK FLAP - folds inward from left edge of back */}
        <animated.group
          position={[-DIMS.backW, 0, 0]}
          rotation={backFlapSpring.rotation as unknown as [number, number, number]}
        >
          <mesh position={[-DIMS.flapW / 2, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[DIMS.flapW, DIMS.flapH, DIMS.thickness]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>

          {/* Slot cutout indicator on back flap */}
          <mesh position={[-DIMS.flapW / 2, -DIMS.flapH / 2 + DIMS.slotW / 2, DIMS.thickness / 2 + 0.001]}>
            <planeGeometry args={[DIMS.beltW + 0.02, DIMS.slotW]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.3} />
          </mesh>
        </animated.group>
      </animated.group>

      {/* Card stack indicator (when open) */}
      {viewMode === 'open' && (
        <mesh position={[0, 0, -DIMS.spine / 2]} castShadow>
          <boxGeometry args={[DIMS.frontW * 0.9, DIMS.frontH * 0.9, DIMS.spine * 0.8]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>
      )}
    </group>
  );
}

// Hook to create text texture from typography settings
function useTextTexture(
  typography: TypographySettings,
  width: number,
  height: number,
  color: string,
  rotated: boolean = false
) {
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    // Use high resolution for crisp text
    const resolution = 4;
    const canvasW = rotated ? height * 100 * resolution : width * 100 * resolution;
    const canvasH = rotated ? width * 100 * resolution : height * 100 * resolution;
    canvas.width = canvasW;
    canvas.height = canvasH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Clear with transparent background
    ctx.clearRect(0, 0, canvasW, canvasH);

    // Apply text transformation
    let text = typography.text;
    switch (typography.textCase) {
      case 'uppercase':
        text = text.toUpperCase();
        break;
      case 'lowercase':
        text = text.toLowerCase();
        break;
      case 'capitalize':
        text = text.replace(/\b\w/g, (c) => c.toUpperCase());
        break;
    }

    // Font setup
    const fontSize = typography.fontSize * 4 * resolution; // Scale up for resolution
    ctx.font = `${fontSize}px ${typography.fontFamily}, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = typography.alignment;
    ctx.textBaseline = 'middle';

    // Calculate text position
    let x = canvasW / 2;
    if (typography.alignment === 'left') x = canvasW * 0.1;
    if (typography.alignment === 'right') x = canvasW * 0.9;

    // Handle multi-line text
    const lines = text.split('\n');
    const lineHeight = fontSize * typography.lineHeight;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvasH - totalHeight) / 2 + lineHeight / 2;

    // Apply letter spacing by drawing each character
    lines.forEach((line, lineIndex) => {
      const y = startY + lineIndex * lineHeight;

      if (typography.letterSpacing > 0.1) {
        // Draw with letter spacing
        const letterSpacing = typography.letterSpacing * 4 * resolution;
        let currentX = x;

        if (typography.alignment === 'center') {
          const totalWidth = (line.length - 1) * letterSpacing + ctx.measureText(line).width;
          currentX = (canvasW - totalWidth) / 2;
        } else if (typography.alignment === 'right') {
          const totalWidth = (line.length - 1) * letterSpacing + ctx.measureText(line).width;
          currentX = canvasW * 0.9 - totalWidth;
        }

        for (let i = 0; i < line.length; i++) {
          ctx.fillText(line[i], currentX, y);
          currentX += ctx.measureText(line[i]).width + letterSpacing;
        }
      } else {
        ctx.fillText(line, x, y);
      }
    });

    // Create THREE texture
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.colorSpace = THREE.SRGBColorSpace;

    // Rotate UV if needed for spine
    if (rotated) {
      tex.rotation = Math.PI / 2;
      tex.center.set(0.5, 0.5);
    }

    return tex;
  }, [typography, width, height, color, rotated]);

  // Load Google Font
  useEffect(() => {
    const fontUrl = `https://fonts.googleapis.com/css2?family=${typography.fontFamily.replace(/ /g, '+')}&display=swap`;

    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.href = fontUrl;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      // Force texture update after font loads
      link.onload = () => {
        if (textureRef.current) {
          textureRef.current.needsUpdate = true;
        }
      };
    }
  }, [typography.fontFamily]);

  textureRef.current = texture;
  return texture;
}
