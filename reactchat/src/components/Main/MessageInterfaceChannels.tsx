import {
  AppBar,
  Toolbar,
  Box,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { MEDIA_URL } from "../../config";
import { Server } from "../../@types/server.d";
import { useParams } from "react-router-dom";
import ServerChannels from "../SecondaryDraw/ServerChannels";
import { useEffect, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";

// import JoinServerButton from "../Membership/JoinServerButton";

interface ServerChannelProps {
  data: Server[];
}

const MessageInterfaceChannels = (props: ServerChannelProps) => {
  const { data } = props;
  const theme = useTheme();
  const [sideMenu, setSideMenu] = useState(false);
  const { serverId, channelId } = useParams();
  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      setSideMenu(false);
    }
  }, [isSmallScreen]);

  const channelName =
    data
      ?.find((server) => server.id === Number(serverId))
      ?.channel_server?.find((channel) => channel.id === Number(channelId))
      ?.name || "home";

  const toggleDrawer = (open: boolean) => (event: React.MouseEvent) => {
    if (
      (event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Tab") ||
      (event as React.KeyboardEvent).key === "Shift"
    ) {
      return;
    }
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
      <ServerChannels data={data} />
    </Box>
  );

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        color="default"
        position="sticky"
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: theme.primaryAppBar.height,
            height: theme.primaryAppBar.height,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ xs: "block", sm: "none" }}>
            <ListItemAvatar sx={{ minWidth: "40px" }}>
              <Avatar
                alt="Server Icon"
                src={`${MEDIA_URL}${data?.[0]?.icon}`}
                sx={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>
          </Box>
          <Typography noWrap component="div">
            {channelName}
          </Typography>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <IconButton onClick={toggleDrawer(true)} color="inherit" edge="end">
              <MoreVertIcon />
            </IconButton>
          </Box>
          <Drawer anchor="left" onClose={toggleDrawer(false)} open={sideMenu}>
            {list()}
          </Drawer>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default MessageInterfaceChannels;
