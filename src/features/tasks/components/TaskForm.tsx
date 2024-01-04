import React, { useState } from "react";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  CaretSortIcon,
  CheckIcon,
  CrossCircledIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  useAddNewTaskMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
  // useUploadFileMutation,
} from "../tasksApiSlice";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
// import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "primereact/calendar";
// import { calendarClass } from "@/lib/primeTailwind";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/features/auth/authSlice";
import { BlockNoteEditor } from "@blocknote/core";
import {
  BlockNoteView,
  Theme,
  darkDefaultTheme,
  useBlockNote,
} from "@blocknote/react";
import "@blocknote/core/style.css";
import { useResolvedTheme } from "@/components/theme-provider";

const formSchema = z.object({
  taskName: z.string().min(1, {
    message: "Name must be at least 1 character",
  }),
  taskDescription: z.string().min(1, {
    message: "Description must be at least 1 character",
  }),
  associatedPhase: z.string().min(1),
  assignedTo: z.string().min(1),
  taskWeight: z
    .number()
    .min(1, { message: "Task weight must be at least 1" })
    .max(5, { message: "Task weight must be no more than 5" }),
  status: z.enum(["Backlog", "To Do", "In Progress", "Done", "Cancelled"]),
  attachments: z
    .array(
      z.object({
        url: z.string(),
        name: z.string(),
      })
    )
    .optional(),
  startDate: z.date({ required_error: "Please select a Start Date." }),
  dueDate: z.date({
    required_error: "Please select an estimated end Date.",
  }),
});

type TaskFormValues = z.infer<typeof formSchema>;

type Team = {
  id: string;
  name: string;
};
type Phase = {
  id: string;
  name: string;
};

interface TaskFormProps {
  initialData: Task | null;
  team: Team[];
  phases: Phase[];
}

