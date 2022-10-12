import { DataType, Property } from "csstype";
import React from "react";
import { Factor, useAnimatedLength } from "./animated-length";
import { createComponent } from "./create-component";
import { useSizeObserver } from "./size-observer";

export type AnimatedSizeProps = {
  widthFactor?: Factor,
  heightFactor?: Factor,
  duration?: number, /* ms */
  delay?: number, /* ms */
  curve?: DataType.EasingFunction,
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
    widthFactor = null,
    heightFactor = null,
    duration = 350,
    delay = 0,
    curve = 'ease',
    axisDirection = 'row',
    mainAxisPosition = 'center',
    crossAxisPosition = 'center',
    builder,
    style,
    ...props
  }, ref) {
    const [element, setElement] = React.useState<HTMLSpanElement | null>(null);
    const { width: w, height: h } = useSizeObserver(element);

    const width = useAnimatedLength(widthFactor, w, duration);
    const height = useAnimatedLength(heightFactor, h, duration);

    return (
      <span ref={ref}
        style={{
          overflow: 'hidden',
          display: 'inline-flex',
          transition: `width ${duration}ms ${curve} ${delay}ms, height ${duration}ms ${curve} ${delay}ms`,
          flexDirection: axisDirection,
          justifyContent: mainAxisPosition,
          alignItems: crossAxisPosition,
          width,
          height,
          ...style,
        }}
        {...props}>
        {builder(setElement)}
      </span>
    );
  }
);
