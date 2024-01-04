import { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetProjectsQuery } from "./projectsApiSlice";
import { useGetPhasesQuery } from "../phases/phasesApiSlice";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResolvedTheme } from "@/components/theme-provider";

const GanttChart = () => {
  const { id } = useParams<string>();
  const { project } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      project: id ? data?.entities[id] : undefined,
    }),
  });

  const [viewMode, setViewMode] = useState(ViewMode.Day);
  const { data: phases } = useGetPhasesQuery();
  const theme = useResolvedTheme(); // Use the custom hook
  const themeClass = theme === "dark" ? "dark-mode" : "";

  if (!project || !phases) return <p>Loading...</p>;

  const getTaskStyles = (theme: string) => {
    if (theme === "dark") {
      return {
        // backgroundColor: "#333", // Dark mode background color
        // Dark mode progress color
        // barProgressColor: "black",
        // ... other dark mode styles
      };
    } else {
      return {
        // backgroundColor: "#f0f0f0", // Light mode background color
        // Light mode progress color
        // ... other light mode styles
      };
    }
  };

  const tasks: Task[] = project.phasesHistory.map((phaseHistory) => {
    const phaseName =
      phases.entities[phaseHistory.phase]?.phaseName || "Unknown Phase";

    return {
      start: new Date(phaseHistory.phaseStartDate),
      end: new Date(phaseHistory.phaseEstimatedEndDate),
      name: phaseName,
      id: phaseHistory._id,
      progress: phaseHistory.phaseCompletionRate,
      type: "task",
      isDisabled: false,
      styles: getTaskStyles(theme),
    };
  });

  return (
    <div className="">
      <div className="flex flex-col gap-2 items-center mb-2">
        <h3>Gantt Chart for {project.projectName}</h3>
        <Tabs defaultValue="day" className="flex">
          <TabsList aria-label="View Modes">
            <TabsTrigger value="day" onClick={() => setViewMode(ViewMode.Day)}>
              Day
            </TabsTrigger>
            <TabsTrigger
              value="week"
              onClick={() => setViewMode(ViewMode.Week)}
            >
              Week
            </TabsTrigger>
            <TabsTrigger
              value="month"
              onClick={() => setViewMode(ViewMode.Month)}
            >
              Month
            </TabsTrigger>
            <TabsTrigger
              value="year"
              onClick={() => setViewMode(ViewMode.Year)}
            >
              Year
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {tasks.length > 0 ? (
        <div className={`${themeClass}`}>
          <Gantt tasks={tasks} viewMode={viewMode} />
        </div>
      ) : (
        <p className="text-center">No Phases to Display</p>
      )}
    </div>
  );
};

export default GanttChart;
