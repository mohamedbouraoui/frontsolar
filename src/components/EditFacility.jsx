import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { UPDATE_FACILITY } from "../graphql/mutations";
import { useForm, Controller } from "react-hook-form";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { GET_FACILITIES_BY_USER, GET_FACILITY_BY_ID } from "../graphql/queries";
import { useNavigate, useParams } from "react-router-dom";

function EditFacility() {
  const navigate = useNavigate();
  const { facilityId } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  // Fetch facility data
  const { loading, data } = useQuery(GET_FACILITY_BY_ID, {
    variables: { id: facilityId },
    fetchPolicy: 'network-only'
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset, 
  } = useForm({
    defaultValues: {
      name: "",
      nominalPower: "",
      file: null,
    },
  });

  useEffect(() => {
    if (data?.facilityById) {
      reset({
        name: data.facilityById.name || "",
        nominalPower: data.facilityById.nominalPower || "",
        file: null,
      });
    }
  }, [data, reset]);

 

  const [updateFacility] = useMutation(UPDATE_FACILITY, {
    onCompleted: () => {
      onCancel();
    },
    onError: (error) => {
      setErrorMessage(error.message);
      setOpenSnackbar(true);
    },
    refetchQueries: [{ query: GET_FACILITIES_BY_USER }],
  });

  const onSubmit = (formData) => {
    const isAtLeastOneFieldFilled = Object.values(formData).some(
      (value) => value !== "" && value !== null
    );

    if (!isAtLeastOneFieldFilled) {
      setErrorMessage("At least one field must be filled.");
      setOpenSnackbar(true);
      return;
    }

    updateFacility({
      variables: {
        input: {
          id: facilityId,
          name: formData.name || undefined,
          nominalPower: formData.nominalPower ? parseFloat(formData.nominalPower) : undefined,
          file: formData.file || undefined,
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
    navigate('/');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data?.facilityById) {
    return (
      <Alert severity="error">
        Facility not found.
      </Alert>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Edit Facility
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Facility Name Input */}
        <Controller
          name="name"
          control={control}
          rules={{
            validate: (value) =>
              !value || value.trim().length > 0 || "Name cannot be just whitespace",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              margin="normal"
              label="Facility Name"
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          )}
        />

        {/* Nominal Power Input */}
        <Controller
          name="nominalPower"
          control={control}
          rules={{
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
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, mr: 2 }}
        >
          Update Facility
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

export default EditFacility;