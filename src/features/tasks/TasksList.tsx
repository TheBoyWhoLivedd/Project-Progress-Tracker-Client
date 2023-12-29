import { useParams } from "react-router-dom";
import { TasksClient } from "./components/client";
import { useGetTasksByProjectIdQuery } from "./tasksApiSlice";

const TasksList = () => {
  const { projectId } = useParams();

  // const {
  //   data: tasks,
  //   isLoading: isLoadingTasks,
  //   isSuccess: isSuccessTasks,
  // } = useGetTasksQuery(undefined, {
  //   pollingInterval: 60000,
  //   // refetchOnFocus: true,
  //   // refetchOnMountOrArgChange: true,
  // });

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    // isSuccess: isSuccessTasks,
  } = useGetTasksByProjectIdQuery(projectId as string, {
    pollingInterval: 60000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (isLoadingTasks) return <p>Loading...</p>;

  if (tasks) {
    console.log("Tasks", tasks);

    const transformedData = tasks.ids.map((taskId) => {
      const task = tasks.entities[taskId];

      return {
        ...task,
      };
    });

    return <TasksClient data={transformedData} />;
  }

  return null;
};

export default TasksList;
