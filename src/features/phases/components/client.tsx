import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { PhaseColumn, PhaseColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
interface PhasesClientProps {
  data: PhaseColumn[];
}

export const PhasesClient: React.FC<PhasesClientProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Phases (${data.length})`}
          description="Manage your Phases"
        />
        <Button onClick={() => navigate("/dash/phases/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="phaseName"
        columns={PhaseColumns}
        data={data}
      />
    </>
  );
};
