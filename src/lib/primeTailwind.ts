// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { cn } from "./utils";

export const calendarClass = {
  input: {
    root: {
      className:
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
    },
  },
  panel: {
    className:
      "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
  },
  table: {
    className: "w-full border-collapse space-y-1",
  },
  tableHeaderCell: {
    className: "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
  },
  day: {
    className: " h-8 w-8 p-1 font-normal aria-selected:opacity-100",
  },
  header: {
    className: cn("space-x-1 flex items-center"),
  },
  previousbutton: {
    className: cn(
      "rounded-md border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
  },
  title: {
    className: "leading-8 mx-auto",
  },
  monthTitle: {
    className: cn(
      "text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2",
      "mr-2",
      "hover:text-blue-500"
    ),
  },
  yearTitle: {
    className: cn(
      "text-gray-700 dark:text-white/80 transition duration-200 font-semibold p-2",
      "hover:text-blue-500"
    ),
  },
  nextbutton: {
    className: cn(
      "rounded-md border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
    ),
  },
  dayLabel: ({ context }) => ({
    className: cn(
      "p-1 rounded-md transition-shadow duration-200 border-transparent border",
      "flex items-center justify-center mx-auto overflow-hidden relative",
      "focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]",
      {
        "text-muted-foreground opacity-50": context.disabled,
        "cursor-pointer": !context.disabled,
      },
      {
        "text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80":
          !context.selected && !context.disabled,
        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground":
          context.selected && !context.disabled,
      }
    ),
  }),
  year: ({ context }) => ({
    className: cn(
      "w-1/2 inline-flex items-center justify-center cursor-pointer overflow-hidden relative",
      "p-2 transition-shadow duration-200 rounded-lg",
      "focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]",
      {
        "text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80":
          !context.selected && !context.disabled,
        "text-blue-700 bg-blue-100 hover:bg-blue-200":
          context.selected && !context.disabled,
      }
    ),
  }),
  month: ({ context }) => ({
    className: cn(
      "w-1/3 inline-flex items-center justify-center cursor-pointer overflow-hidden relative",
      "p-2 transition-shadow duration-200 rounded-lg",
      "focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)] dark:focus:shadow-[0_0_0_0.2rem_rgba(147,197,253,0.5)]",
      {
        "text-gray-600 dark:text-white/70 bg-transprent hover:bg-gray-200 dark:hover:bg-gray-800/80":
          !context.selected && !context.disabled,
        "text-blue-700 bg-blue-100 hover:bg-blue-200":
          context.selected && !context.disabled,
      }
    ),
  }),
};
