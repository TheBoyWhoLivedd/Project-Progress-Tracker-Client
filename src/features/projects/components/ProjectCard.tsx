import { Button } from "@/components/ui/button";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import useIsTeamLead from "@/hooks/useIsTeamLead";
import { Pencil2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CircularProgress({ completionRate }: { completionRate: number }) {
  const normalizedRate = Math.min(Math.max(completionRate, 0), 100); // Ensure rate is between 0 and 100
  const circumference = 2 * Math.PI * 50; // Assuming the radius is 50 for the circle
  const strokeDashoffset = ((100 - normalizedRate) / 100) * circumference;

  return (
    <svg width="50" height="50" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="lightgray"
        strokeWidth="10"
        fill="transparent"
      />
      <circle
        cx="60"
        cy="60"
        r="50"
        stroke="green"
        strokeWidth="10"
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="69" // Adjust this value to center the text vertically
        textAnchor="middle"
        fontSize="40"
        fill="green"
      >
        {Math.ceil(normalizedRate)}%
      </text>
    </svg>
  );
}

export default function ProjectCard({ project }: { project: Project }) {
  const { userId } = useAuth();
  const isLead = useIsTeamLead(userId, project._id);
  // console.log(`is Lead in ${project.projectName} is ${isLead}`)
  const navigate = useNavigate();
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    navigate(`/dash/projects/${project.id}`);
  };

  const [animatedWidth, setAnimatedWidth] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    // This timeout is to ensure the animation starts after the component mounts
    const timeout = setTimeout(() => {
      setAnimatedWidth(project.projectCompletionRate);
    }, 100);

    return () => clearTimeout(timeout);
  }, [project.projectCompletionRate]);

  useEffect(() => {
    function handleResize() {
      setIsLargeScreen(window.innerWidth >= 768);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  console.log("project in card", project);

  return (
    <div className="block w-full">
      <Card
        onClick={() => navigate(`/dash/projects/${project.id}/tasks`)}
        className="m-4 cursor-pointer hover:shadow-lg transition duration-200 ease-in-out bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-200 dark:border-gray-800 rounded-lg group relative min-h-[300px] flex flex-col dark:hover:opacity-80"
      >
        {isLead && (
          <Button
            onClick={handleEditClick}
            size="icon"
            variant="ghost"
            className="absolute top-0 right-0 m-4 opacity-0 group-hover:opacity-100 md:opacity-100"
          >
            <Pencil2Icon className="w-6 h-6" />
          </Button>
        )}
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
        <CardContent className="p-0">
          <div className="relative w-full mb-6 ">
            <div className="absolute inset-0 bg-gray-200 h-2"></div>
            <div
              className="absolute left-0 top-0 h-2 bg-green-600 transition-all duration-500"
              style={{ width: `${animatedWidth}%` }}
            ></div>

            <span
              className="absolute whitespace-nowrap bg-green-600 text-white text-xs rounded-b-sm px-2 py-1 transition-all duration-500"
              style={{
                left:
                  animatedWidth >= (isLargeScreen ? 10 : 15)
                    ? `${animatedWidth}%`
                    : "0%",
                bottom: "-2rem",
                transform:
                  animatedWidth >= (isLargeScreen ? 10 : 15)
                    ? "translateX(-100%)"
                    : "translateX(0)",
              }}
            >
              {`${Math.ceil(animatedWidth)}%`}
            </span>
          </div>
        </CardContent>

        <CardContent className="p-4 text-sm border-t-none border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <TypeIcon className="w-6 h-6" />
            <span className="text-gray-900 dark:text-gray-100">
              Phase: {project.currentPhaseName}
            </span>
            <div className="">
              <CircularProgress
                completionRate={
                  project.phasesHistory.length > 0
                    ? project.phasesHistory[project.phasesHistory.length - 1]
                        ?.phaseCompletionRate
                    : 0
                }
              />
            </div>
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

// function MilestoneIcon(props: React.SVGProps<SVGSVGElement>) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z" />
//       <path d="M12 13v8" />
//       <path d="M12 3v3" />
//     </svg>
//   );
// }

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
