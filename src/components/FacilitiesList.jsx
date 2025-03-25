import React from 'react';
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_FACILITIES_BY_USER } from '../graphql/queries'; 
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom'; 
import { DELETE_FACILITY } from '../graphql/mutations';

function FacilityList() {
  const navigate = useNavigate(); 

  // Fetch facilities 
  const { loading, error, data } = useQuery(GET_FACILITIES_BY_USER);

  const [deleteFacility] = useMutation(DELETE_FACILITY, {
    refetchQueries: [{ query: GET_FACILITIES_BY_USER }], 
    onCompleted: () => {
      console.log('Facility deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting facility:', error.message);
    },
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error('Error fetching facilities:', error.message);
    return (
      <Typography variant="body1" color="error" sx={{ mt: 4 }}>
        Error fetching facilities
      </Typography>
    );
  }

  const facilities = data?.facilitiesByUser || [];

  const handleView = (facilityId) => {
    navigate(`/facilities/${facilityId}`); 
  };

  const handleEdit = (facilityId) => {
    navigate(`/facilities/${facilityId}/edit`); 
  };

  const handleDelete = async (facilityId) => {
    try { 
      await deleteFacility({ variables: { id: facilityId } }); 
    } catch (error) {
      console.error('Error deleting facility:', error.message);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      {/* Facilities List */}
      {facilities.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2, fontStyle: 'italic' }}>
          No facilities found. Add a new facility to get started.
        </Typography>
      ) : (
        <List>
          {facilities.map((facility, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={facility.name}
                  secondary={`Nominal Power: ${facility.nominalPower} kW`}
                />
                {/* View Button */}
                <IconButton
                  color="primary"
                  onClick={() => handleView(facility._id)}
                  aria-label="view"
                >
                  <VisibilityIcon />
                </IconButton>
                {/* Edit Button */}
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(facility._id)}
                  aria-label="edit"
                >
                  <EditIcon />
                </IconButton>
                {/* Delete Button */}
                <IconButton
                  color="error"
                  onClick={() => handleDelete(facility._id)}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              {index < facilities.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default FacilityList;