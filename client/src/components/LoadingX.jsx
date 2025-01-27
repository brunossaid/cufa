import { CircularProgress } from "@mui/material";
import * as React from "react";

export default function LoadingX() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <CircularProgress />
    </div>
  );
}
