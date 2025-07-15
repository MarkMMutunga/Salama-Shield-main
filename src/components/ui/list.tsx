// src/components/ui/list.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const List = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn("space-y-2", className)}
    {...props}
  />
))
List.displayName = "List"

const ListItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("p-3 bg-muted/50 rounded-md text-sm hover:bg-muted transition-colors", className)}
    {...props}
  />
))
ListItem.displayName = "ListItem"

export { List, ListItem }
