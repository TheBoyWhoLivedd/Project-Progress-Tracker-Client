import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const ProjectCardSkeleton = () => {
  return (
    <div className="p-4 border border-gray-100 dark:border-gray-800 shadow rounded-md space-y-4 animate-pulse">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-12 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
};

const ProjectsLoadingSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md" />
        </div>
        <Skeleton className="h-1 w-full my-4" />
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {[...Array(6)].map((_, index) => (
            <ProjectCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsLoadingSkeleton;
