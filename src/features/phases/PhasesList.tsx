import { PhasesClient } from "./components/client";
import { useGetPhasesQuery } from "./phasesApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const PhasesList = () => {
  const {
    data: phases,
    isLoading,
    isSuccess,
  } = useGetPhasesQuery(undefined, {
    pollingInterval: 60000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <p>Loading...</p>;


  if (isSuccess) {
    console.log("Phases", phases);
    const transformedData = phases.ids.map((phaseId) => ({
      ...phases.entities[phaseId],
    }));
    // console.log(transformedData);
    return <PhasesClient data={transformedData} />;
  }

  return null;
};

export default PhasesList;
