import { useParams } from "react-router-dom";
import { useGetTasksByProjectIdQuery } from "./tasksApiSlice";
import TaskForm from "./components/TaskForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetPhasesQuery } from "../phases/phasesApiSlice";

const EditTask = () => {
  const { projectId, taskId } = useParams<string>();

  // console.log(projectId, taskId);

  const { task } = useGetTasksByProjectIdQuery(projectId as string, {
    selectFromResult: ({ data }) => ({
      task: taskId ? data?.entities[taskId] : undefined,
    }),
  });

  // console.log(task);
  const { data: users } = useGetUsersQuery();
  const { data: phases } = useGetPhasesQuery();

  // console.log("Edit Task", task);

  if (!task || !users || !phases) return <p>Loading...</p>;

  const formattedUsers = users.ids.map((id) => ({
    id,
    name: users.entities[id].name,
  }));
  const formattedPhases = phases.ids.map((id) => ({
    id,
    name: phases.entities[id].phaseName,
  }));

  const formattedTasks = {
    ...task,
    startDate: new Date(task.startDate),
    dueDate: new Date(task.dueDate),
  };
  console.log("formattedTasks", formattedTasks);
  const content = (
    <TaskForm
      initialData={formattedTasks}
      team={formattedUsers}
      phases={formattedPhases}
    />
  );

  return content;
};

export default EditTask;
