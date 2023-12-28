import React, { useMemo, useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  useAddNewProjectMutation,
  useDeleteProjectMutation,
  useUpdateProjectMutation,
} from "../projectsApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { MultiSelect } from "primereact/multiselect";
import { calendarClass, multiSelectClass } from "@/lib/primeTailwind";
import { Calendar } from "primereact/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const addProjectFormSchema = z.object({
  projectName: z.string().min(1, {
    message: "Name must be atleast 1 character",
  }),
  projectDescription: z.string().min(1),
  currentPhase: z.string().min(1),
  phaseStartDate: z.date({ required_error: "Please select a Start Date." }),
  phaseEstimatedEndDate: z.date({
    required_error: "Please select an estimated end Date.",
  }),
  team: z
    .array(z.string().min(1))
    .min(1, "The team must have at least one member"),
  teamLead: z
    .array(z.string().min(1))
    .min(1, "There must be at least one team lead"),
  projectStatus: z.enum(["Active", "Completed", "On Hold"]),
  startDate: z.date({ required_error: "Please select a Start Date." }),
  estimatedEndDate: z.date({
    required_error: "Please select an estimated end Date.",
  }),
  actualEndDate: z.date().optional(),
});

const editProjectFormSchema = z.object({
  projectName: z.string().min(1, {
    message: "Name must be atleast 1 character",
  }),
  projectDescription: z.string().min(1),
  currentPhase: z.string().min(1).optional(),
  phaseStartDate: z.date().optional(),
  phaseEstimatedEndDate: z.date().optional(),
  team: z
    .array(z.string().min(1))
    .min(1, "The team must have at least one member"),
  teamLead: z
    .array(z.string().min(1))
    .min(1, "There must be at least one team lead"),
  projectStatus: z.enum(["Active", "Completed", "On Hold"]),
  startDate: z.date({ required_error: "Please select a Start Date." }),
  estimatedEndDate: z.date({
    required_error: "Please select an estimated end Date.",
  }),
  actualEndDate: z.date().optional(),
});

type ProjectFormValues =
  | z.infer<typeof addProjectFormSchema>
  | z.infer<typeof editProjectFormSchema>;

export type Team = {
  id: string;
  name: string;
};
export type Phase = {
  id: string;
  name: string;
};

interface ProjectFormProps {
  initialData: Project | null;
  team: Team[];
  phases: Phase[];
}
const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  team,
  phases,
}) => {
  const [
    addNewProject,
    // { isLoading, isSuccess, isError, error }
  ] = useAddNewProjectMutation();

  const [
    updateProject,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdateProjectMutation();

  const [
    deleteProject,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteProjectMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const title = initialData ? "Edit Projects" : "Add Projects";
  const description = initialData ? "Edit a Project." : "Add a new Project";
  const action = initialData ? "Save changes" : "Create";
  const defaultValues = initialData
    ? initialData
    : {
        projectName: "",
        projectDescription: "",
        currentPhase: "",
      };

  // Dynamically select schema based on initialData
  const selectedFormSchema = useMemo(() => {
    return initialData ? editProjectFormSchema : addProjectFormSchema;
  }, [initialData]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(selectedFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProjectFormValues) => {
    console.log(data);
    if (!initialData) {
      try {
        const response = await addNewProject({
          ...data,
        }).unwrap();
        // console.log("response in submit", response);
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/dash/projects");
      } catch (error) {
        // conso le.log("Error in submit", error);
        if (typeof error === "object" && error !== null && "data" in error) {
          const errorResponse = error as ErrorResponse;
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error: ${errorResponse.data.message}`,
          });
        }
      }
    } else {
      console.log("Data for edit", data);
      try {
        const updateResponse = await updateProject({
          id: params.id,
          ...data,
        }).unwrap();
        // console.log("updateResponse in submit", updateResponse);
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate("/dash/projects");
      } catch (updateError) {
        // console.log("Update Error", updateError);
        if (
          typeof updateError === "object" &&
          updateError !== null &&
          "data" in updateError
        ) {
          const errorResponse = updateError as ErrorResponse;
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: `Error: ${errorResponse.data.message}`,
          });
        }
      }
    }
  };

  const onDelete = async () => {
    try {
      const deleteResponse = await deleteProject({ id: params.id });
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        navigate("/dash/projects");
      }
    } catch (error) {
      console.log(error);
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorResponse = error as ErrorResponse;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${errorResponse.data.message}`,
        });
      }
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Project/Employee name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Members</FormLabel>
                  <FormControl>
                    <MultiSelect
                      pt={multiSelectClass}
                      display="chip"
                      value={field.value}
                      options={team.map((t) => ({
                        label: t.name,
                        value: t.id,
                      }))}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="label"
                      filter
                      placeholder="Select Team Members"
                      maxSelectedLabels={3}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teamLead"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Team Leads</FormLabel>
                  <FormControl>
                    <MultiSelect
                      display="chip"
                      pt={multiSelectClass}
                      value={field.value}
                      options={team.map((t) => ({
                        label: t.name,
                        value: t.id,
                      }))}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="label"
                      filter
                      placeholder="Select Team Leads"
                      // maxSelectedLabels={3}
                      // className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!initialData && (
              <>
                <FormField
                  control={form.control}
                  name="currentPhase"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phase Status</FormLabel>
                      <Select
                        disabled={false}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              defaultValue={field.value}
                              placeholder="Planning?"
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {phases.map((phase, index) => (
                            <SelectItem key={index} value={phase.id}>
                              <div className="flex items-center">
                                {phase.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phaseStartDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between">
                      <FormLabel>Planning Phase Start Date</FormLabel>
                      <FormControl>
                        <Calendar
                          pt={calendarClass}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          dateFormat="dd/mm/yy"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="phaseEstimatedEndDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex flex-col justify-between">
                      <FormLabel>Planning Phase Estimated End Date</FormLabel>
                      <FormControl>
                        <Calendar
                          pt={calendarClass}
                          value={field.value}
                          onChange={(e) => field.onChange(e.value)}
                          dateFormat="dd/mm/yy"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="projectStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Status</FormLabel>
                  <Select
                    disabled={false}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Active?"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["Active", "Completed", "On Hold"].map(
                        (gender, index) => (
                          <SelectItem key={index} value={gender}>
                            <div className="flex items-center">{gender}</div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Project Start Date</FormLabel>
                  <FormControl>
                    <Calendar
                      pt={calendarClass}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => field.onChange(e.value)}
                      dateFormat="dd/mm/yy"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="estimatedEndDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Project Estimated End Date</FormLabel>
                  <FormControl>
                    <Calendar
                      pt={calendarClass}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => field.onChange(e.value)}
                      dateFormat="dd/mm/yy"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="To Enhance Risk Management in COO"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProjectForm;
