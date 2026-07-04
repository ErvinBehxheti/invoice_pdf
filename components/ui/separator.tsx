"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorPrimitive.Props & { variant?: "solid" | "dashed" }) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 border-border",
        variant === "dashed"
          ? "border-dashed data-horizontal:w-full data-horizontal:border-t data-vertical:self-stretch data-vertical:border-l"
          : "bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
