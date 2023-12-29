import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  QuestionMarkCircledIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export type TaskColumn = {
  id: string;
  taskName: string;
  taskWeight: number;
  status: string;
};

export const statuses = [
  {
    value: "Backlog",
    label: "Backlog",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "To Do",
    label: "Todo",
    icon: CircleIcon,
  },
  {
    value: "In Progress",
    label: "In Progress",
    icon: StopwatchIcon,
  },
  {
    value: "Done",
    label: "Done",
    icon: CheckCircledIcon,
  },
  {
    value: "Canceled",
    label: "Canceled",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
];

export const TaskColumns: ColumnDef<TaskColumn>[] = [
  {
    accessorKey: "taskName",
    header: "Task Name",
  },
  {
    accessorKey: "taskWeight",
    header: "Task Priority",
    cell: ({ row }) => {
      const taskWeight = row.getValue("taskWeight");

      let priorityLabel: string;
      if (taskWeight === 1) {
        priorityLabel = "low";
      } else if (taskWeight === 2 || taskWeight === 3) {
        priorityLabel = "medium";
      } else if (taskWeight === 4 || taskWeight === 5) {
        priorityLabel = "high";
      }

      const priority = priorities.find((p) => p.value === priorityLabel);

      if (!priority) {
        return null;
      }

      return (
        <div className="flex items-center">
          {priority.icon && (
            <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{priority.label}</span>
        </div>
      );
    },
    filterFn: (row, _id, filterValue) => {
      const taskWeight = row.getValue("taskWeight");
      let priorityLabel;
      if (taskWeight === 1) {
        priorityLabel = "low";
      } else if (taskWeight === 2 || taskWeight === 3) {
        priorityLabel = "medium";
      } else if (taskWeight === 4 || taskWeight === 5) {
        priorityLabel = "high";
      }

      return filterValue.includes(priorityLabel);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = statuses.find((status) => {
        // console.log(row.getValue("status"));
        return status.value === row.getValue("status");
      });

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
