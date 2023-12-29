import TaskForm from "./components/TaskForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetPhasesQuery } from "../phases/phasesApiSlice";

const AddTask = () => {
  const { data: users } = useGetUsersQuery();
  const { data: phases } = useGetPhasesQuery();

  // console.log(users);

  let content = null;

  if (!users || !phases) return <p>Loading...</p>;

  const formattedUsers = users.ids.map((id) => ({
    id,
    name: users.entities[id].name,
  }));
  const formattedPhases = phases.ids.map((id) => ({
    id,
    name: phases.entities[id].phaseName,
  }));

  content = (
    <TaskForm
      initialData={null}
      team={formattedUsers}
      phases={formattedPhases}
    />
  );

  return content;
};

export default AddTask;
