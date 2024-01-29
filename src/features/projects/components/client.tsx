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
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3500";
  const token = useSelector(selectCurrentToken);
  const downloadReport = () => {
    fetch(`${apiUrl}/reports/generate-report`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // console.log("Received blob size:", blob.size);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "report.xlsx";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 100); // Remove the link after a short delay
      })
      .catch((error) => {
        console.error("Error generating report", error);
        alert("Could not generate report");
      });

    //   fetch("http://localhost:3500/reports/generate-report", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log(data);
    //     });
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
