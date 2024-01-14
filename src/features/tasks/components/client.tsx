import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { TaskColumn, TaskColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { BarChartIcon, PlusIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import useIsTeamLead from "@/hooks/useIsTeamLead";
import useAuth from "@/hooks/useAuth";
interface TasksClientProps {
  data: TaskColumn[];
}

export const TasksClient: React.FC<TasksClientProps> = ({ data }) => {
  const navigate = useNavigate();
  const { projectId = "" } = useParams();
  const { userId } = useAuth();
  const isLead = useIsTeamLead(userId, projectId);

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Tasks (${data.length})`}
          description="Manage your Tasks"
        />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => navigate(`/dash/projects/${projectId}/gantt`)}
          >
            <BarChartIcon className="mr-2 h-4 w-4" /> View Gantt
          </Button>
          {isLead && (
            <Button
              onClick={() => navigate(`/dash/projects/${projectId}/tasks/new`)}
            >
              <PlusIcon className="mr-2 h-4 w-4" /> Add New
            </Button>
          )}
        </div>
      </div>
      <Separator />
      <DataTable searchKey="taskName" columns={TaskColumns} data={data} />
    </>
  );
};
