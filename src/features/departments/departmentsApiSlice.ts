import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";

export interface Department {
  id: string;
  _id: string;
  departmentName: string;
  departmentDetails: string;
  departmentStatus: boolean;
}

const departmentsAdapter = createEntityAdapter<Department>({});

const initialState = departmentsAdapter.getInitialState();

export const departmentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<EntityState<Department, string>, void>({
      query: () => ({
        url: "/departments",
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
      transformResponse: (responseData: Department[]) => {
        const loadedDepartments = responseData.map((department) => {
          department.id = department._id;
          return department;
        });
        return departmentsAdapter.setAll(initialState, loadedDepartments);
      },
      providesTags: (result: EntityState<Department, string> | undefined) => {
        if (result?.ids) {
          return [
            { type: "Department", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Department" as const, id })),
          ];
        } else return [{ type: "Department", id: "LIST" }];
      },
    }),
    addNewDepartment: builder.mutation({
      query: (initialDepartmentData) => ({
        url: "/departments",
        method: "POST",
        body: {
          ...initialDepartmentData,
        },
      }),
      invalidatesTags: [{ type: "Department", id: "LIST" }],
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...initialDepartmentData }) => ({
        url: `/departments/${id}`,
        method: "PATCH",
        body: {
          ...initialDepartmentData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Department", id: arg.id },
      ],
    }),
    deleteDepartment: builder.mutation({
      query: ({ id }) => ({
        url: `/departments/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Department", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useAddNewDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentsApiSlice;

// Define a type for the Redux state

// returns the query result object
export const selectDepartmentsResult =
  departmentsApiSlice.endpoints.getDepartments.select();

// creates memoized selector
const selectDepartmentsData = createSelector(
  selectDepartmentsResult,
  (departmentsResult) => departmentsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllDepartments,
  selectById: selectDepartmentById,
  selectIds: selectDepartmentIds,
  // Pass in a selector that returns the departments slice of state
} = departmentsAdapter.getSelectors(
  (state: RootState) => selectDepartmentsData(state) ?? initialState
);
