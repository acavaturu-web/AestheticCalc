import React, { createContext, useContext, useState } from 'react';

export const themes = {
  dark: {
    gradientColors: ['#0B0B1A', '#1A1033'],
    primaryText: '#FFFFFF',
    secondaryText: 'rgba(255,255,255,0.45)',
    numberBtnBg: 'rgba(255,255,255,0.08)',
    numberBtnBorder: 'rgba(255,255,255,0.12)',
    numberBtnText: '#FFFFFF',
    operatorBtnBg: 'rgba(236,72,153,0.88)',
    operatorBtnBorder: 'rgba(244,114,182,0.4)',
    operatorBtnText: '#FFFFFF',
    operatorActiveBg: '#FFFFFF',
    operatorActiveText: '#EC4899',
    accentBtnBg: 'rgba(255,255,255,0.14)',
    accentBtnBorder: 'rgba(255,255,255,0.18)',
    accentBtnText: '#FFFFFF',
    equalsBtnBg: '#EC4899',
    equalsBtnText: '#FFFFFF',
    buttonShadowColor: '#000000',
    buttonShadowOpacity: 0.35,
    statusBar: 'light',
  },
  light: {
    gradientColors: ['#F0F0F8', '#E8E8F5'],
    primaryText: '#1A1033',
    secondaryText: 'rgba(0,0,0,0.38)',
    numberBtnBg: 'rgba(255,255,255,0.92)',
    numberBtnBorder: 'rgba(0,0,0,0.06)',
    numberBtnText: '#1A1033',
    operatorBtnBg: 'rgba(236,72,153,0.12)',
    operatorBtnBorder: 'rgba(236,72,153,0.25)',
    operatorBtnText: '#DB2777',
    operatorActiveBg: '#DB2777',
    operatorActiveText: '#FFFFFF',
    accentBtnBg: 'rgba(0,0,0,0.07)',
    accentBtnBorder: 'rgba(0,0,0,0.08)',
    accentBtnText: '#1A1033',
    equalsBtnBg: '#DB2777',
    equalsBtnText: '#FFFFFF',
    buttonShadowColor: 'rgba(236,72,153,0.15)',
    buttonShadowOpacity: 1,
    statusBar: 'dark',
  },
};

const ThemeContext = createContext({
  theme: themes.dark,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <ThemeContext.Provider
      value={{ theme: isDark ? themes.dark : themes.light, isDark, toggleTheme: () => setIsDark(p => !p) }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
