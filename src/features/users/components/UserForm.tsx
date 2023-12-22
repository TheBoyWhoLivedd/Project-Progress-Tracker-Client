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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon, TrashIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  useAddNewUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../usersApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name must be atleast 1 character",
  }),
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().optional(),
  hasAdminRights: z.boolean().default(false).optional(),
  departmentId: z.string().min(1),
});

type UserFormValues = z.infer<typeof formSchema>;

export interface User {
  name: string;
  email: string;
  password?: string;
  departmentId: string;
  hasAdminRights: boolean;
}
export type Department = {
  id: string;
  departmentName: string;
};

interface UserFormProps {
  initialData: User | null;
  departments: Department[];
}
const UserForm: React.FC<UserFormProps> = ({ initialData, departments }) => {
  const [
    addNewUser,
    // { isLoading, isSuccess, isError, error }
  ] = useAddNewUserMutation();

  const [
    updateUser,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdateUserMutation();

  const [
    deleteUser,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteUserMutation();

  const params = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const department = departments.find(
    (dep) => dep.id === initialData?.departmentId
  );
  const initialDepartmentName = department ? department.departmentName : "";
  const [selectedDepartmentName, setSelectedDepartmentName] = useState(
    initialDepartmentName
  );

  const title = initialData ? "Edit Users" : "Add Users";
  const description = initialData ? "Edit a User." : "Add a new User";
  const action = initialData ? "Save changes" : "Create";
  const defaultValues = initialData
    ? initialData
    : {
        name: "",
        password: "12345",
        departmentId: "",
        hasAdminRights: false,
      };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: UserFormValues) => {
    if (!initialData) {
      try {
        const response = await addNewUser({
          ...data,
        }).unwrap();
        // console.log("response in submit", response);
        toast({
          title: "Success",
          description: response.message,
        });
        navigate("/dash/users");
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
      // console.log("Data for edit", data);
      try {
        const updateResponse = await updateUser({
          id: params.id,
          ...data,
        }).unwrap();
        // console.log("updateResponse in submit", updateResponse);
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate("/dash/users");
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
      const deleteResponse = await deleteUser({ id: params.id });
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        navigate("/dash/users");
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="User/Employee name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`Default Password ${
                    initialData ? "(Empty Means No Change)" : ""
                  }`}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={loading}
                      placeholder="Default Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => {
                return (
                  <>
                    <FormItem className="flex flex-col justify-between">
                      <FormLabel>Department</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {selectedDepartmentName ||
                                "Select Direct Department"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Departments."
                              className="h-9"
                            />
                            <CommandEmpty>No Department found.</CommandEmpty>
                            <CommandGroup>
                              {departments.map((department) => (
                                <CommandItem
                                  value={department.departmentName}
                                  key={department.id}
                                  onSelect={() => {
                                    form.setValue(
                                      "departmentId",
                                      department.id,
                                      { shouldValidate: true }
                                    );

                                    setSelectedDepartmentName(
                                      department.departmentName
                                    );
                                  }}
                                >
                                  {department.departmentName}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      (
                                        initialData
                                          ? department.departmentName ===
                                            selectedDepartmentName
                                          : department.id == field.value
                                      )
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  </>
                );
              }}
            />
            <FormField
              control={form.control}
              name="hasAdminRights"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Can User Pass? (IsAdmin)</FormLabel>
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

export default UserForm;