const FilePill = ({
  name,
  onRemove,
  url,
}: {
  name: string;
  onRemove: () => void;
  url: string;
}) => {
  const MAX_LENGTH = 20;
  const displayName =
    name.length > MAX_LENGTH ? `${name.substring(0, MAX_LENGTH - 3)}...` : name;

  return (
    <div className="flex items-center py-1 px-2 mr-2  mb-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white/80 text-sm font-semibold  rounded-full hover:opacity-80">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-grow"
      >
        {displayName}
      </a>
      <button onClick={onRemove} className="ml-2">
        <CrossCircledIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const TaskForm: React.FC<TaskFormProps> = ({ initialData, team, phases }) => {
  const [
    addNewTask,
    // { isLoading, isSuccess, isError, error }
  ] = useAddNewTaskMutation();
  // const [
  //   uploadFile,
  //   // { isLoading, isSuccess, isError, error }
  // ] = useUploadFileMutation();

  const [
    updateTask,
    // {
    //   isLoading: isUpdateLoading,
    //   isSuccess: isUpdateSuccess,
    //   isError: isUpdateError,
    //   error: updateError,
    // },
  ] = useUpdateTaskMutation();

  const [
    deleteTask,
    // { isSuccess: isDeleteSuccess, isError: isDeleteError, error: deleteError },
  ] = useDeleteTaskMutation();

  const { projectId, taskId } = useParams();

  // console.log(projectId,taskId);
  const navigate = useNavigate();
  const { toast } = useToast();
  const theme = useResolvedTheme();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Define the initial content for the editor
  const initialEditorContent = initialData?.taskDescription
    ? JSON.parse(initialData.taskDescription)
    : undefined;

  // Initialize the editor with custom options
  const editor: BlockNoteEditor = useBlockNote({
    editable: true,
    initialContent: initialEditorContent,
    onEditorContentChange: (editor) => {
      const updatedContent = JSON.stringify(editor.topLevelBlocks, null, 2);
      // console.log("Updated content:", updatedContent);
      form.setValue("taskDescription", updatedContent);
    },
  });

  const backgroundColor = "#020817";
  // Custom dark theme
  const customDarkTheme = {
    ...darkDefaultTheme,
    colors: {
      ...darkDefaultTheme.colors,
      editor: {
        ...darkDefaultTheme.colors.editor,
        background: backgroundColor,
      },
      menu: {
        ...darkDefaultTheme.colors.editor,
        background: backgroundColor,
      },
    },
  } satisfies Theme;

  // Initialize fileInfos state with initial attachments
  const initialAttachments =
    initialData?.attachments?.map((attachment) => ({
      url: attachment.url,
      name: attachment.name,
    })) || [];
  const [fileInfos, setFileInfos] =
    useState<{ url: string; name: string }[]>(initialAttachments);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const user = team.find((user) => user.id === initialData?.assignedTo);
  const initialUserName = user ? user.name : "";
  const [selectedUserName, setSelectedUserName] = useState(initialUserName);

  const title = initialData ? "Edit Tasks" : "Add Tasks";
  const description = initialData ? "Edit a Task." : "Add a new Task";
  const action = initialData ? "Save changes" : "Create";
  const defaultValues = initialData
    ? initialData
    : {
        taskName: "",
        taskDescription: "",
        associatedPhase: "",
        assignedTo: "",
        taskWeight: 1,
        status: "To Do" as
          | "Backlog"
          | "To Do"
          | "In Progress"
          | "Done"
          | "Cancelled",
        startDate: new Date(),
        dueDate: new Date(),
        attachments: [],
      };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  const token = useSelector(selectCurrentToken);
  const handleUploadClick = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      // console.log("selectedFiles", selectedFiles);
      selectedFiles.forEach((file) => {
        formData.append("file", file);
      });

      const response = await fetch("http://localhost:3500/upload", {
        method: "POST",
        body: formData,
        headers: {
          // Set the authorization token
          Authorization: `Bearer ${token}`,
          // Don't set the Content-Type header for FormData
          // It's automatically set by the browser including the correct boundary
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const newFileInfos = data.results.map(
        (result: { url: string; originalName: string }) => ({
          url: result.url,
          name: result.originalName,
        })
      );
      setFileInfos((prevInfos) => [...prevInfos, ...newFileInfos]);
      form.setValue("attachments", [...fileInfos, ...newFileInfos]);
      setSelectedFiles([]);
    } catch (error) {
      if (typeof error === "object" && error !== null && "data" in error) {
        const errorResponse = error as ErrorResponse;
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: `Error: ${errorResponse.data.message}`,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: TaskFormValues) => {
    console.log(data);
    if (!initialData) {
      setLoading(true);
      try {
        const response = await addNewTask({
          projectId,
          ...data,
        }).unwrap();
        // console.log("response in submit", response);
        toast({
          title: "Success",
          description: response.message,
        });
        navigate(`/dash/projects/${projectId}/tasks`);
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
      } finally {
        setLoading(false);
      }
    } else {
      // console.log("Data for edit", data);
      setLoading(true);
      try {
        const updateResponse = await updateTask({
          projectId: projectId,
          taskId: taskId,
          ...data,
        }).unwrap();
        // console.log("updateResponse in submit", updateResponse);
        toast({
          title: "Success",
          description: updateResponse.message,
        });
        navigate(`/dash/projects/${projectId}/tasks`);
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
      } finally {
        setLoading(false);
      }
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      const deleteResponse = await deleteTask({
        projectId: projectId,
        taskId: taskId,
      });
      if ("data" in deleteResponse && deleteResponse.data) {
        toast({
          title: "Success",
          description: deleteResponse.data.message,
        });
        navigate(`/dash/projects/${projectId}/tasks`);
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
    } finally {
      setLoading(false);
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
              name="taskName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Enter Task Title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="associatedPhase"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phase</FormLabel>
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
                          placeholder="Pick phase"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {phases.map((phase, index) => (
                        <SelectItem key={index} value={phase.id}>
                          <div className="flex items-center">{phase.name}</div>
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Status</FormLabel>
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
                      {[
                        "Backlog",
                        "To Do",
                        "In Progress",
                        "Done",
                        "Cancelled",
                      ].map((gender, index) => (
                        <SelectItem key={index} value={gender}>
                          <div className="flex items-center">{gender}</div>
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
              name="assignedTo"
              render={({ field }) => {
                return (
                  <>
                    <FormItem className="flex flex-col justify-between">
                      <FormLabel>Task Assignee</FormLabel>
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
                              {selectedUserName || "Select Task Assignee"}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search Users."
                              className="h-9"
                            />
                            <CommandEmpty>No User found.</CommandEmpty>
                            <CommandGroup>
                              {team.map((user) => (
                                <CommandItem
                                  value={user.name}
                                  key={user.id}
                                  onSelect={() => {
                                    form.setValue("assignedTo", user.id, {
                                      shouldValidate: true,
                                    });

                                    setSelectedUserName(user.name);
                                  }}
                                >
                                  {user.name}
                                  <CheckIcon
                                    className={cn(
                                      "ml-auto h-4 w-4",
                                      (
                                        initialData
                                          ? user.name === selectedUserName
                                          : user.id == field.value
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
              name="taskWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Weight</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="Task Weight (1-5)"
                      value={field.value}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? value : Number(value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Task Start Date</FormLabel>
                  <FormControl>
                    <Calendar
                      // pt={calendarClass}
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => field.onChange(e.value)}
                      dateFormat="dd/mm/yy"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-col justify-between">
                  <FormLabel>Task Estimated due Date</FormLabel>
                  <FormControl>
                    <Calendar
                      // pt={calendarClass}
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
                name="taskDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Details</FormLabel>
                    <FormControl>
                      <BlockNoteView
                        {...field}
                        editor={editor}
                        theme={theme === "dark" ? customDarkTheme : "light"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-3">
              <FormField
                control={form.control}
                name="attachments"
                render={() => (
                  <FormItem>
                    <FormLabel>Files</FormLabel>
                    {fileInfos.length > 0 && (
                      <div>
                        <div className="flex flex-wrap mt-2">
                          {fileInfos.map((info, index) => (
                            <FilePill
                              url={info.url}
                              key={index}
                              name={info.name}
                              onRemove={() => {
                                const newFileInfos = fileInfos.filter(
                                  (_, i) => i !== index
                                );
                                setFileInfos(newFileInfos);
                                form.setValue("attachments", newFileInfos);
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    <FormControl>
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            setSelectedFiles(Array.from(e.target.files));
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Upload Documents</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  disabled={!selectedFiles.length || uploading}
                  onClick={handleUploadClick}
                >
                  Upload Files
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    form.setValue("attachments", []);
                    setFileInfos([]);
                  }}
                >
                  Clear Uploaded Files
                </Button>
              </div>

              {uploading && <div>Uploading files...</div>}
            </div>
          </div>
          <Button
            disabled={loading || uploading}
            className="ml-auto"
            type="submit"
          >
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default TaskForm;
