import { useReducer } from 'react';

const MAX_DIGITS = 10;

const initialState = {
  displayValue: '0',
  expressionStr: '',
  storedValue: null,
  pendingOp: null,
  repeatOp: null,
  repeatVal: null,
  clearOnInput: false,
  isError: false,
};

function applyOp(a, b, op) {
  const fa = parseFloat(a);
  const fb = parseFloat(b);
  switch (op) {
    case '+': return fa + fb;
    case '-': return fa - fb;
    case '×': return fa * fb;
    case '÷': return fb === 0 ? 'Error' : fa / fb;
    default: return fb;
  }
}

function formatResult(val) {
  if (!isFinite(val)) return 'Error';
  if (Math.abs(val) >= 1e10 || (val !== 0 && Math.abs(val) < 1e-7)) {
    return val.toExponential(4);
  }
  // Trim precision noise (e.g. 0.1 + 0.2 = 0.30000000000000004)
  const precise = parseFloat(val.toPrecision(10));
  return precise.toString();
}

function reducer(state, action) {
  const { displayValue, storedValue, pendingOp, clearOnInput, repeatOp, repeatVal, isError } = state;

  switch (action.type) {
    case 'DIGIT': {
      if (isError) return { ...initialState, displayValue: action.payload === '.' ? '0.' : action.payload };
      const d = action.payload;

      if (clearOnInput) {
        return { ...state, displayValue: d === '.' ? '0.' : d, clearOnInput: false };
      }
      if (d === '.' && displayValue.includes('.')) return state;
      if (displayValue.replace(/[^0-9]/g, '').length >= MAX_DIGITS && d !== '.') return state;

      const next = displayValue === '0' && d !== '.' ? d : displayValue + d;
      return { ...state, displayValue: next };
    }

    case 'OPERATOR': {
      if (isError) return initialState;
      const op = action.payload;
      let newStored = storedValue;
      let newDisplay = displayValue;

      if (pendingOp && !clearOnInput) {
        const result = applyOp(storedValue, displayValue, pendingOp);
        if (result === 'Error') return { ...initialState, displayValue: 'Error', expressionStr: 'Error', isError: true };
        newDisplay = formatResult(result);
        newStored = newDisplay;
      } else {
        newStored = displayValue;
      }

      return {
        ...state,
        displayValue: newDisplay,
        storedValue: newStored,
        pendingOp: op,
        clearOnInput: true,
        expressionStr: `${newStored} ${op}`,
        repeatOp: null,
        repeatVal: null,
        isError: false,
      };
    }

    case 'EQUALS': {
      if (isError) return initialState;

      // Repeated = — apply last operation again
      if (!pendingOp && repeatOp) {
        const result = applyOp(displayValue, repeatVal, repeatOp);
        if (result === 'Error') return { ...initialState, displayValue: 'Error', expressionStr: 'Error', isError: true };
        const resultStr = formatResult(result);
        return {
          ...state,
          displayValue: resultStr,
          expressionStr: `${displayValue} ${repeatOp} ${repeatVal} =`,
          storedValue: null,
          pendingOp: null,
          repeatOp,
          repeatVal,
          clearOnInput: true,
        };
      }

      if (!pendingOp) return { ...state, expressionStr: `${displayValue} =`, clearOnInput: true };

      const rightVal = clearOnInput ? storedValue : displayValue;
      const result = applyOp(storedValue, rightVal, pendingOp);
      if (result === 'Error') return { ...initialState, displayValue: 'Error', expressionStr: 'Error', isError: true };

      const resultStr = formatResult(result);
      return {
        displayValue: resultStr,
        expressionStr: `${storedValue} ${pendingOp} ${rightVal} =`,
        storedValue: null,
        pendingOp: null,
        repeatOp: pendingOp,
        repeatVal: rightVal,
        clearOnInput: true,
        isError: false,
      };
    }

    case 'CLEAR':
      return initialState;

    case 'BACKSPACE': {
      if (isError || clearOnInput) return { ...initialState };
      if (displayValue.length <= 1) return { ...state, displayValue: '0' };
      if (displayValue.length === 2 && displayValue.startsWith('-')) return { ...state, displayValue: '0' };
      return { ...state, displayValue: displayValue.slice(0, -1) };
    }

    case 'TOGGLE_SIGN': {
      if (isError || displayValue === '0') return state;
      const toggled = displayValue.startsWith('-') ? displayValue.slice(1) : '-' + displayValue;
      return { ...state, displayValue: toggled, clearOnInput: false };
    }

    case 'PERCENTAGE': {
      if (isError) return state;
      const n = parseFloat(displayValue);
      if (isNaN(n)) return state;
      return { ...state, displayValue: formatResult(n / 100), clearOnInput: false };
    }

    default:
      return state;
  }
}

export function useCalculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
}
