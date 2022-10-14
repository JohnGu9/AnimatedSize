import { Property } from "csstype";
import React from "react";
import { useRefComposer } from "react-ref-composer";
import { createComponent } from "./create-component";
import { Factor, useAnimatedSize } from "./hook";

export type AnimatedSizeProps = {
  widthFactor?: Factor,
  heightFactor?: Factor,
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
    const { width, height, transition } = useAnimatedSize(element, innerRef, widthFactor, heightFactor, style ?? {});
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
