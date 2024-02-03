import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuthServiceContext } from "../context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Register = () => {
  const { register } = useAuthServiceContext();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};
      if (!values.username) {
        errors.username = "Required";
      }
      if (!values.password) {
        errors.password = "Required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      const { username, password } = values;
      const status = await register(username, password);
      if (status === 409) {
        formik.setErrors({
          username: "Invalid username",
        });
      } else if (status === 401) {
        console.log("Unauthorised");
        formik.setErrors({
          username: "Invalid username or password",
          password: "Invalid username or password",
        });
      } else {
        navigate("/login");
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 500, mb: 2, marginRight: "27px" }}
        >
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%" }}
        >
          <TextField
            autoFocus
            fullWidth
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            id="password"
            name="password"
            type="password"
            label="Password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ marginBottom: 2 }}
          />
          <Button
            variant="contained"
            disableElevation
            type="submit"
            sx={{ width: "100%", marginTop: 2, paddingRight: "35px" }}
          >
            Signup
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
