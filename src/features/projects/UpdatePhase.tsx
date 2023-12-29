import { useParams } from "react-router-dom";
import { useGetProjectsQuery } from "./projectsApiSlice";
import { useGetPhasesQuery } from "../phases/phasesApiSlice";
import UpdatePhaseForm from "./components/UpdatePhaseForm";

const UpdatePhase = () => {
  const { id } = useParams<string>();

  const { project } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      project: id ? data?.entities[id] : undefined,
    }),
  });

  const { data: phases } = useGetPhasesQuery();

  // console.log("Edit Project", project);

  if (!project || !phases) return <p>Loading...</p>;

  const formattedPhases = phases.ids.map((id) => ({
    id,
    name: phases.entities[id].phaseName,
  }));

  const formattedProjects = {
    ...project,
    startDate: new Date(project.startDate),
    estimatedEndDate: new Date(project.estimatedEndDate),
  };
  console.log("Formatted Projects", formattedProjects);
  const content = (
    <UpdatePhaseForm
      initialData={formattedProjects}
      phases={formattedPhases}
    />
  );

  return content;
};

export default UpdatePhase;
