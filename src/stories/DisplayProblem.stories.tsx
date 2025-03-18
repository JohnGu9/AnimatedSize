import { Meta, StoryFn } from '@storybook/react';
import { Property } from "csstype";
import React from 'react';
import { AnimatedSize, AnimatedSizeBuilder } from '../animated-size';

export default {
  component: AnimatedSize,
} as Meta<typeof AnimatedSize>;

function AnimationBetween(display: Property.Display) {
  const start = { size: 'auto' };
  const end = { size: 0 };
  const Template: StoryFn<typeof AnimatedSize> = (args) => {
    const [open0, setOpen0] = React.useState(true);
    const [open1, setOpen1] = React.useState(true);
    return (
      <div style={{ position: 'relative' }}>
        <h4 style={{ display: 'block' }}>AnimatedSizeBuilder's direct child should have its own "Block formatting context". </h4>
        <h4 style={{ display: 'block' }}>If not, it will cause layout issue and AnimatedSize would not work as expected. </h4>
        <h4 style={{ display: 'block' }}>Known: "inline-block" will create its own "Block formatting context" but "inline" is not. </h4>
        <h4 style={{ display: 'block' }}>For more detail: <a>https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Block_formatting_context</a></h4>
        <button style={{ marginBottom: 8, display: 'block', zIndex: 8 }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
        <button style={{ marginBottom: 8, display: 'block', zIndex: 8 }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
        <AnimatedSizeBuilder style={{ border: 'dotted', overflow: 'visible', display: "inline-block"/* override default flex display, prevent child from creating BFC automatically. */ }}
          heightFactor={open0 ? start : end} {...args}
          builder={ref => {
            return <span ref={ref as unknown as React.LegacyRef<HTMLDivElement>} style={{ display }}>
              <div style={{ margin: 32, color: open0 ? 'black' : 'grey' }}>Direct child's display is "{display}"!</div>
              <AnimatedSizeBuilder style={{ border: 'dotted', margin: 32, overflow: 'visible', display: "inline-block"/* override default flex display, prevent child from creating BFC automatically. */ }}
                heightFactor={open1 ? start : end} {...args}
                builder={ref => {
                  return <span ref={ref as unknown as React.LegacyRef<HTMLDivElement>} style={{ display }}>
                    <div style={{ margin: 32, color: open1 ? 'black' : 'grey' }}>text</div>
                  </span>;
                }}>
              </AnimatedSizeBuilder>
            </span>;
          }}>
        </AnimatedSizeBuilder>
      </div>
    );
  };
  return Template.bind({});
}

export const InlineBlock = AnimationBetween('inline-block');
export const Inline = AnimationBetween('inline');
