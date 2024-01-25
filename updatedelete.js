// UpdateDeletePage.js
import React, { useState } from 'react';
import UpdatePage from './UpdatePage';

const UpdateDeletePage = ({ selectedData, onUpdate, onDelete, confirmationId, setConfirmationId }) => {
  const [updatedData, setUpdatedData] = useState({ ...selectedData });
  const [isUpdateSuccessful, setIsUpdateSuccessful] = useState(null);
  const [showUpdatePage, setShowUpdatePage] = useState(false); // Initialize state for UpdatePage
  
  const handleUpdate = async () => {
    try {
      await onUpdate(updatedData, confirmationId); // Pass confirmationId to onUpdate
      setIsUpdateSuccessful(true);
    } catch (error) {
      console.error('Error updating data:', error);
      setIsUpdateSuccessful(false);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(confirmationId); // Pass confirmationId to onDelete
      setIsUpdateSuccessful(true);
    } catch (error) {
      console.error('Error deleting data:', error);
      setIsUpdateSuccessful(false);
    }
  };

  
  const handleChange = (fieldName, value) => {
    setUpdatedData({ ...updatedData, [fieldName]: value });
  };

  return (
    <div className='form'>
      {showUpdatePage ? (
          <UpdatePage
          onUpdate={handleUpdate}
          selectedData={selectedData}
          onCancel={() => setShowUpdatePage(false)}
          confirmationId={confirmationId}
          setConfirmationId={setConfirmationId}
        />
      
      ) : (
        <div>
          <h2>Update Data</h2>
          <label>Confirmation ID:</label>
          <input
            type="text"
            value={confirmationId}
            onChange={(e) => setConfirmationId(e.target.value)}
          />

          <label>Expressway:</label>
          <input
            type="text"
            value={updatedData.expressway}
            onChange={(e) => handleChange('expressway', e.target.value)}
          />
          {/* ... Add similar input fields for other properties ... */}
          <button onClick={() => setShowUpdatePage(true)}>Update Data</button>

          <h2>Delete Data</h2>
          <p>Are you sure you want to delete this data?</p>
          <button onClick={handleDelete}>Delete</button>

          {/* Display feedback to the user */}
          {isUpdateSuccessful !== null && (
            <p style={{ color: isUpdateSuccessful ? 'green' : 'red' }}>
              {isUpdateSuccessful ? 'Update successful' : 'Delete successful'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default UpdateDeletePage;
