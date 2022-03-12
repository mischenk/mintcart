import { globalCss } from "@stitches/react";

const globalStyles = globalCss({
  "html, body": {
    padding: 0,
    margin: 0,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,   Helvetica Neue, sans-serif",
  },
  a: {
    color: "inherit",
    textDecoration: "none",
  },
  "*": {
    boxSizing: "border-box",
  },
});

function MyApp({ Component, pageProps }) {
  globalStyles();
  return <Component {...pageProps} />;
}

export default MyApp;
