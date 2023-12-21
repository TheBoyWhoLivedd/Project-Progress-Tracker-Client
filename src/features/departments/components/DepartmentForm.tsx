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
  useAddNewDepartmentMutation,
  useDeleteDepartmentMutation,
  useUpdateDepartmentMutation,
} from "../departmentsApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  departmentName: z
    .string()
    .min(1, { message: "Department Name must be at least 1 character" }),
  departmentDetails: z.string(),
  departmentStatus: z.boolean(),
});
type DepartmentFormValues = z.infer<typeof formSchema>;

export interface Department {
  id: string;
  departmentName: string;
  departmentDetails: string;
  departmentStatus: boolean;
}

interface DepartmentFormProps {
  initialData: Department | null;
}
const DepartmentForm: React.FC<DepartmentFormProps> = ({ initialData }) => {
  const [
    addNewDepartment,
    //  { isLoading, isSuccess, isError, error }
  ] = useAddNewDepartmentMutation();

  const [
    updateDepartment,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdateDepartmentMutation();

  const [
    deleteDepartment,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteDepartmentMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit Departments" : "Add Departments";
  const description = initialData
    ? "Edit a Department."
    : "Add a new Department";
  const action = initialData ? "Save changes" : "Create";

  const defaultValues = initialData
    ? initialData
    : {
        departmentName: "",
        departmentDetails: "",
        departmentStatus: true,
      };

  const form = useForm<DepartmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: DepartmentFormValues) => {
    if (!initialData) {
      const { departmentName, departmentDetails, departmentStatus } = data;
      try {
        const response = await addNewDepartment({
          departmentName,
          departmentDetails,
          departmentStatus,
        }).unwrap();
        // console.log("response in submit", response);
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/dash/departments");
      } catch (error: any) {
        // console.log("Error in submit", error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${error.data.message}`,
        });
      }
    } else {
      // console.log("Data for edit", data);
      const { departmentName, departmentDetails, departmentStatus } = data;
      try {
        const updateResponse = await updateDepartment({
          id: params.id,
          departmentName,
          departmentDetails,
          departmentStatus,
        }).unwrap();
        // console.log("updateResponse in submit", updateResponse);
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate("/dash/departments");
      } catch (updateError: any) {
        // console.log("Update Error", updateError);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${updateError.data.message}`,
        });
      }
    }
  };

  const onDelete = async () => {
    try {
      const deleteResponse = await deleteDepartment({ id: params.id });
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        navigate("/dash/departments");
      }
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error: ${error.data.message}`,
      });
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
              name="departmentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Name</FormLabel>
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
            <FormField
              control={form.control}
              name="departmentDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department Details</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Handles Admin Tasks"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentStatus"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Department Status</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default DepartmentForm;
