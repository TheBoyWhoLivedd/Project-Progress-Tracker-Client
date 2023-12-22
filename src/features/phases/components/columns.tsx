import { ColumnDef } from "@tanstack/react-table";

import { CellAction } from "./cell-action";

export type PhaseColumn = {
  id: string;
  phaseName: string;
};

export const PhaseColumns: ColumnDef<PhaseColumn>[] = [
  {
    accessorKey: "phaseName",
    header: "Phase Name",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
