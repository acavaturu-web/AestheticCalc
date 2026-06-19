import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import CalcButton from './CalcButton';

const PADDING = 16;
const GAP = 10;
const MAX_WIDTH = 430;

const ROWS = [
  [
    { label: 'AC',  type: 'accent',    action: { type: 'CLEAR' } },
    { label: '+/-', type: 'accent',    action: { type: 'TOGGLE_SIGN' } },
    { label: '%',   type: 'accent',    action: { type: 'PERCENTAGE' } },
    { label: '÷',   type: 'operator',  action: { type: 'OPERATOR', payload: '÷' } },
  ],
  [
    { label: '7', type: 'number', action: { type: 'DIGIT', payload: '7' } },
    { label: '8', type: 'number', action: { type: 'DIGIT', payload: '8' } },
    { label: '9', type: 'number', action: { type: 'DIGIT', payload: '9' } },
    { label: '×', type: 'operator', action: { type: 'OPERATOR', payload: '×' } },
  ],
  [
    { label: '4', type: 'number', action: { type: 'DIGIT', payload: '4' } },
    { label: '5', type: 'number', action: { type: 'DIGIT', payload: '5' } },
    { label: '6', type: 'number', action: { type: 'DIGIT', payload: '6' } },
    { label: '-', type: 'operator', action: { type: 'OPERATOR', payload: '-' } },
  ],
  [
    { label: '1', type: 'number', action: { type: 'DIGIT', payload: '1' } },
    { label: '2', type: 'number', action: { type: 'DIGIT', payload: '2' } },
    { label: '3', type: 'number', action: { type: 'DIGIT', payload: '3' } },
    { label: '+', type: 'operator', action: { type: 'OPERATOR', payload: '+' } },
  ],
  [
    { label: '0', type: 'number', action: { type: 'DIGIT', payload: '0' }, wide: true },
    { label: '.', type: 'number', action: { type: 'DIGIT', payload: '.' } },
    { label: '=', type: 'equals', action: { type: 'EQUALS' } },
  ],
];

export default function ButtonGrid({ onAction, pendingOp }) {
  const { width: screenWidth } = useWindowDimensions();
  const containerWidth = Math.min(screenWidth, MAX_WIDTH);
  const size = (containerWidth - PADDING * 2 - GAP * 3) / 4;
  const wideSize = size * 2 + GAP;

  return (
    <View style={[styles.grid, { paddingHorizontal: PADDING, paddingBottom: PADDING + 4 }]}>
      {ROWS.map((row, ri) => (
        <View key={ri} style={[styles.row, ri < ROWS.length - 1 && { marginBottom: GAP }]}>
          {row.map((btn) => (
            <CalcButton
              key={btn.label}
              label={btn.label}
              type={btn.type}
              wide={btn.wide}
              size={size}
              wideSize={wideSize}
              active={btn.type === 'operator' && btn.action.payload === pendingOp}
              onPress={() => onAction(btn.action)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
