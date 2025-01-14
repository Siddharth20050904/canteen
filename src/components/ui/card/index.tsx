"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// ... (other non-skeleton components remain the same) ...

const CardSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm animate-pulse",
      className
    )}
    {...props}
  />
))
CardSkeleton.displayName = "CardSkeleton"

const CardHeaderSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  >
    <div className="h-8 bg-green-200 rounded w-1/3 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75"></div>
  </div>
))
CardHeaderSkeleton.displayName = "CardHeaderSkeleton"

const CardTitleSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-7 bg-green-200 rounded w-1/2 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75",
      className
    )}
    {...props}
  />
))
CardTitleSkeleton.displayName = "CardTitleSkeleton"

const CardDescriptionSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-4 bg-green-200 rounded w-2/3 mt-2 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75",
      className
    )}
    {...props}
  />
))
CardDescriptionSkeleton.displayName = "CardDescriptionSkeleton"

const CardContentSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 space-y-3", className)} {...props}>
    <div className="h-4 bg-green-300 rounded animate-[pulse_1.5s_ease-in-out_infinite] opacity-75"></div>
    <div className="h-4 bg-green-300 rounded w-5/6 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75 delay-[200ms]"></div>
    <div className="h-4 bg-green-300 rounded w-4/6 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75 delay-[400ms]"></div>
  </div>
))
CardContentSkeleton.displayName = "CardContentSkeleton"

const CardFooterSkeleton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0 space-x-4", className)}
    {...props}
  >
    <div className="h-4 bg-green-200 rounded w-24 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75"></div>
    <div className="h-4 bg-green-200 rounded w-20 animate-[pulse_1.5s_ease-in-out_infinite] opacity-75 delay-[200ms]"></div>
  </div>
))
CardFooterSkeleton.displayName = "CardFooterSkeleton"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardSkeleton,
  CardHeaderSkeleton,
  CardTitleSkeleton,
  CardDescriptionSkeleton,
  CardContentSkeleton,
  CardFooterSkeleton
}