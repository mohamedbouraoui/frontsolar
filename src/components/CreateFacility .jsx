import React from "react";
import { useMutation } from "@apollo/client";
import { CREATE_FACILITY } from "../graphql/mutations";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { GET_FACILITIES_BY_USER } from "../graphql/queries";
import { useNavigate } from "react-router-dom";

function CreateFacility() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      nominalPower: "",
      file: null,
    },
  });

  const [errorMessage, setErrorMessage] = React.useState("");
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const [createFacility] = useMutation(CREATE_FACILITY, {
    onCompleted: () => {
      onCancel();
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    },
    refetchQueries: [{ query: GET_FACILITIES_BY_USER }],
  });

  const onSubmit = (data) => {
    createFacility({
      variables: {
        input: {
          name: data.name,
          nominalPower: parseFloat(data.nominalPower),
          file: data.file,
        },
      },
    });
  };

  const handleFileChange = (e, onChange) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const onCancel = () => {
    navigate("/");
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Create New Facility
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Facility Name Input */}
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Facility Name is required",
            validate: (value) =>
              value?.trim().length > 0 || "Name cannot be just whitespace",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Facility Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              required
            />
          )}
        />

        {/* Nominal Power Input */}
        <Controller
          name="nominalPower"
          control={control}
          rules={{
            required: "Nominal Power is required",
            min: {
              value: 0,
              message: "Nominal Power must be at least 0",
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Nominal Power (kW)"
              type="number"
              inputProps={{ min: 0 }}
              error={!!errors.nominalPower}
              helperText={errors.nominalPower?.message}
              required
            />
          )}
        />

        {/* File Upload Input */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Upload a CSV file with solar data (optional):
          </Typography>
          <Controller
            name="file"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFileChange(e, field.onChange)}
              />
            )}
          />
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            You can upload the file now or later.
          </Typography>
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
        >
          Create Facility
        </Button>

        {/* Cancel Button */}
        <Button
          variant="outlined"
          color="secondary"
          onClick={onCancel}
          sx={{ mt: 2 }}
        >
          Cancel
        </Button>
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default CreateFacility;
