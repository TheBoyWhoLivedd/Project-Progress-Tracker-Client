
import UserForm from "./components/UserForm";
import { useGetDepartmentsQuery } from "../departments/departmentsApiSlice";

const AddUser = () => {
  const { data: departments } = useGetDepartmentsQuery();

  let content = null;

  if (!departments) return <p>Loading...</p>;

  const formattedDepartments = departments.ids.map(
    (id) => departments.entities[id]
  );

  // console.log("Formatted", formattedDepartments);

  content = <UserForm initialData={null} departments={formattedDepartments} />;

  return content;
};

export default AddUser;
