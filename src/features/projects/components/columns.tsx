import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type ProjectColumn = {
  id: string;
  projectName: string;
  currentPhase: string;
  completionRate: number;
  latestRemark: string;
};

export const ProjectColumns: ColumnDef<ProjectColumn>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "currentPhase",
    header: "Current Phase",
  },
  {
    accessorKey: "completionRate",
    header: "Completion Rate",
  },
  {
    accessorKey: "latestRemark",
    header: "Latest Remark",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
