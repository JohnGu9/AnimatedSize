import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { AnimatedSize } from '../src/index';

export default {
  component: AnimatedSize,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof AnimatedSize>;

const Template0: ComponentStory<typeof AnimatedSize> = (args) => {
  const [open0, setOpen0] = React.useState(true);
  const [open1, setOpen1] = React.useState(true);
  return (
    <>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
      <AnimatedSize style={{ border: 'dotted' }} heightFactor={open0 ? 'auto' : 0} {...args}>
        <div style={{ margin: 64 }}></div>
        <AnimatedSize style={{ border: 'dotted', margin: 64 }} heightFactor={open1 ? 'auto' : 0} {...args}>
          <div style={{ margin: 64 }}></div>
        </AnimatedSize>
      </AnimatedSize>

    </>
  )
};

export const AnimationWithAuto = Template0.bind({});

const Template1: ComponentStory<typeof AnimatedSize> = (args) => {
  const [open0, setOpen0] = React.useState(true);
  const [open1, setOpen1] = React.useState(true);
  return (
    <>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
      <AnimatedSize style={{ border: 'dotted' }} heightFactor={open0 ? null : 0} {...args}>
        <div style={{ margin: 64 }}></div>
        <AnimatedSize style={{ border: 'dotted', margin: 64 }} heightFactor={open1 ? null : 0} {...args}>
          <div style={{ margin: 64 }}></div>
        </AnimatedSize>
      </AnimatedSize>

    </>
  )
};

export const AnimationWithNull = Template1.bind({});

const Template2: ComponentStory<typeof AnimatedSize> = (args) => {
  const [open0, setOpen0] = React.useState(true);
  const [open1, setOpen1] = React.useState(true);
  return (
    <>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen0(!open0)}>{open0 ? 'close' : 'open'} outer</button>
      <button style={{ marginBottom: 16, display: 'block' }} onClick={() => setOpen1(!open1)}>{open1 ? 'close' : 'open'} inner</button>
      <AnimatedSize style={{ border: 'dotted' }} heightFactor={open0 ? 1 : 0} {...args}>
        <div style={{ margin: 64 }}></div>
        <AnimatedSize style={{ border: 'dotted', margin: 64 }} heightFactor={open1 ? 1 : 0} {...args}>
          <div style={{ margin: 64 }}></div>
        </AnimatedSize>
      </AnimatedSize>
    </>
  )
};

export const AnimationWithFactor = Template2.bind({});
