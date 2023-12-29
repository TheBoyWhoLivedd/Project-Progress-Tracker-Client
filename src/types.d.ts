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

declare interface Task {
  _id: string;
  id: string;
  taskName: string;
  associatedPhase: string;
  assignedTo: string;
  taskWeight: number;
  status: "Backlog" | "To Do" | "In Progress" | "Done" | "Cancelled";
  attachments: { url: string; name: string }[];
  startDate: Date;
  dueDate: Date;
  taskDescription: string;
}
