import { useFonts, Inter_300Light, Inter_400Regular } from '@expo-google-fonts/inter';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import ButtonGrid from './src/components/ButtonGrid';
import Display from './src/components/Display';
import { useCalculator } from './src/hooks/useCalculator';

function Calculator() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { state, dispatch } = useCalculator();

  // Show active operator highlight only while waiting for next operand
  const activeOp = state.clearOnInput ? state.pendingOp : null;

  return (
    <LinearGradient colors={theme.gradientColors} style={styles.gradient}>
      <StatusBar style={theme.statusBar} />
      <SafeAreaView style={styles.safe}>
        <View style={styles.center}>
          <View style={styles.screen}>
          <Display
            displayValue={state.displayValue}
            expressionStr={state.expressionStr}
            onBackspace={() => dispatch({ type: 'BACKSPACE' })}
            onToggleTheme={toggleTheme}
          />
          <ButtonGrid onAction={dispatch} pendingOp={activeOp} />
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ Inter_300Light, Inter_400Regular });
  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <Calculator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
  },
});
