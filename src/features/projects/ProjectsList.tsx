import { useGetProjectsQuery } from "./projectsApiSlice";
import ProjectsLoadingSkeleton from "./components/skeletons/ProjectListSkeleton";
import { ProjectsClient } from "./components/client";
import { Phase, useGetPhasesQuery } from "../phases/phasesApiSlice";
import { useGetTasksQuery } from "../tasks/tasksApiSlice";
import { EntityState } from "@reduxjs/toolkit";

const getLatestRemarkForProject = (
  tasks: EntityState<Task, string>,
  projectId: string
) => {
  const projectTasks = tasks.ids
    .map((taskId) => tasks.entities[taskId])
    .filter(
      (task) =>
        task.associatedProject === projectId &&
        task.remarks &&
        task.remarks.length > 0
    );

  const latestRemark = projectTasks.reduce<{
    text: string;
    createdAt: Date;
  } | null>((latest, task) => {
    if (task) {
      const lastRemark = task.remarks[task.remarks.length - 1];
      if (
        latest === null ||
        new Date(latest.createdAt) < new Date(lastRemark.createdAt)
      ) {
        return lastRemark;
      }
    }
    return latest;
  }, null);

  return latestRemark
    ? `${new Date(latestRemark.createdAt).toLocaleDateString()} - ${
        latestRemark.text
      }`
    : "";
};

const ProjectsList = () => {
  const {
    data: projects,
    isLoading: isLoadingProjects,
    isSuccess: isSuccessProjects,
  } = useGetProjectsQuery();

  const {
    data: phases,
    isLoading: isLoadingPhases,
    isSuccess: isSuccessPhases,
  } = useGetPhasesQuery();

  const {
    data: tasks,
    isLoading: isLoadingTasks,
    isSuccess: isSuccessTasks,
  } = useGetTasksQuery(undefined, {});

  if (isLoadingProjects || isLoadingPhases || isLoadingTasks) {
    return <ProjectsLoadingSkeleton />;
  }

  if (isSuccessProjects && isSuccessPhases && isSuccessTasks) {
    // Map of phase IDs to phase names
    const phaseMap: Record<string, string> = phases.ids.reduce((acc, id) => {
      const phase = phases.entities[id] as Phase;
      acc[phase._id] = phase.phaseName;
      return acc;
    }, {} as Record<string, string>);

    // Transform project data
    const transformedProjects = projects.ids.map((projectId) => {
      const project = projects.entities[projectId];
      const currentPhaseName = phaseMap[project.currentPhase] || "Unknown";
      const latestRemark = getLatestRemarkForProject(tasks, project._id);

      return {
        id: project._id,
        projectName: project.projectName,
        currentPhase: currentPhaseName,
        completionRate: project.projectCompletionRate,
        latestRemark: latestRemark,
      };
    });

    console.log("Transformed Projects",transformedProjects);

    return <ProjectsClient data={transformedProjects} />;
  }

  return null;
};

export default ProjectsList;
