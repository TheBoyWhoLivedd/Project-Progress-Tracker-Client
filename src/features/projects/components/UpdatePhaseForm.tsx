import React, { useState } from "react";
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
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { useUpdateProjectPhaseMutation } from "../projectsApiSlice";
import { useToast } from "@/components/ui/use-toast";
// import { calendarClass } from "@/lib/primeTailwind";
import { Calendar } from "primereact/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "primereact/multiselect";

const updatePhaseFormSchema = z.object({
  projectName: z.string().min(1, {
    message: "Name must be atleast 1 character",
  }),
  currentPhase: z.string().min(1),
  phaseLead: z
    .array(z.string().min(1))
    .min(1, "There must be at least one team lead"),
  phaseStartDate: z.date({ required_error: "Please select a Start Date." }),
  phaseEstimatedEndDate: z.date({
    required_error: "Please select an estimated end Date.",
  }),
});

type ProjectFormValues = z.infer<typeof updatePhaseFormSchema>;

export type Team = {
  id: string;
  name: string;
};
export type Phase = {
  id: string;
  name: string;
};

interface UpdatePhaseFormProps {
  initialData: Project | null;
  team: Team[];
  phases: Phase[];
}
const UpdatePhaseForm: React.FC<UpdatePhaseFormProps> = ({
  initialData,
  team,
  phases,
}) => {
  const [
    updateProjectPhase,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdateProjectPhaseMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading] = useState(false);

  const title = "Update Project Phase";
  const description = "Advance the Project's Phases";
  const action = initialData ? "Save changes" : "Create";
  const defaultValues = initialData
    ? initialData
    : {
        projectName: "",
        projectDescription: "",
        currentPhase: "",
      };

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(updatePhaseFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: ProjectFormValues) => {
    console.log(data);
    try {
      const response = await updateProjectPhase({
        id: params.id,
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
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
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
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      placeholder="Project name"
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <>
              <FormField
                control={form.control}
                name="currentPhase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase Status</FormLabel>
                    <Select
                      disabled={false}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // form.setValue("phaseLead", []);
                      }}
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
                control={form.control}
                name="phaseLead"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Phase Lead</FormLabel>
                    <FormControl>
                      <MultiSelect
                        display="chip"
                        // pt={multiSelectClass}
                        value={field.value}
                        options={team.map((t) => ({
                          label: t.name,
                          value: t.id,
                        }))}
                        onChange={(e) => field.onChange(e.value)}
                        optionLabel="label"
                        filter
                        placeholder="Select Phase Lead"
                        // maxSelectedLabels={3}
                        // className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="phaseStartDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-between">
                    <FormLabel>Phase Start Date</FormLabel>
                    <FormControl>
                      <Calendar
                        // pt={calendarClass}
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
                    <FormLabel>Phase Estimated End Date</FormLabel>
                    <FormControl>
                      <Calendar
                        // pt={calendarClass}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        dateFormat="dd/mm/yy"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UpdatePhaseForm;
