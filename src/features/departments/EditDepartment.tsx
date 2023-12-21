import { useParams } from "react-router-dom";
import { useGetDepartmentsQuery } from "./departmentsApiSlice";
import DepartmentForm from "./components/DepartmentForm";

const EditDepartment = () => {
  const { id } = useParams<string>();

  const { department } = useGetDepartmentsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      department: id ? data?.entities[id] : undefined,
    }),
  });

  // const department = useSelector((state: RootState) =>
  //   id !== undefined ? selectDepartmentById(state, id) : null
  // );

  console.log(department);

  if (!department) return <p>Loading...</p>;

  const content = <DepartmentForm initialData={department} />;

  return content;
};

export default EditDepartment;
