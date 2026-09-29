import { createTheme, responsiveFontSizes, ThemeOptions } from '@mui/material/styles';

const getDesignTokens = (mode: 'dark' | 'light'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'dark'
      ? {
          background: {
            default: '#07090e',
            paper: '#0e131f',
          },
          primary: {
            main: '#10b981', // Emerald
            light: '#34d399',
            dark: '#059669',
            contrastText: '#000000',
          },
          secondary: {
            main: '#06b6d4', // Cyan
            light: '#22d3ee',
            dark: '#0891b2',
            contrastText: '#ffffff',
          },
          text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
            disabled: '#475569',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
          action: {
            hover: 'rgba(255, 255, 255, 0.04)',
            selected: 'rgba(16, 185, 129, 0.12)',
          },
        }
      : {
          background: {
            default: '#f8fafc',
            paper: '#ffffff',
          },
          primary: {
            main: '#059669',
            light: '#10b981',
            dark: '#047857',
            contrastText: '#ffffff',
          },
          secondary: {
            main: '#0891b2',
            light: '#06b6d4',
            dark: '#0e7490',
            contrastText: '#ffffff',
          },
          text: {
            primary: '#0f172a',
            secondary: '#475569',
            disabled: '#94a3b8',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
          action: {
            hover: 'rgba(0, 0, 0, 0.04)',
            selected: 'rgba(5, 153, 105, 0.08)',
          },
        }),
  },
  typography: {
    fontFamily: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h5: {
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.005em',
    },
    subtitle1: {
      letterSpacing: '-0.005em',
    },
    body1: {
      letterSpacing: '-0.003em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: mode === 'dark' ? '#1e293b' : '#cbd5e1',
            borderRadius: '3px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: mode === 'dark' ? '#0e131f' : '#ffffff',
          borderRadius: 16,
          border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: mode === 'dark'
            ? '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.02) inset'
            : '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 18px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
          color: '#07090e',
          '&:hover': {
            background: 'linear-gradient(135deg, #34d399 0%, #22d3ee 100%)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: mode === 'dark' ? '#1e293b' : '#0f172a',
          color: '#f8fafc',
          borderRadius: 8,
          fontSize: '0.75rem',
          padding: '6px 12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

export const createAppTheme = (mode: 'dark' | 'light') => {
  let theme = createTheme(getDesignTokens(mode));
  theme = responsiveFontSizes(theme);
  return theme;
};
