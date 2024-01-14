import { useGetProjectsQuery } from "@/features/projects/projectsApiSlice";

const useIsTeamLead = (userId: string, projectId: string) => {
  const { data: projects } = useGetProjectsQuery();

  let isTeamLead = false;

  if (projects && projectId && userId) {
    const project = projects.entities[projectId];
    if (project && project.teamLead.includes(userId)) {
      isTeamLead = true;
    }
  }

  return isTeamLead;
};

export default useIsTeamLead;
