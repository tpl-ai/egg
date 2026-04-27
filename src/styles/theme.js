export const theme = {
  colors: {
    bg: '#FAF3E0',
    panel: '#F0E8D0',
    panelLight: '#FFFDF5',
    yellow: '#F5C518',
    yellowLight: '#FDF3C0',
    charcoal: '#2C2416',
    grey: '#8A8078',
    greyLight: '#C8BFB4',
    coral: '#E8856A',
    white: '#FFFDF5',
    border: '#E0D8C8',
  },
  fonts: {
    bold: '700',
    medium: '500',
    regular: '400',
  },
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '999px',
  },
  shadow: {
    sm: '0 2px 8px rgba(44,36,22,0.08)',
    md: '0 4px 16px rgba(44,36,22,0.10)',
    lg: '0 8px 32px rgba(44,36,22,0.12)',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

export const globalStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-tap-highlight-color: transparent;
  }

  body {
    background: ${theme.colors.bg};
    color: ${theme.colors.charcoal};
    font-family: -apple-system, 'SF Pro Rounded', 'SF Pro Text', 
                 system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    max-width: 430px;
    margin: 0 auto;
    min-height: 100vh;
    overflow-x: hidden;
  }

  input, button, select, textarea {
    font-family: inherit;
    font-size: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }
`;
