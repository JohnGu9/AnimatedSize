import React from "react";

type E<T> = T extends React.DetailedHTMLProps<React.HTMLAttributes<infer E>, infer E> ? E : never;
export type TagToElementType<T extends keyof JSX.IntrinsicElements> = E<JSX.IntrinsicElements[T]>;

export function createComponent<Element, Props>(render: React.ForwardRefRenderFunction<Element, Props & Omit<React.HTMLProps<Element>, keyof Props | "ref">>) {
    return React.forwardRef<Element, Props & Omit<React.HTMLProps<Element>, keyof Props | "ref">>(render);
}
