import {
  Box,
  Drawer,
  IconButton,
  Link,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { AppBar, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import ExploreCategories from "../../components/SecondaryDraw/ExploreCategories";
import AccountButton from "../../components/PrimaryAppBar/AccountButton";

const PrimaryAppBar = () => {
  const [sideMenu, setSideMenu] = useState(false);
  const theme = useTheme();

  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen]);

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
    setSideMenu(open);
  };

  const list = () => (
    <Box
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{
        paddingTop: `${theme.primaryAppBar.height}px`,
        minWidth: 200,
      }}
    >
      <ExploreCategories />
    </Box>
  );
  return (
    <AppBar
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backgroundColor: theme.palette.background.default,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          height: theme.primaryAppBar.height,
          minHeight: theme.primaryAppBar.height,
        }}
      >
        <Box sx={{ display: { xs: "block", sm: "none" } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            sx={{ mr: 1 }}
            onClick={toggleDrawer(!sideMenu)}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        <Drawer anchor="left" open={sideMenu} onClose={toggleDrawer(false)}>
          {list()}
        </Drawer>
        <Link href="/" underline="none" color="inherit">
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { fontWeight: 700 }, letterSpacing: "-0.5px" }}
          >
            DJCHAT
          </Typography>
        </Link>
        <Box sx={{ flexGrow: 1 }}></Box>
        <AccountButton />
      </Toolbar>
    </AppBar>
  );
};

export default PrimaryAppBar;
