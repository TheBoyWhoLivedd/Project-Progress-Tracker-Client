import { useGetDepartmentsQuery } from "../departments/departmentsApiSlice";
import { UsersClient } from "./components/client";
import { useGetUsersQuery } from "./usersApiSlice";
interface DepartmentEntity {
  _id: string;
  id: string;
  departmentName: string;
  departmentDetails: string;
  departmentStatus: boolean;
}

const UsersList = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    isSuccess: isSuccessUsers,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });
  const {
    data: departments,
    isLoading: isLoadingDepartments,
    isSuccess: isSuccessDepartments,
  } = useGetDepartmentsQuery();

  if (isLoadingUsers || isLoadingDepartments) return <p>Loading...</p>;


  if (isSuccessUsers && isSuccessDepartments) {
    // console.log("Users", users);
    // console.log("Departments", departments);
    const departmentMap: Record<string, string> = departments.ids.reduce(
      (acc, id) => {
        const department = departments.entities[id] as DepartmentEntity;
        acc[department._id] = department.departmentName;
        return acc;
      },
      {} as Record<string, string>
    );
    // console.log("Department Map", departmentMap); // Debugging log

    const transformedData = users.ids.map((userId) => {
      const user = users.entities[userId];
      const departmentName = departmentMap[user.departmentId] || "Unknown";
      // console.log(`User: ${user.name}, Department: ${departmentName}`); // Debugging log

      return {
        ...user,
        departmentName: departmentName,
      };
    });

    return <UsersClient data={transformedData} />;
  }

  return null;
};

export default UsersList;
