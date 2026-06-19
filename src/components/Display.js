import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function Display({ displayValue, expressionStr, onBackspace }) {
  const { theme } = useTheme();

  // Slide-up fade animation when result changes
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevValue = useRef(displayValue);

  useEffect(() => {
    if (displayValue !== prevValue.current) {
      prevValue.current = displayValue;
      slideAnim.setValue(14);
      fadeAnim.setValue(0);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 30, bounciness: 4 }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [displayValue]);

  // Dynamic font size based on character count
  const baseFontSize = displayValue.length > 11 ? 46 : displayValue.length > 8 ? 60 : displayValue.length > 6 ? 70 : 82;

  return (
    <View style={styles.container}>
      {/* Secondary expression row with backspace */}
      <View style={styles.expressionRow}>
        <Text
          style={[styles.expression, { color: theme.secondaryText }]}
          numberOfLines={1}
          ellipsizeMode="head"
        >
          {expressionStr}
        </Text>
        <Pressable onPress={onBackspace} hitSlop={16} style={styles.backspaceBtn}>
          <Text style={[styles.backspace, { color: theme.secondaryText }]}>⌫</Text>
        </Pressable>
      </View>

      {/* Primary value */}
      <Animated.Text
        style={[
          styles.primary,
          {
            color: theme.primaryText,
            fontSize: baseFontSize,
            transform: [{ translateY: slideAnim }],
            opacity: fadeAnim,
          },
        ]}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
      >
        {displayValue}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  expressionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 2,
    minHeight: 32,
  },
  expression: {
    flex: 1,
    fontFamily: 'Inter_300Light',
    fontSize: 20,
    textAlign: 'right',
    letterSpacing: 0.4,
  },
  backspaceBtn: {
    marginLeft: 12,
  },
  backspace: {
    fontFamily: 'Inter_300Light',
    fontSize: 20,
  },
  primary: {
    fontFamily: 'Inter_300Light',
    textAlign: 'right',
    letterSpacing: -1.5,
    lineHeight: undefined,
  },
});
