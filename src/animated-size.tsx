import { DataType, Property } from "csstype";
import { createElement, CSSProperties, ReactNode, useRef, useState } from "react";
import { useRefComposer } from "react-ref-composer";
import { createComponent, TagToElementType } from "./create-component";
import { AnimationProps, Factor, SizeFactor, useAnimatedSize } from "./hook";

export { type Factor, type SizeFactor };

export type AnimatedSizeProps = {
  widthFactor?: Partial<Factor>,
  heightFactor?: Partial<Factor>,
  axisDirection?: Property.FlexDirection,     /* only work in flex */
  mainAxisPosition?: Property.JustifyContent, /* only work in flex */
  crossAxisPosition?: Property.AlignItems,    /* only work in flex */
} & AnimationProps;

export const AnimatedSize = buildAnimatedSize('div');

export function buildAnimatedSize<T extends keyof JSX.IntrinsicElements, Element = TagToElementType<T>>(tag: T) {
  const AnimatedSizeBuilder = buildAnimatedSizeBuilder<T, Element>(tag);
  return createComponent<Element, AnimatedSizeProps & { internalStyle: CSSProperties; }>(
    function AnimatedSize({ children, internalStyle, ...props }, ref) {
      return (<AnimatedSizeBuilder {...props} ref={ref}
        builder={ref =>
          createElement(
            tag,
            { ref, style: internalStyle },
            children)} />);
    });
}

export type AnimatedSizeBuilderProps = AnimatedSizeProps & {
  builder: (ref: (element: HTMLElement) => unknown) => ReactNode,
};

export const AnimatedSizeBuilder = buildAnimatedSizeBuilder('div');

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
          display: 'flex',
          overflow: 'hidden',
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
