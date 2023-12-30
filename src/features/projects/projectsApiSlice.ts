import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";


// interface Project {
//   id: string;
//   email: string;
//   _id: string;
//   departmentId: string;
//   name: string;
//   hasAdminRights: boolean;
// }

const projectsAdapter = createEntityAdapter<Project>({});

const initialState = projectsAdapter.getInitialState();

export const projectsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<EntityState<Project, string>, void>({
      query: () => ({
        url: "/projects",
        validateStatus: (response, result) => {
          // First, check if there's an error flag in the result
          if (result && result.isError) return false;

          // Treat status 200-299 as success
          if (response.status >= 200 && response.status < 300) return true;

          if (response.status >= 400 && response.status < 500) return false;

          return false;
        },
      }),
      keepUnusedDataFor: 60,
      transformResponse: (responseData: Project[]) => {
        const loadedProjects = responseData.map((project) => {
          project.id = project._id;
          return project;
        });
        return projectsAdapter.setAll(initialState, loadedProjects);
      },
      providesTags: (result: EntityState<Project, string> | undefined) => {
        if (result?.ids) {
          return [
            { type: "Project", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Project" as const, id })),
          ];
        } else return [{ type: "Project", id: "LIST" }];
      },
    }),
    addNewProject: builder.mutation({
      query: (initialProjectData) => ({
        url: "/projects",
        method: "POST",
        body: {
          ...initialProjectData,
        },
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation({
      query: ({ id, ...initialProjectData }) => ({
        url: `/projects/${id}`,
        method: "PATCH",
        body: {
          ...initialProjectData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Project", id: arg.id }],
    }),
    updateProjectPhase: builder.mutation({
      query: ({ id, ...initialProjectData }) => ({
        url: `/projects/${id}/update-phase`,
        method: "PATCH",
        body: {
          ...initialProjectData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Project", id: arg.id }],
    }),
    deleteProject: builder.mutation({
      query: ({ id }) => ({
        url: `/projects/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Project", id: arg.id }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useAddNewProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectPhaseMutation,
} = projectsApiSlice;

// Define a type for the Redux state

// returns the query result object
export const selectProjectsResult = projectsApiSlice.endpoints.getProjects.select();

// creates memoized selector
const selectProjectsData = createSelector(
  selectProjectsResult,
  (projectsResult) => projectsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllProjects,
  selectById: selectProjectById,
  selectIds: selectProjectIds,
  // Pass in a selector that returns the projects slice of state
} = projectsAdapter.getSelectors(
  (state: RootState) => selectProjectsData(state) ?? initialState
);
