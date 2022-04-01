import React, { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      leftIcon,
      rightIcon,
      children,
      as = "button",
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={`px-4 inline-flex grow-0 justify-center items-center font-sans font-semibold border border-solid border-black text-sm pointer h-10 ${className}`}
        as={as}
        ref={ref}
        onClick={(e) => !props.disabled && onClick && onClick(e)}
        {...props}
      >
        {leftIcon && <Icon left>{leftIcon}</Icon>}
        {children}
        {rightIcon && <Icon right>{rightIcon}</Icon>}
      </button>
    );
  }
);
export default Button;
