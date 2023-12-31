import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import ProjectCard from "./ProjectCard";

interface ProjectsClientProps {
  data: Project[];
}

export const ProjectsClient: React.FC<ProjectsClientProps> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-7xl px-4">
        {" "}
        {/* Adjust max-width as per your layout */}
        <div className="flex items-center justify-between">
          <Heading
            title={`Projects (${data.length})`}
            description="Manage your Projects"
          />
          <Button onClick={() => navigate("/dash/projects/new")}>
            <PlusIcon className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
        <Separator />
        {/* Search bar */}
        <div className="my-4">
          <label htmlFor="search" className="sr-only">
            Search projects
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <Input
              type="search"
              name="search"
              id="search"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search projects"
            />
          </div>
        </div>
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((project, index) => (
            <ProjectCard key={index} project={project} /> 
          ))}
        </div>
      </div>
    </div>
  );
};
