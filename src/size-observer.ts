import React from "react";

export function useSizeObserver<T extends HTMLElement>(element: T | null | undefined) {
  const [, setTicker] = React.useState(false);
  const [resizeObserver, current] = React.useMemo(() => {
    return [new ResizeObserver(() => setTicker(value => !value)),
    { width: undefined as number | undefined, height: undefined as number | undefined }];
  }, []);

  if (element) {
    current.width = element.offsetWidth;
    current.height = element.offsetHeight;
  } else {
    current.width = undefined;
    current.height = undefined;
  }

  React.useEffect(() => {
    if (element) {
      resizeObserver.observe(element);
      if (current.width !== element.offsetWidth ||
        current.height !== element.offsetWidth) {
        setTicker(value => !value);
      }
      return () => resizeObserver.unobserve(element);
    }
  }, [current, element, resizeObserver]);

  React.useEffect(() => {
    return () => resizeObserver.disconnect();
  }, [resizeObserver]);

  return current;
}
