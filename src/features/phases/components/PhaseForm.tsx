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
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  useAddNewPhaseMutation,
  useDeletePhaseMutation,
  useUpdatePhaseMutation,
} from "../phasesApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  phaseName: z
    .string()
    .min(1, { message: "Phase Name must be at least 1 character" }),
  phaseDescription: z.string(),
  // status: z.enum(["Active", "Completed", "On Hold"]),
  // startDate: z.date({ required_error: "Please select a Start Date." }),
  // estimatedEndDate: z.date({
  //   required_error: "Please select an estimated end Date.",
  // }),
  // actualEndDate: z.date().optional(),
});
type PhaseFormValues = z.infer<typeof formSchema>;

export interface Phase {
  id: string;
  phaseName: string;
  phaseDescription: string;
  // startDate: Date;
  // estimatedEndDate: Date;
  // actualEndDate?: Date;
  // status: "Active" | "Completed" | "On Hold";
}

interface PhaseFormProps {
  initialData: Phase | null;
}
const PhaseForm: React.FC<PhaseFormProps> = ({ initialData }) => {
  const [
    addNewPhase,
    //  { isLoading, isSuccess, isError, error }
  ] = useAddNewPhaseMutation();

  const [
    updatePhase,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdatePhaseMutation();

  const [
    deletePhase,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeletePhaseMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const title = initialData ? "Edit Phases" : "Add Phases";
  const description = initialData ? "Edit a Phase." : "Add a new Phase";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        phaseName: "",
        phaseDescription: "",
        // status: "Active" as const,
        // startDate: new Date(),
        // estimatedEndDate: "" as unknown as Date,
      };

  const form = useForm<PhaseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: PhaseFormValues) => {
    console.log(data);
    if (!initialData) {
      const { phaseName, phaseDescription } = data;
      try {
        const response = await addNewPhase({
          phaseName,
          phaseDescription,
        }).unwrap();
        // console.log("response in submit", response);
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/dash/phases");
      } catch (error) {
        // console.log("Error in submit", error);
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
      // console.log("Data for edit", data);
      const { phaseName, phaseDescription } = data;
      try {
        const updateResponse = await updatePhase({
          id: params.id,
          phaseName,
          phaseDescription,
        }).unwrap();
        // console.log("updateResponse in submit", updateResponse);
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate("/dash/phases");
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
      const deleteResponse = await deletePhase({ id: params.id });
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        navigate("/dash/phases");
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
              name="phaseName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="status"
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
                          placeholder="Officer?"
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
                  <FormLabel>Start Date</FormLabel>
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
              name="estimatedEndDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Estimated End Date</FormLabel>
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
              name="actualEndDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Actual End Date</FormLabel>
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
            /> */}
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="phaseDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase Details</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={loading}
                        placeholder="During this phase, the team develops and completes deliverables."
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

export default PhaseForm;
