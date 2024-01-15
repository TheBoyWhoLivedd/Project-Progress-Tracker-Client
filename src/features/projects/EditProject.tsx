import { useParams } from "react-router-dom";
import { useGetProjectsQuery } from "./projectsApiSlice";
import ProjectForm from "./components/ProjectForm";
import { useGetUsersQuery } from "../users/usersApiSlice";
import { useGetPhasesQuery } from "../phases/phasesApiSlice";

const EditProject = () => {
  const { id } = useParams<string>();

  const { project } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      project: id ? data?.entities[id] : undefined,
    }),
  });

  const { data: users } = useGetUsersQuery();
  const { data: phases } = useGetPhasesQuery();

  // console.log("Edit Project", project);

  if (!project || !users || !phases) return <p>Loading...</p>;

  const formattedUsers = users.ids.map((id) => ({
    id,
    name: users.entities[id].name,
  }));
  const formattedPhases = phases.ids.map((id) => ({
    id,
    name: phases.entities[id].phaseName,
  }));

  const formattedProjects = {
    ...project,
    startDate: new Date(project.startDate),
    estimatedEndDate: new Date(project.estimatedEndDate),
  };
  // console.log("Formatted Projects", formattedProjects);
  const content = (
    <ProjectForm
      initialData={formattedProjects}
      team={formattedUsers}
      phases={formattedPhases}
    />
  );

  return content;
};

export default EditProject;
