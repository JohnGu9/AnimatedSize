import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { AnimatedSize } from '../src/animated-size';
import { Factor } from '../src/hook';

export default {
  component: AnimatedSize,
} as ComponentMeta<typeof AnimatedSize>;

function AnimationBetween(start: Partial<Factor>, end: Partial<Factor>) {
  return ((args) => {
    const [open0, setOpen0] = React.useState(true);
    const [open1, setOpen1] = React.useState(true);
    return (
      <>
        <h4 style={{ display: 'block' }}>Animation between [{start.size ?? 'undefined'}] and [{end.size ?? 'undefined'}]</h4>
        <button style={{ marginBottom: 8, display: 'block' }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
        <button style={{ marginBottom: 8, display: 'block' }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
        <AnimatedSize style={{ border: 'dotted' }} heightFactor={open0 ? start : end} {...args}>
          <div style={{ margin: 64 }}></div>
          <AnimatedSize style={{ border: 'dotted', margin: 64 }} heightFactor={open1 ? start : end} {...args}>
            <div style={{ margin: 64 }}></div>
          </AnimatedSize>
        </AnimatedSize>

      </>
    )
  }) as ComponentStory<typeof AnimatedSize>;
}

export const Demo0 = AnimationBetween({ size: 1.2 }, { size: 0 }).bind({});
export const Demo1 = AnimationBetween({ size: 'auto' }, { size: 0 }).bind({});
export const Demo2 = AnimationBetween({ size: undefined }, { size: 0 }).bind({});
export const Demo3 = AnimationBetween({ size: 1 }, { size: 0 }).bind({});

export const Demo4 = AnimationBetween({ size: 1.2 }, { size: '20px' }).bind({});
export const Demo5 = AnimationBetween({ size: 'auto' }, { size: '20px' }).bind({});
export const Demo6 = AnimationBetween({ size: undefined }, { size: '20px' }).bind({});
export const Demo7 = AnimationBetween({ size: 1 }, { size: '20px' }).bind({});
