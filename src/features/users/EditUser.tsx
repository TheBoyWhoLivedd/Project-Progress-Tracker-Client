import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import UserForm from "./components/UserForm";
import { useGetDepartmentsQuery } from "../departments/departmentsApiSlice";

const EditUser = () => {
  const { id } = useParams<string>();

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : undefined,
    }),
  });

  const { data: departments } = useGetDepartmentsQuery();

  console.log(user);

  if (!user || !departments) return <p>Loading...</p>;

  const formattedDepartments = departments.ids.map(
    (id) => departments.entities[id]
  );
  const content = (
    <UserForm initialData={user} departments={formattedDepartments} />
  );

  return content;
};

export default EditUser;
