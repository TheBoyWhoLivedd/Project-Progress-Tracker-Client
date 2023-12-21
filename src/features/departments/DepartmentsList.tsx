import { DepartmentsClient } from "./components/client";
import { useGetDepartmentsQuery } from "./departmentsApiSlice";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

const DepartmentsList = () => {
  const {
    data: departments,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetDepartmentsQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    let errorMessage = "An error occurred";

    if ("status" in error) {
      const fetchError = error as FetchBaseQueryError;
      if (
        fetchError.data &&
        typeof fetchError.data === "object" &&
        "message" in fetchError.data
      ) {
        errorMessage = (fetchError.data as { message: string }).message;
      }
    }

    return <p className="errmsg">{errorMessage}</p>;
  }

  if (isSuccess) {
    console.log("Departments", departments);
    const transformedData = departments.ids.map((departmentId) => ({
      ...departments.entities[departmentId],
    }));
    // console.log(transformedData);
    return <DepartmentsClient data={transformedData} />;
  }

  return null;
};

export default DepartmentsList;
