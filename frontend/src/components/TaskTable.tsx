import {
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { TaskForm } from "./TaskForm";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Task } from "./interfaces/Task";
import Toast from "./Toast";
import { DataGrid, GridRenderCellParams } from "@mui/x-data-grid";

const statusOptions = ["To Do", "In Progress", "Completed"];

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().oneOf(statusOptions).required("Status is required"),
});

export const TaskTable = ({
  tasks,
  total,
  page,
  rowsPerPage,
  setPage,
  setRowsPerPage,
  onUpdate,
  onDelete,
}: {
  tasks: Task[];
  total: number;
  page: number;
  rowsPerPage: number;
  setPage: (p: number) => void;
  setRowsPerPage: (r: number) => void;
  onUpdate: (
    id: string,
    status: string,
    title?: string,
    description?: string
  ) => void;
  onDelete: (id: string) => void;
}) => {
  const rowHeight = 52;
  const calculatedHeight = rowsPerPage * rowHeight + 100;

  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", status: "To Do" },
  });

  const handleOpen = (task: Task) => {
    setEditTask(task);
    methods.reset(task);
    setEditOpen(true);
  };

  const handleClose = () => {
    setEditOpen(false);
    setEditTask(null);
  };

  const handleSave = methods.handleSubmit((data) => {
    if (editTask) {
      try {
        onUpdate(editTask.id, data.status, data.title, data.description);
        handleClose();
      } catch {
        setToast({
          open: true,
          message: "Failed to update task.",
          type: "error",
        });
      }
    }
  });

  return (
    <>
      <div style={{ height: calculatedHeight, width: "100%" }}>
        <DataGrid
          rows={tasks}
          columns={[
            {
              field: "title",
              headerName: "Title",
              flex: 1,
              renderCell: (params: GridRenderCellParams<Task>) => (
                <Button variant="text" onClick={() => handleOpen(params.row)}>
                  {params.value}
                </Button>
              ),
            },
            { field: "description", headerName: "Description", flex: 2 },
            {
              field: "status",
              headerName: "Status",
              flex: 1,
              renderCell: (params: GridRenderCellParams<Task>) => (
                <Select
                  value={params.value}
                  onChange={(e) => onUpdate(params.row.id, e.target.value)}
                  size="small"
                  fullWidth
                >
                  {statusOptions.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              ),
            },
            {
              field: "actions",
              headerName: "Actions",
              sortable: false,
              filterable: false,
              flex: 1,
              renderCell: (params: GridRenderCellParams<Task>) => (
                <Button color="error" onClick={() => onDelete(params.row.id)}>
                  Delete
                </Button>
              ),
            },
          ]}
          pagination
          paginationMode="server"
          rowCount={total}
          paginationModel={{ page, pageSize: rowsPerPage }}
          onPaginationModelChange={(model) => {
            setPage(model.page);
            setRowsPerPage(model.pageSize);
          }}
          pageSizeOptions={[5, 10]}
          getRowId={(row: Task) => row.id}
        />
      </div>

      <Dialog open={editOpen} onClose={handleClose} fullWidth>
        <DialogTitle>Edit Task</DialogTitle>
        <FormProvider {...methods}>
          <form onSubmit={handleSave}>
            <DialogContent>
              <TaskForm showButton={false} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button variant="contained" type="submit">
                Save
              </Button>
            </DialogActions>
          </form>
        </FormProvider>
      </Dialog>

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
};
