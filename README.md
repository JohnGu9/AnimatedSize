# AnimatedSize

## Introduce

This component provide flexible size-change animation for html element under `react-dom` framework.

## Feature

1. AnimatedSize provide the features that let element's width/height animate between `auto` and any size.
2. Animation is provided by `css transition` so the component take less js-runtime compared with pure js implement.
3. And AnimatedSize support perfect animation that you can stop animation or change animation dest or change animation duration `at any time` even AnimatedSize is animating or nested element's size is changing.

<br/>

<img src="./document/preview.gif" alt="preview" width="200"/>

- nested `AnimatedSize` is also fine.

<br/>

<img src="./document/performance.png" alt="performance" width="300"/>

- most of the job is html renderer paint, more animation with less js-runtime.

<br/>

## Install

```console
npm i animated-size
```

## Import

```jsx
import { AnimatedSize } from "animated-size";
```

## Use

```jsx
const [open, setOpen] = React.useState(true);
...
<AnimatedSize widthFactor={open ? { size: "auto" } : { size: 0 }}>
  {/* your element*/}
</AnimatedSize>;
```

## Size [Factor](./src//hook.tsx)

```ts
export type Factor = {
  size?: SizeFactor /* default: undefined */;
  duration?: number /* unit: ms, default: 350 */;
  delay?: number /* unit: ms, default: 0 */;
  curve?: DataType.EasingFunction /* default: ease */;
};

export type SizeFactor = number | string | "auto" | undefined;
```

| SizeFactor | Requirement                                 |
| ---------- | ------------------------------------------- |
| number     | float or int that equal to or bigger than 0 |
| string     | the string is valid for css width property  |
| auto       | /                                           |
| undefined  | /                                           |

For example: element's `width` is `150px`.

```jsx
<AnimatedSize widthFactor={/* set your factor */}>
  {/* if the entirely width (wrapper by span) is 150px */}
  <Element0 />
  <Element1 />
</AnimatedSize>
```

This width property of inline style sheet:

| Type           | Property            | Code                                                                                    |
| -------------- | ------------------- | --------------------------------------------------------------------------------------- |
| number[2]      | 300px (150 \* 2 px) | `widthFactor={{ size: 2 }}`                                                             |
| string['50px'] | 50px                | `widthFactor={{ size: '50px' }}`                                                        |
| auto           | auto                | `widthFactor={{ size: 'auto' }}`                                                        |
| undefined      | undefined           | `widthFactor={{ size: undefined }}` or `widthFactor={{ }}` or `widthFactor={undefined}` |

Factor change behaviors:

| From           | To             | Description                                                                                                           |
| -------------- | -------------- | --------------------------------------------------------------------------------------------------------------------- |
| number[2]      | auto           | animate from 300px to 150px, then set the width property as 'auto'                                                    |
| number[2]      | undefined      | animate from 300px to 150px, then set the width property as undefined (remove width property from inline style sheet) |
| string['50px'] | auto           | animate from 50px to 150px, then set the width property as 'auto'                                                     |
| string['50px'] | undefined      | animate from 50px to 150px, then set the width property as undefined (remove width property from inline style sheet)  |
|                |                |                                                                                                                       |
| auto           | number[2]      | set the width property as 150px, then animate from 150px to 300px                                                     |
| undefined      | number[2]      | set the width property as 150px, then animate from 150px to 300px                                                     |
| auto           | string['50px'] | set the width property as 150px, then animate from 150px to 50px                                                      |
| undefined      | string['50px'] | set the width property as 150px, then animate from 150px to 50px                                                      |
|                |                |                                                                                                                       |
| number[2]      | string['50px'] | animate from 300px to 50px                                                                                            |
| string['50px'] | number[2]      | animate from 50px to 300px                                                                                            |
|                |                |                                                                                                                       |
| auto           | undefined      | set the width property as undefined (remove width property from inline style sheet)                                   |
| undefined      | auto           | set the width property as auto                                                                                        |

