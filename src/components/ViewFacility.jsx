import React from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { useQuery } from "@apollo/client";
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { GET_FACILITY_BY_ID } from "../graphql/queries"; 

function ViewFacility() {
  const { facilityId } = useParams(); 
  const navigate = useNavigate(); 

  const { loading, data } = useQuery(GET_FACILITY_BY_ID, {
    variables: { id: facilityId },
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const facility = data?.facilityById;

  if (!facility) {
    return <Typography>Facility not found.</Typography>;
  }

  const handleUpdateFacility = () => {
    navigate(`/facilities/${facilityId}/edit`);
  };

  const hasSolarData = facility.solarData && facility.solarData.length > 0;

  return (
    <Container maxWidth="lg">
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4" gutterBottom>
          {facility.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateFacility}
        >
          Update Facility
        </Button>
      </Box>

      <Typography variant="subtitle1" gutterBottom>
        Nominal Power: {facility.nominalPower} kW
      </Typography>

      {hasSolarData ? (
        <>
          {/* Chart */}
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Solar Data Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={facility.solarData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => new Date(timestamp).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active_power_kW"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="energy_kWh"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>

          {/* Table */}
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Solar Data Table
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell align="right">Active Power (kW)</TableCell>
                    <TableCell align="right">Energy (kWh)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facility.solarData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.timestamp}</TableCell>
                      <TableCell align="right">{row.active_power_kW.toFixed(2)}</TableCell>
                      <TableCell align="right">{row.energy_kWh.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      ) : (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            No Solar Data Available
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please update the facility and upload a solar data file.
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default ViewFacility;