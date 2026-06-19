import React, { useRef } from 'react';
import { Animated, Pressable, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

export default function CalcButton({ label, onPress, type = 'number', wide = false, size, wideSize, active = false }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.91, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
    Animated.timing(opacity, { toValue: 0.75, useNativeDriver: true, duration: 60 }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 8 }).start();
    Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 120 }).start();
  };

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  const isOperator = type === 'operator';
  const isEquals = type === 'equals';
  const isAccent = type === 'accent';

  const bgColor = active && isOperator
    ? theme.operatorActiveBg
    : isOperator ? theme.operatorBtnBg
    : isEquals ? theme.equalsBtnBg
    : isAccent ? theme.accentBtnBg
    : theme.numberBtnBg;

  const borderColor = isOperator
    ? theme.operatorBtnBorder
    : isAccent ? theme.accentBtnBorder
    : theme.numberBtnBorder;

  const textColor = active && isOperator
    ? theme.operatorActiveText
    : isOperator ? theme.operatorBtnText
    : isEquals ? theme.equalsBtnText
    : isAccent ? theme.accentBtnText
    : theme.numberBtnText;

  const btnWidth = wide ? wideSize : size;
  const borderRadius = size * 0.36;
  const fontSize = label.length <= 1 ? size * 0.38 : label.length <= 2 ? size * 0.31 : size * 0.26;

  return (
    <Animated.View style={{ transform: [{ scale }], opacity }}>
      <Pressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handlePress}
        style={[
          styles.button,
          {
            width: btnWidth,
            height: size,
            borderRadius,
            backgroundColor: bgColor,
            borderColor,
            shadowColor: theme.buttonShadowColor,
            shadowOpacity: theme.buttonShadowOpacity,
          },
          wide && styles.wideLabel,
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: textColor, fontSize },
            wide && { marginLeft: size * 0.36 },
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  wideLabel: {
    alignItems: 'flex-start',
  },
  label: {
    fontFamily: 'Inter_400Regular',
    letterSpacing: 0.3,
  },
});