- use `auto` or `undefined` for better performance when nested element may change its size.

## Custom animation curve

AnimatedSize implement the animation that underlay is [css transition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions).
Setup factor other properties to custom your animation `curve` as well as `duration` and `delay` just like [css transition](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions/Using_CSS_transitions).

```jsx
<AnimatedSize
  widthFactor={{
    size: "auto",
    curve: "ease-in",
    duration: 200 /* unit: ms */,
    delay: 200 /* unit: ms */,
  }}
>
  <div>{/* your components */}</div>
  <div>{/* your components */}</div>
  {/* your other components */}
</AnimatedSize>
```

## Custom wrapper

```jsx
<AnimatedSizeBuilder
  widthFactor={/* set your factor */}
  heightFactor={/* set your factor */}
  builder={(ref) => (
    <div ref={ref}>{/* pass ref to dom element that let AnimatedSize access the element object. Should be the only one dom child of AnimatedSizeBuilder. */}
    {/* set your components that wrapper by div */}
    </div>
  )}
/>
```

- AnimatedSize require wrapper dom element reference for calculation of this nested elements' total size

## Inner element position

By default, AnimatedSize use `flex` layout (and `center` inner element) and the inner element follow the flex layout.

Change the parament `axisDirection`, `mainAxisPosition` and `crossAxisPosition` to custom your element position. Or directly set inline style sheet -- `style` parament.

Be careful when you use `AnimatedSizeBuilder`! `AnimatedSizeBuilder` require its direct child has its own `Block formatting context`(`BFC`). The children of `flex` will create their own `BFC` automatically. It is the reason why `AnimatedSizeBuilder` default `display` is `flex`.
Checkout the [storybook](src/stories/DisplayProblem.stories.tsx) for more detail. Reference [Block formatting context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_display/Block_formatting_context).

Nothing require to handle if you just use `AnimatedSize`. Because `AnimatedSize` will wrap additional dom on your nested components. The wrapper will create its own `BFC`.

By the way, by default `AnimatedSize` set `overflow` as `hidden`. Set style to override it if necessary.

```jsx
<AnimatedSize
  widthFactor={/* set your factor */}
  heightFactor={/* set your factor */}
  axisDirection="column"
  mainAxisPosition="start"
  crossAxisPosition="end">
  {/* your element */}
</AnimatedSize>
```

- `axisDirection` - CSSProperties.`flexDirection`
- `mainAxisPosition` - CSSProperties.`justifyContent`
- `crossAxisPosition` - CSSProperties.`alignItems`

```jsx
<AnimatedSize
  widthFactor={/* set your factor */}
  heightFactor={/* set your factor */}
  style={{
    overflow: 'visible',
    display:'flex',
    position:'relative',
    /* If you just want animation on height, don't override height prop in the style but it is ok to override width. The same goes for the other way around. */
    }}>
  {/* your element */}
</AnimatedSize>
```

- `style`

## Interactive Demo

```console
git clone https://github.com/JohnGu9/AnimatedSize.git
cd AnimatedSize
npm i
npm run storybook
```

## Browser requirement

[ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) support

| Browser       | Version (or newer) |
| ------------- | ------------------ |
| Chrome        | 64                 |
| Edge          | 79                 |
| Firefox       | 69                 |
| Safari        | 13.1               |
| Safari on iOS | 13.4               |

## Component dependencies

- react-dom
- react-ref-composer

## Issue report

https://github.com/JohnGu9/AnimatedSize/issues

## Caution

Before version 3.0.0, the build target is `es5`.

After version 3.0.0, the build target is `esnext`. You should use some bundle tool to help your bundle this project code into your own project (like `esbuild`). Set your tsconfig file `"module": "ESNext"` and build system (like `vite` config file `build.target`) to convert your code to target platform compatible code.

Why `esnext`?
Using `esnext` to compile this project and preform minimal transpiling. This can product less redundant code and reduce the package size for download.

## LICENSE

[MIT](./LICENSE)
