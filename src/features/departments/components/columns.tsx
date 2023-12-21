import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type DepartmentColumn = {
  // id: string;
  departmentName: string;
};

export const DepartmentColumns: ColumnDef<DepartmentColumn>[] = [
  {
    accessorKey: "departmentName",
    header: "Department Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
