import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { ProjectColumn, ProjectColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
interface ProjectsClientProps {
  data: ProjectColumn[];
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Projects (${data.length})`}
          description="Manage your Projects"
        />
        <Button onClick={() => navigate("/dash/projects/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="projectName"
        columns={ProjectColumns}
        data={data}
      />
    </>
  );
};
