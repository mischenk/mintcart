import { forwardRef } from "react";

const Input = forwardRef(({ className, ...rest }, ref) => {
  return (
    <input
      className={`${className} mb-4 p-2 border border-gray-500 text-base w-full`}
      ref={ref}
      {...rest}
    />
  );
});

export default Input;
