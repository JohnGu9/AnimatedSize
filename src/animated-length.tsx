import React from "react";

export type Factor = number | string |
  'auto' | /** animate to Factor=1 and change the length property to 'auto'. For example: width: 'auto' */
  null;    /** animate to Factor=1 and remove the length property from inline style sheet. For example: width: undefined */

export function useAnimatedLength(factor: Factor, offsetLength: number | undefined, duration: number, notifyUpdate: () => unknown) {
  const isAuto = factor === 'auto' || factor === null;
  const [auto, setAuto] = React.useState(isAuto);
  const length = (() => {
    if (isAuto) {
      if (auto) return factor === null ? undefined : 'auto';
      else return offsetLength;
    }
    if (auto) return offsetLength;
    if (typeof factor === 'string') return factor;
    if (offsetLength !== undefined) return factor * offsetLength;
    if (factor === 0) return 0;
    // [[unlikely]]
    return undefined;
  })();

  const animating = useAnimatingOnChange(length, auto ? 0 : duration, notifyUpdate);
  React.useEffect(() => {
    if (isAuto) {
      if (!animating) {
        setAuto(true);
      }
    } else {
      setAuto(false);
    }
  }, [animating, isAuto]);

  return length;
}

const { clearTimeout, setTimeout } = window;

function useAnimatingOnChange(current: unknown, duration: number, notifyUpdate: () => unknown) {
  const state = React.useMemo(() => {
    return { current, duration, animating: undefined as number | undefined };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.current !== current || state.duration !== duration) {
    clearTimeout(state.animating);

    state.current = current;
    state.duration = duration;
    state.animating = duration === 0
      ? undefined
      : setTimeout(() => {
        state.animating = undefined;
        notifyUpdate();
      }, duration);
  }

  return state.animating !== undefined;
}
