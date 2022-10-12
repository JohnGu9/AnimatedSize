import React from "react";

export type Factor = number | string |
  'auto' | /** animate to Factor=1 and change the length property to 'auto'. For example: width: 'auto' */
  null;    /** animate to Factor=1 and remove the length property from inline style sheet. For example: width: undefined */

export function useAnimatedLength(factor: Factor, offsetLength: number | undefined, duration: number, notifyUpdate: () => unknown) {
  const [auto, setAuto] = React.useState(factor === 'auto' || factor === null);

  const expectLength = (() => {
    if (factor === 'auto' || factor === null) {
      if (auto) return factor === null ? undefined : 'auto';
      else return offsetLength;
    }
    if (typeof factor === 'string') return factor;
    if (offsetLength !== undefined) return factor * offsetLength;
    if (factor === 0) return 0;
    // [[unlikely]]
    return undefined;
  })();

  const length = (factor !== 'auto' && factor !== null && auto)
    ? offsetLength
    : expectLength;

  const animating = useAnimatingOnChange(expectLength, duration, notifyUpdate);

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

function useAnimatingOnChange(current: unknown, duration: number, notifyUpdate: () => unknown) {
  const state = React.useMemo(() => {
    return { current, duration, animating: undefined as number | undefined };
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
        notifyUpdate();
      }, duration);
    }
  }

  return state.animating !== undefined;
}
