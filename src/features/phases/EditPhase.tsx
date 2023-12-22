import { useParams } from "react-router-dom";
import { useGetPhasesQuery } from "./phasesApiSlice";
import PhaseForm from "./components/PhaseForm";

const EditPhase = () => {
  const { id } = useParams<string>();

  const { phase } = useGetPhasesQuery(undefined, {
    selectFromResult: ({ data }) => ({
      phase: id ? data?.entities[id] : undefined,
    }),
  });

  // const phase = useSelector((state: RootState) =>
  //   id !== undefined ? selectPhaseById(state, id) : null
  // );

  console.log(phase);

  if (!phase) return <p>Loading...</p>;

  const content = <PhaseForm initialData={phase} />;

  return content;
};

export default EditPhase;
