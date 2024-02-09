// types/errorResponse.d.ts
declare interface ErrorResponse {
  data: {
    message: string;
  };
}

interface PhaseHistory {
  _id: string;
  phase: string;
  phaseStartDate: Date;
  phaseEstimatedEndDate: Date;
  phaseCompletionRate: number;
}

declare interface Project {
  _id: string;
  id: string;
  projectName: string;
  projectDescription: string;
  currentPhase: string;
  currentPhaseName?: string;
  phasesHistory: PhaseHistory[];
  team: string[];
  teamLead: string[];
  projectStatus: "Active" | "Completed" | "On Hold";
  startDate: Date;
  estimatedEndDate: Date;
  actualEndDate?: Date;
  projectCompletionRate: number;
}

declare interface Task {
  _id: string;
  id: string;
  taskName: string;
  associatedPhase: string;
  associatedProject: string;
  assignedTo: string;
  taskWeight: number;
  status: "Backlog" | "To Do" | "In Progress" | "Done" | "Cancelled";
  attachments: { url: string; name: string }[];
  startDate: Date;
  dueDate: Date;
  taskDescription: string;
  remarks: {
    text: string;
    createdAt: Date;
  }[];
}

type registerErrorType = {
  email?: string;
  name?: string;
  password?: string;
};

type LoginPayloadType = {
  email: string;
  password: string;
};

type LoginErrorType = {
  email?: string;
  password?: string;
};

// * Auth INput type
type AuthInputType = {
  label: string;
  type: string;
  name: string;
  errors: registerErrorType;
  callback: (name: string, value: string) => void;
};

// * Forgot password payload type
type ForgotPasswordPayload = {
  email: string;
};

// reset password type
type ResetPasswordPayload = {
  email: string;
  signature: string;
  password: string;
  password_confirmation: string;
};

// * Magic link payload type
type MagicLinkPayload = {
  email: string;
};

type MagicLinkPayloadVerify = {
  email: string;
  token: string;
};
