import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import {
  Card,
  CardHeader,
  CardContent,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Autocomplete,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";
import theme from "../theme";

const ListAdvisories = ({ showSnackBar }) => {
  const {
    isLoading,
    error,
    data: alerts,
  } = useQuery("alertsAndAdvisories", async () => {
    let response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        query: `
              query GetAdvisoriesAndAlerts{
                  advisories{
                      name
                      country
                      text
                      date
                      region
                      subregion
                  }
                  alerts{
                      country
                      name
                      text
                      date
                      region
                      subregion
                  }
                  regions
                  subregions
              }
          `,
      }),
    });
    return await response.json();
  });

  const [traveler, setTraveler] = useState(null);
  const [region, setRegion] = useState(null);
  const [subregion, setSubregion] = useState(null);
  const [category, setCategory] = useState("traveler");
  const [rows, setRows] = useState([]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setRows([]);
  };
  async function onTravelerChange(e, selectedTraveler) {
    setTraveler(selectedTraveler);
    getAlertsForTraveler(selectedTraveler);
  }

  const onRegionChange = (e, selectedRegion) => {
    setRegion(selectedRegion);
    getAlertsForRegion(selectedRegion);
  };
  const onSubregionChange = (e, selectedSubregion) => {
    setSubregion(selectedSubregion);
    getAlertsForSubregion(selectedSubregion);
  };

  function createData(countryColumn, alertColumn) {
    return { countryColumn, alertColumn };
  }

  useEffect(() => {
    if (!isLoading) {
      if (category == "traveler") {
        showSnackBar(`found ${alerts.data.advisories.length} travelers`)
        if (traveler != null && rows.length > 0)
          showSnackBar(`found ${rows.length} alerts for ${traveler.name}`)
      }
      if (category == "region") {
        showSnackBar(`found ${alerts.data.regions.length} regions`)
      }
      if (category == "subregion") {
        showSnackBar(`found ${alerts.data.subregions.length} subregions`)
      }
    }
  }, [category, alerts, traveler, region, subregion])

  function getAlertsForTraveler(traveler) {
    if (!alerts) throw new Error("No alerts loaded");

    // filter by traveler
    const filteredAlerts = alerts.data.advisories.filter(
      (alert) => alert.name == traveler.name
    );

    const rows = [];
    filteredAlerts.forEach((alert) => {
      rows.push(createData(alert.country, alert.text + "\n" + alert.date));
    });

    setRows(rows);
  }

  async function getAlertsForRegion(region) {
    let response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        query: `
              query GetAlertsForRegion($region: String){
                alerts_for_region(region: $region){
                  country
                  name
                  text
                  date
                  region
                  subregion
                }
              }
            `,
        variables: { region },
      }),
    });

    let regionResult = await response.json();

    const alerts = regionResult.data.alerts_for_region;

    if (!alerts) throw new Error("No alerts loaded");

    const rows = [];
    alerts.forEach((alert) => {
      rows.push(createData(alert.name, alert.text + "\n" + alert.date));
    });

    setRows(rows);
    showSnackBar(`found ${rows.length} alerts for ${region}`)
  }

  async function getAlertsForSubregion(subregion) {
    let response = await fetch("/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        query: `
          query GetAlertsForSubegion($subregion: String){
            alerts_for_subregion(subregion: $subregion){
              country
              name
              text
              date
              region
              subregion
            }
          }
        `,
        variables: { subregion },
      }),
    });

    let subregionResult = await response.json();

    const alerts = subregionResult.data.alerts_for_subregion;

    if (!alerts) throw new Error("No alerts loaded");

    const rows = [];
    alerts.forEach((alert) => {
      rows.push(createData(alert.name, alert.text + "\n" + alert.date));
    });

    setRows(rows);
    showSnackBar(`found ${rows.length} alerts for ${subregion}`)
  }

  return (
    <ThemeProvider theme={theme}>
      <Card className="card">
        <CardContent>
          <img src="/icons/travel.png" alt="Travel Icon" width="100px" />
        </CardContent>
        <CardHeader
          title="World Wide Travel Alerts"
          style={{ color: theme.palette.primary.main, textAlign: "center" }}
        />
        <CardContent style={{ fontWeight: "bold" }}>
          List Advisories By:
        </CardContent>
        <FormControl>
          {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
          <RadioGroup
            row
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="traveler"
            name="radio-buttons-group"
            onChange={handleCategoryChange}
          >
            <FormControlLabel
              value="traveler"
              control={<Radio />}
              label="Traveler"
            />
            <FormControlLabel
              value="region"
              control={<Radio />}
              label="Region"
            />
            <FormControlLabel
              value="subregion"
              control={<Radio />}
              label="Sub-Region"
            />
          </RadioGroup>
        </FormControl>
        {isLoading ? (
          <></>
        ) : category === "traveler" ? (
          <Autocomplete
            id="traveler"
            options={alerts.data.advisories}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            onChange={onTravelerChange}
            value={traveler}
            renderInput={(params) => (
              <TextField
                {...params}
                label="travelers"
                variant="outlined"
                fullWidth
              />
            )}
          />
        ) : category === "region" ? (
          <Autocomplete
            id="region"
            options={alerts.data.regions}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onRegionChange}
            value={region}
            renderInput={(params) => (
              <TextField
                {...params}
                label="regions"
                variant="outlined"
                fullWidth
              />
            )}
          />
        ) : (
          <Autocomplete
            id="subregion"
            options={alerts.data.subregions}
            getOptionLabel={(option) => option}
            style={{ width: 300 }}
            onChange={onSubregionChange}
            value={subregion}
            renderInput={(params) => (
              <TextField
                {...params}
                label="subregions"
                variant="outlined"
                fullWidth
              />
            )}
          />
        )}

        <CardContent>
          {rows.length > 0 && (
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">
                      <Typography color="primary">Country</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography color="primary">Alert Information</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.countryColumn}
                      </TableCell>
                      <TableCell align="left">{row.alertColumn}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </ThemeProvider>
    // <div>
    //     {isLoading ? "running setup..." : JSON.stringify(data.data.advisories)}
    // </div>
  );
};

export default ListAdvisories;
