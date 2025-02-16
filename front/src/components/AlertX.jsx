import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export default function AlertX({ messageInfo, setMessageInfo, open, setOpen }) {
  const handleClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  // temporizador
  React.useEffect(() => {
    let timer;
    if (open) {
      timer = setTimeout(() => {
        setOpen(false);
      }, 2000); // cerrar  despues de 2 segundos
    }
    return () => {
      clearTimeout(timer);
    };
  }, [open, setOpen]);

  return (
    <div>
      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        open={open}
        autoHideDuration={null}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        sx={{ minWidth: 250 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={messageInfo ? messageInfo.severity : "error"}
          //variant="filled"
          sx={{ width: "100%" }}
          icon={messageInfo ? messageInfo.icon : null}
        >
          {messageInfo ? messageInfo.message : undefined}
        </Alert>
      </Snackbar>
    </div>
  );
}
