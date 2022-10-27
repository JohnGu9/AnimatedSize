import { DataType } from "csstype";
import { RefObject, useEffect, useMemo, useState } from "react";

const { now } = Date;
const { max, min } = Math;

export type SizeFactor = number | string | "auto" | undefined;

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
  willChange?: string,
};

export function useAnimatedSize<T extends HTMLElement>(
  element: T | null, target: RefObject<T>,
  widthFactor: Factor, heightFactor: Factor,
  outerStyle: Style) {
  const isWidthAuto = isFactorAuto(widthFactor.size);
  const isHeightAuto = isFactorAuto(heightFactor.size);
  const [, setTicker] = useState(false);
  const notifyUpdate = () => setTicker(value => !value);
  const state = useMemo(() => {
    return {
      isWidthAuto,
      isHeightAuto,
      widthAuto: isWidthAuto,
      heightAuto: isHeightAuto,
      outputStyle: {} as Style,
      outerStyle: undefined as unknown as Style,
      widthFactor: undefined as unknown as Factor,
      heightFactor: undefined as unknown as Factor,
      widthAnimation: undefined as unknown as ReturnType<typeof useAnimatingOnChange>,
      heightAnimation: undefined as unknown as ReturnType<typeof useAnimatingOnChange>,
      element: undefined as unknown as T | null,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  state.element = element;
  state.isWidthAuto = isWidthAuto;
  state.isHeightAuto = isHeightAuto;
  state.widthFactor = widthFactor;
  state.heightFactor = heightFactor;
  state.outerStyle = outerStyle;

  state.widthAnimation = useAnimatingOnChange(widthFactor);
  state.heightAnimation = useAnimatingOnChange(heightFactor);

  useEffect(() => {
    if (!isWidthAuto && state.widthAuto !== false) {
      // 'auto' -> offsetWidth -> width
      state.widthAuto = false;
      notifyUpdate();
    }
  }, [isWidthAuto, state]);

  useEffect(() => {
    if (!isHeightAuto && state.heightAuto !== false) {
      // 'auto' -> offsetHeight -> height
      state.heightAuto = false;
      notifyUpdate();
    }
  }, [isHeightAuto, state]);

  useEffect(() => {
    const current = target.current!;
    const listener = (event: TransitionEvent) => {
      const { propertyName, target: src } = event;
      if (src === current)
        switch (propertyName) {
          case 'height': {
            const { isHeightAuto, heightAnimation } = state;
            if (isHeightAuto) state.heightAuto = true;
            heightAnimation.startTime = undefined;
            heightAnimation.transition = undefined;
            notifyUpdate();
            break;
          } case 'width': {
            const { isWidthAuto, widthAnimation } = state;
            if (isWidthAuto) state.widthAuto = true;
            widthAnimation.startTime = undefined;
            widthAnimation.transition = undefined;
            notifyUpdate();
            break;
          }
        }
    };
    current.addEventListener('transitionend', listener);
    return () => current.removeEventListener('transitionend', listener);
  }, [target, state]);

  const { outputStyle,
    widthAnimation: { transition: widthTransition },
    heightAnimation: { transition: heightTransition } } = state;
  outputStyle.width = 'width' in outerStyle ? outerStyle.width
    : expectLength(widthFactor.size, element?.offsetWidth, state.widthAuto);
  outputStyle.height = 'height' in outerStyle ? outerStyle.height
    : expectLength(heightFactor.size, element?.offsetHeight, state.heightAuto);
  outputStyle.transition = 'transition' in outerStyle ? outerStyle.transition
    : toTransitionString(widthTransition, heightTransition);
  outputStyle.willChange = 'willChange' in outerStyle ? outerStyle.willChange
    : toWillChange(element, widthTransition !== undefined, heightTransition !== undefined);

  useEffect(() => {
    if (element) {
      const current = target.current!;
      const update = () => {
        const { style } = current;
        const { outputStyle, outerStyle,
          widthFactor, heightFactor,
          widthAuto, heightAuto,
          widthAnimation, heightAnimation } = state;
        let requestUpdateTransition = false;

        const width = 'width' in outerStyle ? outerStyle.width
          : expectLength(widthFactor.size, element.offsetWidth, widthAuto);
        if (outputStyle.width !== width) {
          outputStyle.width = width;
          if (width !== undefined) { style.width = toCssString(width); }
          else { style.removeProperty('width'); }
          if (updateAnimation(widthAnimation, widthFactor)) {
            requestUpdateTransition = true;
          }
        }

        const height = 'height' in outerStyle ? outerStyle.height
          : expectLength(heightFactor.size, element.offsetHeight, heightAuto);
        if (outputStyle.height !== height) {
          outputStyle.height = height;
          if (height !== undefined) { style.height = toCssString(height); }
          else { style.removeProperty('height'); }
          if (updateAnimation(heightAnimation, heightFactor)) {
            requestUpdateTransition = true;
          }
        }

        if (!('transition' in outerStyle) && requestUpdateTransition) {
          const transition = outputStyle.transition =
            toTransitionString(widthAnimation.transition, heightAnimation.transition);
          if (transition !== undefined) { style.transition = transition; }
          else { style.removeProperty('transition'); }
        }
      };
      const observer = new ResizeObserver(update);
      observer.observe(element);
      update(); // not sure whether this line is necessary or not
      return () => observer.disconnect();
    }
  }, [element, target, state]);

  return outputStyle;
}

function isFactorAuto(factor: SizeFactor): factor is ("auto" | undefined) {
  return factor === 'auto' || factor === undefined;
}

function isFactorNotEqual(prev: Factor, current: Factor, isAnimating: boolean) {
  if (isAnimating)
    return prev.size !== current.size
      || prev.duration !== current.duration
      || prev.curve !== current.curve
      || prev.delay !== current.delay;
  return prev.size !== current.size;
}

function useAnimatingOnChange(current: Factor) {
  const state = useMemo(() => {
    return { prev: current, startTime: undefined as number | undefined, transition: undefined as string | undefined };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isFactorNotEqual(state.prev, current, state.startTime !== undefined)) {
    const duration = current.duration + current.delay;
    if (duration === 0) {
      state.startTime = undefined;
      state.transition = undefined;
    } else {
      state.startTime = now();
      state.transition = `${current.duration}ms ${current.curve} ${current.delay}ms`;
    }
    state.prev = current;
  }

  return state;
}

function updateAnimation(animation: ReturnType<typeof useAnimatingOnChange>, current: Factor) {
  if (animation.startTime === undefined) return false;
  const pass = now() - animation.startTime;
  const delay = max(0, current.delay - pass);
  const duration = min(current.duration, current.duration + current.delay - pass);
  animation.transition = `${duration}ms ${current.curve} ${delay}ms`;
  return true;
}

function expectLength(factor: SizeFactor, offsetLength: number | undefined, auto: boolean) {
  const toBeAuto = isFactorAuto(factor);
  if (toBeAuto) {
    if (auto) {
      return factor;
    } else {
      return offsetLength;
    }
  }
  if (auto) { return offsetLength; }
  if (typeof factor === "string") { return factor; }
  if (offsetLength !== undefined) { return factor * offsetLength; }
  if (factor === 0) { return 0; }
  // [[unlikely]]
  return undefined;
}

function toTransitionString(width?: string, height?: string) {
  if (width === undefined && height === undefined) {
    return undefined;
  } else if (width === undefined) {
    return `height ${height}`;
  } else if (height === undefined) {
    return `width ${width}`
  } else {
    return `width ${width}, height ${height}`;
  }
}

function toWillChange(element: HTMLElement | null, width?: boolean, height?: boolean) {
  if (element === null) {
    return "width, height";
  } else if (width && height) {
    return "width, height, transition";
  } else if (width) {
    return "width, transition";
  } else if (height) {
    return "height, transition";
  } else {
    return undefined;
  }
}

function toCssString(value: number | string) {
  if (typeof value === "number") {
    return `${value}px`;
  } else {
    return value;
  }
}
