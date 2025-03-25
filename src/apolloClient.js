import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { onError } from "@apollo/client/link/error";

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (token) {
  try {
    const decodedToken = JSON.parse(atob(token.split('.')[1])); 
    const exp = decodedToken.exp * 1000; 
    return Date.now() >= exp; 
  } catch (error) {
    console.error("Invalid token format:", error);
    return true;
  }
} 
};

// Authentication middleware
const authLink = new ApolloLink((operation, forward) => {
  let token = localStorage.getItem('authToken'); 

  if (isTokenExpired(token)) {
    console.warn("Token expired, logging out...");
    localStorage.removeItem('authToken');
    localStorage.removeItem('user'); 
    window.location.href = '/login'; 
    return null; 
  }

  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }));

  return forward(operation);
});

// Handle GraphQL errors 
const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      if (err.extensions.code === "UNAUTHENTICATED") {
        console.warn("Received UNAUTHENTICATED error, logging out...");
        
        // Check if the current page is already the login page
        if (window.location.pathname !== "/login") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }
    }
  }
});


// Upload link for GraphQL API requests
const uploadLink = createUploadLink({
  uri: process.env.REACT_APP_BACKEND_URL,
  headers: {
    "Apollo-Require-Preflight": "true",
  },
});

// Combine all links
export const client = new ApolloClient({
    // @ts-ignore:next-line
  link: ApolloLink.from([errorLink, authLink, uploadLink]), 
  cache: new InMemoryCache(),
});

export default client;
