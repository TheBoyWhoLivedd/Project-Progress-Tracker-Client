import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";

const tasksAdapter = createEntityAdapter<Task>({});

const initialState = tasksAdapter.getInitialState();

export const tasksApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<EntityState<Task, string>, void>({
      query: () => ({
        url: "/tasks",
      }),
      keepUnusedDataFor: 60,
      transformResponse: (responseData: Task[]) => {
        const loadedTasks = responseData.map((task) => {
          task.id = task._id;
          return task;
        });
        return tasksAdapter.setAll(initialState, loadedTasks);
      },
      providesTags: (result: EntityState<Task, string> | undefined) => {
        if (result?.ids) {
          return [
            { type: "Task", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Task" as const, id })),
          ];
        } else return [{ type: "Task", id: "LIST" }];
      },
    }),
    getTasksByProjectId: builder.query<EntityState<Task, string>, string>({
      query: (projectId) => ({
        url: `/tasks/${projectId}`,
      }),
      transformResponse: (responseData: Task[]) => {
        const loadedTasks = responseData.map((task) => {
          task.id = task._id;
          return task;
        });
        return tasksAdapter.setAll(initialState, loadedTasks);
      },
      providesTags: (result: EntityState<Task, string> | undefined) => {
        if (result?.ids) {
          return [
            { type: "Task", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Task" as const, id })),
          ];
        } else return [{ type: "Task", id: "LIST" }];
      },
    }),
    addNewTask: builder.mutation({
      query: ({ projectId, ...initialTaskData }) => ({
        url: `/tasks/${projectId}`,
        method: "POST",
        body: {
          ...initialTaskData,
        },
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation({
      query: ({ projectId, taskId, ...initialTaskData }) => ({
        url: `/tasks/${projectId}/${taskId}`,
        method: "PATCH",
        body: {
          ...initialTaskData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Task", id: arg.id }],
    }),
    deleteTask: builder.mutation({
      query: ({ projectId, taskId }) => ({
        url: `/tasks/${projectId}/${taskId}`,
        method: "DELETE",
        // body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Task", id: arg.id }],
    }),
    // uploadFile: builder.mutation({
    //   query: (files) => {
    //     console.log('files', files)
    //     return {
    //       url: "/upload",
    //       method: "POST",
    //       body: files,
    //     };
    //   },
    // }),
  }),
});

export const {
  useGetTasksQuery,
  useAddNewTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTasksByProjectIdQuery,
  // useUploadFileMutation,
} = tasksApiSlice;

// Define a type for the Redux state

// returns the query result object
export const selectTasksResult = tasksApiSlice.endpoints.getTasks.select();

// creates memoized selector
const selectTasksData = createSelector(
  selectTasksResult,
  (tasksResult) => tasksResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllTasks,
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  // Pass in a selector that returns the tasks slice of state
} = tasksAdapter.getSelectors(
  (state: RootState) => selectTasksData(state) ?? initialState
);
