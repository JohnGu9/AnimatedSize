import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Property } from "csstype";
import React from 'react';
import { AnimatedSize } from '../src/animated-size';

export default {
  component: AnimatedSize,
} as ComponentMeta<typeof AnimatedSize>;

function AnimationBetween(display: Property.Display) {
  const start = { size: 'auto' };
  const end = { size: 0 };
  return (((args) => {
    const [open0, setOpen0] = React.useState(true);
    const [open1, setOpen1] = React.useState(true);
    return (
      <div style={{ position: 'relative' }}>
        <h4 style={{ display: 'block' }}>Inline and block display may not work as expected if nested element contains text</h4>
        <h4 style={{ display: 'block' }}>Flex display can fix it</h4>
        <button style={{ marginBottom: 8, display: 'block', zIndex: 8 }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
        <button style={{ marginBottom: 8, display: 'block', zIndex: 8 }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
        <AnimatedSize style={{ display, border: 'dotted', overflow: 'visible', pointerEvents: 'none' }}
          heightFactor={open0 ? start : end} {...args}>
          <div style={{ margin: 32, color: open0 ? 'black' : 'grey' }}>text</div>
          <AnimatedSize style={{ display, border: 'dotted', margin: 32, overflow: 'visible', pointerEvents: 'none' }}
            heightFactor={open1 ? start : end} {...args}>
            <div style={{ margin: 32, color: open1 ? 'black' : 'grey' }}>text</div>
          </AnimatedSize>
        </AnimatedSize>

      </div>
    )
  }) as ComponentStory<typeof AnimatedSize>).bind({});
}

export const InlineFlex = AnimationBetween('inline-flex');
export const Flex = AnimationBetween('flex');
export const InlineBlock = AnimationBetween('inline-block');
export const Block = AnimationBetween('block');
