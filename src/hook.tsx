import { DataType } from "csstype";
import React from "react";

export type SizeFactor = number | string |
  'auto' |   /** animate to Factor=1 and change the length property to 'auto'. For example: width: 'auto' */
  undefined; /** animate to Factor=1 and remove the length property from inline style sheet. For example: width: undefined */

export type Factor = {
  size?: SizeFactor,              /* default: undefined */
  duration: number,               /* unit: ms, default: 350 */
  delay: number,                  /* unit: ms, default: 0 */
  curve: DataType.EasingFunction, /* default: ease */
}

type Style = {
  width?: number | string,
  height?: number | string,
  transition?: string,
};

export function useAnimatedSize<T extends HTMLElement>(
  element: T | null, target: React.RefObject<T>,
  widthFactor: Factor, heightFactor: Factor,
  outerStyle: Style) {
  const isWidthAuto = isFactorAuto(widthFactor.size);
  const isHeightAuto = isFactorAuto(heightFactor.size)
  const [, setTicker] = React.useState(false);
  const notifyUpdate = () => setTicker(value => !value);
  const state = React.useMemo(() => {
    return {
      widthAuto: isWidthAuto,
      heightAuto: isHeightAuto,
      outputStyle: {} as Style,
      outerStyle: undefined as unknown as Style,
      widthFactor: undefined as unknown as Factor,
      heightFactor: undefined as unknown as Factor,
      widthAnimation: undefined as unknown as ReturnType<typeof useAnimatingOnChange>,
      heightAnimation: undefined as unknown as ReturnType<typeof useAnimatingOnChange>,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  state.widthAnimation = useAnimatingOnChange(widthFactor, () => {
    if (isWidthAuto) state.widthAuto = true;
    notifyUpdate();
  });
  React.useEffect(() => {
    if (!isWidthAuto && state.widthAuto !== false) {
      state.widthAuto = false;
      notifyUpdate();
    }
  }, [isWidthAuto, state]);

  state.heightAnimation = useAnimatingOnChange(heightFactor, () => {
    if (isHeightAuto) state.heightAuto = true;
    notifyUpdate();
  });
  React.useEffect(() => {
    if (!isHeightAuto && state.heightAuto !== false) {
      state.heightAuto = false;
      notifyUpdate();
    }
  }, [isHeightAuto, state]);

  state.widthFactor = widthFactor;
  state.heightFactor = heightFactor;
  state.outerStyle = outerStyle;
  state.outputStyle.width = 'width' in outerStyle ? outerStyle.width
    : expectLength(widthFactor.size, element?.offsetWidth, state.widthAuto);
  state.outputStyle.height = 'height' in outerStyle ? outerStyle.height
    : expectLength(heightFactor.size, element?.offsetHeight, state.heightAuto);
  state.outputStyle.transition = 'transition' in outerStyle ? outerStyle.transition
    : toTransitionString(state.widthAnimation.transition, state.heightAnimation.transition);

  React.useEffect(() => {
    if (element) {
      const current = target.current!;
      const update = () => {
        const { outputStyle, outerStyle,
          widthFactor, heightFactor,
          widthAuto, heightAuto,
          widthAnimation, heightAnimation } = state;
        let requestUpdateTransition = false;

        const width = 'width' in outerStyle ? outerStyle.width
          : expectLength(widthFactor.size, element.offsetWidth, widthAuto);
        if (outputStyle.width !== width) {
          outputStyle.width = width;
          if (width !== undefined) current.style.width = toCssString(width);
          else current.style.removeProperty('width');
          if (updateAnimation(widthAnimation, widthFactor))
            requestUpdateTransition = true;
        }

        const height = 'height' in outerStyle ? outerStyle.height
          : expectLength(heightFactor.size, element.offsetHeight, heightAuto);
        if (outputStyle.height !== height) {
          outputStyle.height = height;
          if (height !== undefined) current.style.height = toCssString(height);
          else current.style.removeProperty('height');
          if (updateAnimation(heightAnimation, heightFactor))
            requestUpdateTransition = true;
        }

        if (!('transition' in outerStyle) && requestUpdateTransition) {
          current.style.transition = outputStyle.transition =
            toTransitionString(widthAnimation.transition, heightAnimation.transition);
        }
      };
      const observer = new ResizeObserver(update);
      observer.observe(element);
      update();
      return () => observer.disconnect();
    }
  }, [element, state, target]);

  return state.outputStyle;
}

function isFactorAuto(factor: SizeFactor) {
  return factor === 'auto' || factor === undefined;
}

function isFactorNotEqual(prev: Factor, current: Factor) {
  return prev.size !== current.size
    || prev.duration !== current.duration
    || prev.curve !== current.curve
    || prev.delay !== current.delay;
}

const { clearTimeout, setTimeout } = window;
function useAnimatingOnChange(current: Factor, onAnimationEnd: () => unknown) {
  const state = React.useMemo(() => {
    return { prev: current, animating: undefined as number | undefined, startTime: undefined as number | undefined, transition: undefined as string | undefined };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFactorNotEqual(state.prev, current)) {
    clearTimeout(state.animating);
    const duration = current.duration + current.delay;
    if (duration === 0) {
      state.startTime = undefined;
      state.transition = undefined;
      state.animating = undefined;
    } else {
      state.startTime = Date.now();
      state.transition = `${current.duration}ms ${current.curve} ${current.delay}ms`;
      state.animating = setTimeout(() => {
        state.startTime = undefined;
        state.transition = undefined;
        state.animating = undefined;
        onAnimationEnd();
      }, duration);
    }
    state.prev = current;
  }

  React.useEffect(() => {
    return () => clearTimeout(state.animating);
  }, [state]);

  return state;
}

function updateAnimation(animation: ReturnType<typeof useAnimatingOnChange>, current: Factor) {
  if (animation.startTime === undefined) return false;
  const pass = Date.now() - animation.startTime;
  const delay = Math.max(0, current.delay - pass);
  const duration = Math.min(current.duration, current.duration + current.delay - pass);
  animation.transition = `${duration}ms ${current.curve} ${delay}ms`;
  return true;
}

function expectLength(factor: SizeFactor, offsetLength: number | undefined, auto: boolean) {
  const toBeAuto = factor === 'auto' || factor === undefined;
  if (toBeAuto) {
    if (auto) return factor;
    else return offsetLength;
  }
  if (auto) return offsetLength;
  if (typeof factor === 'string') return factor;
  if (offsetLength !== undefined) return factor * offsetLength;
  if (factor === 0) return 0;
  // [[unlikely]]
  return undefined;
}

function toTransitionString(width?: string, height?: string) {
  if (width === undefined && height === undefined) {
    return '';
  } else if (width === undefined) {
    return `height ${height}`;
  } else if (height === undefined) {
    return `width ${width}`
  } else {
    return `width ${width}, height ${height}`;
  }
}

function toCssString(value: number | string) {
  if (typeof value === 'string') return value;
  else return `${value}px`;
}
