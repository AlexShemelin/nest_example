/* eslint-disable */
export function debounce(func: Function, delay: number) {
  let timerId: ReturnType<typeof setTimeout>;

  return function (...args: any[]) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      //@ts-expect-error
      func.apply(this, args);
    }, delay);
  };
}
