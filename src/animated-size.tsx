import { DataType, Property } from "csstype";
import React, { createElement, useRef, useState } from "react";
import { useRefComposer } from "react-ref-composer";
import { createComponent, TagToElementType } from "./create-component";
import { Factor, SizeFactor, useAnimatedSize } from "./hook";

export { type Factor, type SizeFactor };

export type AnimatedSizeProps = {
  widthFactor?: Partial<Factor>,
  heightFactor?: Partial<Factor>,
  duration?: number,               /* unit: ms, default: 350 */
  delay?: number,                  /* unit: ms, default: 0 */
  curve?: DataType.EasingFunction, /* default: ease */
  axisDirection?: Property.FlexDirection,     /* only work in flex */
  mainAxisPosition?: Property.JustifyContent, /* only work in flex */
  crossAxisPosition?: Property.AlignItems,    /* only work in flex */
};

export const AnimatedSize = buildAnimatedSize('span');

export function buildAnimatedSize<T extends keyof JSX.IntrinsicElements, Element = TagToElementType<T>>(tag: T) {
  const AnimatedSizeBuilder = buildAnimatedSizeBuilder<T, Element>(tag);
  return createComponent<Element, AnimatedSizeProps>(
    function AnimatedSize({ children, ...props }, ref) {
      return (<AnimatedSizeBuilder {...props} ref={ref}
        builder={ref =>
          createElement(
            tag,
            { ref, style: { display: "inline-block" } },
            children)} />);
    });
}

export type AnimatedSizeBuilderProps = AnimatedSizeProps & {
  builder: (ref: React.LegacyRef<HTMLElement>) => React.ReactNode,
};

export const AnimatedSizeBuilder = buildAnimatedSizeBuilder('span');

export function buildAnimatedSizeBuilder<T extends keyof JSX.IntrinsicElements, Element = TagToElementType<T>>(tag: T) {
  return createComponent<Element, AnimatedSizeBuilderProps>(
    function AnimatedSizeBuilder({
      widthFactor = {},
      heightFactor = {},
      duration = 350,
      delay = 0,
      curve = 'ease',
      axisDirection,
      mainAxisPosition = 'center',
      crossAxisPosition = 'center',
      builder,
      style,
      ...props
    }, ref) {
      const composeRefs = useRefComposer();
      const innerRef = useRef<HTMLElement>(null);
      const [element, setElement] = useState<HTMLSpanElement | null>(null);
      const { width, height, transition, willChange } = useAnimatedSize(
        element, innerRef,
        mergeFactor(widthFactor, duration, delay, curve),
        mergeFactor(heightFactor, duration, delay, curve),
        style ?? {});
      return createElement(tag, {
        ref: composeRefs(innerRef, ref),
        style: {
          overflow: 'hidden',
          display: 'flex',
          flexDirection: axisDirection,
          justifyContent: mainAxisPosition,
          alignItems: crossAxisPosition,
          width, height, transition, willChange,
          ...style,
        },
        ...props,
      }, builder(setElement));
    }
  );
}

function mergeFactor(factor: Partial<Factor>, duration: number, delay: number, curve: DataType.EasingFunction): Factor {
  return {
    size: factor.size,
    duration: factor.duration ?? duration,
    delay: factor.delay ?? delay,
    curve: factor.curve ?? curve,
  };
}
