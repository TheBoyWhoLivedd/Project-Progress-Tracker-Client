import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./features/auth/Login";
import DashLayout from "./components/DashLayout";
import Welcome from "./features/auth/Welcome";
import UsersList from "./features/users/UsersList";
import { ThemeProvider } from "./components/theme-provider";
import EditUser from "./features/users/EditUser";
import Prefetch from "./features/auth/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitile";
import DepartmentsList from "./features/departments/DepartmentsList";
import EditDepartment from "./features/departments/EditDepartment";
import DepartmentForm from "./features/departments/components/DepartmentForm";
import AddUser from "./features/users/AddUser";
import PhasesList from "./features/phases/PhasesList";
import EditPhase from "./features/phases/EditPhase";
import PhaseForm from "./features/phases/components/PhaseForm";
import ProjectsList from "./features/projects/ProjectsList";
import EditProject from "./features/projects/EditProject";
import AddProject from "./features/projects/AddProject";
import TasksList from "./features/tasks/TasksList";
import AddTask from "./features/tasks/AddTask";
import EditTask from "./features/tasks/EditTask";
import UpdatePhase from "./features/projects/UpdatePhase";
import GanttChart from "./features/projects/GanttChart";

function App() {
  useTitle("URA - JENGA");
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* public routes */}
          <Route index element={<Login />} />
          {/* protected routes */}
          <Route element={<PersistLogin />}>
            <Route
              element={
                <RequireAuth allowedRoles={[ROLES.Admin, ROLES.Employee]} />
              }
            >
              <Route element={<Prefetch />}>
                <Route path="dash" element={<DashLayout />}>
                  <Route index element={<Welcome />} />
                  <Route path="projects">
                    <Route index element={<ProjectsList />} />
                    <Route path=":id" element={<EditProject />} />
                    <Route path=":id/update-phase" element={<UpdatePhase />} />
                    <Route path=":id/gantt" element={<GanttChart />} />
                    <Route path="new" element={<AddProject />} />
                    <Route path=":projectId/tasks" element={<TasksList />} />
                    <Route path=":projectId/tasks/new" element={<AddTask />} />
                    <Route
                      path=":projectId/tasks/:taskId"
                      element={<EditTask />}
                    />
                  </Route>
                  <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                    <Route path="users">
                      <Route index element={<UsersList />} />
                      <Route path=":id" element={<EditUser />} />
                      <Route path="new" element={<AddUser />} />
                    </Route>
                    <Route path="departments">
                      <Route index element={<DepartmentsList />} />
                      <Route path=":id" element={<EditDepartment />} />
                      <Route
                        path="new"
                        element={<DepartmentForm initialData={null} />}
                      />
                    </Route>
                    <Route path="phases">
                      <Route index element={<PhasesList />} />
                      <Route path=":id" element={<EditPhase />} />
                      <Route
                        path="new"
                        element={<PhaseForm initialData={null} />}
                      />
                    </Route>
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
          {/* end protected routes */}
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
