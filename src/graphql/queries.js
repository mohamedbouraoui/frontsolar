import { gql } from "@apollo/client";

export const GET_FACILITIES_BY_USER = gql`
  query GetFacilitiesByUser {
    facilitiesByUser {
      _id
      name
      nominalPower
    }
  }
`;

export const GET_FACILITY_BY_ID = gql`
  query GetFacilityById($id: String!) {
    facilityById(id: $id) {
      _id
      name
      nominalPower
      userId
      solarData {
        timestamp
        active_power_kW
        energy_kWh
      }
    }
  }
`;