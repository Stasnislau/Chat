import { useRef } from "react";

const useDebounce = (func: Function, delay: number) => {
  const debounce = useRef<ReturnType<typeof setTimeout>>();
  return (...args: any) => {
    if (debounce.current) {
        clearTimeout(debounce.current);}
    debounce.current = setTimeout(() => func(...args), delay);
  };
};

export default useDebounce;