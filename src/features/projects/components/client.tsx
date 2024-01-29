import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { ProjectColumn, ProjectColumns } from "./columns";
import { Separator } from "@/components/ui/separator";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";
interface ProjectsClientProps {
  data: ProjectColumn[];
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({ data }) => {
  const token = useSelector(selectCurrentToken);
  const downloadReport = () => {
    // fetch("http://localhost:3500/generate-report")
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     // Create a link element, use it to download the file and remove it
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download = "report.xlsx";
    //     document.body.appendChild(a);
    //     a.click();
    //     a.remove();
    //   })
    //   .catch(() => alert("Could not generate report"));

    fetch("http://localhost:3500/reports/generate-report", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={` All Projects (${data.length})`}
          description="Projects Report"
        />
        <Button onClick={downloadReport}>
          <PlusIcon className="mr-2 h-4 w-4" /> Generate Report
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="projectName" columns={ProjectColumns} data={data} />
    </>
  );
};
