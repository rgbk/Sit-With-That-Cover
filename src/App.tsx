import { Canvas } from '@react-three/fiber';
import { Leva, useControls } from 'leva';
import { Scene } from './components/Scene';
import {
  DEFAULT_SETTINGS,
  COLORPLAN_COLORS,
  FONT_OPTIONS,
  type ViewMode,
  type FoilType,
  type PaperColor,
} from './types';
import './App.css';

function App() {
  // View controls
  const viewControls = useControls('View', {
    viewMode: {
      value: DEFAULT_SETTINGS.viewMode,
      options: ['closed', 'open', 'flat'] as ViewMode[],
    },
    openAngle: {
      value: DEFAULT_SETTINGS.openAngle,
      min: 0,
      max: 180,
      step: 1,
      render: (get) => get('View.viewMode') === 'open',
    },
    animationSpeed: {
      value: DEFAULT_SETTINGS.animationSpeed,
      min: 0.1,
      max: 3,
      step: 0.1,
    },
  });

  // Paper controls
  const paperControls = useControls('Paper', {
    paperColor: {
      value: DEFAULT_SETTINGS.paperColor,
      options: Object.keys(COLORPLAN_COLORS) as PaperColor[],
    },
    useCustomColor: DEFAULT_SETTINGS.useCustomColor,
    customPaperColor: {
      value: DEFAULT_SETTINGS.customPaperColor,
      render: (get) => get('Paper.useCustomColor'),
    },
    paperTexture: DEFAULT_SETTINGS.paperTexture,
    textureIntensity: {
      value: DEFAULT_SETTINGS.textureIntensity,
      min: 0,
      max: 1,
      step: 0.05,
      render: (get) => get('Paper.paperTexture'),
    },
  });

  // Foil controls
  const foilControls = useControls('Foil', {
    foilType: {
      value: DEFAULT_SETTINGS.foilType,
      options: ['none', 'gloss', 'matte', 'silver', 'gold', 'copper', 'holographic'] as FoilType[],
    },
    foilColor: {
      value: DEFAULT_SETTINGS.foilColor,
      render: (get) => get('Foil.foilType') !== 'none',
    },
  });

  // Deboss controls
  const debossControls = useControls('Deboss', {
    debossEnabled: DEFAULT_SETTINGS.debossEnabled,
    debossDepth: {
      value: DEFAULT_SETTINGS.debossDepth,
      min: 0,
      max: 1,
      step: 0.05,
      render: (get) => get('Deboss.debossEnabled'),
    },
  });

  // Front typography
  const frontTypo = useControls('Front Typography', {
    text: {
      value: DEFAULT_SETTINGS.frontTypography.text,
      rows: true,
    },
    fontFamily: {
      value: DEFAULT_SETTINGS.frontTypography.fontFamily,
      options: FONT_OPTIONS,
    },
    fontSize: {
      value: DEFAULT_SETTINGS.frontTypography.fontSize,
      min: 4,
      max: 48,
      step: 0.5,
    },
    letterSpacing: {
      value: DEFAULT_SETTINGS.frontTypography.letterSpacing,
      min: -2,
      max: 10,
      step: 0.1,
    },
    lineHeight: {
      value: DEFAULT_SETTINGS.frontTypography.lineHeight,
      min: 0.8,
      max: 3,
      step: 0.05,
    },
    textCase: {
      value: DEFAULT_SETTINGS.frontTypography.textCase,
      options: ['none', 'uppercase', 'lowercase', 'capitalize'] as const,
    },
    alignment: {
      value: DEFAULT_SETTINGS.frontTypography.alignment,
      options: ['left', 'center', 'right'] as const,
    },
  });

  // Back typography
  const backTypo = useControls('Back Typography', {
    text: {
      value: DEFAULT_SETTINGS.backTypography.text,
      rows: true,
    },
    fontFamily: {
      value: DEFAULT_SETTINGS.backTypography.fontFamily,
      options: FONT_OPTIONS,
    },
    fontSize: {
      value: DEFAULT_SETTINGS.backTypography.fontSize,
      min: 4,
      max: 48,
      step: 0.5,
    },
    letterSpacing: {
      value: DEFAULT_SETTINGS.backTypography.letterSpacing,
      min: -2,
      max: 10,
      step: 0.1,
    },
    lineHeight: {
      value: DEFAULT_SETTINGS.backTypography.lineHeight,
      min: 0.8,
      max: 3,
      step: 0.05,
    },
    textCase: {
      value: DEFAULT_SETTINGS.backTypography.textCase,
      options: ['none', 'uppercase', 'lowercase', 'capitalize'] as const,
    },
    alignment: {
      value: DEFAULT_SETTINGS.backTypography.alignment,
      options: ['left', 'center', 'right'] as const,
    },
  });

  // Spine typography
  const spineTypo = useControls('Spine Typography', {
    text: {
      value: DEFAULT_SETTINGS.spineTypography.text,
      rows: true,
    },
    fontFamily: {
      value: DEFAULT_SETTINGS.spineTypography.fontFamily,
      options: FONT_OPTIONS,
    },
    fontSize: {
      value: DEFAULT_SETTINGS.spineTypography.fontSize,
      min: 4,
      max: 24,
      step: 0.5,
    },
    letterSpacing: {
      value: DEFAULT_SETTINGS.spineTypography.letterSpacing,
      min: -2,
      max: 10,
      step: 0.1,
    },
  });

  // Combine settings
  const settings = {
    viewMode: viewControls.viewMode as ViewMode,
    openAngle: viewControls.openAngle,
    animationSpeed: viewControls.animationSpeed,

    paperColor: paperControls.paperColor as PaperColor,
    useCustomColor: paperControls.useCustomColor,
    customPaperColor: paperControls.customPaperColor,
    paperTexture: paperControls.paperTexture,
    textureIntensity: paperControls.textureIntensity,

    foilType: foilControls.foilType as FoilType,
    foilColor: foilControls.foilColor,

    debossEnabled: debossControls.debossEnabled,
    debossDepth: debossControls.debossDepth,

    frontTypography: {
      text: frontTypo.text,
      fontFamily: frontTypo.fontFamily,
      fontSize: frontTypo.fontSize,
      letterSpacing: frontTypo.letterSpacing,
      lineHeight: frontTypo.lineHeight,
      textCase: frontTypo.textCase as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
      alignment: frontTypo.alignment as 'left' | 'center' | 'right',
    },

    backTypography: {
      text: backTypo.text,
      fontFamily: backTypo.fontFamily,
      fontSize: backTypo.fontSize,
      letterSpacing: backTypo.letterSpacing,
      lineHeight: backTypo.lineHeight,
      textCase: backTypo.textCase as 'none' | 'uppercase' | 'lowercase' | 'capitalize',
      alignment: backTypo.alignment as 'left' | 'center' | 'right',
    },

    spineTypography: {
      text: spineTypo.text,
      fontFamily: spineTypo.fontFamily,
      fontSize: spineTypo.fontSize,
      letterSpacing: spineTypo.letterSpacing,
      lineHeight: DEFAULT_SETTINGS.spineTypography.lineHeight,
      textCase: DEFAULT_SETTINGS.spineTypography.textCase,
      alignment: DEFAULT_SETTINGS.spineTypography.alignment,
    },
  };

  // Get actual paper color
  const actualPaperColor = settings.useCustomColor
    ? settings.customPaperColor
    : COLORPLAN_COLORS[settings.paperColor];

  return (
    <div className="app">
      <Leva collapsed={false} />
      <Canvas
        shadows
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene
          {...settings}
          paperColorHex={actualPaperColor}
        />
      </Canvas>
    </div>
  );
}

export default App;
