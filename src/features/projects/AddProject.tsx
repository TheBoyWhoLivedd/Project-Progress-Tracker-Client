import { useGetPhasesQuery } from "../phases/phasesApiSlice";
import { useGetUsersQuery } from "../users/usersApiSlice";
import ProjectForm from "./components/ProjectForm";

const AddProject = () => {
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
    <ProjectForm
      initialData={null}
      team={formattedUsers}
      phases={formattedPhases}
    />
  );

  return content;
};

export default AddProject;
