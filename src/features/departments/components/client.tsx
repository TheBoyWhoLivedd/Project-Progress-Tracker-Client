import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { DepartmentColumn, DepartmentColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
interface DepartmentsClientProps {
  data: DepartmentColumn[];
}

export const DepartmentsClient: React.FC<DepartmentsClientProps> = ({
  data,
}) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Departments (${data.length})`}
          description="Manage your Departments"
        />
        <Button onClick={() => navigate("/dash/departments/new")}>
          <PlusIcon className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable
        searchKey="departmentName"
        columns={DepartmentColumns}
        data={data}
      />
    </>
  );
};
