// import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    Typography,
} from "@mui/material";
import theme from "../theme";
import "../App.css";

const HomeComponent = () => {
  return (
    <ThemeProvider theme={theme}>
      <Card className="card">
        <CardContent><img src="/icons/travel.png" alt="Travel Icon" width="100px"/></CardContent>
        <CardHeader
          title="World Wide Travel Alerts"
          style={{ color: theme.palette.primary.main, textAlign: "center" }}
        />
        <CardContent>
          <br />
          <Typography
            color="primary"
            style={{ float: "right", paddingRight: "1vh", fontSize: "smaller" }}
          >
            &copy;Info3139 - 2024
          </Typography>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
};

export default HomeComponent;
