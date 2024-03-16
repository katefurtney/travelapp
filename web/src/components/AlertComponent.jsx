import { useEffect } from "react";
import { useQuery } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import { Card, CardHeader, CardContent, Table, TableContainer, TableBody, TableRow, TableCell, Typography } from "@mui/material";
import theme from "../theme";

const AlertComponent = ({ showSnackBar }) => {
    const { isLoading, error, data } = useQuery("alertSummary", async () => {
        let response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                query: `
                    query {
                        alert_summary
                    }
                `
            })
        });
        return await response.json();
    });

    useEffect(() => {
        if (isLoading)
            showSnackBar("running setup...")
        else
            showSnackBar("alerts collection setup completed")
    }, [isLoading]);

    return (
        <ThemeProvider theme={theme}>
        <Card className="card">
            <CardContent><img src="/icons/travel.png" alt="Travel Icon" width="100px"/></CardContent>
            <CardHeader
                title="World Wide Travel Alerts"
                style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
                <CardContent style={{fontWeight: "bold"}}>Alert Setup - Details</CardContent>
                <CardContent>
                    {isLoading ? '' :
                        <TableContainer>
                            <Table aria-label="simple table">
                                <TableBody>
                                    <TableRow><TableCell><Typography color="secondary">{JSON.stringify(data.data.alert_summary[0])}</Typography></TableCell></TableRow>
                                    <TableRow><TableCell><Typography color="secondary">{JSON.stringify(data.data.alert_summary[1])}</Typography></TableCell></TableRow>
                                    <TableRow><TableCell><Typography color="secondary">{JSON.stringify(data.data.alert_summary[2])}</Typography></TableCell></TableRow>
                                    <TableRow><TableCell><Typography color="secondary">{JSON.stringify(data.data.alert_summary[3])}</Typography></TableCell></TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                {/* {isLoading ? "running setup..." : JSON.stringify(data.data.alert_summary)} */}
            </CardContent>
        </Card>
      </ThemeProvider>

        // <div>
        //     {isLoading ? "running setup..." : JSON.stringify(data.data.alert_summary)}
        // </div>
    );
}

export default AlertComponent;