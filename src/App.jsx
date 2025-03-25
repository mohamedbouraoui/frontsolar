import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import Auth from './components/Auth';
import ProtectedRoute from './components/ProtectedRoute'; 
import Dashboard from './components/Dashboard';
import client from './apolloClient';
import FacilityList from './components/FacilitiesList';
import EditFacility from './components/EditFacility';
import ViewFacility from './components/ViewFacility';
import CreateFacility from './components/CreateFacility ';

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/login" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<FacilityList />} />
            <Route path="facilities/create" element={<CreateFacility />} />
            <Route path="facilities/:facilityId/edit" element={<EditFacility />} />
            <Route path="facilities/:facilityId" element={<ViewFacility />} />
          </Route>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;