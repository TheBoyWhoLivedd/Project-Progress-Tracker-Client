import { Phase, useGetPhasesQuery } from "../phases/phasesApiSlice";
import { ProjectsCardClient } from "./components/cardClient";
import ProjectsLoadingSkeleton from "./components/skeletons/ProjectListSkeleton";
import { useGetProjectsQuery } from "./projectsApiSlice";

const ProjectsCards = () => {
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isSuccess: isSuccessProjects,
  } = useGetProjectsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  console.log("Projects", projects);

  const {
    data: phases,
    isLoading: isLoadingPhases,
    isSuccess: isSuccessPhases,
  } = useGetPhasesQuery();

  if (isLoadingProjects || isLoadingPhases) {
    return <ProjectsLoadingSkeleton />;
  }

  if (isSuccessProjects && isSuccessPhases) {
    // Create a map of phase IDs to phase names
    const phaseMap: Record<string, string> = phases.ids.reduce((acc, id) => {
      const phase = phases.entities[id] as Phase; 
      acc[phase._id] = phase.phaseName;
      return acc;
    }, {} as Record<string, string>);

    // Transform project data by adding the current phase name
    const transformedData = projects.ids.map((projectId) => {
      const project = projects.entities[projectId];
      const currentPhaseName = phaseMap[project.currentPhase] || "Unknown";
      console.log("Project", project);
      return {
        ...project,
        currentPhaseName,
      };
    });

    return <ProjectsCardClient data={transformedData} />;
  }

  return null;
};

export default ProjectsCards;
