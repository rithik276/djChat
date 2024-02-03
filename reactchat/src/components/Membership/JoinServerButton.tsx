import { useTheme } from "@mui/material";
import { useMembershipContext } from "../../context/MemberContext";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const JoinServerButton = () => {
  const { serverId } = useParams();
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const navigate = useNavigate();
  const { joinServer, leaveServer, isLoading, error, isUserMember } =
    useMembershipContext();

  const handleJoinServer = async () => {
    try {
      await joinServer(Number(serverId));
      navigate(`/server/${serverId}/`);
      console.log("User has joined server");
    } catch (error) {
      console.log("Error joining", error);
    }
  };

  const handleLeaveServer = async () => {
    try {
      await leaveServer(Number(serverId));
      navigate(`/server/${serverId}/`);
      console.log("User has left the server successfully!");
    } catch (error) {
      if (error?.response?.status === 409) {
        const alertOptions = {
          text: "Server Owner Cannot Leave Server",
          icon: "error",
          dangerMode: true,
        };

        const swalInstance = swal(alertOptions);

        if (isDarkMode) {
          swalInstance.then(() => {
            const sweetTextAlertContainer =
              document.querySelector(".swal-text");

            if (sweetTextAlertContainer) {
              sweetTextAlertContainer.style.color = "#ffffff";
            }

            const sweetAlertContainer = document.querySelector(".swal-modal");
            if (sweetAlertContainer) {
              sweetAlertContainer.style.backgroundColor = "#000000";
            }
          });
        }
      } else {
        console.error("Error leaving the server:");
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>Error: {error.message}</div>;
  // }

  return (
    <>
      {isUserMember ? (
        <button
          onClick={handleLeaveServer}
          style={{
            background: "#eb0729",
            borderRadius: "20px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Leave Server
        </button>
      ) : (
        <button
          onClick={handleJoinServer}
          style={{
            background: "#00FF00",
            borderRadius: "20px",
            padding: "5px 10px",
            cursor: "pointer",
          }}
        >
          Join Server
        </button>
      )}
    </>
  );
};
export default JoinServerButton;
