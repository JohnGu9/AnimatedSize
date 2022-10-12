# AnimatedSize

## Introduce

This component provide flexible size-change animation for html element under react framework.

## Core content

AnimatedSize provide the features in such as element's width/height animate from [auto](https://developer.mozilla.org/en-US/docs/Web/CSS/width) to any size factor or animate from any size factor to [auto](https://developer.mozilla.org/en-US/docs/Web/CSS/width).

## Size [Factor](./src//animated-length.tsx)

For example:
Element's width is 150px.

- Factor.number[2] => 150px \* 2
- Factor.auto => auto
- Factor.null => undefined

Behaviors

- Factor.number[2] => Factor.auto: animate from 300px to 150px, than set the width property as 'auto'
- Factor.number[2] => Factor.null: animate from 300px to 150px, than set the width property as undefined (remove width property from inline style sheet)
- Factor.auto => Factor.number[2]: set 150px, than animate from 150px to 300px
- Factor.null => Factor.number[2]: set 150px, than animate from 150px to 300px

## Demo

```console
git clone https://github.com/JohnGu9/AnimatedSize.git
cd AnimatedSize
npm init -y
npm run storybook
```

## Browser requirement

[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) support

| Type    | Version |
| ------- | ------- |
| Chrome  | 64      |
| Firefox | 69      |
| Safari  | 13.1    |

## Component dependencies

- React

## Issue report

https://github.com/JohnGu9/AnimatedSize

## LICENSE

[MIT](./LICENSE)
