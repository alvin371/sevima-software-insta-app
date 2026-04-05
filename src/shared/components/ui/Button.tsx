import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, type TouchableOpacityProps } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-lg py-3 px-5",
  {
    variants: {
      variant: {
        primary: "bg-brand-primary",
        secondary: "bg-brand-secondary",
        outline: "border border-gray-300 bg-white",
        ghost: "bg-transparent",
        destructive: "bg-red-500",
      },
      size: {
        sm: "py-2 px-4",
        md: "py-3 px-5",
        lg: "py-4 px-6",
        full: "py-3 px-5 w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

const textVariants = cva("font-semibold text-center", {
  variants: {
    variant: {
      primary: "text-white",
      secondary: "text-white",
      outline: "text-brand-dark",
      ghost: "text-brand-primary",
      destructive: "text-white",
    },
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      full: "text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonProps = TouchableOpacityProps &
  VariantProps<typeof buttonVariants> & {
    label: string;
    isLoading?: boolean;
  };

export function Button({ label, variant, size, isLoading, disabled, className, ...props }: ButtonProps) {
  return (
    <TouchableOpacity
      className={[buttonVariants({ variant, size }), className].filter(Boolean).join(" ")}
      disabled={disabled || isLoading}
      activeOpacity={0.75}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === "outline" || variant === "ghost" ? "#E1306C" : "#fff"}
        />
      ) : (
        <Text className={textVariants({ variant, size })}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
