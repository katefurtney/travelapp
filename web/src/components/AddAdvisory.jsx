import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { ThemeProvider } from "@mui/material/styles";
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    Autocomplete,
    Button
} from "@mui/material";
import theme from "../theme";

const AddAdvisory = ({ showSnackBar }) => {
    var addAdvisory = false;

    const { isLoading, error, data, isSuccess } = useQuery("countries", async () => {
        let response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                query: `
                    query {
                        countries {
                            name
                            code
                        }
                    }
                `
            })
        });
        return await response.json();
    });

    const {mutate, isSuccess: loadedMutation, data: advisoryAdded} = useMutation(async (advisory) => {
        let response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                query: `
                    mutation AddAdvisory($name: String, $country: String, $text: String, $date: String, $region: String, $subregion: String) {
                        add_advisory(name: $name, country: $country, text: $text, date: $date, region: $region, subregion: $subregion) {
                            name
                            country
                            text
                            date
                            region
                            subregion
                        }
                    }
                `,
                variables: advisory
            })
        });
        return await response.json();
    })

    async function handleAdd() {
        let response = await fetch("/graphql", {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({
                query: `
                    query GetAlert($countryCode: String) {
                        alert(country_code: $countryCode) {
                            name
                            country
                            text
                            date
                            region
                            subregion
                        }
                    }
                `,
                variables: {
                    countryCode: country.code
                }
            })
        });
        let result = await response.json();

        await mutate({
            "name": name,
            "country": result.data.alert.name,
            "text": result.data.alert.text,
            "date": result.data.alert.date,
            "region": result.data.alert.region,
            "subregion": result.data.alert.subregion
        })

        setName("");
        setCountry(null);
        addAdvisory = true;
    }

    const [country, setCountry] = useState(null);
    const [name, setName] = useState("");
    const onCountryChange = (e, selectedOption) => {
        setCountry(selectedOption)
    };
    const onNameChange = (e) => {
        setName(e.target.value);
    }

    useEffect(() => {
        if (isSuccess)
            showSnackBar(`found ${data.data.countries.length} countries`)
        if (loadedMutation)
            showSnackBar(`added advisory on ${advisoryAdded.data.add_advisory.date}`)
    }, [isSuccess, data, loadedMutation, advisoryAdded]);

    return (
        <ThemeProvider theme={theme}>
        <Card className="card">
            <CardContent><img src="/icons/travel.png" alt="Travel Icon" width="100px"/></CardContent>
            <CardHeader
                title="World Wide Travel Alerts"
                style={{ color: theme.palette.primary.main, textAlign: "center" }}
                />
            <CardContent style={{fontWeight: "bold"}}>Add Advisory</CardContent>
                <TextField
                    onChange={onNameChange}
                    placeholder="Traveler's name"
                    value={name}
                ></TextField>
                {isLoading ? 'loading...' : 
                    <Autocomplete
                        id="countries"
                        options={data.data.countries}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        onChange={onCountryChange}
                        value={country}
                        renderInput={(params) => (
                        <TextField
                            {...params}
                            label="countries"
                            variant="outlined"
                            fullWidth
                        />
                        )}
                    />
                }
            <Button
                onClick={handleAdd}
                disabled={(!name || !country) ? true : false}
                variant="contained"
                color="primary"
            >Add Advisory
            </Button>
        </Card>
      </ThemeProvider>

    );
}

export default AddAdvisory;