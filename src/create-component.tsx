import React from "react";

export function createComponent<Element, Props>(render: React.ForwardRefRenderFunction<Element, Props & Omit<React.HTMLProps<Element>, keyof Props>>) {
    return React.forwardRef<Element, Props & Omit<React.HTMLProps<Element>, keyof Props>>(render);
}
