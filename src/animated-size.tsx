import { DataType, Property } from "csstype";
import React from "react";
import { useRefComposer } from "react-ref-composer";
import { createComponent } from "./create-component";
import { Factor, useAnimatedSize } from "./hook";

export type PartialFactor = Partial<Factor>;
export type AnimatedSizeProps = {
  widthFactor?: PartialFactor,
  heightFactor?: PartialFactor,
  duration?: number,               /* unit: ms, default: 350 */
  delay?: number,                  /* unit: ms, default: 0 */
  curve?: DataType.EasingFunction, /* default: ease */
  axisDirection?: Property.FlexDirection,
  mainAxisPosition?: Property.JustifyContent,
  crossAxisPosition?: Property.AlignItems,
};

export const AnimatedSize = createComponent<HTMLSpanElement, AnimatedSizeProps>(
  function AnimatedSize({ children, ...props }, ref) {
    return (
      <AnimatedSizeBuilder {...props} ref={ref}
        builder={ref => <span ref={ref}>{children}</span>} />);
  });

export type AnimatedSizeBuilderProps = AnimatedSizeProps & {
  builder: (ref: React.LegacyRef<HTMLElement>) => React.ReactNode,
};

export const AnimatedSizeBuilder = createComponent<HTMLSpanElement, AnimatedSizeBuilderProps>(
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
    const innerRef = React.useRef<HTMLElement>(null);
    const [element, setElement] = React.useState<HTMLSpanElement | null>(null);
    const { width, height, transition } = useAnimatedSize(element, innerRef,
      mergeFactor(widthFactor, duration, delay, curve),
      mergeFactor(heightFactor, duration, delay, curve), style ?? {});
    return (
      <span ref={composeRefs(innerRef, ref)}
        style={{
          overflow: 'hidden',
          display: 'inline-flex',
          flexDirection: axisDirection,
          justifyContent: mainAxisPosition,
          alignItems: crossAxisPosition,
          width,
          height,
          transition,
          ...style,
        }}
        {...props}>
        {builder(setElement)}
      </span>
    );
  }
);

function mergeFactor(factor: PartialFactor, duration: number, delay: number, curve: DataType.EasingFunction): Factor {
  return {
    size: factor.size,
    duration: factor.duration ?? duration,
    delay: factor.delay ?? delay,
    curve: factor.curve ?? curve,
  };
}
