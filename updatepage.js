import React, { useState, useEffect } from 'react';
import { serverURL } from './config';

const UpdatePage = ({ onUpdate, selectedData, onCancel, confirmationId, setConfirmationId }) => {
  const [updatedData, setUpdatedData] = useState({ ...selectedData });
  const [isConfirmationIdValid, setIsConfirmationIdValid] = useState(true);

  const handleUpdate = async () => {
    try {
      // Validate confirmationId and show an error message if needed
      if (confirmationId !== 'toby') {
        alert('Invalid confirmation ID');
        return;
      }
  
      // Check if selectedData has _id property
      if (!selectedData || !selectedData._id) {
        alert('Selected data is missing the _id property');
        return;
      }
  
      // Send a request to your server to update the data in MongoDB
      const response = await fetch(`${serverURL}/updateTollGateData/${selectedData._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationId: 'toby', // Replace with actual confirmationId
          updatedData,
        }),
      });
      const updatedDataFromServer = await response.json();

      if (response.ok) {
        console.log('Data updated successfully:', updatedDataFromServer);
        onUpdate(updatedDataFromServer); // Update the local state with the updated data
        setConfirmationId(''); // Clear confirmation ID after a successful update
      } else {
        console.error('Server error:', updatedDataFromServer.message);
        // Display or log the actual error message received from the server
        // Handle the error as needed
      }
      // Rest of the code...
    } catch (error) {
      console.error('Error updating data:', error);
      // Handle the error as needed
    }
  };
  
  
  


  const handleChange = (fieldName, value) => {
    setUpdatedData({ ...updatedData, [fieldName]: value });
  };

  useEffect(() => {
    // Reset the form when selectedData changes (e.g., when updating from UpdateDeletePage)
    setUpdatedData({ ...selectedData });
    setIsConfirmationIdValid(true);
  }, [selectedData]);

  return (
    <div>
      <h2>Update Data</h2>
      {isConfirmationIdValid ? (
        <div>
          <label>Confirmation ID:</label>
          <input
            type="text"
            value={confirmationId}
            onChange={(e) => setConfirmationId(e.target.value)} // Corrected function name
          />

          <label>Expressway:</label>
          <input
            type="text"
            value={updatedData.expressway}
            onChange={(e) => handleChange('expressway', e.target.value)}
          />
          <label>Entry:</label>
          <input
            type="text"
            value={updatedData.entry}
            onChange={(e) => handleChange('entry', e.target.value)}
          />
          <label>Exit:</label>
          <input
            type="text"
            value={updatedData.exit}
            onChange={(e) => handleChange('exit', e.target.value)}
          />
          <label>Vehicle:</label>
          <input
            type="text"
            value={updatedData.vehicle}
            onChange={(e) => handleChange('vehicle', e.target.value)}
          />
          <label>Vehicle Class:</label>
          <input
            type="text"
            value={updatedData.vehicleClass}
            onChange={(e) => handleChange('vehicleClass', e.target.value)}
          />

          <label>Price:</label>
          <input
            type="text"
            value={updatedData.price}
            onChange={(e) => handleChange('price', parseInt(e.target.value, 10))}
          />
        </div>
      ) : (
        <p>Invalid confirmation ID. Please enter a valid confirmation ID.</p>
      )}
      <button onClick={handleUpdate}>Update</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default UpdatePage;
