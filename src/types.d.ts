// types/errorResponse.d.ts
declare interface ErrorResponse {
  data: {
    message: string;
  };
}

declare interface Project {
  _id: string;
  id: string;
  projectName: string;
  projectDescription: string;
  currentPhase: string;
  currentPhaseName?: string;
  phaseStartDate: Date;
  phaseEstimatedEndDate: Date;
  team: string[];
  teamLead: string[];
  projectStatus: "Active" | "Completed" | "On Hold";
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
}
