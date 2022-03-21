import { createStitches } from "@stitches/react";

const spacing = {
  px: "1px",
  0: "0px",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  20: "5rem",
  24: "6rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
};

export const theme = {
  colors: {},
  space: {
    ...spacing,
  },
  sizes: {
    ...spacing,
  },
  fonts: {
    sans: "Poppins, -apple-system, system-ui, sans-serif",
    mono: "IBM Plex Mono, menlo, monospace",
  },
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xxl: "1.5rem",
    xxxl: "2rem",
  },
  fontWeights: {
    lighest: 200,
    lighter: 300,
    light: 400,
    regular: 500,
    bold: 600,
    bolder: 700,
    boldest: 800,
  },
  borderWidths: {
    px: "1px",
  },
  radii: {
    1: "0.325rem",
    2: "1.5rem",
    3: "3rem",
    pill: "9999px",
  },
  zIndices: {
    1: "100",
    2: "200",
    3: "300",
    4: "400",
    max: "999",
  },
};

const utils = {
  pt: (valuemetadataHash) => ({
    paddingTop: value,
  }),
  pr: (value) => ({
    paddingRight: value,
  }),
  pb: (value) => ({
    paddingBottom: value,
  }),
  pl: (value) => ({
    paddingLeft: value,
  }),
  px: (value) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: (value) => ({
    paddingTop: value,
    paddingBottom: value,
  }),

  m: (value) => ({
    marginTop: value,
    marginBottom: value,
    marginLeft: value,
    marginRight: value,
  }),
  mt: (value) => ({
    marginTop: value,
  }),
  mr: (value) => ({
    marginRight: value,
  }),
  mb: (value) => ({
    marginBottom: value,
  }),
  ml: (value) => ({
    marginLeft: value,
  }),
  mx: (value) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value) => ({
    marginTop: value,
    marginBottom: value,
  }),

  ta: (value) => ({ textAlign: value }),

  fd: (value) => ({ flexDirection: value }),
  fw: (value) => ({ flexWrap: value }),

  ai: (value) => ({ alignItems: value }),
  ac: (value) => ({ alignContent: value }),
  jc: (value) => ({ justifyContent: value }),
  as: (value) => ({ alignSelf: value }),
  fg: (value) => ({ flexGrow: value }),
  fs: (value) => ({ flexShrink: value }),
  fb: (value) => ({ flexBasis: value }),

  bc: (value) => ({
    backgroundColor: value,
  }),

  br: (value) => ({
    borderRadius: value,
  }),
  btrr: (value) => ({
    borderTopRightRadius: value,
  }),
  bbrr: (value) => ({
    borderBottomRightRadius: value,
  }),
  bblr: (value) => ({
    borderBottomLeftRadius: value,
  }),
  btlr: (value) => ({
    borderTopLeftRadius: value,
  }),

  bs: (value) => ({ boxShadow: value }),

  lh: (value) => ({ lineHeight: value }),

  ox: (value) => ({ overflowX: value }),
  oy: (value) => ({ overflowY: value }),

  pe: (value) => ({ pointerEvents: value }),
  us: (value) => ({ userSelect: value }),

  linearGradient: () => ({
    backgroundImage: `linear-gradient({value})`,
  }),
};

const media = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  xxl: "(min-width: 1536px)",
};

export const { styled, css, getCssText, keyframes, globalCss } = createStitches(
  {
    theme,
    utils,
    media,
  }
);
