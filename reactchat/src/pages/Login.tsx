import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useAuthServiceContext } from "../context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

const Login = () => {
  const { login } = useAuthServiceContext();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors: Partial<typeof values> = {};
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
      const status = await login(username, password);
      if (status === 401) {
        console.log("Unauthorised");
        formik.setErrors({
          username: "Invalid username or password",
          password: "Invalid username or password",
        });
      } else {
        navigate("/");
      }
    },
  });
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h3"
          noWrap
          component="h1"
          sx={{
            fontWeight: 700,
            mb: 2,
          }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          onSubmit={formik.handleSubmit}
          sx={{ width: "100%", mt: 3 }}
        >
          <TextField
            autoFocus
            fullWidth
            id="username"
            name="username"
            label="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={!!formik.touched.username && !!formik.errors.username}
            helperText={formik.touched.username && formik.errors.username}
            sx={{ marginBottom: 2 }}
          ></TextField>
          <TextField
            margin="normal"
            fullWidth
            id="password"
            name="password"
            type="password"
            label="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={!!formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            sx={{ marginBottom: 2 }}
          ></TextField>
          <Button
            variant="contained"
            disableElevation
            type="submit"
            sx={{ width: "100%", marginTop: 2 }}
          >
            Login
          </Button>
        </Box>

        <Button
          variant="contained"
          disableElevation
          type="button"
          sx={{ width: "100%", marginTop: 2 }}
          onClick={() => {
            navigate("/register");
          }}
        >
          SignUp
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
