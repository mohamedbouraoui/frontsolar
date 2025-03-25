import { gql } from "@apollo/client";

export const CREATE_FACILITY = gql`
  mutation CreateFacility($input: CreateFacilityInput!) {
    createFacility(input: $input) {
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

export const UPDATE_FACILITY = gql`
  mutation UpdateFacility($input: UpdateFacilityInput!) {
    updateFacility(input: $input) {
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

export const DELETE_FACILITY = gql`
  mutation DeleteFacility($id: String!) {
    deleteFacility(id: $id)
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($loginUserInput: LoginUserInput!) {
    login(loginUserInput: $loginUserInput) {
      user {
        _id
        name
        email
      }
      authToken
    }
  }
`;

export const SIGNUP_USER = gql`
  mutation SignupUser($signupInput: CreateUserInput!) {
    signup(signupInput: $signupInput) {
     user {
        _id
        name
        email
      }
      authToken
    }
  }
`;
