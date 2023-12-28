import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export default function ProjectCard({ project }: { project: Project }) {
  const navigate = useNavigate();
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/dash/projects/${project.id}`);
  };

  return (
    <div className="block w-full">
      <Card
        onClick={() => navigate(`/dash/projects/${project.id}/tasks`)}
        className="m-4 cursor-pointer hover:shadow-lg transition duration-200 ease-in-out bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg group relative min-h-[350px] flex flex-col dark:hover:opacity-80"
      >
        <Button
          onClick={handleEditClick}
          size="icon"
          variant="ghost"
          className="absolute top-0 right-0 m-4 opacity-0 group-hover:opacity-100 md:opacity-100"
        >
          <Pencil2Icon className="w-6 h-6" />
        </Button>
        <CardHeader className="bg-blue-200 dark:bg-blue-900">
          <div className="flex justify-between items-center p-4">
            <div className="">
              <CardTitle className="font-bold text-lg line-clamp-2">
                {project.projectName}
              </CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-300 line-clamp-2">
                {project.projectDescription}
              </CardDescription>
            </div>
            <TypeIcon className="w-6 h-6" />
          </div>
        </CardHeader>
        <CardContent className="p-4 text-sm border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-6 h-6" />
            <span className="text-gray-900 dark:text-gray-100">
              Phase: {project.currentPhaseName}
            </span>
          </div>
        </CardContent>
        <CardContent className="p-4 text-sm border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BadgeIcon className="w-6 h-6" />
            <span className="text-gray-900 dark:text-gray-100">
              Status: {project.projectStatus}
            </span>
          </div>
        </CardContent>
        <div className="mt-auto">
          <CardFooter className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700">
            <div className="flex items-center space-x-2">
              <MilestoneIcon className="w-6 h-6" />
              <span className="text-gray-900 dark:text-gray-100">
                Progress:
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-3/4" />
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}

function BadgeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
    </svg>
  );
}

function MilestoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
      <path d="M12 13v8" />
      <path d="M12 3v3" />
    </svg>
  );
}

function TypeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" x2="15" y1="20" y2="20" />
      <line x1="12" x2="12" y1="4" y2="20" />
    </svg>
  );
}
