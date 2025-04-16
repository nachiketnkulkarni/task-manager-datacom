import { Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

const statusOptions = ["To Do", "In Progress", "Completed"];

export const TaskForm = ({ showButton = true }: { showButton?: boolean }) => {
  const { control } = useFormContext();

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {["title", "description"].map((fieldName) => (
        <Grid size={{ xs: 12, sm: 4 }} key={fieldName}>
          <Controller
            name={fieldName}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                label={fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Grid>
      ))}
      <Grid size={{ xs: 12, sm: 3 }}>
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <Select {...field} fullWidth error={!!fieldState.error}>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </Grid>
      {showButton && (
        <Grid size={{ xs: 12, sm: 2 }}>
          <Button variant="contained" type="submit" fullWidth>
            Add
          </Button>
        </Grid>
      )}
    </Grid>
  );
};
