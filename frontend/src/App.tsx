import { useEffect, useState, useCallback } from "react";
import { Box, CircularProgress, Container, Typography } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TaskForm } from "./components/TaskForm";
import { TaskTable } from "./components/TaskTable";
import api from "./config/axios";
import Toast from "./components/Toast";

const schema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  status: yup.string().oneOf(["To Do", "In Progress", "Completed"]).required(),
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    type: "success" | "error";
  }>({ open: false, message: "", type: "success" });
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { title: "", description: "", status: "To Do" },
  });

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/task", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      const {
        data: { data },
      } = res;
      const { tasks, total } = data;
      setTotal(total);
      setTasks(tasks);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
      setToast({
        open: true,
        message: `Fetch error with ${err}.`,
        type: "error",
      });
      setTasks([]); // fallback
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onSubmit = async (data: any) => {
    try {
      await api.post("/task", data);
      setToast({
        open: true,
        message: `Task added successfully.`,
        type: "success",
      });
      methods.reset();
      fetchTasks();
    } catch (err: any) {
      console.error("Add error", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Unknown error occurred while adding task.";
      setToast({
        open: true,
        message: `${errorMsg}`,
        type: "error",
      });
    }
  };

  const updateTask = async (
    id: string,
    status: string,
    title?: string,
    description?: string
  ) => {
    try {
      await api.put(`/task/${id}`, { title, description, status });
      setToast({
        open: true,
        message: `Task updated successfully.`,
        type: "success",
      });
      fetchTasks();
    } catch (err: any) {
      console.error("Add error", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Unknown error occurred while adding task.";
      setToast({
        open: true,
        message: `${errorMsg}`,
        type: "error",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/task/${id}`);
      setToast({
        open: true,
        message: `Task deleted successfully.`,
        type: "success",
      });
      fetchTasks();
    } catch (err: any) {
      console.error("Add error", err);
      const errorMsg =
        err?.response?.data?.message ||
        "Unknown error occurred while adding task.";
      setToast({
        open: true,
        message: `${errorMsg}`,
        type: "error",
      });
    }
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Task Manager
      </Typography>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <TaskForm />
        </form>
      </FormProvider>
      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TaskTable
          tasks={tasks}
          total={total}
          page={page}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          setRowsPerPage={setRowsPerPage}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}

      <Toast
        open={toast.open}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </Container>
  );
}
