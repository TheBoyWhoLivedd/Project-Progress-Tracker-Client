import {
  createSelector,
  createEntityAdapter,
  EntityState,
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { RootState } from "@/app/store";

export interface Phase {
  id: string;
  _id: string;
  phaseName: string;
  phaseDescription: string;

}

const phasesAdapter = createEntityAdapter<Phase>({});

const initialState = phasesAdapter.getInitialState();

export const phasesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPhases: builder.query<EntityState<Phase, string>, void>({
      query: () => ({
        url: "/phases",
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
      transformResponse: (responseData: Phase[]) => {
        const loadedPhases = responseData.map((phase) => {
          phase.id = phase._id;
          return phase;
        });
        return phasesAdapter.setAll(initialState, loadedPhases);
      },
      providesTags: (result: EntityState<Phase, string> | undefined) => {
        if (result?.ids) {
          return [
            { type: "Phase", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Phase" as const, id })),
          ];
        } else return [{ type: "Phase", id: "LIST" }];
      },
    }),
    addNewPhase: builder.mutation({
      query: (initialPhaseData) => ({
        url: "/phases",
        method: "POST",
        body: {
          ...initialPhaseData,
        },
      }),
      invalidatesTags: [{ type: "Phase", id: "LIST" }],
    }),
    updatePhase: builder.mutation({
      query: ({ id, ...initialPhaseData }) => ({
        url: `/phases/${id}`,
        method: "PATCH",
        body: {
          ...initialPhaseData,
        },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Phase", id: arg.id },
      ],
    }),
    deletePhase: builder.mutation({
      query: ({ id }) => ({
        url: `/phases/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: "Phase", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetPhasesQuery,
  useAddNewPhaseMutation,
  useUpdatePhaseMutation,
  useDeletePhaseMutation,
} = phasesApiSlice;

// Define a type for the Redux state

// returns the query result object
export const selectPhasesResult =
  phasesApiSlice.endpoints.getPhases.select();

// creates memoized selector
const selectPhasesData = createSelector(
  selectPhasesResult,
  (phasesResult) => phasesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPhases,
  selectById: selectPhaseById,
  selectIds: selectPhaseIds,
  // Pass in a selector that returns the phases slice of state
} = phasesAdapter.getSelectors(
  (state: RootState) => selectPhasesData(state) ?? initialState
);
