import React from "react";

export type Factor = number |
  'auto' | /** animate to Factor=1 and change the length property to 'auto'. For example: width: 'auto' */
  null;    /** animate to Factor=1 and remove the length property from inline style sheet. For example: width: undefined */


export function useAnimatedLength(factor: Factor, offsetLength: number | undefined, duration: number) {
  const [auto, setAuto] = React.useState(factor === 'auto');
  const expectLength =
    (factor === 'auto' || factor === null || offsetLength === undefined)
      ? offsetLength
      : factor * offsetLength;
  const animating = useAnimatingOnChange(expectLength, duration);

  const length = (() => {
    if (factor !== 'auto' && factor !== null) {
      if (auto) return offsetLength; // from 'auto' | null to number
      return factor === 0 ? 0 :
        (offsetLength !== undefined
          ? offsetLength * factor
          : undefined /* this situation unlikely happen */);
    } else {
      /* factor === 'auto' | factor === null */
      if (auto) {
        return factor === null ? undefined : 'auto';
      } else {
        return offsetLength;
      }
    }
  })();

  React.useEffect(() => {
    if (factor === 'auto' || factor === null) {
      if (!animating) {
        setAuto(true);
      }
    } else {
      setAuto(false);
    }
  }, [animating, factor]);

  return length;
}

function useAnimatingOnChange(current: unknown, duration: number) {
  const [ticker, setTicker] = React.useState(false);
  const state = React.useMemo(() => {
    return { current, animating: undefined as number | undefined, duration };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.current !== current || state.duration !== duration) {
    state.current = current;
    state.duration = duration;

    window.clearTimeout(state.animating);

    if (duration === 0) {
      state.animating = undefined;
    } else {
      state.animating = window.setTimeout(() => {
        state.animating = undefined;
        setTicker(!ticker);
      }, duration);
    }
  }

  return state.animating !== undefined;
}
