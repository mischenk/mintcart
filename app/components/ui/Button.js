import React, { forwardRef } from "react";
import { styled } from "../../stitches.config";

const Button = forwardRef(
  (
    { leftIcon, rightIcon, children, as = "button", onClick, ...props },
    ref
  ) => {
    return (
      <ButtonContainer
        as={as}
        ref={ref}
        onClick={(e) => !props.disabled && onClick && onClick(e)}
        {...props}
      >
        {leftIcon && <Icon left>{leftIcon}</Icon>}
        {children}
        {rightIcon && <Icon right>{rightIcon}</Icon>}
      </ButtonContainer>
    );
  }
);

const ButtonContainer = styled("button", {
  display: "inline-flex",
  flexGrow: 0,
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "$sans",
  fontWeight: 600,
  border: "none",
  fontSize: "$sm",
  transition: "all 0.2s ease-in-out",
  textDecoration: "none",
  boxSizing: "border-box",
  cursor: "pointer",

  defaultVariants: {
    type: "primary",
  },
  variants: {
    type: {
      primary: {
        borderStyle: "solid",
        borderWidth: "1px",
        borderColor: "black",
        height: "$10",
        py: 0,
        px: "$4",
      },
      secondary: {
        borderStyle: "solid",
        borderWidth: "1px",
        height: "$10",
        py: 0,
        px: "$4",
      },
      link: {
        borderStyle: "solid",
        borderWidth: "1px",
        background: "transparent",
        border: "none",
        p: 0,
      },
      icon: {
        border: "none",
        p: 0,
        height: "$8",
        width: "$8",
      },
    },
    disabled: {
      true: {
        opacity: "0.75",
        cursor: "not-allowed",
        "&:hover": {
          boxShadow: "none",
        },
      },
    },
    style: {
      wide: {
        width: "100%",
      },
    },
  },
  compoundVariants: [
    {
      type: "primary",
      css: {
        backgroundColor: "white",
        color: "black",
        "&:hover": {
          boxShadow: "0px 0px 0px 1px #000",
        },
      },
    },
    {
      type: "secondary",
      css: {
        color: "white",
        borderColor: "black",
        backgroundColor: "black",
        "&:hover": {
          boxShadow: "0px 0px 0px 1px #000",
        },
      },
    },
    {
      type: "link",
      css: {
        color: "black",
      },
    },
    {
      type: "icon",
      css: {
        backgroundColor: "white",
        color: "black",
        "&:hover": {
          boxShadow: "0px 0px 0px 1px #000",
        },
      },
    },
  ],
});

const Icon = styled("div", {
  height: "$5",
  svg: {
    height: "$5",
    width: "$5",
  },
  variants: {
    left: {
      true: {
        mr: "$2",
      },
    },
    right: {
      true: {
        ml: "$2",
      },
    },
  },
});

export default Button;
