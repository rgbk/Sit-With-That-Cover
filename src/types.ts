// Cover dimensions from CAD (all in mm)
export const COVER_DIMENSIONS = {
  frontWidth: 160,
  frontHeight: 220,
  backWidth: 160,
  backHeight: 220,
  flapHeight: 60,  // Height of the flap
  flapWidth: 80,   // How far flap extends from edge
  beltWidth: 50,
  beltHeight: 30,
  slotWidth: 20,
  spineDepth: 15,  // TBD based on card stack - 12 x 270gsm cards
};

export type ViewMode = 'closed' | 'open' | 'flat';

export type FoilType = 'none' | 'gloss' | 'matte' | 'silver' | 'gold' | 'copper' | 'holographic';

export type PaperColor =
  | 'white'
  | 'pristine-white'
  | 'bright-white'
  | 'natural'
  | 'smoke'
  | 'pale-grey'
  | 'cool-grey'
  | 'dark-grey'
  | 'ebony'
  | 'factory-yellow'
  | 'citrine'
  | 'mandarin'
  | 'rust'
  | 'vermilion'
  | 'scarlet'
  | 'candy-pink'
  | 'fuchsia-pink'
  | 'purple'
  | 'lavender'
  | 'azure-blue'
  | 'turquoise'
  | 'marrs-green'
  | 'racing-green'
  | 'forest'
  | 'mid-green'
  | 'sorbet-yellow'
  | 'tabriz-blue';

// GF Smith Colorplan hex values
export const COLORPLAN_COLORS: Record<PaperColor, string> = {
  'white': '#ffffff',
  'pristine-white': '#fafafa',
  'bright-white': '#f5f5f5',
  'natural': '#f5f1e6',
  'smoke': '#b5b5b5',
  'pale-grey': '#d9d9d9',
  'cool-grey': '#8c8c8c',
  'dark-grey': '#4a4a4a',
  'ebony': '#1a1a1a',
  'factory-yellow': '#f7d917',
  'citrine': '#e8b00f',
  'mandarin': '#f58220',
  'rust': '#c1440e',
  'vermilion': '#e34234',
  'scarlet': '#cf142b',
  'candy-pink': '#e75480',
  'fuchsia-pink': '#ff00ff',
  'purple': '#6b3fa0',
  'lavender': '#b57edc',
  'azure-blue': '#4a90d9',
  'turquoise': '#30d5c8',
  'marrs-green': '#009473',
  'racing-green': '#004225',
  'forest': '#228b22',
  'mid-green': '#4cbb17',
  'sorbet-yellow': '#fff44f',
  'tabriz-blue': '#1c3f6e',
};

export interface TypographySettings {
  text: string;
  fontFamily: string;
  fontSize: number;      // in mm
  letterSpacing: number; // in mm
  lineHeight: number;    // multiplier
  textCase: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  alignment: 'left' | 'center' | 'right';
}

export interface CoverSettings {
  viewMode: ViewMode;
  openAngle: number;     // 0-180 degrees for open mode

  // Paper
  paperColor: PaperColor;
  customPaperColor: string;
  useCustomColor: boolean;
  paperTexture: boolean;
  textureIntensity: number;

  // Foil
  foilType: FoilType;
  foilColor: string;

  // Deboss
  debossDepth: number;   // 0-1
  debossEnabled: boolean;

  // Typography - Front
  frontTypography: TypographySettings;

  // Typography - Back
  backTypography: TypographySettings;

  // Spine
  spineTypography: TypographySettings;

  // Animation
  animationSpeed: number;
}

export const DEFAULT_TYPOGRAPHY: TypographySettings = {
  text: 'SIT WITH THAT',
  fontFamily: 'Inter',
  fontSize: 12,
  letterSpacing: 0.5,
  lineHeight: 1.2,
  textCase: 'uppercase',
  alignment: 'center',
};

export const DEFAULT_SETTINGS: CoverSettings = {
  viewMode: 'closed',
  openAngle: 90,

  paperColor: 'ebony',
  customPaperColor: '#1a1a1a',
  useCustomColor: false,
  paperTexture: true,
  textureIntensity: 0.5,

  foilType: 'silver',
  foilColor: '#c0c0c0',

  debossDepth: 0.3,
  debossEnabled: true,

  frontTypography: { ...DEFAULT_TYPOGRAPHY },
  backTypography: {
    ...DEFAULT_TYPOGRAPHY,
    text: 'An exhibition about chairs\nand the people who sit in them',
    fontSize: 8,
  },
  spineTypography: {
    ...DEFAULT_TYPOGRAPHY,
    text: 'SIT WITH THAT',
    fontSize: 6,
  },

  animationSpeed: 1,
};

// Google Fonts options
export const FONT_OPTIONS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Montserrat',
  'Playfair Display',
  'Lora',
  'Source Serif Pro',
  'Oswald',
  'Raleway',
  'Merriweather',
  'PT Serif',
  'Noto Serif',
  'Libre Baskerville',
  'Crimson Text',
  'EB Garamond',
  'Cormorant Garamond',
  'Bitter',
  'Arvo',
  'Vollkorn',
  'Spectral',
];
