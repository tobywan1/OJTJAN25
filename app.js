import React, { useState, useEffect } from 'react';
import './styles.css';
import { serverURL } from './config';
import UpdateDeletePage from './UpdateDeletePage.js';
import './UpdatePage.js';


const DropdownMenuWithInputsAndVehiclesAndSubmit = () => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [locationdropdown, setlocationdropdown] = useState('');
  const [locationdropdown2, setlocationdropdown2] = useState('');
  const [vehicleDropdown, setVehicleDropdown] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [price, setPrice] = useState('');
  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [isAdmin, setIsAdmin] = useState('');
  const [dataId, setDataId] = useState(null);
  const [showUpdateDeletePage, setShowUpdateDeletePage] = useState(false);
  const [data, ] = useState('');
  const [confirmationId, setConfirmationId] = useState('');
  const [selectedData, setSelectedData] = useState(null);


  const [newData, setNewData] = useState({
    expressway: '',
    entry: '',
    exit: '',
    vehicle: '',
    vehicleClass: '',
    price: '',
  });


  useEffect(() => {
    fetchAllData();
  }, []);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handlelocationdropdownChange = (event) => {
    setlocationdropdown(event.target.value);
  };

  const handlelocationdropdown2Change = (event) => {
    setlocationdropdown2(event.target.value);
  };

  const handleVehicleDropdownChange = (event) => {
    setVehicleDropdown(event.target.value);
  };

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
    setVehicleDropdown(''); // Reset selected vehicle when class changes
  };
  

 
  
  const fetchAllData = async () => {
    try {
      const response = await fetch(`${serverURL}/getAllTollGateData`);
      const data = await response.json();
      console.log('All Toll Gate Data:', data);
      // Process data as needed, e.g., update state with the fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateData = async () => {
    try {
      if (!dataId) {
        console.error('Data ID is not set');
        return;
      }
      
    
      // Assume newData contains the updated data
      const response = await fetch(`${serverURL}/updateTollGateData/${dataId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmationId: 'toby', // Replace with actual confirmationId
          updatedData: newData,
        }),
      });
  
      const updatedData = await response.json();
      console.log('Data updated successfully:', updatedData);
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  
  const handleDeleteData = async () => {
    try {
      if (!dataId) {
        console.error('Data ID is not set');
        return;
      }
  
      const response = await fetch(`${serverURL}/deleteTollGateData/${dataId}`, {
        method: 'DELETE',
      });
  
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };
  

  const handleAddNewData = async () => {
    console.log('New Data to be sent:', newData);
  
    // Check if required values are not empty
    if (!newData.expressway || !newData.entry || !newData.exit || !newData.vehicle || !newData.vehicleClass || !newData.price) {
      console.error('Required data is missing');
      return;
    }
  
    const username = loginUsername;
    try {
      const sendData = isAdmin ? { ...newData, isAdmin } : { ...newData, username };
  
      console.log('Sending data to server:', sendData);
  
      console.log('Before fetch:', serverURL);
      const response = await fetch(`${serverURL}/addTollGateData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Add this line
        body: JSON.stringify(sendData),
      });
  
      console.log('After fetch:', response);
  
      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Server error:', errorMessage);
        // Handle the error as needed
        return;
      }
  
      const data = await response.json();
      console.log('Server response:', response);
      console.log('Server data:', data);
  
      setDataId(data.dataId); // Update the dataId state with the received ID
      setNewData({
        expressway: '',
        entry: '',
        exit: '',
        vehicle: '',
        vehicleClass: '',
        price: null,
      }); // Reset the new data state after successful addition
      fetchAllData(); // Fetch all data after adding new data
  
    } catch (error) {
      console.error('Client-side error:', error);
    }
  };
  
  const handleShowUpdateDeletePage = async (dataId) => {
    try {
      // Fetch the selected data based on dataId
      const response = await fetch(`${serverURL}/getTollGateData/${dataId}`);
      const selectedData = await response.json();

      setDataId(dataId);
      setSelectedData(selectedData); // Add this state variable
      setConfirmationId(''); // Initialize confirmationId when showing update/delete page
      setShowUpdateDeletePage(true);
    } catch (error) {
      console.error('Error fetching selected data:', error);
    }
  };
  
  
  const handleUpdateDataWithConfirmation = async () => {
    if (!confirmationId) {
      console.error('Confirmation ID is required');
      handleUpdateData(confirmationId);
      return;
    }

    // Prompt for confirmation ID and perform the update only if it matches
    if (window.confirm('Please confirm the operation by entering the confirmation ID:')) {
      handleUpdateData();
    } else {
      console.log('Update operation cancelled');
    }
  };
  


  const handleDeleteDataWithConfirmation = async () => {
    if (!confirmationId) {
      console.error('Confirmation ID is required');
      handleUpdateData(confirmationId);
      return;
    }

    // Prompt for confirmation ID and perform the delete only if it matches
    if (window.confirm('Please confirm the operation by entering the confirmation ID:')) {
      handleDeleteData();
    } else {
      console.log('Delete operation cancelled');
    }
  };
  
  
  
  
  


  const handleLogin = async () => {
    if (!loginUsername || !loginPassword) {
      alert('Please enter both username and password');
      return;
    }
  
    const lowerCaseUsername = loginUsername.toLowerCase();
  
    // Simulating local login logic
    if (lowerCaseUsername === 'admin' && loginPassword === 'wa') {
      setIsLoggedIn(true);
      setIsAdmin(true);
      setIsCreateAccount(false);
      console.log('Admin logged in');
    } else if (lowerCaseUsername === createUsername && loginPassword === createPassword) {
      setIsLoggedIn(true);
      setIsAdmin(false);
      setIsCreateAccount(false);
      console.log('User logged in');
    } else {
      // If local login fails, try server-side authentication
      try {
        const response = await fetch(`${serverURL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: loginUsername, password: loginPassword }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          // Server authentication successful
          setIsLoggedIn(true);
          setIsAdmin(data.isAdmin); // Set isAdmin based on the server response
          setIsCreateAccount(false);
          console.log('Server login successful');
        } else {
          // Server authentication failed
          alert('Invalid credentials');
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login');
      }
    }
  };
  

  
  const handleCreateAccount = () => {
    // Simulating account creation logic, you should replace this with your actual registration logic
    if (createUsername.toLowerCase() === 'admin' && createPassword === 'wa') {
      alert('Admin account created. Please login before accessing the expressway.');
      setIsCreateAccount(true);
      setIsLoggedIn(false);
      setIsAdmin(true);
    } else {
      alert(`Account created for ${createUsername}. Please log in.`);
      setIsCreateAccount(true);
      setIsLoggedIn(false);
      setIsAdmin(false);
    }
  };

  const handleSubmit = () => {
    // Set the default price
    let calculatedPrice = 'N/A';
    if (!isLoggedIn) {
      alert('Please log in first');
      return;
    }

    
    console.log('isLoggedIn:', isLoggedIn);
    console.log('isAdmin:', isAdmin);

     // BALINTAWAK ENTRY POINT (DONE)
  if (
    selectedOption === 'option1' &&
    locationdropdown === 'locationE1' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location2' ||
     locationdropdown2 === 'location3' ||
     locationdropdown2 === 'location4' ||
     locationdropdown2 === 'location5' ||
     locationdropdown2 === 'location6' ||
     locationdropdown2 === 'location7' ||
     locationdropdown2 === 'location8' ||
     locationdropdown2 === 'location9' ||
     locationdropdown2 === 'location10' ||
     locationdropdown2 === 'location11' ||
     locationdropdown2 === 'location12' ||
     locationdropdown2 === 'location13' ||
     locationdropdown2 === 'location14' ||
     locationdropdown2 === 'location15' ||
     locationdropdown2 === 'location16' ||
     locationdropdown2 === 'location17' ||
     locationdropdown2 === 'location18' ||
     locationdropdown2 === 'location19' ||
     locationdropdown2 === 'location20' ||
     locationdropdown2 === 'location21' ||
     locationdropdown2 === 'location22' ||
     locationdropdown2 === 'location23' ||
     locationdropdown2 === 'location24' ||
     locationdropdown2 === 'location25' ||
     locationdropdown2 === 'location26' ||
     locationdropdown2 === 'location27' ||
     locationdropdown2 === 'location28' ||
     locationdropdown2 === 'location29' ||
     locationdropdown2 === 'location30' ||
     locationdropdown2 === 'location31')
  ) {
    
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location5':
        case 'location6':
        case 'location7':
          calculatedPrice = 69;
          break;
        case 'location8':
          calculatedPrice = 77;
          break;
        case 'location9':
          calculatedPrice = 84;
          break;
        case 'location10':
          calculatedPrice = 88;
          break;
        case 'location11':
          calculatedPrice = 107;
          break;
        case 'location12':
          calculatedPrice = 122;
          break;
        case 'location13':
          calculatedPrice = 128;
          break;
        case 'location14':
          calculatedPrice = 156;
          break;
        case 'location15':
          calculatedPrice = 203;
          break;
        case 'location16':
          calculatedPrice = 239;
          break;
        case 'location17':
          calculatedPrice = 268;
          break;
        case 'location18':
          calculatedPrice = 302;
          break;
        case 'location19':
          calculatedPrice = 310;
          break;
        case 'location20':
          calculatedPrice = 332;
          break;
        case 'location21':
          calculatedPrice = 656;
          break;
        case 'location22':
          calculatedPrice = 560;
          break;
        case 'location23':
          calculatedPrice = 464;
          break;
        case 'location24':
          calculatedPrice = 393;
          break;
        case 'location25':
          calculatedPrice = 341;
          break;
        case 'location26':
          calculatedPrice = 332;
          break;
        case 'location27':
          calculatedPrice = 353;
          break;
        case 'location28':
          calculatedPrice = 361;
          break;
        case 'location29':
          calculatedPrice = 414;
          break;
        case 'location30':
          calculatedPrice = 487;
          break;
        case 'location31':
          calculatedPrice = 512;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location5':
        case 'location6':
        case 'location7':
          calculatedPrice = 172;
          break;
        case 'location8':
          calculatedPrice = 193;
          break;
        case 'location9':
          calculatedPrice = 210;
          break;
        case 'location10':
          calculatedPrice = 219;
          break;
        case 'location11':
          calculatedPrice = 267;
          break;
        case 'location12':
          calculatedPrice = 306;
          break;
        case 'location13':
          calculatedPrice = 320;
          break;
        case 'location14':
          calculatedPrice = 389;
          break;
        case 'location15':
          calculatedPrice = 507;
          break;
        case 'location16':
          calculatedPrice = 597;
          break;
        case 'location17':
          calculatedPrice = 669;
          break;
        case 'location18':
          calculatedPrice = 755;
          break;
        case 'location19':
          calculatedPrice = 775;
          break;
        case 'location20':
          calculatedPrice = 829;
          break;
        case 'location21':
          calculatedPrice = 1494;
          break;
        case 'location22':
          calculatedPrice = 1284;
          break;
        case 'location23':
          calculatedPrice = 1092;
          break;
        case 'location24':
          calculatedPrice = 952;
          break;
        case 'location25':
          calculatedPrice = 846;
          break;
        case 'location26':
          calculatedPrice = 829;
          break;
        case 'location27':
          calculatedPrice = 871;
          break;
        case 'location28':
          calculatedPrice = 887;
          break;
        case 'location29':
          calculatedPrice = 994;
          break;
        case 'location30':
          calculatedPrice = 1138;
          break;
        case 'location31':
          calculatedPrice = 1188;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location5':
        case 'location6':
        case 'location7':
          calculatedPrice = 206;
          break;
        case 'location8':
          calculatedPrice = 232;
          break;
        case 'location9':
          calculatedPrice = 252;
          break;
        case 'location10':
          calculatedPrice = 263;
          break;
        case 'location11':
          calculatedPrice = 321;
          break;
        case 'location12':
          calculatedPrice = 367;
          break;
        case 'location13':
          calculatedPrice = 383;
          break;
        case 'location14':
          calculatedPrice = 467;
          break;
        case 'location15':
          calculatedPrice = 609;
          break;
        case 'location16':
          calculatedPrice = 717;
          break;
        case 'location17':
          calculatedPrice = 803;
          break;
        case 'location18':
          calculatedPrice = 905;
          break;
        case 'location19':
          calculatedPrice = 930;
          break;
        case 'location20':
          calculatedPrice = 995;
          break;
        case 'location21':
          calculatedPrice = 1967;
          break;
        case 'location22':
          calculatedPrice = 1678;
          break;
        case 'location23':
          calculatedPrice = 1390;
          break;
        case 'location24':
          calculatedPrice = 1179;
          break;
        case 'location25':
          calculatedPrice = 1021;
          break;
        case 'location26':
          calculatedPrice = 995;
          break;
        case 'location27':
          calculatedPrice = 1059;
          break;
        case 'location28':
          calculatedPrice = 1082;
          break;
        case 'location29':
          calculatedPrice = 1242;
          break;
        case 'location30':
          calculatedPrice = 1459;
          break;
        case 'location31':
          calculatedPrice = 1534;
          break;
        default:
          break;
      }
    }
  }


       // MINDANAO AVENUE ENTRY POINT (DONE)
       if (
        selectedOption === 'option1' &&
        locationdropdown === 'locationA' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location1' ||
         locationdropdown2 === 'location3' ||
         locationdropdown2 === 'location4' ||
         locationdropdown2 === 'location5' ||
         locationdropdown2 === 'location6' ||
         locationdropdown2 === 'location7' ||
         locationdropdown2 === 'location8' ||
         locationdropdown2 === 'location9' ||
         locationdropdown2 === 'location10' ||
         locationdropdown2 === 'location11' ||
         locationdropdown2 === 'location12' ||
         locationdropdown2 === 'location13' ||
         locationdropdown2 === 'location14' ||
         locationdropdown2 === 'location15' ||
         locationdropdown2 === 'location16' ||
         locationdropdown2 === 'location17' ||
         locationdropdown2 === 'location18' ||
         locationdropdown2 === 'location19' ||
         locationdropdown2 === 'location20' ||
         locationdropdown2 === 'location21' ||
         locationdropdown2 === 'location22' ||
         locationdropdown2 === 'location23' ||
         locationdropdown2 === 'location24' ||
         locationdropdown2 === 'location25' ||
         locationdropdown2 === 'location26' ||
         locationdropdown2 === 'location27' ||
         locationdropdown2 === 'location28' ||
         locationdropdown2 === 'location29' ||
         locationdropdown2 === 'location30' ||
         locationdropdown2 === 'location31')
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location1':
            case 'location3':
            case 'location4':
            case 'location5':
            case 'location6':
            case 'location7':
              calculatedPrice = 69;
              break;
            case 'location8':
              calculatedPrice = 77;
              break;
            case 'location9':
              calculatedPrice = 84;
              break;
            case 'location10':
              calculatedPrice = 88;
              break;
            case 'location11':
              calculatedPrice = 107;
              break;
            case 'location12':
              calculatedPrice = 122;
              break;
            case 'location13':
              calculatedPrice = 128;
              break;
            case 'location14':
              calculatedPrice = 156;
              break;
            case 'location15':
              calculatedPrice = 203;
              break;
            case 'location16':
              calculatedPrice = 239;
              break;
            case 'location17':
              calculatedPrice = 268;
              break;
            case 'location18':
              calculatedPrice = 302;
              break;
            case 'location19':
              calculatedPrice = 310;
              break;
            case 'location20':
              calculatedPrice = 332;
              break;
            case 'location21':
              calculatedPrice = 656;
              break;
            case 'location22':
              calculatedPrice = 560;
              break;
            case 'location23':
              calculatedPrice = 464;
              break;
            case 'location24':
              calculatedPrice = 393;
              break;
            case 'location25':
              calculatedPrice = 341;
              break;
            case 'location26':
              calculatedPrice = 332;
              break;
            case 'location27':
              calculatedPrice = 353;
              break;
            case 'location28':
              calculatedPrice = 361;
              break;
            case 'location29':
              calculatedPrice = 414;
              break;
            case 'location30':
              calculatedPrice = 487;
              break;
            case 'location31':
              calculatedPrice = 512;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location1':
            case 'location3':
            case 'location4':
            case 'location5':
            case 'location6':
            case 'location7':
              calculatedPrice = 172;
              break;
            case 'location8':
              calculatedPrice = 193;
              break;
            case 'location9':
              calculatedPrice = 210;
              break;
            case 'location10':
              calculatedPrice = 219;
              break;
            case 'location11':
              calculatedPrice = 267;
              break;
            case 'location12':
              calculatedPrice = 306;
              break;
            case 'location13':
              calculatedPrice = 320;
              break;
            case 'location14':
              calculatedPrice = 389;
              break;
            case 'location15':
              calculatedPrice = 507;
              break;
            case 'location16':
              calculatedPrice = 597;
              break;
            case 'location17':
              calculatedPrice = 669;
              break;
            case 'location18':
              calculatedPrice = 755;
              break;
            case 'location19':
              calculatedPrice = 775;
              break;
            case 'location20':
              calculatedPrice = 829;
              break;
            case 'location21':
              calculatedPrice = 1494;
              break;
            case 'location22':
              calculatedPrice = 1284;
              break;
            case 'location23':
              calculatedPrice = 1092;
              break;
            case 'location24':
              calculatedPrice = 952;
              break;
            case 'location25':
              calculatedPrice = 846;
              break;
            case 'location26':
              calculatedPrice = 829;
              break;
            case 'location27':
              calculatedPrice = 871;
              break;
            case 'location28':
              calculatedPrice = 887;
              break;
            case 'location29':
              calculatedPrice = 994;
              break;
            case 'location30':
              calculatedPrice = 1138;
              break;
            case 'location31':
              calculatedPrice = 1188;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location1':
            case 'location3':
            case 'location4':
            case 'location5':
            case 'location6':
            case 'location7':
              calculatedPrice = 206;
              break;
            case 'location8':
              calculatedPrice = 232;
              break;
            case 'location9':
              calculatedPrice = 252;
              break;
            case 'location10':
              calculatedPrice = 263;
              break;
            case 'location11':
              calculatedPrice = 321;
              break;
            case 'location12':
              calculatedPrice = 367;
              break;
            case 'location13':
              calculatedPrice = 383;
              break;
            case 'location14':
              calculatedPrice = 467;
              break;
            case 'location15':
              calculatedPrice = 609;
              break;
            case 'location16':
              calculatedPrice = 717;
              break;
            case 'location17':
              calculatedPrice = 803;
              break;
            case 'location18':
              calculatedPrice = 905;
              break;
            case 'location19':
              calculatedPrice = 930;
              break;
            case 'location20':
              calculatedPrice = 995;
              break;
            case 'location21':
              calculatedPrice = 1967;
              break;
            case 'location22':
              calculatedPrice = 1678;
              break;
            case 'location23':
              calculatedPrice = 1390;
              break;
            case 'location24':
              calculatedPrice = 1179;
              break;
            case 'location25':
              calculatedPrice = 1021;
              break;
            case 'location26':
              calculatedPrice = 995;
              break;
            case 'location27':
              calculatedPrice = 1059;
              break;
            case 'location28':
              calculatedPrice = 1082;
              break;
            case 'location29':
              calculatedPrice = 1242;
              break;
            case 'location31':
              calculatedPrice = 1459;
              break;
            case 'location30':
              calculatedPrice = 1534;
              break;
            default:
              break;
          }
        }
      }



             // KARUHATAN ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationB' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location4':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 69;
                    break;
                  case 'location8':
                    calculatedPrice = 77;
                    break;
                  case 'location9':
                    calculatedPrice = 84;
                    break;
                  case 'location10':
                    calculatedPrice = 88;
                    break;
                  case 'location11':
                    calculatedPrice = 107;
                    break;
                  case 'location12':
                    calculatedPrice = 122;
                    break;
                  case 'location13':
                    calculatedPrice = 128;
                    break;
                  case 'location14':
                    calculatedPrice = 156;
                    break;
                  case 'location15':
                    calculatedPrice = 203;
                    break;
                  case 'location16':
                    calculatedPrice = 239;
                    break;
                  case 'location17':
                    calculatedPrice = 268;
                    break;
                  case 'location18':
                    calculatedPrice = 302;
                    break;
                  case 'location19':
                    calculatedPrice = 310;
                    break;
                  case 'location20':
                    calculatedPrice = 332;
                    break;
                  case 'location21':
                    calculatedPrice = 656;
                    break;
                  case 'location22':
                    calculatedPrice = 560;
                    break;
                  case 'location23':
                    calculatedPrice = 464;
                    break;
                  case 'location24':
                    calculatedPrice = 393;
                    break;
                  case 'location25':
                    calculatedPrice = 341;
                    break;
                  case 'location26':
                    calculatedPrice = 332;
                    break;
                  case 'location27':
                    calculatedPrice = 353;
                    break;
                  case 'location28':
                    calculatedPrice = 361;
                    break;
                  case 'location29':
                    calculatedPrice = 414;
                    break;
                  case 'location30':
                    calculatedPrice = 487;
                    break;
                  case 'location31':
                    calculatedPrice = 512;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location4':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 172;
                    break;
                  case 'location8':
                    calculatedPrice = 193;
                    break;
                  case 'location9':
                    calculatedPrice = 210;
                    break;
                  case 'location10':
                    calculatedPrice = 219;
                    break;
                  case 'location11':
                    calculatedPrice = 267;
                    break;
                  case 'location12':
                    calculatedPrice = 306;
                    break;
                  case 'location13':
                    calculatedPrice = 320;
                    break;
                  case 'location14':
                    calculatedPrice = 389;
                    break;
                  case 'location15':
                    calculatedPrice = 507;
                    break;
                  case 'location16':
                    calculatedPrice = 597;
                    break;
                  case 'location17':
                    calculatedPrice = 669;
                    break;
                  case 'location18':
                    calculatedPrice = 755;
                    break;
                  case 'location19':
                    calculatedPrice = 775;
                    break;
                  case 'location20':
                    calculatedPrice = 829;
                    break;
                  case 'location21':
                    calculatedPrice = 1494;
                    break;
                  case 'location22':
                    calculatedPrice = 1284;
                    break;
                  case 'location23':
                    calculatedPrice = 1092;
                    break;
                  case 'location24':
                    calculatedPrice = 952;
                    break;
                  case 'location25':
                    calculatedPrice = 846;
                    break;
                  case 'location26':
                    calculatedPrice = 829;
                    break;
                  case 'location27':
                    calculatedPrice = 871;
                    break;
                  case 'location28':
                    calculatedPrice = 887;
                    break;
                  case 'location29':
                    calculatedPrice = 994;
                    break;
                  case 'location30':
                    calculatedPrice = 1138;
                    break;
                  case 'location31':
                    calculatedPrice = 1188;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location4':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 206;
                    break;
                  case 'location8':
                    calculatedPrice = 232;
                    break;
                  case 'location9':
                    calculatedPrice = 252;
                    break;
                  case 'location10':
                    calculatedPrice = 263;
                    break;
                  case 'location11':
                    calculatedPrice = 321;
                    break;
                  case 'location12':
                    calculatedPrice = 367;
                    break;
                  case 'location13':
                    calculatedPrice = 383;
                    break;
                  case 'location14':
                    calculatedPrice = 467;
                    break;
                  case 'location15':
                    calculatedPrice = 609;
                    break;
                  case 'location16':
                    calculatedPrice = 717;
                    break;
                  case 'location17':
                    calculatedPrice = 803;
                    break;
                  case 'location18':
                    calculatedPrice = 905;
                    break;
                  case 'location19':
                    calculatedPrice = 930;
                    break;
                  case 'location20':
                    calculatedPrice = 995;
                    break;
                  case 'location21':
                    calculatedPrice = 1967;
                    break;
                  case 'location22':
                    calculatedPrice = 1678;
                    break;
                  case 'location23':
                    calculatedPrice = 1390;
                    break;
                  case 'location24':
                    calculatedPrice = 1179;
                    break;
                  case 'location25':
                    calculatedPrice = 1021;
                    break;
                  case 'location26':
                    calculatedPrice = 995;
                    break;
                  case 'location27':
                    calculatedPrice = 1059;
                    break;
                  case 'location28':
                    calculatedPrice = 1082;
                    break;
                  case 'location29':
                    calculatedPrice = 1242;
                    break;
                  case 'location30':
                    calculatedPrice = 1459;
                    break;
                  case 'location31':
                    calculatedPrice = 1534;
                    break;
                  default:
                    break;
                }
              }
            }


             // VALENZUELA ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationC' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 69;
                    break;
                  case 'location8':
                    calculatedPrice = 77;
                    break;
                  case 'location9':
                    calculatedPrice = 84;
                    break;
                  case 'location10':
                    calculatedPrice = 88;
                    break;
                  case 'location11':
                    calculatedPrice = 107;
                    break;
                  case 'location12':
                    calculatedPrice = 122;
                    break;
                  case 'location13':
                    calculatedPrice = 128;
                    break;
                  case 'location14':
                    calculatedPrice = 156;
                    break;
                  case 'location15':
                    calculatedPrice = 203;
                    break;
                  case 'location16':
                    calculatedPrice = 239;
                    break;
                  case 'location17':
                    calculatedPrice = 268;
                    break;
                  case 'location18':
                    calculatedPrice = 302;
                    break;
                  case 'location19':
                    calculatedPrice = 310;
                    break;
                  case 'location20':
                    calculatedPrice = 332;
                    break;
                  case 'location21':
                    calculatedPrice = 656;
                    break;
                  case 'location22':
                    calculatedPrice = 560;
                    break;
                  case 'location23':
                    calculatedPrice = 464;
                    break;
                  case 'location24':
                    calculatedPrice = 393;
                    break;
                  case 'location25':
                    calculatedPrice = 341;
                    break;
                  case 'location26':
                    calculatedPrice = 332;
                    break;
                  case 'location27':
                    calculatedPrice = 353;
                    break;
                  case 'location28':
                    calculatedPrice = 361;
                    break;
                  case 'location29':
                    calculatedPrice = 414;
                    break;
                  case 'location30':
                    calculatedPrice = 487;
                    break;
                  case 'location31':
                    calculatedPrice = 512;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 172;
                    break;
                  case 'location8':
                    calculatedPrice = 193;
                    break;
                  case 'location9':
                    calculatedPrice = 210;
                    break;
                  case 'location10':
                    calculatedPrice = 219;
                    break;
                  case 'location11':
                    calculatedPrice = 267;
                    break;
                  case 'location12':
                    calculatedPrice = 306;
                    break;
                  case 'location13':
                    calculatedPrice = 320;
                    break;
                  case 'location14':
                    calculatedPrice = 389;
                    break;
                  case 'location15':
                    calculatedPrice = 507;
                    break;
                  case 'location16':
                    calculatedPrice = 597;
                    break;
                  case 'location17':
                    calculatedPrice = 669;
                    break;
                  case 'location18':
                    calculatedPrice = 755;
                    break;
                  case 'location19':
                    calculatedPrice = 775;
                    break;
                  case 'location20':
                    calculatedPrice = 829;
                    break;
                  case 'location21':
                    calculatedPrice = 1494;
                    break;
                  case 'location22':
                    calculatedPrice = 1284;
                    break;
                  case 'location23':
                    calculatedPrice = 1092;
                    break;
                  case 'location24':
                    calculatedPrice = 952;
                    break;
                  case 'location25':
                    calculatedPrice = 846;
                    break;
                  case 'location26':
                    calculatedPrice = 829;
                    break;
                  case 'location27':
                    calculatedPrice = 871;
                    break;
                  case 'location28':
                    calculatedPrice = 887;
                    break;
                  case 'location29':
                    calculatedPrice = 994;
                    break;
                  case 'location30':
                    calculatedPrice = 1138;
                    break;
                  case 'location31':
                    calculatedPrice = 1188;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location5':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 206;
                    break;
                  case 'location8':
                    calculatedPrice = 232;
                    break;
                  case 'location9':
                    calculatedPrice = 252;
                    break;
                  case 'location10':
                    calculatedPrice = 263;
                    break;
                  case 'location11':
                    calculatedPrice = 321;
                    break;
                  case 'location12':
                    calculatedPrice = 367;
                    break;
                  case 'location13':
                    calculatedPrice = 383;
                    break;
                  case 'location14':
                    calculatedPrice = 467;
                    break;
                  case 'location15':
                    calculatedPrice = 609;
                    break;
                  case 'location16':
                    calculatedPrice = 717;
                    break;
                  case 'location17':
                    calculatedPrice = 803;
                    break;
                  case 'location18':
                    calculatedPrice = 905;
                    break;
                  case 'location19':
                    calculatedPrice = 930;
                    break;
                  case 'location20':
                    calculatedPrice = 995;
                    break;
                  case 'location21':
                    calculatedPrice = 1967;
                    break;
                  case 'location22':
                    calculatedPrice = 1678;
                    break;
                  case 'location23':
                    calculatedPrice = 1390;
                    break;
                  case 'location24':
                    calculatedPrice = 1179;
                    break;
                  case 'location25':
                    calculatedPrice = 1021;
                    break;
                  case 'location26':
                    calculatedPrice = 995;
                    break;
                  case 'location27':
                    calculatedPrice = 1059;
                    break;
                  case 'location28':
                    calculatedPrice = 1082;
                    break;
                  case 'location29':
                    calculatedPrice = 1242;
                    break;
                  case 'location30':
                    calculatedPrice = 1459;
                    break;
                  case 'location31':
                    calculatedPrice = 1534;
                    break;
                  default:
                    break;
                }
              }
            }


             // LAWANG BATO ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationD' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                    calculatedPrice = 69;
                    break;
                    case 'location6':
                      case 'location7':
                      case 'location8':
                      case 'location9':
                      case 'location10':
                      case 'location11':
                      case 'location12':
                      case 'location13':
                      case 'location14':
                      case 'location15':
                      case 'location16':
                      case 'location17':
                      case 'location18':
                      case 'location19':
                      case 'location20':
                      case 'location21':
                      case 'location22':
                      case 'location23':
                      case 'location24':
                      case 'location25':
                      case 'location26':
                      case 'location27':
                      case 'location28':
                      case 'location29':
                      case 'location30':
                      case 'location31':
                        calculatedPrice = 'NO EXIT';
                        break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                    calculatedPrice = 172;
                    break;
                    case 'location6':
                      case 'location7':
                      case 'location8':
                      case 'location9':
                      case 'location10':
                      case 'location11':
                      case 'location12':
                      case 'location13':
                      case 'location14':
                      case 'location15':
                      case 'location16':
                      case 'location17':
                      case 'location18':
                      case 'location19':
                      case 'location20':
                      case 'location21':
                      case 'location22':
                      case 'location23':
                      case 'location24':
                      case 'location25':
                      case 'location26':
                      case 'location27':
                      case 'location28':
                      case 'location29':
                      case 'location30':
                      case 'location31':
                        calculatedPrice = 'NO EXIT';
                        break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                    calculatedPrice = 206;
                    break;
                  case 'location6':
                  case 'location7':
                  case 'location8':
                  case 'location9':
                  case 'location10':
                  case 'location11':
                  case 'location12':
                  case 'location13':
                  case 'location14':
                  case 'location15':
                  case 'location16':
                  case 'location17':
                  case 'location18':
                  case 'location19':
                  case 'location20':
                  case 'location21':
                  case 'location22':
                  case 'location23':
                  case 'location24':
                  case 'location25':
                  case 'location26':
                  case 'location27':
                  case 'location28':
                  case 'location29':
                  case 'location30':
                  case 'location31':
                    calculatedPrice = 'NO EXIT';
                    break;
                  default:
                    break;
                }
              }
            }




 // MEYCAUAYAN ENTRY POINT (DONE)
 if (
  selectedOption === 'option1' &&
  locationdropdown === 'locationE' &&
  locationdropdown2 &&
  (locationdropdown2 === 'location1' ||
   locationdropdown2 === 'location2' ||
   locationdropdown2 === 'location3' ||
   locationdropdown2 === 'location4' ||
   locationdropdown2 === 'location5' ||
   locationdropdown2 === 'location7' ||
   locationdropdown2 === 'location8' ||
   locationdropdown2 === 'location9' ||
   locationdropdown2 === 'location10' ||
   locationdropdown2 === 'location11' ||
   locationdropdown2 === 'location12' ||
   locationdropdown2 === 'location13' ||
   locationdropdown2 === 'location14' ||
   locationdropdown2 === 'location15' ||
   locationdropdown2 === 'location16' ||
   locationdropdown2 === 'location17' ||
   locationdropdown2 === 'location18' ||
   locationdropdown2 === 'location19' ||
   locationdropdown2 === 'location20' ||
   locationdropdown2 === 'location21' ||
   locationdropdown2 === 'location22' ||
   locationdropdown2 === 'location23' ||
   locationdropdown2 === 'location24' ||
   locationdropdown2 === 'location25' ||
   locationdropdown2 === 'location26' ||
   locationdropdown2 === 'location27' ||
   locationdropdown2 === 'location28' ||
   locationdropdown2 === 'location29' ||
   locationdropdown2 === 'location30' ||
   locationdropdown2 === 'location31')
) {
  if (selectedClass === 'class1') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location7':
        calculatedPrice = 69;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 77;
        break;
      case 'location9':
        calculatedPrice = 84;
        break;
      case 'location10':
        calculatedPrice = 88;
        break;
      case 'location11':
        calculatedPrice = 107;
        break;
      case 'location12':
        calculatedPrice = 122;
        break;
      case 'location13':
        calculatedPrice = 128;
        break;
      case 'location14':
        calculatedPrice = 156;
        break;
      case 'location15':
        calculatedPrice = 203;
        break;
      case 'location16':
        calculatedPrice = 239;
        break;
      case 'location17':
        calculatedPrice = 268;
        break;
      case 'location18':
        calculatedPrice = 302;
        break;
      case 'location19':
        calculatedPrice = 310;
        break;
      case 'location20':
        calculatedPrice = 332;
        break;
      case 'location21':
        calculatedPrice = 656;
        break;
      case 'location22':
        calculatedPrice = 560;
        break;
      case 'location23':
        calculatedPrice = 464;
        break;
      case 'location24':
        calculatedPrice = 393;
        break;
      case 'location25':
        calculatedPrice = 341;
        break;
      case 'location26':
        calculatedPrice = 332;
        break;
      case 'location27':
        calculatedPrice = 353;
        break;
      case 'location28':
        calculatedPrice = 361;
        break;
      case 'location29':
        calculatedPrice = 414;
        break;
      case 'location30':
        calculatedPrice = 487;
        break;
      case 'location31':
        calculatedPrice = 512;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class2') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location7':
        calculatedPrice = 172;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 193;
        break;
      case 'location9':
        calculatedPrice = 210;
        break;
      case 'location10':
        calculatedPrice = 219;
        break;
      case 'location11':
        calculatedPrice = 267;
        break;
      case 'location12':
        calculatedPrice = 306;
        break;
      case 'location13':
        calculatedPrice = 320;
        break;
      case 'location14':
        calculatedPrice = 389;
        break;
      case 'location15':
        calculatedPrice = 507;
        break;
      case 'location16':
        calculatedPrice = 597;
        break;
      case 'location17':
        calculatedPrice = 669;
        break;
      case 'location18':
        calculatedPrice = 755;
        break;
      case 'location19':
        calculatedPrice = 775;
        break;
      case 'location20':
        calculatedPrice = 829;
        break;
      case 'location21':
        calculatedPrice = 1494;
        break;
      case 'location22':
        calculatedPrice = 1284;
        break;
      case 'location23':
        calculatedPrice = 1092;
        break;
      case 'location24':
        calculatedPrice = 952;
        break;
      case 'location25':
        calculatedPrice = 846;
        break;
      case 'location26':
        calculatedPrice = 829;
        break;
      case 'location27':
        calculatedPrice = 871;
        break;
      case 'location28':
        calculatedPrice = 887;
        break;
      case 'location29':
        calculatedPrice = 994;
        break;
      case 'location30':
        calculatedPrice = 1138;
        break;
      case 'location31':
        calculatedPrice = 1188;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class3') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location7':
        calculatedPrice = 206;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 232;
        break;
      case 'location9':
        calculatedPrice = 252;
        break;
      case 'location10':
        calculatedPrice = 263;
        break;
      case 'location11':
        calculatedPrice = 321;
        break;
      case 'location12':
        calculatedPrice = 367;
        break;
      case 'location13':
        calculatedPrice = 383;
        break;
      case 'location14':
        calculatedPrice = 467;
        break;
      case 'location15':
        calculatedPrice = 609;
        break;
      case 'location16':
        calculatedPrice = 717;
        break;
      case 'location17':
        calculatedPrice = 803;
        break;
      case 'location18':
        calculatedPrice = 905;
        break;
      case 'location19':
        calculatedPrice = 930;
        break;
      case 'location20':
        calculatedPrice = 995;
        break;
      case 'location21':
        calculatedPrice = 1967;
        break;
      case 'location22':
        calculatedPrice = 1678;
        break;
      case 'location23':
        calculatedPrice = 1390;
        break;
      case 'location24':
        calculatedPrice = 1179;
        break;
      case 'location25':
        calculatedPrice = 1021;
        break;
      case 'location26':
        calculatedPrice = 995;
        break;
      case 'location27':
        calculatedPrice = 1059;
        break;
      case 'location28':
        calculatedPrice = 1082;
        break;
      case 'location29':
        calculatedPrice = 1242;
        break;
      case 'location30':
        calculatedPrice = 1459;
        break;
      case 'location31':
        calculatedPrice = 1534;
        break;
      default:
        break;
    }
  }
}



// MARILAO ENTRY POINT (DONE)
if (
  selectedOption === 'option1' &&
  locationdropdown === 'locationF' &&
  locationdropdown2 &&
  (locationdropdown2 === 'location1' ||
   locationdropdown2 === 'location2' ||
   locationdropdown2 === 'location3' ||
   locationdropdown2 === 'location4' ||
   locationdropdown2 === 'location5' ||
   locationdropdown2 === 'location6' ||
   locationdropdown2 === 'location8' ||
   locationdropdown2 === 'location9' ||
   locationdropdown2 === 'location10' ||
   locationdropdown2 === 'location11' ||
   locationdropdown2 === 'location12' ||
   locationdropdown2 === 'location13' ||
   locationdropdown2 === 'location14' ||
   locationdropdown2 === 'location15' ||
   locationdropdown2 === 'location16' ||
   locationdropdown2 === 'location17' ||
   locationdropdown2 === 'location18' ||
   locationdropdown2 === 'location19' ||
   locationdropdown2 === 'location20' ||
   locationdropdown2 === 'location21' ||
   locationdropdown2 === 'location22' ||
   locationdropdown2 === 'location23' ||
   locationdropdown2 === 'location24' ||
   locationdropdown2 === 'location25' ||
   locationdropdown2 === 'location26' ||
   locationdropdown2 === 'location27' ||
   locationdropdown2 === 'location28' ||
   locationdropdown2 === 'location29' ||
   locationdropdown2 === 'location30' ||
   locationdropdown2 === 'location31')
) {
  if (selectedClass === 'class1') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location6':
        calculatedPrice = 69;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 77;
        break;
      case 'location9':
        calculatedPrice = 84;
        break;
      case 'location10':
        calculatedPrice = 88;
        break;
      case 'location11':
        calculatedPrice = 107;
        break;
      case 'location12':
        calculatedPrice = 122;
        break;
      case 'location13':
        calculatedPrice = 128;
        break;
      case 'location14':
        calculatedPrice = 156;
        break;
      case 'location15':
        calculatedPrice = 203;
        break;
      case 'location16':
        calculatedPrice = 239;
        break;
      case 'location17':
        calculatedPrice = 268;
        break;
      case 'location18':
        calculatedPrice = 302;
        break;
      case 'location19':
        calculatedPrice = 310;
        break;
      case 'location20':
        calculatedPrice = 332;
        break;
      case 'location21':
        calculatedPrice = 656;
        break;
      case 'location22':
        calculatedPrice = 560;
        break;
      case 'location23':
        calculatedPrice = 464;
        break;
      case 'location24':
        calculatedPrice = 393;
        break;
      case 'location25':
        calculatedPrice = 341;
        break;
      case 'location26':
        calculatedPrice = 332;
        break;
      case 'location27':
        calculatedPrice = 353;
        break;
      case 'location28':
        calculatedPrice = 361;
        break;
      case 'location29':
        calculatedPrice = 414;
        break;
      case 'location30':
        calculatedPrice = 487;
        break;
      case 'location31':
        calculatedPrice = 512;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class2') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location6':
        calculatedPrice = 172;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 193;
        break;
      case 'location9':
        calculatedPrice = 210;
        break;
      case 'location10':
        calculatedPrice = 219;
        break;
      case 'location11':
        calculatedPrice = 267;
        break;
      case 'location12':
        calculatedPrice = 306;
        break;
      case 'location13':
        calculatedPrice = 320;
        break;
      case 'location14':
        calculatedPrice = 389;
        break;
      case 'location15':
        calculatedPrice = 507;
        break;
      case 'location16':
        calculatedPrice = 597;
        break;
      case 'location17':
        calculatedPrice = 669;
        break;
      case 'location18':
        calculatedPrice = 755;
        break;
      case 'location19':
        calculatedPrice = 775;
        break;
      case 'location20':
        calculatedPrice = 829;
        break;
      case 'location21':
        calculatedPrice = 1494;
        break;
      case 'location22':
        calculatedPrice = 1284;
        break;
      case 'location23':
        calculatedPrice = 1092;
        break;
      case 'location24':
        calculatedPrice = 952;
        break;
      case 'location25':
        calculatedPrice = 846;
        break;
      case 'location26':
        calculatedPrice = 829;
        break;
      case 'location27':
        calculatedPrice = 871;
        break;
      case 'location28':
        calculatedPrice = 887;
        break;
      case 'location29':
        calculatedPrice = 994;
        break;
      case 'location30':
        calculatedPrice = 1138;
        break;
      case 'location31':
        calculatedPrice = 1188;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class3') {
    switch (locationdropdown2) {
      case 'location1':
      case 'location2':
      case 'location3':
      case 'location4':
      case 'location6':
        calculatedPrice = 206;
        break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
      case 'location8':
        calculatedPrice = 232;
        break;
      case 'location9':
        calculatedPrice = 252;
        break;
      case 'location10':
        calculatedPrice = 263;
        break;
      case 'location11':
        calculatedPrice = 321;
        break;
      case 'location12':
        calculatedPrice = 367;
        break;
      case 'location13':
        calculatedPrice = 383;
        break;
      case 'location14':
        calculatedPrice = 467;
        break;
      case 'location15':
        calculatedPrice = 609;
        break;
      case 'location16':
        calculatedPrice = 717;
        break;
      case 'location17':
        calculatedPrice = 803;
        break;
      case 'location18':
        calculatedPrice = 905;
        break;
      case 'location19':
        calculatedPrice = 930;
        break;
      case 'location20':
        calculatedPrice = 995;
        break;
      case 'location21':
        calculatedPrice = 1967;
        break;
      case 'location22':
        calculatedPrice = 1678;
        break;
      case 'location23':
        calculatedPrice = 1390;
        break;
      case 'location24':
        calculatedPrice = 1179;
        break;
      case 'location25':
        calculatedPrice = 1021;
        break;
      case 'location26':
        calculatedPrice = 995;
        break;
      case 'location27':
        calculatedPrice = 1059;
        break;
      case 'location28':
        calculatedPrice = 1082;
        break;
      case 'location29':
        calculatedPrice = 1242;
        break;
      case 'location30':
        calculatedPrice = 1459;
        break;
      case 'location31':
        calculatedPrice = 1534;
        break;
      default:
        break;
    }
  }
}



// CIUDAD DE VICTORIA ENTRY POINT (DONE)
if (
  selectedOption === 'option1' &&
  locationdropdown === 'locationG' &&
  locationdropdown2 &&
  (locationdropdown2 === 'location1' ||
   locationdropdown2 === 'location2' ||
   locationdropdown2 === 'location3' ||
   locationdropdown2 === 'location4' ||
   locationdropdown2 === 'location5' ||
   locationdropdown2 === 'location6' ||
   locationdropdown2 === 'location7' ||
   locationdropdown2 === 'location9' ||
   locationdropdown2 === 'location10' ||
   locationdropdown2 === 'location11' ||
   locationdropdown2 === 'location12' ||
   locationdropdown2 === 'location13' ||
   locationdropdown2 === 'location14' ||
   locationdropdown2 === 'location15' ||
   locationdropdown2 === 'location16' ||
   locationdropdown2 === 'location17' ||
   locationdropdown2 === 'location18' ||
   locationdropdown2 === 'location19' ||
   locationdropdown2 === 'location20' ||
   locationdropdown2 === 'location21' ||
   locationdropdown2 === 'location22' ||
   locationdropdown2 === 'location23' ||
   locationdropdown2 === 'location24' ||
   locationdropdown2 === 'location25' ||
   locationdropdown2 === 'location26' ||
   locationdropdown2 === 'location27' ||
   locationdropdown2 === 'location28' ||
   locationdropdown2 === 'location29' ||
   locationdropdown2 === 'location30' ||
   locationdropdown2 === 'location31')
) {
  // Update the price based on the selectedClass and destination
  if (selectedClass === 'class1') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 77;
        break;
      case 'location2':
        calculatedPrice = 77;
        break;
      case 'location3':
        calculatedPrice = 77;
        break;
      case 'location4':
        calculatedPrice = 77;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 77;
        break;
      case 'location7':
        calculatedPrice = 77;
        break;
      case 'location9':
        calculatedPrice = 7;
        break;
      case 'location10':
        calculatedPrice = 10;
        break;
      case 'location11':
        calculatedPrice = 30;
        break;
      case 'location12':
        calculatedPrice = 45;
        break;
      case 'location13':
        calculatedPrice = 51;
        break;
      case 'location14':
        calculatedPrice = 78;
        break;
      case 'location15':
        calculatedPrice = 126;
        break;
      case 'location16':
        calculatedPrice = 162;
        break;
      case 'location17':
        calculatedPrice = 190;
        break;
      case 'location18':
        calculatedPrice = 225;
        break;
      case 'location19':
        calculatedPrice = 233;
        break;
      case 'location20':
        calculatedPrice = 254;
        break;
      case 'location21':
        calculatedPrice = 578;
        break;
      case 'location22':
        calculatedPrice = 482;
        break;
      case 'location23':
        calculatedPrice = 386;
        break;
      case 'location24':
        calculatedPrice = 315;
        break;
      case 'location25':
        calculatedPrice = 263;
        break;
      case 'location26':
        calculatedPrice = 254;
        break;
      case 'location27':
        calculatedPrice = 275;
        break;
      case 'location28':
        calculatedPrice = 283;
        break;
      case 'location29':
        calculatedPrice = 336;
        break;
      case 'location30':
        calculatedPrice = 409;
        break;
      case 'location31':
        calculatedPrice = 434;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class2') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 193;
        break;
      case 'location2':
        calculatedPrice = 193;
        break;
      case 'location3':
        calculatedPrice = 193;
        break;
      case 'location4':
        calculatedPrice = 193;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 193;
        break;
      case 'location7':
        calculatedPrice = 193;
        break;
      case 'location9':
        calculatedPrice = 17;
        break;
      case 'location10':
        calculatedPrice = 26;
        break;
      case 'location11':
        calculatedPrice = 74;
        break;
      case 'location12':
        calculatedPrice = 113;
        break;
      case 'location13':
        calculatedPrice = 126;
        break;
      case 'location14':
        calculatedPrice = 196;
        break;
      case 'location15':
        calculatedPrice = 314;
        break;
      case 'location16':
        calculatedPrice = 404;
        break;
      case 'location17':
        calculatedPrice = 476;
        break;
      case 'location18':
        calculatedPrice = 561;
        break;
      case 'location19':
        calculatedPrice = 582;
        break;
      case 'location20':
        calculatedPrice = 636;
        break;
      case 'location21':
        calculatedPrice = 1301;
        break;
      case 'location22':
        calculatedPrice = 1091;
        break;
      case 'location23':
        calculatedPrice = 899;
        break;
      case 'location24':
        calculatedPrice = 759;
        break;
      case 'location25':
        calculatedPrice = 653;
        break;
      case 'location26':
        calculatedPrice = 636;
        break;
      case 'location27':
        calculatedPrice = 678;
        break;
      case 'location28':
        calculatedPrice = 694;
        break;
      case 'location29':
        calculatedPrice = 801;
        break;
      case 'location30':
        calculatedPrice = 945;
        break;
      case 'location31':
        calculatedPrice = 995;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class3') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 232;
        break;
      case 'location2':
        calculatedPrice = 232;
        break;
      case 'location3':
        calculatedPrice = 232;
        break;
      case 'location4':
        calculatedPrice = 232;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 232;
        break;
      case 'location7':
        calculatedPrice = 232;
        break;
      case 'location9':
        calculatedPrice = 20;
        break;
      case 'location10':
        calculatedPrice = 31;
        break;
      case 'location11':
        calculatedPrice = 89;
        break;
      case 'location12':
        calculatedPrice = 135;
        break;
      case 'location13':
        calculatedPrice = 152;
        break;
      case 'location14':
        calculatedPrice = 235;
        break;
      case 'location15':
        calculatedPrice = 377;
        break;
      case 'location16':
        calculatedPrice = 485;
        break;
      case 'location17':
        calculatedPrice = 571;
        break;
      case 'location18':
        calculatedPrice = 674;
        break;
      case 'location19':
        calculatedPrice = 699;
        break;
      case 'location20':
        calculatedPrice = 763;
        break;
      case 'location21':
        calculatedPrice = 1735;
        break;
      case 'location22':
        calculatedPrice = 1446;
        break;
      case 'location23':
        calculatedPrice = 1158;
        break;
      case 'location24':
        calculatedPrice = 947;
        break;
      case 'location25':
        calculatedPrice = 789;
        break;
      case 'location26':
        calculatedPrice = 763;
        break;
      case 'location27':
        calculatedPrice = 827;
        break;
      case 'location28':
        calculatedPrice = 850;
        break;
      case 'location29':
        calculatedPrice = 1010;
        break;
      case 'location30':
        calculatedPrice = 1227;
        break;
      case 'location31':
        calculatedPrice = 1302;
        break;
      default:
        break;
    }
  }
}



   // BOCAUE ENTRY POINT (DONE)
  if (
    selectedOption === 'option1' &&
    locationdropdown === 'locationH' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location1' ||
     locationdropdown2 === 'location2' ||
     locationdropdown2 === 'location3' ||
     locationdropdown2 === 'location4' ||
     locationdropdown2 === 'location5' ||
     locationdropdown2 === 'location6' ||
     locationdropdown2 === 'location7' ||
     locationdropdown2 === 'location8' ||
     locationdropdown2 === 'location10' ||
     locationdropdown2 === 'location11' ||
     locationdropdown2 === 'location12' ||
     locationdropdown2 === 'location13' ||
     locationdropdown2 === 'location14' ||
     locationdropdown2 === 'location15' ||
     locationdropdown2 === 'location16' ||
     locationdropdown2 === 'location17' ||
     locationdropdown2 === 'location18' ||
     locationdropdown2 === 'location19' ||
     locationdropdown2 === 'location20' ||
     locationdropdown2 === 'location21' ||
     locationdropdown2 === 'location22' ||
     locationdropdown2 === 'location23' ||
     locationdropdown2 === 'location24' ||
     locationdropdown2 === 'location25' ||
     locationdropdown2 === 'location26' ||
     locationdropdown2 === 'location27' ||
     locationdropdown2 === 'location28' ||
     locationdropdown2 === 'location29' ||
     locationdropdown2 === 'location30' ||
     locationdropdown2 === 'location31')
  ) {
    // Update the price based on the selectedClass and destination
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 84;
          break;
        case 'location2':
          calculatedPrice = 84;
          break;
        case 'location3':
          calculatedPrice = 84;
          break;
        case 'location4':
          calculatedPrice = 84;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 84;
          break;
        case 'location7':
          calculatedPrice = 84;
          break;
        case 'location8':
          calculatedPrice = 7;
          break;
        case 'location10':
          calculatedPrice = 4;
          break;
        case 'location11':
          calculatedPrice = 23;
          break;
        case 'location12':
          calculatedPrice = 38;
          break;
        case 'location13':
          calculatedPrice = 44;
          break;
        case 'location14':
          calculatedPrice = 71;
          break;
        case 'location15':
          calculatedPrice = 119;
          break;
        case 'location16':
          calculatedPrice = 155;
          break;
        case 'location17':
          calculatedPrice = 184;
          break;
        case 'location18':
          calculatedPrice = 218;
          break;
        case 'location19':
          calculatedPrice = 226;
          break;
        case 'location20':
          calculatedPrice = 248;
          break;
        case 'location21':
          calculatedPrice = 572;
          break;
        case 'location22':
          calculatedPrice = 476;
          break;
        case 'location23':
          calculatedPrice = 380;
          break;
        case 'location24':
          calculatedPrice = 309;
          break;
        case 'location25':
          calculatedPrice = 257;
          break;
        case 'location26':
          calculatedPrice = 248;
          break;
        case 'location27':
          calculatedPrice = 269;
          break;
        case 'location28':
          calculatedPrice = 277;
          break;
        case 'location29':
          calculatedPrice = 330;
          break;
        case 'location30':
          calculatedPrice = 403;
          break;
        case 'location31':
          calculatedPrice = 428;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 210;
          break;
        case 'location2':
          calculatedPrice = 210;
          break;
        case 'location3':
          calculatedPrice = 210;
          break;
        case 'location4':
          calculatedPrice = 210;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 210;
          break;
        case 'location7':
          calculatedPrice = 210;
          break;
        case 'location8':
          calculatedPrice = 17;
          break;
        case 'location10':
          calculatedPrice = 9;
          break;
        case 'location11':
          calculatedPrice = 57;
          break;
        case 'location12':
          calculatedPrice = 96;
          break;
        case 'location13':
          calculatedPrice = 109;
          break;
        case 'location14':
          calculatedPrice = 179;
          break;
        case 'location15':
          calculatedPrice = 297;
          break;
        case 'location16':
          calculatedPrice = 387;
          break;
        case 'location17':
          calculatedPrice = 459;
          break;
        case 'location18':
          calculatedPrice = 544;
          break;
        case 'location19':
          calculatedPrice = 565;
          break;
        case 'location20':
          calculatedPrice = 619;
          break;
        case 'location21':
          calculatedPrice = 1284;
          break;
        case 'location22':
          calculatedPrice = 1074;
          break;
        case 'location23':
          calculatedPrice = 882;
          break;
        case 'location24':
          calculatedPrice = 742;
          break;
        case 'location25':
          calculatedPrice = 636;
          break;
        case 'location26':
          calculatedPrice = 619;
          break;
        case 'location27':
          calculatedPrice = 661;
          break;
        case 'location28':
          calculatedPrice = 677;
          break;
        case 'location29':
          calculatedPrice = 784;
          break;
        case 'location30':
          calculatedPrice = 928;
          break;
        case 'location31':
          calculatedPrice = 978;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 252;
          break;
        case 'location2':
          calculatedPrice = 252;
          break;
        case 'location3':
          calculatedPrice = 252;
          break;
        case 'location4':
          calculatedPrice = 252;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 252;
          break;
        case 'location7':
          calculatedPrice = 252;
          break;
        case 'location8':
          calculatedPrice = 20;
          break;
        case 'location10':
          calculatedPrice = 11;
          break;
        case 'location11':
          calculatedPrice = 68;
          break;
        case 'location12':
          calculatedPrice = 115;
          break;
        case 'location13':
          calculatedPrice = 131;
          break;
        case 'location14':
          calculatedPrice = 214;
          break;
        case 'location15':
          calculatedPrice = 356;
          break;
        case 'location16':
          calculatedPrice = 464;
          break;
        case 'location17':
          calculatedPrice = 551;
          break;
        case 'location18':
          calculatedPrice = 653;
          break;
        case 'location19':
          calculatedPrice = 678;
          break;
        case 'location20':
          calculatedPrice = 743;
          break;
        case 'location21':
          calculatedPrice = 1715;
          break;
        case 'location22':
          calculatedPrice = 1426;
          break;
        case 'location23':
          calculatedPrice = 1138;
          break;
        case 'location24':
          calculatedPrice = 927;
          break;
        case 'location25':
          calculatedPrice = 769;
          break;
        case 'location26':
          calculatedPrice = 743;
          break;
        case 'location27':
          calculatedPrice = 807;
          break;
        case 'location28':
          calculatedPrice = 830;
          break;
        case 'location29':
          calculatedPrice = 990;
          break;
        case 'location30':
          calculatedPrice = 1207;
          break;
        case 'location31':
          calculatedPrice = 1282;
          break;
        default:
          break;
      }
    }
  }


  // TAMBUBONG ENTRY POINT (DONE)
if (
  selectedOption === 'option1' &&
  locationdropdown === 'locationI' &&
  locationdropdown2 &&
  (locationdropdown2 === 'location1' ||
   locationdropdown2 === 'location2' ||
   locationdropdown2 === 'location3' ||
   locationdropdown2 === 'location4' ||
   locationdropdown2 === 'location5' ||
   locationdropdown2 === 'location6' ||
   locationdropdown2 === 'location7' ||
   locationdropdown2 === 'location8' ||
   locationdropdown2 === 'location9' ||
   locationdropdown2 === 'location10' ||
   locationdropdown2 === 'location12' ||
   locationdropdown2 === 'location13' ||
   locationdropdown2 === 'location14' ||
   locationdropdown2 === 'location15' ||
   locationdropdown2 === 'location16' ||
   locationdropdown2 === 'location17' ||
   locationdropdown2 === 'location18' ||
   locationdropdown2 === 'location19' ||
   locationdropdown2 === 'location20' ||
   locationdropdown2 === 'location21' ||
   locationdropdown2 === 'location22' ||
   locationdropdown2 === 'location23' ||
   locationdropdown2 === 'location24' ||
   locationdropdown2 === 'location25' ||
   locationdropdown2 === 'location26' ||
   locationdropdown2 === 'location27' ||
   locationdropdown2 === 'location28' ||
   locationdropdown2 === 'location29' ||
   locationdropdown2 === 'location30' ||
   locationdropdown2 === 'location31')
) {
  // Update the price based on the selectedClass and destination
  if (selectedClass === 'class1') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 88;
        break;
      case 'location2':
        calculatedPrice = 88;
        break;
      case 'location3':
        calculatedPrice = 88;
        break;
      case 'location4':
        calculatedPrice = 88;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 88;
        break;
      case 'location7':
        calculatedPrice = 88;
        break;
      case 'location8':
        calculatedPrice = 10;
        break;
      case 'location9':
        calculatedPrice = 4;
        break;
      case 'location11':
        calculatedPrice = 19;
        break;
      case 'location12':
        calculatedPrice = 35;
        break;
      case 'location13':
        calculatedPrice = 40;
        break;
      case 'location14':
        calculatedPrice = 68;
        break;
      case 'location15':
        calculatedPrice = 115;
        break;
      case 'location16':
        calculatedPrice = 151;
        break;
      case 'location17':
        calculatedPrice = 180;
        break;
      case 'location18':
        calculatedPrice = 214;
        break;
      case 'location19':
        calculatedPrice = 222;
        break;
      case 'location20':
        calculatedPrice = 244;
        break;
      case 'location21':
        calculatedPrice = 568;
        break;
      case 'location22':
        calculatedPrice = 472;
        break;
      case 'location23':
        calculatedPrice = 376;
        break;
      case 'location24':
        calculatedPrice = 305;
        break;
      case 'location25':
        calculatedPrice = 253;
        break;
      case 'location26':
        calculatedPrice = 244;
        break;
      case 'location27':
        calculatedPrice = 265;
        break;
      case 'location28':
        calculatedPrice = 273;
        break;
      case 'location29':
        calculatedPrice = 326;
        break;
      case 'location30':
        calculatedPrice = 399;
        break;
      case 'location31':
        calculatedPrice = 424;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class2') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 219;
        break;
      case 'location2':
        calculatedPrice = 219;
        break;
      case 'location3':
        calculatedPrice = 219;
        break;
      case 'location4':
        calculatedPrice = 219;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 219;
        break;
      case 'location7':
        calculatedPrice = 219;
        break;
      case 'location8':
        calculatedPrice = 26;
        break;
      case 'location9':
        calculatedPrice = 9;
        break;
      case 'location11':
        calculatedPrice = 48;
        break;
      case 'location12':
        calculatedPrice = 87;
        break;
      case 'location13':
        calculatedPrice = 100;
        break;
      case 'location14':
        calculatedPrice = 170;
        break;
      case 'location15':
        calculatedPrice = 288;
        break;
      case 'location16':
        calculatedPrice = 378;
        break;
      case 'location17':
        calculatedPrice = 450;
        break;
      case 'location18':
        calculatedPrice = 535;
        break;
      case 'location19':
        calculatedPrice = 556;
        break;
      case 'location20':
        calculatedPrice = 610;
        break;
      case 'location21':
        calculatedPrice = 1275;
        break;
      case 'location22':
        calculatedPrice = 1065;
        break;
      case 'location23':
        calculatedPrice = 873;
        break;
      case 'location24':
        calculatedPrice = 733;
        break;
      case 'location25':
        calculatedPrice = 627;
        break;
      case 'location26':
        calculatedPrice = 610;
        break;
      case 'location27':
        calculatedPrice = 652;
        break;
      case 'location28':
        calculatedPrice = 668;
        break;
      case 'location29':
        calculatedPrice = 775;
        break;
      case 'location30':
        calculatedPrice = 919;
        break;
      case 'location31':
        calculatedPrice = 969;
        break;
      default:
        break;
    }
  } else if (selectedClass === 'class3') {
    switch (locationdropdown2) {
      case 'location1':
        calculatedPrice = 263;
        break;
      case 'location2':
        calculatedPrice = 263;
        break;
      case 'location3':
        calculatedPrice = 263;
        break;
      case 'location4':
        calculatedPrice = 263;
        break;
      case 'location5':
        calculatedPrice = 'NO EXIT';
        break;
      case 'location6':
        calculatedPrice = 263;
        break;
      case 'location7':
        calculatedPrice = 263;
        break;
      case 'location8':
        calculatedPrice = 31;
        break;
      case 'location9':
        calculatedPrice = 11;
        break;
      case 'location11':
        calculatedPrice = 57;
        break;
      case 'location12':
        calculatedPrice = 104;
        break;
      case 'location13':
        calculatedPrice = 120;
        break;
      case 'location14':
        calculatedPrice = 203;
        break;
      case 'location15':
        calculatedPrice = 345;
        break;
      case 'location16':
        calculatedPrice = 453;
        break;
      case 'location17':
        calculatedPrice = 540;
        break;
      case 'location18':
        calculatedPrice = 642;
        break;
      case 'location19':
        calculatedPrice = 667;
        break;
      case 'location20':
        calculatedPrice = 732;
        break;
      case 'location21':
        calculatedPrice = 1704;
        break;
      case 'location22':
        calculatedPrice = 1415;
        break;
      case 'location23':
        calculatedPrice = 1127;
        break;
      case 'location24':
        calculatedPrice = 916;
        break;
      case 'location25':
        calculatedPrice = 758;
        break;
      case 'location26':
        calculatedPrice = 732;
        break;
      case 'location27':
        calculatedPrice = 796;
        break;
      case 'location28':
        calculatedPrice = 819;
        break;
      case 'location29':
        calculatedPrice = 979;
        break;
      case 'location30':
        calculatedPrice = 1196;
        break;
      case 'location31':
        calculatedPrice = 1271;
        break;
      default:
        break;
    }
  }
}


  // BALAGTAS ENTRY POINT (DONE)
  if (
    selectedOption === 'option1' &&
    locationdropdown === 'locationJ' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location1' ||
     locationdropdown2 === 'location2' ||
     locationdropdown2 === 'location3' ||
     locationdropdown2 === 'location4' ||
     locationdropdown2 === 'location5' ||
     locationdropdown2 === 'location6' ||
     locationdropdown2 === 'location7' ||
     locationdropdown2 === 'location8' ||
     locationdropdown2 === 'location9' ||
     locationdropdown2 === 'location10' ||
     locationdropdown2 === 'location12' ||
     locationdropdown2 === 'location13' ||
     locationdropdown2 === 'location14' ||
     locationdropdown2 === 'location15' ||
     locationdropdown2 === 'location16' ||
     locationdropdown2 === 'location17' ||
     locationdropdown2 === 'location18' ||
     locationdropdown2 === 'location19' ||
     locationdropdown2 === 'location20' ||
     locationdropdown2 === 'location21' ||
     locationdropdown2 === 'location22' ||
     locationdropdown2 === 'location23' ||
     locationdropdown2 === 'location24' ||
     locationdropdown2 === 'location25' ||
     locationdropdown2 === 'location26' ||
     locationdropdown2 === 'location27' ||
     locationdropdown2 === 'location28' ||
     locationdropdown2 === 'location29' ||
     locationdropdown2 === 'location30' ||
     locationdropdown2 === 'location31')
  ) {
    // Update the price based on the selectedClass and destination
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 107;
          break;
        case 'location2':
          calculatedPrice = 107;
          break;
        case 'location3':
          calculatedPrice = 107;
          break;
        case 'location4':
          calculatedPrice = 107;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 107;
          break;
        case 'location7':
          calculatedPrice = 107;
          break;
        case 'location8':
          calculatedPrice = 30;
          break;
        case 'location9':
          calculatedPrice = 23;
          break;
        case 'location10':
          calculatedPrice = 19;
          break;
        case 'location12':
          calculatedPrice = 15;
          break;
        case 'location13':
          calculatedPrice = 21;
          break;
        case 'location14':
          calculatedPrice = 49;
          break;
        case 'location15':
          calculatedPrice = 96;
          break;
        case 'location16':
          calculatedPrice = 132;
          break;
        case 'location17':
          calculatedPrice = 161;
          break;
        case 'location18':
          calculatedPrice = 195;
          break;
        case 'location19':
          calculatedPrice = 203;
          break;
        case 'location20':
          calculatedPrice = 225;
          break;
        case 'location21':
          calculatedPrice = 549;
          break;
        case 'location22':
          calculatedPrice = 453;
          break;
        case 'location23':
          calculatedPrice = 357;
          break;
        case 'location24':
          calculatedPrice = 286;
          break;
        case 'location25':
          calculatedPrice = 234;
          break;
        case 'location26':
          calculatedPrice = 225;
          break;
        case 'location27':
          calculatedPrice = 246;
          break;
        case 'location28':
          calculatedPrice = 254;
          break;
        case 'location29':
          calculatedPrice = 307;
          break;
        case 'location30':
          calculatedPrice = 380;
          break;
        case 'location31':
          calculatedPrice = 405;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 267;
          break;
        case 'location2':
          calculatedPrice = 267;
          break;
        case 'location3':
          calculatedPrice = 267;
          break;
        case 'location4':
          calculatedPrice = 267;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 267;
          break;
        case 'location7':
          calculatedPrice = 267;
          break;
        case 'location8':
          calculatedPrice = 74;
          break;
        case 'location9':
          calculatedPrice = 57;
          break;
        case 'location10':
          calculatedPrice = 48;
          break;
        case 'location12':
          calculatedPrice = 39;
          break;
        case 'location13':
          calculatedPrice = 52;
          break;
        case 'location14':
          calculatedPrice = 122;
          break;
        case 'location15':
          calculatedPrice = 240;
          break;
        case 'location16':
          calculatedPrice = 330;
          break;
        case 'location17':
          calculatedPrice = 402;
          break;
        case 'location18':
          calculatedPrice = 487;
          break;
        case 'location19':
          calculatedPrice = 508;
          break;
        case 'location20':
          calculatedPrice = 562;
          break;
        case 'location21':
          calculatedPrice = 1227;
          break;
        case 'location22':
          calculatedPrice = 1017;
          break;
        case 'location23':
          calculatedPrice = 825;
          break;
        case 'location24':
          calculatedPrice = 685;
          break;
        case 'location25':
          calculatedPrice = 579;
          break;
        case 'location26':
          calculatedPrice = 562;
          break;
        case 'location27':
          calculatedPrice = 604;
          break;
        case 'location28':
          calculatedPrice = 620;
          break;
        case 'location29':
          calculatedPrice = 727;
          break;
        case 'location30':
          calculatedPrice = 871;
          break;
        case 'location31':
          calculatedPrice = 921;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location1':
          calculatedPrice = 321;
          break;
        case 'location2':
          calculatedPrice = 321;
          break;
        case 'location3':
          calculatedPrice = 321;
          break;
        case 'location4':
          calculatedPrice = 321;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location6':
          calculatedPrice = 321;
          break;
        case 'location7':
          calculatedPrice = 321;
          break;
        case 'location8':
          calculatedPrice = 89;
          break;
        case 'location9':
          calculatedPrice = 68;
          break;
        case 'location10':
          calculatedPrice = 57;
          break;
        case 'location12':
          calculatedPrice = 46;
          break;
        case 'location13':
          calculatedPrice = 63;
          break;
        case 'location14':
          calculatedPrice = 146;
          break;
        case 'location15':
          calculatedPrice = 288;
          break;
        case 'location16':
          calculatedPrice = 396;
          break;
        case 'location17':
          calculatedPrice = 482;
          break;
        case 'location18':
          calculatedPrice = 585;
          break;
        case 'location19':
          calculatedPrice = 610;
          break;
        case 'location20':
          calculatedPrice = 674;
          break;
        case 'location21':
          calculatedPrice = 1646;
          break;
        case 'location22':
          calculatedPrice = 1357;
          break;
        case 'location23':
          calculatedPrice = 1069;
          break;
        case 'location24':
          calculatedPrice = 858;
          break;
        case 'location25':
          calculatedPrice = 700;
          break;
        case 'location26':
          calculatedPrice = 674;
          break;
        case 'location27':
          calculatedPrice = 738;
          break;
        case 'location28':
          calculatedPrice = 761;
          break;
        case 'location29':
          calculatedPrice = 921;
          break;
        case 'location30':
          calculatedPrice = 1138;
          break;
        case 'location31':
          calculatedPrice = 1213;
          break;
        default:
          break;
      }
    }
  }


    // TABANG ENTRY POINT (DONE)
    if (
      selectedOption === 'option1' &&
      locationdropdown === 'locationK' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location1' ||
       locationdropdown2 === 'location2' ||
       locationdropdown2 === 'location3' ||
       locationdropdown2 === 'location4' ||
       locationdropdown2 === 'location5' ||
       locationdropdown2 === 'location6' ||
       locationdropdown2 === 'location7' ||
       locationdropdown2 === 'location8' ||
       locationdropdown2 === 'location9' ||
       locationdropdown2 === 'location10' ||
       locationdropdown2 === 'location11' ||
       locationdropdown2 === 'location13' ||
       locationdropdown2 === 'location14' ||
       locationdropdown2 === 'location15' ||
       locationdropdown2 === 'location16' ||
       locationdropdown2 === 'location17' ||
       locationdropdown2 === 'location18' ||
       locationdropdown2 === 'location19' ||
       locationdropdown2 === 'location20' ||
       locationdropdown2 === 'location21' ||
       locationdropdown2 === 'location22' ||
       locationdropdown2 === 'location23' ||
       locationdropdown2 === 'location24' ||
       locationdropdown2 === 'location25' ||
       locationdropdown2 === 'location26' ||
       locationdropdown2 === 'location27' ||
       locationdropdown2 === 'location28' ||
       locationdropdown2 === 'location29' ||
       locationdropdown2 === 'location30' ||
       locationdropdown2 === 'location31')
    ) {
      // Update the price based on the selectedClass and destination
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
            calculatedPrice = 122;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location7':
            calculatedPrice = 122;
            break;
          case 'location8':
            calculatedPrice = 45;
            break;
          case 'location9':
            calculatedPrice = 38;
            break;
          case 'location10':
            calculatedPrice = 35;
            break;
          case 'location11':
            calculatedPrice = 15;
            break;
          case 'location13':
          case 'location14':
          case 'location15':
          case 'location16':
          case 'location17':
          case 'location18':
          case 'location19':
          case 'location20':
          case 'location21':
          case 'location22':
          case 'location23':
          case 'location24':
          case 'location25':
          case 'location26':
          case 'location27':
          case 'location28':
          case 'location29':
          case 'location30':
          case 'location31':
            calculatedPrice = 'NO EXIT';
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
            calculatedPrice = 306;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location7':
            calculatedPrice = 306;
            break;
          case 'location8':
            calculatedPrice = 113;
            break;
          case 'location9':
            calculatedPrice = 96;
            break;
          case 'location10':
            calculatedPrice = 48;
            break;
              case 'location11':
                calculatedPrice = 39;
            break;
              case 'location13':
              case 'location14':
              case 'location15':
              case 'location16':
              case 'location17':
              case 'location18':
              case 'location19':
              case 'location20':
              case 'location21':
              case 'location22':
              case 'location23':
              case 'location24':
              case 'location25':
              case 'location26':
              case 'location27':
              case 'location28':
              case 'location29':
              case 'location30':
              case 'location31':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
            calculatedPrice = 367;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location7':
            calculatedPrice = 367;
            break;
          case 'location8':
            calculatedPrice = 135;
            break;
          case 'location9':
            calculatedPrice = 115;
            break;
          case 'location10':
            calculatedPrice = 104;
            break;
            case 'location11':
              calculatedPrice = 46;
            break;
              case 'location13':
              case 'location14':
              case 'location15':
              case 'location16':
              case 'location17':
              case 'location18':
              case 'location19':
              case 'location20':
              case 'location21':
              case 'location22':
              case 'location23':
              case 'location24':
              case 'location25':
              case 'location26':
              case 'location27':
              case 'location28':
              case 'location29':
              case 'location30':
              case 'location31':
                calculatedPrice = 'NO EXIT';
                break;
          default:
            break;
        }
      }
    }
  

  // STA. RITA ENTRY POINT (DONE)
  if (
    selectedOption === 'option1' &&
    locationdropdown === 'locationL' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location1' ||
     locationdropdown2 === 'location2' ||
     locationdropdown2 === 'location3' ||
     locationdropdown2 === 'location4' ||
     locationdropdown2 === 'location5' ||
     locationdropdown2 === 'location6' ||
     locationdropdown2 === 'location7' ||
     locationdropdown2 === 'location8' ||
     locationdropdown2 === 'location9' ||
     locationdropdown2 === 'location10' ||
     locationdropdown2 === 'location11' ||
     locationdropdown2 === 'location12' ||
     locationdropdown2 === 'location14' ||
     locationdropdown2 === 'location15' ||
     locationdropdown2 === 'location16' ||
     locationdropdown2 === 'location17' ||
     locationdropdown2 === 'location18' ||
     locationdropdown2 === 'location19' ||
     locationdropdown2 === 'location20' ||
     locationdropdown2 === 'location21' ||
     locationdropdown2 === 'location22' ||
     locationdropdown2 === 'location23' ||
     locationdropdown2 === 'location24' ||
     locationdropdown2 === 'location25' ||
     locationdropdown2 === 'location26' ||
     locationdropdown2 === 'location27' ||
     locationdropdown2 === 'location28' ||
     locationdropdown2 === 'location29' ||
     locationdropdown2 === 'location30' ||
     locationdropdown2 === 'location31')
  ) {
    // Update the price based on the selectedClass and destination
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
          calculatedPrice = 128;
          break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
          break;
        case 'location7':
          calculatedPrice = 128;
          break;
        case 'location8':
          calculatedPrice = 51;
          break;
        case 'location9':
          calculatedPrice = 44;
          break;
        case 'location10':
          calculatedPrice = 40;
          break;
        case 'location11':
          calculatedPrice = 21;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location14':
          calculatedPrice = 28;
          break;
        case 'location15':
          calculatedPrice = 75;
          break;
        case 'location16':
          calculatedPrice = 111;
          break;
        case 'location17':
          calculatedPrice = 140;
          break;
        case 'location18':
          calculatedPrice = 174;
          break;
        case 'location19':
          calculatedPrice = 182;
          break;
        case 'location20':
          calculatedPrice = 204;
          break;
        case 'location21':
          calculatedPrice = 528;
          break;
        case 'location22':
          calculatedPrice = 432;
          break;
        case 'location23':
          calculatedPrice = 336;
          break;
        case 'location24':
          calculatedPrice = 265;
          break;
        case 'location25':
          calculatedPrice = 213;
          break;
        case 'location26':
          calculatedPrice = 204;
          break;
        case 'location27':
          calculatedPrice = 225;
          break;
        case 'location28':
          calculatedPrice = 233;
          break;
        case 'location29':
          calculatedPrice = 286;
          break;
        case 'location30':
          calculatedPrice = 359;
          break;
        case 'location31':
          calculatedPrice = 384;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
          calculatedPrice = 320;
          break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
          break;
        case 'location7':
          calculatedPrice = 320;
          break;
        case 'location8':
          calculatedPrice = 126;
          break;
        case 'location9':
          calculatedPrice = 109;
          break;
        case 'location10':
          calculatedPrice = 100;
          break;
        case 'location11':
          calculatedPrice = 52;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT'
          break;
        case 'location14':
          calculatedPrice = 69;
          break;
        case 'location15':
          calculatedPrice = 188;
          break;
        case 'location16':
          calculatedPrice = 278;
          break;
        case 'location17':
          calculatedPrice = 349;
          break;
        case 'location18':
          calculatedPrice = 435;
          break;
        case 'location19':
          calculatedPrice = 456;
          break;
        case 'location20':
          calculatedPrice = 509;
          break;
        case 'location21':
          calculatedPrice = 1174;
          break;
        case 'location22':
          calculatedPrice = 964;
          break;
        case 'location23':
          calculatedPrice = 772;
          break;
        case 'location24':
          calculatedPrice = 632;
          break;
        case 'location25':
          calculatedPrice = 526;
          break;
        case 'location26':
          calculatedPrice = 509;
          break;
        case 'location27':
          calculatedPrice = 551;
          break;
        case 'location28':
          calculatedPrice = 567;
          break;
        case 'location29':
          calculatedPrice = 674;
          break;
        case 'location30':
          calculatedPrice = 818;
          break;
        case 'location31':
          calculatedPrice = 868;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
          calculatedPrice = 383;
          break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
          break
        case 'location7':
          calculatedPrice = 383;
          break;
        case 'location8':
          calculatedPrice = 152;
          break;
        case 'location9':
          calculatedPrice = 131;
          break;
        case 'location10':
          calculatedPrice = 120;
          break;
        case 'location11':
          calculatedPrice = 63;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location14':
          calculatedPrice = 83;
          break;
        case 'location15':
          calculatedPrice = 225;
          break;
        case 'location16':
          calculatedPrice = 333;
          break;
        case 'location17':
          calculatedPrice = 419;
          break;
        case 'location18':
          calculatedPrice = 522;
          break;
        case 'location19':
          calculatedPrice = 547;
          break;
        case 'location20':
          calculatedPrice = 611;
          break;
        case 'location21':
          calculatedPrice = 1583;
          break;
        case 'location22':
          calculatedPrice = 1294;
          break;
        case 'location23':
          calculatedPrice = 1006;
          break;
        case 'location24':
          calculatedPrice = 795;
          break;
        case 'location25':
          calculatedPrice = 637;
          break;
        case 'location26':
          calculatedPrice = 611;
          break;
        case 'location27':
          calculatedPrice = 675;
          break;
        case 'location28':
          calculatedPrice = 698;
          break;
        case 'location29':
          calculatedPrice = 858;
          break;
        case 'location30':
          calculatedPrice = 1075;
          break;
        case 'location31':
          calculatedPrice = 1150;
          break;
        default:
          break;
      }
    }
  }


    // PULILAN ENTRY POINT (DONE)
    if (
      selectedOption === 'option1' &&
      locationdropdown === 'locationM' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location1' ||
       locationdropdown2 === 'location2' ||
       locationdropdown2 === 'location3' ||
       locationdropdown2 === 'location4' ||
       locationdropdown2 === 'location5' ||
       locationdropdown2 === 'location6' ||
       locationdropdown2 === 'location7' ||
       locationdropdown2 === 'location8' ||
       locationdropdown2 === 'location9' ||
       locationdropdown2 === 'location10' ||
       locationdropdown2 === 'location11' ||
       locationdropdown2 === 'location12' ||
       locationdropdown2 === 'location13' ||
       locationdropdown2 === 'location15' ||
       locationdropdown2 === 'location16' ||
       locationdropdown2 === 'location17' ||
       locationdropdown2 === 'location18' ||
       locationdropdown2 === 'location19' ||
       locationdropdown2 === 'location20' ||
       locationdropdown2 === 'location21' ||
       locationdropdown2 === 'location22' ||
       locationdropdown2 === 'location23' ||
       locationdropdown2 === 'location24' ||
       locationdropdown2 === 'location25' ||
       locationdropdown2 === 'location26' ||
       locationdropdown2 === 'location27' ||
       locationdropdown2 === 'location28' ||
       locationdropdown2 === 'location29' ||
       locationdropdown2 === 'location30' ||
       locationdropdown2 === 'location31')
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
            calculatedPrice = 156;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
            break;
          case 'location7':
            calculatedPrice = 156;
            break;
          case 'location8':
            calculatedPrice = 78;
            break;
          case 'location9':
            calculatedPrice = 71;
            break;
          case 'location10':
            calculatedPrice = 68;
            break;
          case 'location11':
            calculatedPrice = 49;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 28;
            break;
          case 'location15':
            calculatedPrice = 47;
            break;
          case 'location16':
            calculatedPrice = 83;
            break;
          case 'location17':
            calculatedPrice = 112;
            break;
          case 'location18':
            calculatedPrice = 146;
            break;
          case 'location19':
            calculatedPrice = 155;
            break;
          case 'location20':
            calculatedPrice = 176;
            break;
          case 'location21':
            calculatedPrice = 500;
            break;
          case 'location22':
            calculatedPrice = 404;
            break;
          case 'location23':
            calculatedPrice = 308;
            break;
          case 'location24':
            calculatedPrice = 237;
            break;
          case 'location25':
            calculatedPrice = 185;
            break;
          case 'location26':
            calculatedPrice = 176;
            break;
          case 'location27':
            calculatedPrice = 197;
            break;
          case 'location28':
            calculatedPrice = 205;
            break;
          case 'location29':
            calculatedPrice = 258;
            break;
          case 'location30':
            calculatedPrice = 331;
            break;
          case 'location31':
            calculatedPrice = 356;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 389;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location8':
            calculatedPrice = 196;
            break;
          case 'location9':
            calculatedPrice = 179;
            break;
          case 'location10':
            calculatedPrice = 170;
            break;
          case 'location11':
            calculatedPrice = 122;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 69;
            break;
          case 'location15':
            calculatedPrice = 118;
            break;
          case 'location16':
            calculatedPrice = 208;
            break;
          case 'location17':
            calculatedPrice = 280;
            break;
          case 'location18':
            calculatedPrice = 366;
            break;
          case 'location19':
            calculatedPrice = 386;
            break;
          case 'location20':
            calculatedPrice = 440;
            break;
          case 'location21':
            calculatedPrice = 1105;
            break;
          case 'location22':
            calculatedPrice = 895;
            break;
          case 'location23':
            calculatedPrice = 703;
            break;
          case 'location24':
            calculatedPrice = 563;
            break;
          case 'location25':
            calculatedPrice = 457;
            break;
          case 'location26':
            calculatedPrice = 440;
            break;
          case 'location27':
            calculatedPrice = 482;
            break;
          case 'location28':
            calculatedPrice = 498;
            break;
          case 'location29':
            calculatedPrice = 605;
            break;
          case 'location30':
            calculatedPrice = 749;
            break;
          case 'location31':
            calculatedPrice = 799;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 467;
            break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 235;
            break;
          case 'location9':
            calculatedPrice = 214;
            break;
          case 'location10':
            calculatedPrice = 203;
            break;
          case 'location11':
            calculatedPrice = 146;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 83;
            break;
          case 'location15':
            calculatedPrice = 142;
            break;
          case 'location16':
            calculatedPrice = 250;
            break;
          case 'location17':
            calculatedPrice = 336;
            break;
          case 'location18':
            calculatedPrice = 439;
            break;
          case 'location19':
            calculatedPrice = 464;
            break;
          case 'location20':
            calculatedPrice = 528;
            break;
          case 'location21':
            calculatedPrice = 1500;
            break;
          case 'location22':
            calculatedPrice = 1211;
            break;
          case 'location23':
            calculatedPrice = 923;
            break;
          case 'location24':
            calculatedPrice = 712;
            break;
          case 'location25':
            calculatedPrice = 554;
            break;
          case 'location26':
            calculatedPrice = 528;
            break;
          case 'location27':
            calculatedPrice = 592;
            break;
          case 'location28':
            calculatedPrice = 615;
            break;
          case 'location29':
            calculatedPrice = 775;
            break;
          case 'location30':
            calculatedPrice = 992;
            break;
          case 'location31':
            calculatedPrice = 1067;
            break;
          default:
            break;
        }
      }
    }


     // SAN SIMON ENTRY POINT (DONE)
     if (
      selectedOption === 'option1' &&
      locationdropdown === 'locationN' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location1' ||
       locationdropdown2 === 'location2' ||
       locationdropdown2 === 'location3' ||
       locationdropdown2 === 'location4' ||
       locationdropdown2 === 'location5' ||
       locationdropdown2 === 'location6' ||
       locationdropdown2 === 'location7' ||
       locationdropdown2 === 'location8' ||
       locationdropdown2 === 'location9' ||
       locationdropdown2 === 'location10' ||
       locationdropdown2 === 'location11' ||
       locationdropdown2 === 'location12' ||
       locationdropdown2 === 'location13' ||
       locationdropdown2 === 'location14' ||
       locationdropdown2 === 'location16' ||
       locationdropdown2 === 'location17' ||
       locationdropdown2 === 'location18' ||
       locationdropdown2 === 'location19' ||
       locationdropdown2 === 'location20' ||
       locationdropdown2 === 'location21' ||
       locationdropdown2 === 'location22' ||
       locationdropdown2 === 'location23' ||
       locationdropdown2 === 'location24' ||
       locationdropdown2 === 'location25' ||
       locationdropdown2 === 'location26' ||
       locationdropdown2 === 'location27' ||
       locationdropdown2 === 'location28' ||
       locationdropdown2 === 'location29' ||
       locationdropdown2 === 'location30' ||
       locationdropdown2 === 'location31')
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 203;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 126;
            break;
          case 'location9':
            calculatedPrice = 119;
            break;
          case 'location10':
            calculatedPrice = 115;
            break;
          case 'location11':
            calculatedPrice = 96;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 75;
            break;
          case 'location14':
            calculatedPrice = 47;
            break;
          case 'location16':
            calculatedPrice = 36;
            break;
          case 'location17':
            calculatedPrice = 65;
            break;
          case 'location18':
            calculatedPrice = 99;
            break;
          case 'location19':
            calculatedPrice = 107;
            break;
          case 'location20':
            calculatedPrice = 129;
            break;
          case 'location21':
            calculatedPrice = 453;
            break;
          case 'location22':
            calculatedPrice = 357;
            break;
          case 'location23':
            calculatedPrice = 261;
            break;
          case 'location24':
            calculatedPrice = 190;
            break;
          case 'location25':
            calculatedPrice = 138;
            break;
          case 'location26':
            calculatedPrice = 129;
            break;
          case 'location27':
            calculatedPrice = 150;
            break;
          case 'location28':
            calculatedPrice = 158;
            break;
          case 'location29':
            calculatedPrice = 211;
            break;
          case 'location30':
            calculatedPrice = 284;
            break;
          case 'location31':
            calculatedPrice = 309;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 507;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location8':
            calculatedPrice = 314;
            break;
          case 'location9':
            calculatedPrice = 297;
            break;
          case 'location10':
            calculatedPrice = 288;
            break;
          case 'location11':
            calculatedPrice = 240;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 188;
            break;
          case 'location14':
            calculatedPrice = 118;
            break;
          case 'location16':
            calculatedPrice = 90;
            break;
          case 'location17':
            calculatedPrice = 162;
            break;
          case 'location18':
            calculatedPrice = 247;
            break;
          case 'location19':
            calculatedPrice = 268;
            break;
          case 'location20':
            calculatedPrice = 322;
            break;
          case 'location21':
            calculatedPrice = 987;
            break;
          case 'location22':
            calculatedPrice = 777;
            break;
          case 'location23':
            calculatedPrice = 585;
            break;
          case 'location24':
            calculatedPrice = 445;
            break;
          case 'location25':
            calculatedPrice = 339;
            break;
          case 'location26':
            calculatedPrice = 322;
            break;
          case 'location27':
            calculatedPrice = 364;
            break;
          case 'location28':
            calculatedPrice = 380;
            break;
          case 'location29':
            calculatedPrice = 487;
            break;
          case 'location30':
            calculatedPrice = 631;
            break;
          case 'location31':
            calculatedPrice = 681;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 609;
            break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 377;
            break;
          case 'location9':
            calculatedPrice = 356;
            break;
          case 'location10':
            calculatedPrice = 345;
            break;
          case 'location11':
            calculatedPrice = 288;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 225;
            break;
          case 'location14':
            calculatedPrice = 142;
            break;
          case 'location16':
            calculatedPrice = 108;
            break;
          case 'location17':
            calculatedPrice = 194;
            break;
          case 'location18':
            calculatedPrice = 297;
            break;
          case 'location19':
            calculatedPrice = 322;
            break;
          case 'location20':
            calculatedPrice = 386;
            break;
          case 'location21':
            calculatedPrice = 1358;
            break;
          case 'location22':
            calculatedPrice = 1069;
            break;
          case 'location23':
            calculatedPrice = 781;
            break;
          case 'location24':
            calculatedPrice = 570;
            break;
          case 'location25':
            calculatedPrice = 412;
            break;
          case 'location26':
            calculatedPrice = 386;
            break;
          case 'location27':
            calculatedPrice = 450;
            break;
          case 'location28':
            calculatedPrice = 473;
            break;
          case 'location29':
            calculatedPrice = 633;
            break;
          case 'location30':
            calculatedPrice = 850;
            break;
          case 'location31':
            calculatedPrice = 925;
            break;
          default:
            break;
        }
      }
    }

    
    
         // SAN FERNANDO ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationO' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 239;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 162;
                break;
              case 'location9':
                calculatedPrice = 155;
                break;
              case 'location10':
                calculatedPrice = 151;
                break;
              case 'location11':
                calculatedPrice = 132;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 111;
                break;
              case 'location14':
                calculatedPrice = 83;
                break;
              case 'location15':
                calculatedPrice = 36;
                break;
              case 'location17':
                calculatedPrice = 29;
                break;
              case 'location18':
                calculatedPrice = 63;
                break;
              case 'location19':
                calculatedPrice = 71;
                break;
              case 'location20':
                calculatedPrice = 93;
                break;
              case 'location21':
                calculatedPrice = 417;
                break;
              case 'location22':
                calculatedPrice = 321;
                break;
              case 'location23':
                calculatedPrice = 225;
                break;
              case 'location24':
                calculatedPrice = 154;
                break;
              case 'location25':
                calculatedPrice = 102;
                break;
              case 'location26':
                calculatedPrice = 93;
                break;
              case 'location27':
                calculatedPrice = 114;
                break;
              case 'location28':
                calculatedPrice = 122;
                break;
              case 'location29':
                calculatedPrice = 175;
                break;
              case 'location30':
                calculatedPrice = 248;
                break;
              case 'location31':
                calculatedPrice = 273;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 597;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 404;
                break;
              case 'location9':
                calculatedPrice = 387;
                break;
              case 'location10':
                calculatedPrice = 378;
                break;
              case 'location11':
                calculatedPrice = 330;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 278;
                break;
              case 'location14':
                calculatedPrice = 208;
                break;
              case 'location15':
                calculatedPrice = 90;
                break;
              case 'location17':
                calculatedPrice = 72;
                break;
              case 'location18':
                calculatedPrice = 157;
                break;
              case 'location19':
                calculatedPrice = 178;
                break;
              case 'location20':
                calculatedPrice = 232;
                break;
              case 'location21':
                calculatedPrice = 897;
                break;
              case 'location22':
                calculatedPrice = 687;
                break;
              case 'location23':
                calculatedPrice = 495;
                break;
              case 'location24':
                calculatedPrice = 355;
                break;
              case 'location25':
                calculatedPrice = 249;
                break;
              case 'location26':
                calculatedPrice = 232;
                break;
              case 'location27':
                calculatedPrice = 274;
                break;
              case 'location28':
                calculatedPrice = 290;
                break;
              case 'location29':
                calculatedPrice = 397;
                break;
              case 'location30':
                calculatedPrice = 541;
                break;
              case 'location31':
                calculatedPrice = 591;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 717;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 485;
                break;
              case 'location9':
                calculatedPrice = 464;
                break;
              case 'location10':
                calculatedPrice = 453;
                break;
              case 'location11':
                calculatedPrice = 396;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 333;
                break;
              case 'location14':
                calculatedPrice = 250;
                break;
              case 'location15':
                calculatedPrice = 108;
                break;
              case 'location17':
                calculatedPrice = 86;
                break;
              case 'location18':
                calculatedPrice = 189;
                break;
              case 'location19':
                calculatedPrice = 214;
                break;
              case 'location20':
                calculatedPrice = 278;
                break;
              case 'location21':
                calculatedPrice = 1250;
                break;
              case 'location22':
                calculatedPrice = 961;
                break;
              case 'location23':
                calculatedPrice = 673;
                break;
              case 'location24':
                calculatedPrice = 462;
                break;
              case 'location25':
                calculatedPrice = 304;
                break;
              case 'location26':
                calculatedPrice = 278;
                break;
              case 'location27':
                calculatedPrice = 342;
                break;
              case 'location28':
                calculatedPrice = 365;
                break;
              case 'location29':
                calculatedPrice = 525;
                break;
              case 'location30':
                calculatedPrice = 742;
                break;
              case 'location31':
                calculatedPrice = 817;
                break;
              default:
                break;
            }
          }
        }
    
        

             // MEXICO ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationP' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 268;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 190;
                    break;
                  case 'location9':
                    calculatedPrice = 184;
                    break;
                  case 'location10':
                    calculatedPrice = 180;
                    break;
                  case 'location11':
                    calculatedPrice = 161;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 140;
                    break;
                  case 'location14':
                    calculatedPrice = 112;
                    break;
                  case 'location15':
                    calculatedPrice = 65;
                    break;
                  case 'location16':
                    calculatedPrice = 29;
                    break;
                  case 'location18':
                    calculatedPrice = 34;
                    break;
                  case 'location19':
                    calculatedPrice = 43;
                    break;
                  case 'location20':
                    calculatedPrice = 64;
                    break;
                  case 'location21':
                    calculatedPrice = 388;
                    break;
                  case 'location22':
                    calculatedPrice = 292;
                    break;
                  case 'location23':
                    calculatedPrice = 196;
                    break;
                  case 'location24':
                    calculatedPrice = 125;
                    break;
                  case 'location25':
                    calculatedPrice = 73;
                    break;
                  case 'location26':
                    calculatedPrice = 64;
                    break;
                  case 'location27':
                    calculatedPrice = 85;
                    break;
                  case 'location28':
                    calculatedPrice = 93;
                    break;
                  case 'location29':
                    calculatedPrice = 146;
                    break;
                  case 'location30':
                    calculatedPrice = 219;
                    break;
                  case 'location31':
                    calculatedPrice = 244;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 669;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                      break;
                  case 'location8':
                    calculatedPrice = 476;
                    break;
                  case 'location9':
                    calculatedPrice = 459;
                    break;
                  case 'location10':
                    calculatedPrice = 450;
                    break;
                  case 'location11':
                    calculatedPrice = 402;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 349;
                    break;
                  case 'location14':
                    calculatedPrice = 280;
                    break;
                  case 'location15':
                    calculatedPrice = 162;
                    break;
                  case 'location16':
                    calculatedPrice = 72;
                    break;
                  case 'location18':
                    calculatedPrice = 86;
                    break;
                  case 'location19':
                    calculatedPrice = 106;
                    break;
                  case 'location20':
                    calculatedPrice = 160;
                    break;
                  case 'location21':
                    calculatedPrice = 825;
                    break;
                  case 'location22':
                    calculatedPrice = 615;
                    break;
                  case 'location23':
                    calculatedPrice = 423;
                    break;
                  case 'location24':
                    calculatedPrice = 283;
                    break;
                  case 'location25':
                    calculatedPrice = 177;
                    break;
                  case 'location26':
                    calculatedPrice = 160;
                    break;
                  case 'location27':
                    calculatedPrice = 202;
                    break;
                  case 'location28':
                    calculatedPrice = 218;
                    break;
                  case 'location29':
                    calculatedPrice = 325;
                    break;
                  case 'location30':
                    calculatedPrice = 469;
                    break;
                  case 'location31':
                    calculatedPrice = 519;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 803;
                    break;
                  case 'location5':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 571;
                    break;
                  case 'location9':
                    calculatedPrice = 551;
                    break;
                  case 'location10':
                    calculatedPrice = 540;
                    break;
                  case 'location11':
                    calculatedPrice = 482;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 419;
                    break;
                  case 'location14':
                    calculatedPrice = 336;
                    break;
                  case 'location15':
                    calculatedPrice = 194;
                    break;
                  case 'location16':
                    calculatedPrice = 86;
                    break;
                  case 'location18':
                    calculatedPrice = 103;
                    break;
                  case 'location19':
                    calculatedPrice = 128;
                    break;
                  case 'location20':
                    calculatedPrice = 192;
                    break;
                  case 'location21':
                    calculatedPrice = 1164;
                    break;
                  case 'location22':
                    calculatedPrice = 875;
                    break;
                  case 'location23':
                    calculatedPrice = 587;
                    break;
                  case 'location24':
                    calculatedPrice = 376;
                    break;
                  case 'location25':
                    calculatedPrice = 218;
                    break;
                  case 'location26':
                    calculatedPrice = 192;
                    break;
                  case 'location27':
                    calculatedPrice = 256;
                    break;
                  case 'location28':
                    calculatedPrice = 279;
                    break;
                  case 'location29':
                    calculatedPrice = 439;
                    break;
                  case 'location30':
                    calculatedPrice = 656;
                    break;
                  case 'location31':
                    calculatedPrice = 731;
                    break;
                  default:
                    break;
                }
              }
            }

             // ANGELES ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationQ' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 302;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 225;
                    break;
                  case 'location9':
                    calculatedPrice = 218;
                    break;
                  case 'location10':
                    calculatedPrice = 214;
                    break;
                  case 'location11':
                    calculatedPrice = 195;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 174;
                    break;
                  case 'location14':
                    calculatedPrice = 146;
                    break;
                  case 'location15':
                    calculatedPrice = 99;
                    break;
                  case 'location16':
                    calculatedPrice = 63;
                    break;
                  case 'location17':
                    calculatedPrice = 34;
                    break;
                  case 'location19':
                    calculatedPrice = 8;
                    break;
                  case 'location20':
                    calculatedPrice = 30;
                    break;
                  case 'location21':
                    calculatedPrice = 354;
                    break;
                  case 'location22':
                    calculatedPrice = 258;
                    break;
                  case 'location23':
                    calculatedPrice = 162;
                    break;
                  case 'location24':
                    calculatedPrice = 91;
                    break;
                  case 'location25':
                    calculatedPrice = 39;
                    break;
                  case 'location26':
                    calculatedPrice = 30;
                    break;
                  case 'location27':
                    calculatedPrice = 51;
                    break;
                  case 'location28':
                    calculatedPrice = 59;
                    break;
                  case 'location29':
                    calculatedPrice = 112;
                    break;
                  case 'location30':
                    calculatedPrice = 185;
                    break;
                  case 'location31':
                    calculatedPrice = 210;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 755;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                      break;
                  case 'location8':
                    calculatedPrice = 561;
                    break;
                  case 'location9':
                    calculatedPrice = 544;
                    break;
                  case 'location10':
                    calculatedPrice = 535;
                    break;
                  case 'location11':
                    calculatedPrice = 487;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 435;
                    break;
                  case 'location14':
                    calculatedPrice = 366;
                    break;
                  case 'location15':
                    calculatedPrice = 247;
                    break;
                  case 'location16':
                    calculatedPrice = 157;
                    break;
                  case 'location17':
                    calculatedPrice = 86;
                    break;
                  case 'location19':
                    calculatedPrice = 21;
                    break;
                  case 'location20':
                    calculatedPrice = 74;
                    break;
                  case 'location21':
                    calculatedPrice = 739;
                    break;
                  case 'location22':
                    calculatedPrice = 529;
                    break;
                  case 'location23':
                    calculatedPrice = 337;
                    break;
                  case 'location24':
                    calculatedPrice = 197;
                    break;
                  case 'location25':
                    calculatedPrice = 91;
                    break;
                  case 'location26':
                    calculatedPrice = 74;
                    break;
                  case 'location27':
                    calculatedPrice = 116;
                    break;
                  case 'location28':
                    calculatedPrice = 132;
                    break;
                  case 'location29':
                    calculatedPrice = 239;
                    break;
                  case 'location30':
                    calculatedPrice = 383;
                    break;
                  case 'location31':
                    calculatedPrice = 433;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 905;
                    break;
                  case 'location5':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 674;
                    break;
                  case 'location9':
                    calculatedPrice = 653;
                    break;
                  case 'location10':
                    calculatedPrice = 642;
                    break;
                  case 'location11':
                    calculatedPrice = 585;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 522;
                    break;
                  case 'location14':
                    calculatedPrice = 439;
                    break;
                  case 'location15':
                    calculatedPrice = 297;
                    break;
                  case 'location16':
                    calculatedPrice = 189;
                    break;
                  case 'location17':
                    calculatedPrice = 103;
                    break;
                  case 'location19':
                    calculatedPrice = 25;
                    break;
                  case 'location20':
                    calculatedPrice = 89;
                    break;
                  case 'location21':
                    calculatedPrice = 1061;
                    break;
                  case 'location22':
                    calculatedPrice = 772;
                    break;
                  case 'location23':
                    calculatedPrice = 484;
                    break;
                  case 'location24':
                    calculatedPrice = 273;
                    break;
                  case 'location25':
                    calculatedPrice = 115;
                    break;
                  case 'location26':
                    calculatedPrice = 89;
                    break;
                  case 'location27':
                    calculatedPrice = 153;
                    break;
                  case 'location28':
                    calculatedPrice = 176;
                    break;
                  case 'location29':
                    calculatedPrice = 336;
                    break;
                  case 'location30':
                    calculatedPrice = 553;
                    break;
                  case 'location31':
                    calculatedPrice = 628;
                    break;
                  default:
                    break;
                }
              }
            }


             // DAU ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationR' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 310;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 233;
                    break;
                  case 'location9':
                    calculatedPrice = 226;
                    break;
                  case 'location10':
                    calculatedPrice = 222;
                    break;
                  case 'location11':
                    calculatedPrice = 203;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 182;
                    break;
                  case 'location14':
                    calculatedPrice = 155;
                    break;
                  case 'location15':
                    calculatedPrice = 107;
                    break;
                  case 'location16':
                    calculatedPrice = 71;
                    break;
                  case 'location17':
                    calculatedPrice = 43;
                    break;
                  case 'location18':
                    calculatedPrice = 8;
                    break;
                  case 'location20':
                    calculatedPrice = 21;
                    break;
                  case 'location21':
                    calculatedPrice = 345;
                    break;
                  case 'location22':
                    calculatedPrice = 249;
                    break;
                  case 'location23':
                    calculatedPrice = 153;
                    break;
                  case 'location24':
                    calculatedPrice = 82;
                    break;
                  case 'location25':
                    calculatedPrice = 30;
                    break;
                  case 'location26':
                    calculatedPrice = 21;
                    break;
                  case 'location27':
                    calculatedPrice = 42;
                    break;
                  case 'location28':
                    calculatedPrice = 50;
                    break;
                  case 'location29':
                    calculatedPrice = 103;
                    break;
                  case 'location30':
                    calculatedPrice = 176;
                    break;
                  case 'location31':
                    calculatedPrice = 201;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 775;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                      break;
                  case 'location8':
                    calculatedPrice = 582;
                    break;
                  case 'location9':
                    calculatedPrice = 565;
                    break;
                  case 'location10':
                    calculatedPrice = 556;
                    break;
                  case 'location11':
                    calculatedPrice = 508;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 456;
                    break;
                  case 'location14':
                    calculatedPrice = 386;
                    break;
                  case 'location15':
                    calculatedPrice = 268;
                    break;
                  case 'location16':
                    calculatedPrice = 178;
                    break;
                  case 'location17':
                    calculatedPrice = 106;
                    break;
                  case 'location18':
                    calculatedPrice = 21;
                    break;
                  case 'location20':
                    calculatedPrice = 54;
                    break;
                  case 'location21':
                    calculatedPrice = 719;
                    break;
                  case 'location22':
                    calculatedPrice = 509;
                    break;
                  case 'location23':
                    calculatedPrice = 317;
                    break;
                  case 'location24':
                    calculatedPrice = 177;
                    break;
                  case 'location25':
                    calculatedPrice = 71;
                    break;
                  case 'location26':
                    calculatedPrice = 54;
                    break;
                  case 'location27':
                    calculatedPrice = 96;
                    break;
                  case 'location28':
                    calculatedPrice = 112;
                    break;
                  case 'location29':
                    calculatedPrice = 219;
                    break;
                  case 'location30':
                    calculatedPrice = 363;
                    break;
                  case 'location31':
                    calculatedPrice = 413;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 930;
                    break;
                  case 'location5':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 699;
                    break;
                  case 'location9':
                    calculatedPrice = 678;
                    break;
                  case 'location10':
                    calculatedPrice = 667;
                    break;
                  case 'location11':
                    calculatedPrice = 610;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 547;
                    break;
                  case 'location14':
                    calculatedPrice = 464;
                    break;
                  case 'location15':
                    calculatedPrice = 322;
                    break;
                  case 'location16':
                    calculatedPrice = 214;
                    break;
                  case 'location17':
                    calculatedPrice = 128;
                    break;
                  case 'location18':
                    calculatedPrice = 25;
                    break;
                  case 'location20':
                    calculatedPrice = 64;
                    break;
                  case 'location21':
                    calculatedPrice = 1036;
                    break;
                  case 'location22':
                    calculatedPrice = 747;
                    break;
                  case 'location23':
                    calculatedPrice = 459;
                    break;
                  case 'location24':
                    calculatedPrice = 248;
                    break;
                  case 'location25':
                    calculatedPrice = 90;
                    break;
                  case 'location26':
                    calculatedPrice = 64;
                    break;
                  case 'location27':
                    calculatedPrice = 128;
                    break;
                  case 'location28':
                    calculatedPrice = 151;
                    break;
                  case 'location29':
                    calculatedPrice = 311;
                    break;
                  case 'location30':
                    calculatedPrice = 528;
                    break;
                  case 'location31':
                    calculatedPrice = 603;
                    break;
                  default:
                    break;
                }
              }
            }


             // STA. INES ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationS' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 332;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 254;
                    break;
                  case 'location9':
                    calculatedPrice = 248;
                    break;
                  case 'location10':
                    calculatedPrice = 244;
                    break;
                  case 'location11':
                    calculatedPrice = 225;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 204;
                    break;
                  case 'location14':
                    calculatedPrice = 176;
                    break;
                  case 'location15':
                    calculatedPrice = 129;
                    break;
                  case 'location16':
                    calculatedPrice = 93;
                    break;
                  case 'location17':
                    calculatedPrice = 64;
                    break;
                  case 'location18':
                    calculatedPrice = 30;
                    break;
                  case 'location19':
                    calculatedPrice = 21;
                    break;
                  case 'location21':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location22':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location23':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location24':
                    calculatedPrice ='NO EXIT';
                    break;
                  case 'location25':
                    calculatedPrice = 'NO EXIT'
                    break;
                  case 'location26':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location27':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location28':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location29':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location30':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location31':
                    calculatedPrice = 'NO EXIT';
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 829;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                      break;
                  case 'location8':
                    calculatedPrice = 636;
                    break;
                  case 'location9':
                    calculatedPrice = 619;
                    break;
                  case 'location10':
                    calculatedPrice = 610;
                    break;
                  case 'location11':
                    calculatedPrice = 562;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 509;
                    break;
                  case 'location14':
                    calculatedPrice = 440;
                    break;
                  case 'location15':
                    calculatedPrice = 322;
                    break;
                  case 'location16':
                    calculatedPrice = 232;
                    break;
                  case 'location17':
                    calculatedPrice = 160;
                    break;
                  case 'location18':
                    calculatedPrice = 74;
                    break;
                  case 'location19':
                    calculatedPrice = 54;
                    break;
                  case 'location21':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location22':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location23':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location24':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location25':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location26':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location27':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location28':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location29':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location30':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location31':
                    calculatedPrice = 'NO EXIT';
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 995;
                    break;
                  case 'location5':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 763;
                    break;
                  case 'location9':
                    calculatedPrice = 743;
                    break;
                  case 'location10':
                    calculatedPrice = 732;
                    break;
                  case 'location11':
                    calculatedPrice = 674;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 611;
                    break;
                  case 'location14':
                    calculatedPrice = 528;
                    break;
                  case 'location15':
                    calculatedPrice = 386;
                    break;
                  case 'location16':
                    calculatedPrice = 278;
                    break;
                  case 'location17':
                    calculatedPrice = 192;
                    break;
                  case 'location18':
                    calculatedPrice = 89;
                    break;
                  case 'location19':
                    calculatedPrice = 64;
                    break;
                  case 'location21':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location22':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location23':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location24':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location25':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location26':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location27':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location28':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location29':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location30':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location31':
                    calculatedPrice = 'NO EXIT';
                    break;
                  default:
                    break;
                }
              }
            }




             // TIPO/SFEX ENTRY POINT (DONE)
             if (
              selectedOption === 'option1' &&
              locationdropdown === 'locationT' &&
              locationdropdown2 &&
              (locationdropdown2 === 'location1' ||
               locationdropdown2 === 'location2' ||
               locationdropdown2 === 'location3' ||
               locationdropdown2 === 'location4' ||
               locationdropdown2 === 'location5' ||
               locationdropdown2 === 'location6' ||
               locationdropdown2 === 'location7' ||
               locationdropdown2 === 'location8' ||
               locationdropdown2 === 'location9' ||
               locationdropdown2 === 'location10' ||
               locationdropdown2 === 'location11' ||
               locationdropdown2 === 'location12' ||
               locationdropdown2 === 'location13' ||
               locationdropdown2 === 'location14' ||
               locationdropdown2 === 'location15' ||
               locationdropdown2 === 'location16' ||
               locationdropdown2 === 'location17' ||
               locationdropdown2 === 'location18' ||
               locationdropdown2 === 'location19' ||
               locationdropdown2 === 'location20' ||
               locationdropdown2 === 'location21' ||
               locationdropdown2 === 'location22' ||
               locationdropdown2 === 'location23' ||
               locationdropdown2 === 'location24' ||
               locationdropdown2 === 'location25' ||
               locationdropdown2 === 'location26' ||
               locationdropdown2 === 'location27' ||
               locationdropdown2 === 'location28' ||
               locationdropdown2 === 'location29' ||
               locationdropdown2 === 'location30' ||
               locationdropdown2 === 'location31')
            ) {
              if (selectedClass === 'class1') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 656;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 578;
                    break;
                  case 'location9':
                    calculatedPrice = 572;
                    break;
                  case 'location10':
                    calculatedPrice = 568;
                    break;
                  case 'location11':
                    calculatedPrice = 549;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 528;
                    break;
                  case 'location14':
                    calculatedPrice = 500;
                    break;
                  case 'location15':
                    calculatedPrice = 453;
                    break;
                  case 'location16':
                    calculatedPrice = 417;
                    break;
                  case 'location17':
                    calculatedPrice = 388;
                    break;
                  case 'location18':
                    calculatedPrice = 354;
                    break;
                  case 'location19':
                    calculatedPrice = 345;
                    break;
                  case 'location20':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location21':
                    calculatedPrice = 35;
                    break;
                  case 'location22':
                    calculatedPrice = 97;
                    break;
                  case 'location23':
                    calculatedPrice = 193;
                    break;
                  case 'location24':
                    calculatedPrice = 263;
                    break;
                  case 'location25':
                    calculatedPrice = 316;
                    break;
                  case 'location26':
                    calculatedPrice = 324;
                    break;
                  case 'location27':
                    calculatedPrice = 346;
                    break;
                  case 'location28':
                    calculatedPrice = 353;
                    break;
                  case 'location29':
                    calculatedPrice = 407;
                    break;
                  case 'location30':
                    calculatedPrice = 479;
                    break;
                  case 'location31':
                    calculatedPrice = 504;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class2') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 1494;
                    break;
                    case 'location5':
                      calculatedPrice = 'NO EXIT';
                      break;
                  case 'location8':
                    calculatedPrice = 1301;
                    break;
                  case 'location9':
                    calculatedPrice = 1284;
                    break;
                  case 'location10':
                    calculatedPrice = 1275;
                    break;
                  case 'location11':
                    calculatedPrice = 1227;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 1174;
                    break;
                  case 'location14':
                    calculatedPrice = 1105;
                    break;
                  case 'location15':
                    calculatedPrice = 987;
                    break;
                  case 'location16':
                    calculatedPrice = 897;
                    break;
                  case 'location17':
                    calculatedPrice = 825;
                    break;
                  case 'location18':
                    calculatedPrice = 739;
                    break;
                  case 'location19':
                    calculatedPrice = 719;
                    break;
                  case 'location20':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location21':
                    calculatedPrice = 86;
                    break;
                  case 'location22':
                    calculatedPrice = 209;
                    break;
                  case 'location23':
                    calculatedPrice = 401;
                    break;
                  case 'location24':
                    calculatedPrice = 542;
                    break;
                  case 'location25':
                    calculatedPrice = 648;
                    break;
                  case 'location26':
                    calculatedPrice = 665;
                    break;
                  case 'location27':
                    calculatedPrice = 707;
                    break;
                  case 'location28':
                    calculatedPrice = 723;
                    break;
                  case 'location29':
                    calculatedPrice = 830;
                    break;
                  case 'location30':
                    calculatedPrice = 974;
                    break;
                  case 'location31':
                    calculatedPrice = 1024;
                    break;
                  default:
                    break;
                }
              } else if (selectedClass === 'class3') {
                switch (locationdropdown2) {
                  case 'location1':
                  case 'location2':
                  case 'location3':
                  case 'location4':
                  case 'location6':
                  case 'location7':
                    calculatedPrice = 1967;
                    break;
                  case 'location5':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location8':
                    calculatedPrice = 1735;
                    break;
                  case 'location9':
                    calculatedPrice = 1715;
                    break;
                  case 'location10':
                    calculatedPrice = 1704;
                    break;
                  case 'location11':
                    calculatedPrice = 1646;
                    break;
                  case 'location12':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location13':
                    calculatedPrice = 1583;
                    break;
                  case 'location14':
                    calculatedPrice = 1500;
                    break;
                  case 'location15':
                    calculatedPrice = 1358;
                    break;
                  case 'location16':
                    calculatedPrice = 1250;
                    break;
                  case 'location17':
                    calculatedPrice = 1164;
                    break;
                  case 'location18':
                    calculatedPrice = 1061;
                    break;
                  case 'location19':
                    calculatedPrice = 1036;
                    break;
                  case 'location20':
                    calculatedPrice = 'NO EXIT';
                    break;
                  case 'location21':
                    calculatedPrice = 104;
                    break;
                  case 'location22':
                    calculatedPrice = 289;
                    break;
                  case 'location23':
                    calculatedPrice = 577;
                    break;
                  case 'location24':
                    calculatedPrice = 788;
                    break;
                  case 'location25':
                    calculatedPrice = 946;
                    break;
                  case 'location26':
                    calculatedPrice = 972;
                    break;
                  case 'location27':
                    calculatedPrice = 1036;
                    break;
                  case 'location28':
                    calculatedPrice = 1059;
                    break;
                  case 'location29':
                    calculatedPrice = 1219;
                    break;
                  case 'location30':
                    calculatedPrice = 1436;
                    break;
                  case 'location31':
                    calculatedPrice = 1511;
                    break;
                  default:
                    break;
                }
              }
            }


    // DINALUPIHAN ENTRY POINT (DONE)
    if (
      selectedOption === 'option1' &&
      locationdropdown === 'locationU' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location1' ||
       locationdropdown2 === 'location2' ||
       locationdropdown2 === 'location3' ||
       locationdropdown2 === 'location4' ||
       locationdropdown2 === 'location5' ||
       locationdropdown2 === 'location6' ||
       locationdropdown2 === 'location7' ||
       locationdropdown2 === 'location8' ||
       locationdropdown2 === 'location9' ||
       locationdropdown2 === 'location10' ||
       locationdropdown2 === 'location11' ||
       locationdropdown2 === 'location12' ||
       locationdropdown2 === 'location13' ||
       locationdropdown2 === 'location14' ||
       locationdropdown2 === 'location15' ||
       locationdropdown2 === 'location16' ||
       locationdropdown2 === 'location17' ||
       locationdropdown2 === 'location18' ||
       locationdropdown2 === 'location19' ||
       locationdropdown2 === 'location20' ||
       locationdropdown2 === 'location21' ||
       locationdropdown2 === 'location23' ||
       locationdropdown2 === 'location24' ||
       locationdropdown2 === 'location25' ||
       locationdropdown2 === 'location26' ||
       locationdropdown2 === 'location27' ||
       locationdropdown2 === 'location28' ||
       locationdropdown2 === 'location29' ||
       locationdropdown2 === 'location30' ||
       locationdropdown2 === 'location31')
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 560;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 482;
            break;
          case 'location9':
            calculatedPrice = 476;
            break;
          case 'location10':
            calculatedPrice = 472;
            break;
          case 'location11':
            calculatedPrice = 453;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 432;
            break;
          case 'location14':
            calculatedPrice = 404;
            break;
          case 'location15':
            calculatedPrice = 357;
            break;
          case 'location16':
            calculatedPrice = 321;
            break;
          case 'location17':
            calculatedPrice = 292;
            break;
          case 'location18':
            calculatedPrice = 258;
            break;
          case 'location19':
            calculatedPrice = 249;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 97;
            break;
          case 'location23':
            calculatedPrice = 96;
            break;
          case 'location24':
            calculatedPrice = 166;
            break;
          case 'location25':
            calculatedPrice = 219;
            break;
          case 'location26':
            calculatedPrice = 228;
            break;
          case 'location27':
            calculatedPrice = 249;
            break;
          case 'location28':
            calculatedPrice = 257;
            break;
          case 'location29':
            calculatedPrice = 310;
            break;
          case 'location30':
            calculatedPrice = 382;
            break;
          case 'location31':
            calculatedPrice = 407;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 1284;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location8':
            calculatedPrice = 1091;
            break;
          case 'location9':
            calculatedPrice = 1074;
            break;
          case 'location10':
            calculatedPrice = 1065;
            break;
          case 'location11':
            calculatedPrice = 1017;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 964;
            break;
          case 'location14':
            calculatedPrice = 895;
            break;
          case 'location15':
            calculatedPrice = 777;
            break;
          case 'location16':
            calculatedPrice = 687;
            break;
          case 'location17':
            calculatedPrice = 615;
            break;
          case 'location18':
            calculatedPrice = 529;
            break;
          case 'location19':
            calculatedPrice = 509;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 209;
            break;
          case 'location23':
            calculatedPrice = 192;
            break;
          case 'location24':
            calculatedPrice = 333;
            break;
          case 'location25':
            calculatedPrice = 438;
            break;
          case 'location26':
            calculatedPrice = 455;
            break;
          case 'location27':
            calculatedPrice = 498;
            break;
          case 'location28':
            calculatedPrice = 514;
            break;
          case 'location29':
            calculatedPrice = 620;
            break;
          case 'location30':
            calculatedPrice = 764;
            break;
          case 'location31':
            calculatedPrice = 815;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 1678;
            break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 1446;
            break;
          case 'location9':
            calculatedPrice = 1426;
            break;
          case 'location10':
            calculatedPrice = 1415;
            break;
          case 'location11':
            calculatedPrice = 1357;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 1294;
            break;
          case 'location14':
            calculatedPrice = 1211;
            break;
          case 'location15':
            calculatedPrice = 1069;
            break;
          case 'location16':
            calculatedPrice = 961;
            break;
          case 'location17':
            calculatedPrice = 875;
            break;
          case 'location18':
            calculatedPrice = 772;
            break;
          case 'location19':
            calculatedPrice = 747;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 289;
            break;
          case 'location23':
            calculatedPrice = 288;
            break;
          case 'location24':
            calculatedPrice = 499;
            break;
          case 'location25':
            calculatedPrice = 657;
            break;
          case 'location26':
            calculatedPrice = 683;
            break;
          case 'location27':
            calculatedPrice = 747;
            break;
          case 'location28':
            calculatedPrice = 770;
            break;
          case 'location29':
            calculatedPrice = 930;
            break;
          case 'location30':
            calculatedPrice = 1147;
            break;
          case 'location31':
            calculatedPrice = 1222;
            break;
          default:
            break;
        }
      }
    }


    // FLORIDABLANCA ENTRY POINT (DONE)
    if (
      selectedOption === 'option1' &&
      locationdropdown === 'locationV' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location1' ||
       locationdropdown2 === 'location2' ||
       locationdropdown2 === 'location3' ||
       locationdropdown2 === 'location4' ||
       locationdropdown2 === 'location5' ||
       locationdropdown2 === 'location6' ||
       locationdropdown2 === 'location7' ||
       locationdropdown2 === 'location8' ||
       locationdropdown2 === 'location9' ||
       locationdropdown2 === 'location10' ||
       locationdropdown2 === 'location11' ||
       locationdropdown2 === 'location12' ||
       locationdropdown2 === 'location13' ||
       locationdropdown2 === 'location14' ||
       locationdropdown2 === 'location15' ||
       locationdropdown2 === 'location16' ||
       locationdropdown2 === 'location17' ||
       locationdropdown2 === 'location18' ||
       locationdropdown2 === 'location19' ||
       locationdropdown2 === 'location20' ||
       locationdropdown2 === 'location21' ||
       locationdropdown2 === 'location22' ||
       locationdropdown2 === 'location24' ||
       locationdropdown2 === 'location25' ||
       locationdropdown2 === 'location26' ||
       locationdropdown2 === 'location27' ||
       locationdropdown2 === 'location28' ||
       locationdropdown2 === 'location29' ||
       locationdropdown2 === 'location30' ||
       locationdropdown2 === 'location31')
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 464;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 386;
            break;
          case 'location9':
            calculatedPrice = 380;
            break;
          case 'location10':
            calculatedPrice = 376;
            break;
          case 'location11':
            calculatedPrice = 357;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 336;
            break;
          case 'location14':
            calculatedPrice = 308;
            break;
          case 'location15':
            calculatedPrice = 261;
            break;
          case 'location16':
            calculatedPrice = 225;
            break;
          case 'location17':
            calculatedPrice = 196;
            break;
          case 'location18':
            calculatedPrice = 162;
            break;
          case 'location19':
            calculatedPrice = 153;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 193;
            break;
          case 'location22':
            calculatedPrice = 96;
            break;
          case 'location24':
            calculatedPrice = 70;
            break;
          case 'location25':
            calculatedPrice = 123;
            break;
          case 'location26':
            calculatedPrice = 132;
            break;
          case 'location27':
            calculatedPrice = 153;
            break;
          case 'location28':
            calculatedPrice = 161;
            break;
          case 'location29':
            calculatedPrice = 214;
            break;
          case 'location30':
            calculatedPrice = 286;
            break;
          case 'location31':
            calculatedPrice = 311;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 1092;
            break;
            case 'location5':
              calculatedPrice = 'NO EXIT';
              break;
          case 'location8':
            calculatedPrice = 899;
            break;
          case 'location9':
            calculatedPrice = 882;
            break;
          case 'location10':
            calculatedPrice = 873;
            break;
          case 'location11':
            calculatedPrice = 825;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 772;
            break;
          case 'location14':
            calculatedPrice = 703;
            break;
          case 'location15':
            calculatedPrice = 585;
            break;
          case 'location16':
            calculatedPrice = 495;
            break;
          case 'location17':
            calculatedPrice = 423;
            break;
          case 'location18':
            calculatedPrice = 337;
            break;
          case 'location19':
            calculatedPrice = 317;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 401;
            break;
          case 'location22':
            calculatedPrice = 192;
            break;
          case 'location24':
            calculatedPrice = 140;
            break;
          case 'location25':
            calculatedPrice = 246;
            break;
          case 'location26':
            calculatedPrice = 263;
            break;
          case 'location27':
            calculatedPrice = 306;
            break;
          case 'location28':
            calculatedPrice = 321;
            break;
          case 'location29':
            calculatedPrice = 428;
            break;
          case 'location30':
            calculatedPrice = 572;
            break;
          case 'location31':
            calculatedPrice = 623;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location1':
          case 'location2':
          case 'location3':
          case 'location4':
          case 'location6':
          case 'location7':
            calculatedPrice = 1390;
            break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location8':
            calculatedPrice = 1158;
            break;
          case 'location9':
            calculatedPrice = 1138;
            break;
          case 'location10':
            calculatedPrice = 1127;
            break;
          case 'location11':
            calculatedPrice = 1069;
            break;
          case 'location12':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location13':
            calculatedPrice = 1006;
            break;
          case 'location14':
            calculatedPrice = 923;
            break;
          case 'location15':
            calculatedPrice = 781;
            break;
          case 'location16':
            calculatedPrice = 673;
            break;
          case 'location17':
            calculatedPrice = 587;
            break;
          case 'location18':
            calculatedPrice = 484;
            break;
          case 'location19':
            calculatedPrice = 459;
            break;
          case 'location20':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location21':
            calculatedPrice = 577;
            break;
          case 'location22':
            calculatedPrice = 288;
            break;
          case 'location24':
            calculatedPrice = 211;
            break;
          case 'location25':
            calculatedPrice = 369;
            break;
          case 'location26':
            calculatedPrice = 395;
            break;
          case 'location27':
            calculatedPrice = 459;
            break;
          case 'location28':
            calculatedPrice = 482;
            break;
          case 'location29':
            calculatedPrice = 642;
            break;
          case 'location30':
            calculatedPrice = 858;
            break;
          case 'location31':
            calculatedPrice = 934;
            break;
          default:
            break;
        }
      }
    }


        // PORAC ENTRY POINT (DONE)
        if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationW' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 393;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 315;
                break;
              case 'location9':
                calculatedPrice = 309;
                break;
              case 'location10':
                calculatedPrice = 305;
                break;
              case 'location11':
                calculatedPrice = 286;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 265;
                break;
              case 'location14':
                calculatedPrice = 237;
                break;
              case 'location15':
                calculatedPrice = 190;
                break;
              case 'location16':
                calculatedPrice = 154;
                break;
              case 'location17':
                calculatedPrice = 125;
                break;
              case 'location18':
                calculatedPrice = 91;
                break;
              case 'location19':
                calculatedPrice = 82;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 263;
                break;
              case 'location22':
                calculatedPrice = 166;
                break;
              case 'location23':
                calculatedPrice = 70;
                break;
              case 'location25':
                calculatedPrice = 53;
                break;
              case 'location26':
                calculatedPrice = 61;
                break;
              case 'location27':
                calculatedPrice = 83;
                break;
              case 'location28':
                calculatedPrice = 90;
                break;
              case 'location29':
                calculatedPrice = 144;
                break;
              case 'location30':
                calculatedPrice = 216;
                break;
              case 'location31':
                calculatedPrice = 241;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 952;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 759;
                break;
              case 'location9':
                calculatedPrice = 742;
                break;
              case 'location10':
                calculatedPrice = 733;
                break;
              case 'location11':
                calculatedPrice = 685;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 632;
                break;
              case 'location14':
                calculatedPrice = 563;
                break;
              case 'location15':
                calculatedPrice = 445;
                break;
              case 'location16':
                calculatedPrice = 355;
                break;
              case 'location17':
                calculatedPrice = 283;
                break;
              case 'location18':
                calculatedPrice = 197;
                break;
              case 'location19':
                calculatedPrice = 177;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 542;
                break;
              case 'location22':
                calculatedPrice = 333;
                break;
              case 'location23':
                calculatedPrice = 140;
                break;
              case 'location25':
                calculatedPrice = 106;
                break;
              case 'location26':
                calculatedPrice = 123;
                break;
              case 'location27':
                calculatedPrice = 165;
                break;
              case 'location28':
                calculatedPrice = 181;
                break;
              case 'location29':
                calculatedPrice = 288;
                break;
              case 'location30':
                calculatedPrice = 432;
                break;
              case 'location31':
                calculatedPrice = 482;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1179;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 947;
                break;
              case 'location9':
                calculatedPrice = 927;
                break;
              case 'location10':
                calculatedPrice = 916;
                break;
              case 'location11':
                calculatedPrice = 858;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 795;
                break;
              case 'location14':
                calculatedPrice = 712;
                break;
              case 'location15':
                calculatedPrice = 570;
                break;
              case 'location16':
                calculatedPrice = 462;
                break;
              case 'location17':
                calculatedPrice = 376;
                break;
              case 'location18':
                calculatedPrice = 273;
                break;
              case 'location19':
                calculatedPrice = 248;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 788;
                break;
              case 'location22':
                calculatedPrice = 499;
                break;
              case 'location23':
                calculatedPrice = 211;
                break;
              case 'location25':
                calculatedPrice = 159;
                break;
              case 'location26':
                calculatedPrice = 184;
                break;
              case 'location27':
                calculatedPrice = 248;
                break;
              case 'location28':
                calculatedPrice = 271;
                break;
              case 'location29':
                calculatedPrice = 432;
                break;
              case 'location30':
                calculatedPrice = 648;
                break;
              case 'location31':
                calculatedPrice = 723;
                break;
              default:
                break;
            }
          }
        }


        // CLARK SOUTH ENTRY POINT (DONE)
        if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationX' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 341;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 263;
                break;
              case 'location9':
                calculatedPrice = 253;
                break;
              case 'location10':
                calculatedPrice = 234;
                break;
              case 'location11':
                calculatedPrice = 213;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 185;
                break;
              case 'location14':
                calculatedPrice = 138;
                break;
              case 'location15':
                calculatedPrice = 102;
                break;
              case 'location16':
                calculatedPrice = 73;
                break;
              case 'location17':
                calculatedPrice = 39;
                break;
              case 'location18':
                calculatedPrice = 30;
                break;
              case 'location19':
                calculatedPrice = 82;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 316;
                break;
              case 'location22':
                calculatedPrice = 219;
                break;
              case 'location23':
                calculatedPrice = 123;
                break;
              case 'location24':
                calculatedPrice = 53;
                break;
              case 'location26':
                calculatedPrice = 9;
                break;
              case 'location27':
                calculatedPrice = 30;
                break;
              case 'location28':
                calculatedPrice = 38;
                break;
              case 'location29':
                calculatedPrice = 91;
                break;
              case 'location30':
                calculatedPrice = 163;
                break;
              case 'location31':
                calculatedPrice = 188;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 846;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 653;
                break;
              case 'location9':
                calculatedPrice = 636;
                break;
              case 'location10':
                calculatedPrice = 627;
                break;
              case 'location11':
                calculatedPrice = 579;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 526;
                break;
              case 'location14':
                calculatedPrice = 457;
                break;
              case 'location15':
                calculatedPrice = 339;
                break;
              case 'location16':
                calculatedPrice = 249;
                break;
              case 'location17':
                calculatedPrice = 177;
                break;
              case 'location18':
                calculatedPrice = 91;
                break;
              case 'location19':
                calculatedPrice = 71;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 648;
                break;
              case 'location22':
                calculatedPrice = 438;
                break;
              case 'location23':
                calculatedPrice = 246;
                break;
              case 'location24':
                calculatedPrice = 106;
                break;
              case 'location26':
                calculatedPrice = 17;
                break;
              case 'location27':
                calculatedPrice = 60;
                break;
              case 'location28':
                calculatedPrice = 75;
                break;
              case 'location29':
                calculatedPrice = 182;
                break;
              case 'location30':
                calculatedPrice = 326;
                break;
              case 'location31':
                calculatedPrice = 376;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1021;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 789;
                break;
              case 'location9':
                calculatedPrice = 769;
                break;
              case 'location10':
                calculatedPrice = 758;
                break;
              case 'location11':
                calculatedPrice = 700;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 637;
                break;
              case 'location14':
                calculatedPrice = 554;
                break;
              case 'location15':
                calculatedPrice = 412;
                break;
              case 'location16':
                calculatedPrice = 304;
                break;
              case 'location17':
                calculatedPrice = 218;
                break;
              case 'location18':
                calculatedPrice = 115;
                break;
              case 'location19':
                calculatedPrice = 90;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 946;
                break;
              case 'location22':
                calculatedPrice = 657;
                break;
              case 'location23':
                calculatedPrice = 369;
                break;
              case 'location24':
                calculatedPrice = 159;
                break;
              case 'location26':
                calculatedPrice = 26;
                break;
              case 'location27':
                calculatedPrice = 89;
                break;
              case 'location28':
                calculatedPrice = 113;
                break;
              case 'location29':
                calculatedPrice = 273;
                break;
              case 'location30':
                calculatedPrice = 489;
                break;
              case 'location31':
                calculatedPrice = 565;
                break;
              default:
                break;
            }
          }
        }


         // MABALACAT (MABIGA) ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationY' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 332;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 254;
                break;
              case 'location9':
                calculatedPrice = 248;
                break;
              case 'location10':
                calculatedPrice = 244;
                break;
              case 'location11':
                calculatedPrice = 225;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 204;
                break;
              case 'location14':
                calculatedPrice = 176;
                break;
              case 'location15':
                calculatedPrice = 129;
                break;
              case 'location16':
                calculatedPrice = 93;
                break;
              case 'location17':
                calculatedPrice = 64;
                break;
              case 'location18':
                calculatedPrice = 30;
                break;
              case 'location19':
                calculatedPrice = 21;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 324;
                break;
              case 'location22':
                calculatedPrice = 228;
                break;
              case 'location23':
                calculatedPrice = 132;
                break;
              case 'location24':
                calculatedPrice = 61;
                break;
              case 'location25':
                calculatedPrice = 9;
                break;
              case 'location27':
                calculatedPrice = 21;
                break;
              case 'location28':
                calculatedPrice = 29;
                break;
              case 'location29':
                calculatedPrice = 82;
                break;
              case 'location30':
                calculatedPrice = 155;
                break;
              case 'location31':
                calculatedPrice = 180;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 829;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 636;
                break;
              case 'location9':
                calculatedPrice = 619;
                break;
              case 'location10':
                calculatedPrice = 610;
                break;
              case 'location11':
                calculatedPrice = 562;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 509;
                break;
              case 'location14':
                calculatedPrice = 440;
                break;
              case 'location15':
                calculatedPrice = 322;
                break;
              case 'location16':
                calculatedPrice = 232;
                break;
              case 'location17':
                calculatedPrice = 160;
                break;
              case 'location18':
                calculatedPrice = 74;
                break;
              case 'location19':
                calculatedPrice = 54;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 665;
                break;
              case 'location22':
                calculatedPrice = 455;
                break;
              case 'location23':
                calculatedPrice = 263;
                break;
              case 'location24':
                calculatedPrice = 123;
                break;
              case 'location25':
                calculatedPrice = 17;
                break;
              case 'location27':
                calculatedPrice = 42;
                break;
              case 'location28':
                calculatedPrice = 58;
                break;
              case 'location29':
                calculatedPrice = 165;
                break;
              case 'location30':
                calculatedPrice = 309;
                break;
              case 'location31':
                calculatedPrice = 359;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 995;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 763;
                break;
              case 'location9':
                calculatedPrice = 743;
                break;
              case 'location10':
                calculatedPrice = 732;
                break;
              case 'location11':
                calculatedPrice = 674;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 611;
                break;
              case 'location14':
                calculatedPrice = 528;
                break;
              case 'location15':
                calculatedPrice = 386;
                break;
              case 'location16':
                calculatedPrice = 278;
                break;
              case 'location17':
                calculatedPrice = 192;
                break;
              case 'location18':
                calculatedPrice = 89;
                break;
              case 'location19':
                calculatedPrice = 64;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 972;
                break;
              case 'location22':
                calculatedPrice = 683;
                break;
              case 'location23':
                calculatedPrice = 395;
                break;
              case 'location24':
                calculatedPrice = 184;
                break;
              case 'location25':
                calculatedPrice = 26;
                break;
              case 'location27':
                calculatedPrice = 64;
                break;
              case 'location28':
                calculatedPrice = 87;
                break;
              case 'location29':
                calculatedPrice = 247;
                break;
              case 'location30':
                calculatedPrice = 464;
                break;
              case 'location31':
                calculatedPrice = 539;
                break;
              default:
                break;
            }
          }
        }


         // CLARK NORTH  ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationZ' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 353;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 275;
                break;
              case 'location9':
                calculatedPrice = 269;
                break;
              case 'location10':
                calculatedPrice = 265;
                break;
              case 'location11':
                calculatedPrice = 246;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 225;
                break;
              case 'location14':
                calculatedPrice = 197;
                break;
              case 'location15':
                calculatedPrice = 150;
                break;
              case 'location16':
                calculatedPrice = 114;
                break;
              case 'location17':
                calculatedPrice = 85;
                break;
              case 'location18':
                calculatedPrice = 51;
                break;
              case 'location19':
                calculatedPrice = 42;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 346;
                break;
              case 'location22':
                calculatedPrice = 249;
                break;
              case 'location23':
                calculatedPrice = 153;
                break;
              case 'location24':
                calculatedPrice = 83;
                break;
              case 'location25':
                calculatedPrice = 30;
                break;
              case 'location26':
                calculatedPrice = 21;
                break;
              case 'location28':
                calculatedPrice = 8;
                break;
              case 'location29':
                calculatedPrice = 61;
                break;
              case 'location30':
                calculatedPrice = 133;
                break;
              case 'location31':
                calculatedPrice = 158;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 871;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 678;
                break;
              case 'location9':
                calculatedPrice = 661;
                break;
              case 'location10':
                calculatedPrice = 652;
                break;
              case 'location11':
                calculatedPrice = 604;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 551;
                break;
              case 'location14':
                calculatedPrice = 482;
                break;
              case 'location15':
                calculatedPrice = 364;
                break;
              case 'location16':
                calculatedPrice = 274;
                break;
              case 'location17':
                calculatedPrice = 202;
                break;
              case 'location18':
                calculatedPrice = 116;
                break;
              case 'location19':
                calculatedPrice = 96;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 707;
                break;
              case 'location22':
                calculatedPrice = 498;
                break;
              case 'location23':
                calculatedPrice = 306;
                break;
              case 'location24':
                calculatedPrice = 165;
                break;
              case 'location25':
                calculatedPrice = 60;
                break;
              case 'location26':
                calculatedPrice = 42;
                break;
              case 'location28':
                calculatedPrice = 16;
                break;
              case 'location29':
                calculatedPrice = 122;
                break;
              case 'location30':
                calculatedPrice = 267;
                break;
              case 'location31':
                calculatedPrice = 317;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1059;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 827;
                break;
              case 'location9':
                calculatedPrice = 807;
                break;
              case 'location10':
                calculatedPrice = 796;
                break;
              case 'location11':
                calculatedPrice = 738;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 675;
                break;
              case 'location14':
                calculatedPrice = 592;
                break;
              case 'location15':
                calculatedPrice = 450;
                break;
              case 'location16':
                calculatedPrice = 342;
                break;
              case 'location17':
                calculatedPrice = 256;
                break;
              case 'location18':
                calculatedPrice = 153;
                break;
              case 'location19':
                calculatedPrice = 128;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 1036;
                break;
              case 'location22':
                calculatedPrice = 747;
                break;
              case 'location23':
                calculatedPrice = 459;
                break;
              case 'location24':
                calculatedPrice = 248;
                break;
              case 'location25':
                calculatedPrice = 89;
                break;
              case 'location26':
                calculatedPrice = 64;
                break;
              case 'location28':
                calculatedPrice = 24;
                break;
              case 'location29':
                calculatedPrice = 184;
                break;
              case 'location30':
                calculatedPrice = 400;
                break;
              case 'location31':
                calculatedPrice = 475;
                break;
              default:
                break;
            }
          }
        }


         // DOLORES ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationA1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 361;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 283;
                break;
              case 'location9':
                calculatedPrice = 277;
                break;
              case 'location10':
                calculatedPrice = 273;
                break;
              case 'location11':
                calculatedPrice = 254;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 233;
                break;
              case 'location14':
                calculatedPrice = 205;
                break;
              case 'location15':
                calculatedPrice = 158;
                break;
              case 'location16':
                calculatedPrice = 122;
                break;
              case 'location17':
                calculatedPrice = 93;
                break;
              case 'location18':
                calculatedPrice = 59;
                break;
              case 'location19':
                calculatedPrice = 50;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 353;
                break;
              case 'location22':
                calculatedPrice = 257;
                break;
              case 'location23':
                calculatedPrice = 161;
                break;
              case 'location24':
                calculatedPrice = 90;
                break;
              case 'location25':
                calculatedPrice = 38;
                break;
              case 'location26':
                calculatedPrice = 29;
                break;
              case 'location27':
                calculatedPrice = 8;
                break;
              case 'location29':
                calculatedPrice = 53;
                break;
              case 'location30':
                calculatedPrice = 125;
                break;
              case 'location31':
                calculatedPrice = 151;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 887;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 694;
                break;
              case 'location9':
                calculatedPrice = 677;
                break;
              case 'location10':
                calculatedPrice = 668;
                break;
              case 'location11':
                calculatedPrice = 620;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 567;
                break;
              case 'location14':
                calculatedPrice = 498;
                break;
              case 'location15':
                calculatedPrice = 380;
                break;
              case 'location16':
                calculatedPrice = 290;
                break;
              case 'location17':
                calculatedPrice = 218;
                break;
              case 'location18':
                calculatedPrice = 132;
                break;
              case 'location19':
                calculatedPrice = 112;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 723;
                break;
              case 'location22':
                calculatedPrice = 514;
                break;
              case 'location23':
                calculatedPrice = 321;
                break;
              case 'location24':
                calculatedPrice = 181;
                break;
              case 'location25':
                calculatedPrice = 75;
                break;
              case 'location26':
                calculatedPrice = 58;
                break;
              case 'location27':
                calculatedPrice = 16;
                break;
              case 'location29':
                calculatedPrice = 107;
                break;
              case 'location30':
                calculatedPrice = 251;
                break;
              case 'location31':
                calculatedPrice = 301;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1082;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 850;
                break;
              case 'location9':
                calculatedPrice = 830;
                break;
              case 'location10':
                calculatedPrice = 819;
                break;
              case 'location11':
                calculatedPrice = 761;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 698;
                break;
              case 'location14':
                calculatedPrice = 615;
                break;
              case 'location15':
                calculatedPrice = 473;
                break;
              case 'location16':
                calculatedPrice = 365;
                break;
              case 'location17':
                calculatedPrice = 279;
                break;
              case 'location18':
                calculatedPrice = 176;
                break;
              case 'location19':
                calculatedPrice = 151;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 1059;
                break;
              case 'location22':
                calculatedPrice = 770;
                break;
              case 'location23':
                calculatedPrice = 482;
                break;
              case 'location24':
                calculatedPrice = 271;
                break;
              case 'location25':
                calculatedPrice = 113;
                break;
              case 'location26':
                calculatedPrice = 87;
                break;
              case 'location27':
                calculatedPrice = 24;
                break;
              case 'location29':
                calculatedPrice = 160;
                break;
              case 'location30':
                calculatedPrice = 376;
                break;
              case 'location31':
                calculatedPrice = 452;
                break;
              default:
                break;
            }
          }
        }


         // CONCEPCION ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationB1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location30' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 414;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 336;
                break;
              case 'location9':
                calculatedPrice = 330;
                break;
              case 'location10':
                calculatedPrice = 326;
                break;
              case 'location11':
                calculatedPrice = 307;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 286;
                break;
              case 'location14':
                calculatedPrice = 258;
                break;
              case 'location15':
                calculatedPrice = 211;
                break;
              case 'location16':
                calculatedPrice = 175;
                break;
              case 'location17':
                calculatedPrice = 146;
                break;
              case 'location18':
                calculatedPrice = 112;
                break;
              case 'location19':
                calculatedPrice = 103;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 407;
                break;
              case 'location22':
                calculatedPrice = 310;
                break;
              case 'location23':
                calculatedPrice = 214;
                break;
              case 'location24':
                calculatedPrice = 144;
                break;
              case 'location25':
                calculatedPrice = 91;
                break;
              case 'location26':
                calculatedPrice = 82;
                break;
              case 'location27':
                calculatedPrice = 61;
                break;
              case 'location28':
                calculatedPrice = 53;
                break;
              case 'location30':
                calculatedPrice = 72;
                break;
              case 'location31':
                calculatedPrice = 97;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 994;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 801;
                break;
              case 'location9':
                calculatedPrice = 784;
                break;
              case 'location10':
                calculatedPrice = 775;
                break;
              case 'location11':
                calculatedPrice = 727;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 674;
                break;
              case 'location14':
                calculatedPrice = 605;
                break;
              case 'location15':
                calculatedPrice = 487;
                break;
              case 'location16':
                calculatedPrice = 397;
                break;
              case 'location17':
                calculatedPrice = 325;
                break;
              case 'location18':
                calculatedPrice = 239;
                break;
              case 'location19':
                calculatedPrice = 219;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 830;
                break;
              case 'location22':
                calculatedPrice = 620;
                break;
              case 'location23':
                calculatedPrice = 428;
                break;
              case 'location24':
                calculatedPrice = 288;
                break;
              case 'location25':
                calculatedPrice = 182;
                break;
              case 'location26':
                calculatedPrice = 165;
                break;
              case 'location27':
                calculatedPrice = 122;
                break;
              case 'location28':
                calculatedPrice = 107;
                break;
              case 'location30':
                calculatedPrice = 144;
                break;
              case 'location31':
                calculatedPrice = 194;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1242;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 1010;
                break;
              case 'location9':
                calculatedPrice = 990;
                break;
              case 'location10':
                calculatedPrice = 979;
                break;
              case 'location11':
                calculatedPrice = 921;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 858;
                break;
              case 'location14':
                calculatedPrice = 775;
                break;
              case 'location15':
                calculatedPrice = 633;
                break;
              case 'location16':
                calculatedPrice = 525;
                break;
              case 'location17':
                calculatedPrice = 439;
                break;
              case 'location18':
                calculatedPrice = 336;
                break;
              case 'location19':
                calculatedPrice = 311;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 1219;
                break;
              case 'location22':
                calculatedPrice = 930;
                break;
              case 'location23':
                calculatedPrice = 642;
                break;
              case 'location24':
                calculatedPrice = 432;
                break;
              case 'location25':
                calculatedPrice = 273;
                break;
              case 'location26':
                calculatedPrice = 247;
                break;
              case 'location27':
                calculatedPrice = 184;
                break;
              case 'location28':
                calculatedPrice = 160;
                break;
              case 'location30':
                calculatedPrice = 216;
                break;
              case 'location31':
                calculatedPrice = 292;
                break;
              default:
                break;
            }
          }
        }


         // SAN MIGUEL ENTRY POINT (DONE)
         if (
          selectedOption === 'option1' &&
          locationdropdown === 'locationC1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location1' ||
           locationdropdown2 === 'location2' ||
           locationdropdown2 === 'location3' ||
           locationdropdown2 === 'location4' ||
           locationdropdown2 === 'location5' ||
           locationdropdown2 === 'location6' ||
           locationdropdown2 === 'location7' ||
           locationdropdown2 === 'location8' ||
           locationdropdown2 === 'location9' ||
           locationdropdown2 === 'location10' ||
           locationdropdown2 === 'location11' ||
           locationdropdown2 === 'location12' ||
           locationdropdown2 === 'location13' ||
           locationdropdown2 === 'location14' ||
           locationdropdown2 === 'location15' ||
           locationdropdown2 === 'location16' ||
           locationdropdown2 === 'location17' ||
           locationdropdown2 === 'location18' ||
           locationdropdown2 === 'location19' ||
           locationdropdown2 === 'location20' ||
           locationdropdown2 === 'location21' ||
           locationdropdown2 === 'location22' ||
           locationdropdown2 === 'location23' ||
           locationdropdown2 === 'location24' ||
           locationdropdown2 === 'location25' ||
           locationdropdown2 === 'location26' ||
           locationdropdown2 === 'location27' ||
           locationdropdown2 === 'location28' ||
           locationdropdown2 === 'location29' ||
           locationdropdown2 === 'location31')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 487;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 409;
                break;
              case 'location9':
                calculatedPrice = 403;
                break;
              case 'location10':
                calculatedPrice = 399;
                break;
              case 'location11':
                calculatedPrice = 380;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 359;
                break;
              case 'location14':
                calculatedPrice = 331;
                break;
              case 'location15':
                calculatedPrice = 284;
                break;
              case 'location16':
                calculatedPrice = 248;
                break;
              case 'location17':
                calculatedPrice = 219;
                break;
              case 'location18':
                calculatedPrice = 185;
                break;
              case 'location19':
                calculatedPrice = 176;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 479;
                break;
              case 'location22':
                calculatedPrice = 382;
                break;
              case 'location23':
                calculatedPrice = 286;
                break;
              case 'location24':
                calculatedPrice = 216;
                break;
              case 'location25':
                calculatedPrice = 163;
                break;
              case 'location26':
                calculatedPrice = 155;
                break;
              case 'location27':
                calculatedPrice = 133;
                break;
              case 'location28':
                calculatedPrice = 125;
                break;
              case 'location29':
                calculatedPrice = 72;
                break;
              case 'location31':
                calculatedPrice = 97;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1138;
                break;
                case 'location5':
                  calculatedPrice = 'NO EXIT';
                  break;
              case 'location8':
                calculatedPrice = 945;
                break;
              case 'location9':
                calculatedPrice = 928;
                break;
              case 'location10':
                calculatedPrice = 919;
                break;
              case 'location11':
                calculatedPrice = 871;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 818;
                break;
              case 'location14':
                calculatedPrice = 749;
                break;
              case 'location15':
                calculatedPrice = 631;
                break;
              case 'location16':
                calculatedPrice = 541;
                break;
              case 'location17':
                calculatedPrice = 469;
                break;
              case 'location18':
                calculatedPrice = 383;
                break;
              case 'location19':
                calculatedPrice = 363;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 974;
                break;
              case 'location22':
                calculatedPrice = 764;
                break;
              case 'location23':
                calculatedPrice = 572;
                break;
              case 'location24':
                calculatedPrice = 432;
                break;
              case 'location25':
                calculatedPrice = 326;
                break;
              case 'location26':
                calculatedPrice = 309;
                break;
              case 'location27':
                calculatedPrice = 267;
                break;
              case 'location28':
                calculatedPrice = 251;
                break;
              case 'location29':
                calculatedPrice = 144;
                break;
              case 'location31':
                calculatedPrice = 194;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location1':
              case 'location2':
              case 'location3':
              case 'location4':
              case 'location6':
              case 'location7':
                calculatedPrice = 1459;
                break;
              case 'location5':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location8':
                calculatedPrice = 1227;
                break;
              case 'location9':
                calculatedPrice = 1207;
                break;
              case 'location10':
                calculatedPrice = 1196;
                break;
              case 'location11':
                calculatedPrice = 1138;
                break;
              case 'location12':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location13':
                calculatedPrice = 1075;
                break;
              case 'location14':
                calculatedPrice = 992;
                break;
              case 'location15':
                calculatedPrice = 850;
                break;
              case 'location16':
                calculatedPrice = 742;
                break;
              case 'location17':
                calculatedPrice = 656;
                break;
              case 'location18':
                calculatedPrice = 553;
                break;
              case 'location19':
                calculatedPrice = 528;
                break;
              case 'location20':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location21':
                calculatedPrice = 1436;
                break;
              case 'location22':
                calculatedPrice = 1147;
                break;
              case 'location23':
                calculatedPrice = 858;
                break;
              case 'location24':
                calculatedPrice = 648;
                break;
              case 'location25':
                calculatedPrice = 489;
                break;
              case 'location26':
                calculatedPrice = 464;
                break;
              case 'location27':
                calculatedPrice = 400;
                break;
              case 'location28':
                calculatedPrice = 376;
                break;
              case 'location29':
                calculatedPrice = 216;
                break;
              case 'location31':
                calculatedPrice = 75;
                break;
              default:
                break;
            }
          }
        }


   // TARLAC ENTRY POINT (DONE)
   if (
    selectedOption === 'option1' &&
    locationdropdown === 'locationD1' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location1' ||
     locationdropdown2 === 'location2' ||
     locationdropdown2 === 'location3' ||
     locationdropdown2 === 'location4' ||
     locationdropdown2 === 'location5' ||
     locationdropdown2 === 'location6' ||
     locationdropdown2 === 'location7' ||
     locationdropdown2 === 'location8' ||
     locationdropdown2 === 'location9' ||
     locationdropdown2 === 'location10' ||
     locationdropdown2 === 'location11' ||
     locationdropdown2 === 'location12' ||
     locationdropdown2 === 'location13' ||
     locationdropdown2 === 'location14' ||
     locationdropdown2 === 'location15' ||
     locationdropdown2 === 'location16' ||
     locationdropdown2 === 'location17' ||
     locationdropdown2 === 'location18' ||
     locationdropdown2 === 'location19' ||
     locationdropdown2 === 'location20' ||
     locationdropdown2 === 'location21' ||
     locationdropdown2 === 'location22' ||
     locationdropdown2 === 'location23' ||
     locationdropdown2 === 'location24' ||
     locationdropdown2 === 'location25' ||
     locationdropdown2 === 'location26' ||
     locationdropdown2 === 'location27' ||
     locationdropdown2 === 'location28' ||
     locationdropdown2 === 'location29' ||
     locationdropdown2 === 'location30')
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
        case 'location7':
          calculatedPrice = 512;
          break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
          break;
        case 'location8':
          calculatedPrice = 434;
          break;
        case 'location9':
          calculatedPrice = 428;
          break;
        case 'location10':
          calculatedPrice = 424;
          break;
        case 'location11':
          calculatedPrice = 405;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location13':
          calculatedPrice = 384;
          break;
        case 'location14':
          calculatedPrice = 356;
          break;
        case 'location15':
          calculatedPrice = 309;
          break;
        case 'location16':
          calculatedPrice = 273;
          break;
        case 'location17':
          calculatedPrice = 244;
          break;
        case 'location18':
          calculatedPrice = 210;
          break;
        case 'location19':
          calculatedPrice = 201;
          break;
        case 'location20':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location21':
          calculatedPrice = 504;
          break;
        case 'location22':
          calculatedPrice = 407;
          break;
        case 'location23':
          calculatedPrice = 311;
          break;
        case 'location24':
          calculatedPrice = 241;
          break;
        case 'location25':
          calculatedPrice = 188;
          break;
        case 'location26':
          calculatedPrice = 180;
          break;
        case 'location27':
          calculatedPrice = 158;
          break;
        case 'location28':
          calculatedPrice = 151;
          break;
        case 'location29':
          calculatedPrice = 97;
          break;
        case 'location31':
          calculatedPrice = 25;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
        case 'location7':
          calculatedPrice = 1188;
          break;
          case 'location5':
            calculatedPrice = 'NO EXIT';
            break;
        case 'location8':
          calculatedPrice = 995;
          break;
        case 'location9':
          calculatedPrice = 978;
          break;
        case 'location10':
          calculatedPrice = 969;
          break;
        case 'location11':
          calculatedPrice = 921;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location13':
          calculatedPrice = 868;
          break;
        case 'location14':
          calculatedPrice = 799;
          break;
        case 'location15':
          calculatedPrice = 681;
          break;
        case 'location16':
          calculatedPrice = 591;
          break;
        case 'location17':
          calculatedPrice = 519;
          break;
        case 'location18':
          calculatedPrice = 433;
          break;
        case 'location19':
          calculatedPrice = 413;
          break;
        case 'location20':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location21':
          calculatedPrice = 1024;
          break;
        case 'location22':
          calculatedPrice = 815;
          break;
        case 'location23':
          calculatedPrice = 623;
          break;
        case 'location24':
          calculatedPrice = 482;
          break;
        case 'location25':
          calculatedPrice = 376;
          break;
        case 'location26':
          calculatedPrice = 359;
          break;
        case 'location27':
          calculatedPrice = 317;
          break;
        case 'location28':
          calculatedPrice = 301;
          break;
        case 'location29':
          calculatedPrice = 194;
          break;
        case 'location30':
          calculatedPrice = 50;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location1':
        case 'location2':
        case 'location3':
        case 'location4':
        case 'location6':
        case 'location7':
          calculatedPrice = 1534;
          break;
        case 'location5':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location8':
          calculatedPrice = 1302;
          break;
        case 'location9':
          calculatedPrice = 1282;
          break;
        case 'location10':
          calculatedPrice = 1271;
          break;
        case 'location11':
          calculatedPrice = 1213;
          break;
        case 'location12':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location13':
          calculatedPrice = 1150;
          break;
        case 'location14':
          calculatedPrice = 1067;
          break;
        case 'location15':
          calculatedPrice = 925;
          break;
        case 'location16':
          calculatedPrice = 817;
          break;
        case 'location17':
          calculatedPrice = 731;
          break;
        case 'location18':
          calculatedPrice = 628;
          break;
        case 'location19':
          calculatedPrice = 603;
          break;
        case 'location20':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location21':
          calculatedPrice = 1511;
          break;
        case 'location22':
          calculatedPrice = 1222;
          break;
        case 'location23':
          calculatedPrice = 934;
          break;
        case 'location24':
          calculatedPrice = 723;
          break;
        case 'location25':
          calculatedPrice = 565;
          break;
        case 'location26':
          calculatedPrice = 539;
          break;
        case 'location27':
          calculatedPrice = 475;
          break;
        case 'location28':
          calculatedPrice = 452;
          break;
        case 'location29':
          calculatedPrice = 292;
          break;
        case 'location30':
          calculatedPrice = 75;
          break;
        default:
          break;
      }
    }
  }



  // LAPAZ ENTRY POINT (DONE)
  if (
    selectedOption === 'option2' &&
    locationdropdown === 'locationF1' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location33' ||
     locationdropdown2 === 'location34' ||
     locationdropdown2 === 'location35' ||
     locationdropdown2 === 'location36' ||
     locationdropdown2 === 'location37' ||
     locationdropdown2 === 'location38' ||
     locationdropdown2 === 'location39' ||
     locationdropdown2 === 'location40' ||
     locationdropdown2 === 'location41' ||
     locationdropdown2 === 'location42')
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location33':
          calculatedPrice = 30;
          break;
        case 'location34':
          calculatedPrice = 58;
          break;
        case 'location35':
          calculatedPrice = 79;
          break;
        case 'location36':
          calculatedPrice = 99;
          break;
        case 'location37':
          calculatedPrice = 164;
          break;
        case 'location38':
          calculatedPrice = 216;
          break;
        case 'location39':
          calculatedPrice = 235;
          break;
        case 'location40':
          calculatedPrice = 270;
          break;
        case 'location41':
          calculatedPrice = 290;
          break;
        case 'location42':
          calculatedPrice = 311;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location33':
          calculatedPrice = 76;
          break;
        case 'location34':
          calculatedPrice = 145;
          break;
        case 'location35':
          calculatedPrice = 197;
          break;
        case 'location36':
          calculatedPrice = 247;
          break;
        case 'location37':
          calculatedPrice = 410;
          break;
        case 'location38':
          calculatedPrice = 540;
          break;
        case 'location39':
          calculatedPrice = 587;
          break;
        case 'location40':
          calculatedPrice = 675;
          break;
        case 'location41':
          calculatedPrice = 726;
          break;
        case 'location42':
          calculatedPrice = 778;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location33':
          calculatedPrice = 91;
          break;
        case 'location34':
          calculatedPrice = 175;
          break;
        case 'location35':
          calculatedPrice = 237;
          break;
        case 'location36':
          calculatedPrice = 396;
          break;
        case 'location37':
          calculatedPrice = 492;
          break;
        case 'location38':
          calculatedPrice = 648;
          break;
        case 'location39':
          calculatedPrice = 704;
          break;
        case 'location40':
          calculatedPrice = 810;
          break;
        case 'location41':
          calculatedPrice = 871;
          break;
        case 'location42':
          calculatedPrice = 933;
          break;
        default:
          break;
      }
    }
  }


  // VICTORIA ENTRY POINT (DONE)
  if (
    selectedOption === 'option2' &&
    locationdropdown === 'locationG1' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location32' ||
     locationdropdown2 === 'location34' ||
     locationdropdown2 === 'location35' ||
     locationdropdown2 === 'location36' ||
     locationdropdown2 === 'location37' ||
     locationdropdown2 === 'location38' ||
     locationdropdown2 === 'location39' ||
     locationdropdown2 === 'location40' ||
     locationdropdown2 === 'location41' ||
     locationdropdown2 === 'location42')
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 30;
          break;
        case 'location34':
          calculatedPrice = 28;
          break;
        case 'location35':
          calculatedPrice = 49;
          break;
        case 'location36':
          calculatedPrice = 69;
          break;
        case 'location37':
          calculatedPrice = 134;
          break;
        case 'location38':
          calculatedPrice = 186;
          break;
        case 'location39':
          calculatedPrice = 205;
          break;
        case 'location40':
          calculatedPrice = 240;
          break;
        case 'location41':
          calculatedPrice = 260;
          break;
        case 'location42':
          calculatedPrice = 281;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 76;
          break;
        case 'location34':
          calculatedPrice = 70;
          break;
        case 'location35':
          calculatedPrice = 122;
          break;
        case 'location36':
          calculatedPrice = 171;
          break;
        case 'location37':
          calculatedPrice = 334;
          break;
        case 'location38':
          calculatedPrice = 464;
          break;
        case 'location39':
          calculatedPrice = 511;
          break;
        case 'location40':
          calculatedPrice = 599;
          break;
        case 'location41':
          calculatedPrice = 651;
          break;
        case 'location42':
          calculatedPrice = 702;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 91;
          break;
        case 'location34':
          calculatedPrice = 84;
          break;
        case 'location35':
          calculatedPrice = 146;
          break;
        case 'location36':
          calculatedPrice = 206;
          break;
        case 'location37':
          calculatedPrice = 401;
          break;
        case 'location38':
          calculatedPrice = 557;
          break;
        case 'location39':
          calculatedPrice = 614;
          break;
        case 'location40':
          calculatedPrice = 719;
          break;
        case 'location41':
          calculatedPrice = 781;
          break;
        case 'location42':
          calculatedPrice = 843;
          break;
        default:
          break;
      }
    }
  }



  // GERONA ENTRY POINT (DONE)
  if (
    selectedOption === 'option2' &&
    locationdropdown === 'locationH1' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location32' ||
     locationdropdown2 === 'location33' ||
     locationdropdown2 === 'location35' ||
     locationdropdown2 === 'location36' ||
     locationdropdown2 === 'location37' ||
     locationdropdown2 === 'location38' ||
     locationdropdown2 === 'location39' ||
     locationdropdown2 === 'location40' ||
     locationdropdown2 === 'location41' ||
     locationdropdown2 === 'location42')
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 58;
          break;
        case 'location33':
          calculatedPrice = 28;
          break;
        case 'location35':
          calculatedPrice = 21;
          break;
        case 'location36':
          calculatedPrice = 41;
          break;
        case 'location37':
          calculatedPrice = 106;
          break;
        case 'location38':
          calculatedPrice = 158;
          break;
        case 'location39':
          calculatedPrice = 177;
          break;
        case 'location40':
          calculatedPrice = 212;
          break;
        case 'location41':
          calculatedPrice = 232;
          break;
        case 'location42':
          calculatedPrice = 253;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 145;
          break;
        case 'location33':
          calculatedPrice = 70;
          break;
        case 'location35':
          calculatedPrice = 52;
          break;
        case 'location36':
          calculatedPrice = 102;
          break;
        case 'location37':
          calculatedPrice = 264;
          break;
        case 'location38':
          calculatedPrice = 394;
          break;
        case 'location39':
          calculatedPrice = 441;
          break;
        case 'location40':
          calculatedPrice = 530;
          break;
        case 'location41':
          calculatedPrice = 581;
          break;
        case 'location42':
          calculatedPrice = 632;
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location32':
          calculatedPrice = 175;
          break;
        case 'location33':
          calculatedPrice = 84;
          break;
        case 'location35':
          calculatedPrice = 62;
          break;
        case 'location36':
          calculatedPrice = 122;
          break;
        case 'location37':
          calculatedPrice = 317;
          break;
        case 'location38':
          calculatedPrice = 473;
          break;
        case 'location39':
          calculatedPrice = 530;
          break;
        case 'location40':
          calculatedPrice = 635;
          break;
        case 'location41':
          calculatedPrice = 697;
          break;
        case 'location42':
          calculatedPrice = 759;
          break;
        default:
          break;
      }
    }
  }



    // PANIQUI ENTRY POINT (DONE)
    if (
      selectedOption === 'option2' &&
      locationdropdown === 'locationI1' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location32' ||
       locationdropdown2 === 'location33' ||
       locationdropdown2 === 'location34' ||
       locationdropdown2 === 'location36' ||
       locationdropdown2 === 'location37' ||
       locationdropdown2 === 'location38' ||
       locationdropdown2 === 'location39' ||
       locationdropdown2 === 'location40' ||
       locationdropdown2 === 'location41' ||
       locationdropdown2 === 'location42')
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location32':
            calculatedPrice = 79;
            break;
          case 'location33':
            calculatedPrice = 49;
            break;
          case 'location34':
            calculatedPrice = 21;
            break;
          case 'location36':
            calculatedPrice = 20;
            break;
          case 'location37':
            calculatedPrice = 85;
            break;
          case 'location38':
            calculatedPrice = 137;
            break;
          case 'location39':
            calculatedPrice = 156;
            break;
          case 'location40':
            calculatedPrice = 191;
            break;
          case 'location41':
            calculatedPrice = 212;
            break;
          case 'location42':
            calculatedPrice = 232;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location32':
            calculatedPrice = 197;
            break;
          case 'location33':
            calculatedPrice = 122;
            break;
          case 'location34':
            calculatedPrice = 52;
            break;
          case 'location36':
            calculatedPrice = 50;
            break;
          case 'location37':
            calculatedPrice = 213;
            break;
          case 'location38':
            calculatedPrice = 343;
            break;
          case 'location39':
            calculatedPrice = 390;
            break;
          case 'location40':
            calculatedPrice = 478;
            break;
          case 'location41':
            calculatedPrice = 529;
            break;
          case 'location42':
            calculatedPrice = 581;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location32':
            calculatedPrice = 237;
            break;
          case 'location33':
            calculatedPrice = 146;
            break;
          case 'location34':
            calculatedPrice = 62;
            break;
          case 'location36':
            calculatedPrice = 60;
            break;
          case 'location37':
            calculatedPrice = 255;
            break;
          case 'location38':
            calculatedPrice = 411;
            break;
          case 'location39':
            calculatedPrice = 468;
            break;
          case 'location40':
            calculatedPrice = 573;
            break;
          case 'location41':
            calculatedPrice = 635;
            break;
          case 'location42':
            calculatedPrice = 697;
            break;
          default:
            break;
        }
      }
    }



      // MONCADA ENTRY POINT (DONE)
      if (
        selectedOption === 'option2' &&
        locationdropdown === 'locationJ1' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location32' ||
         locationdropdown2 === 'location33' ||
         locationdropdown2 === 'location34' ||
         locationdropdown2 === 'location35' ||
         locationdropdown2 === 'location37' ||
         locationdropdown2 === 'location38' ||
         locationdropdown2 === 'location39' ||
         locationdropdown2 === 'location40' ||
         locationdropdown2 === 'location41' ||
         locationdropdown2 === 'location42')
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 99;
              break;
            case 'location33':
              calculatedPrice = 69;
              break;
            case 'location34':
              calculatedPrice = 41;
              break;
            case 'location35':
              calculatedPrice = 20;
              break;
            case 'location37':
              calculatedPrice = 65;
              break;
            case 'location38':
              calculatedPrice = 117;
              break;
            case 'location39':
              calculatedPrice = 136;
              break;
            case 'location40':
              calculatedPrice = 171;
              break;
            case 'location41':
              calculatedPrice = 192;
              break;
            case 'location42':
              calculatedPrice = 212;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 247;
              break;
            case 'location33':
              calculatedPrice = 171;
              break;
            case 'location34':
              calculatedPrice = 102;
              break;
            case 'location35':
              calculatedPrice = 50;
              break;
            case 'location37':
              calculatedPrice = 163;
              break;
            case 'location38':
              calculatedPrice = 293;
              break;
            case 'location39':
              calculatedPrice = 340;
              break;
            case 'location40':
              calculatedPrice = 428;
              break;
            case 'location41':
              calculatedPrice = 479;
              break;
            case 'location42':
              calculatedPrice = 531;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 396;
              break;
            case 'location33':
              calculatedPrice = 206;
              break;
            case 'location34':
              calculatedPrice = 122;
              break;
            case 'location35':
              calculatedPrice = 60;
              break;
            case 'location37':
              calculatedPrice = 195;
              break;
            case 'location38':
              calculatedPrice = 351;
              break;
            case 'location39':
              calculatedPrice = 408;
              break;
            case 'location40':
              calculatedPrice = 514;
              break;
            case 'location41':
              calculatedPrice = 575;
              break;
            case 'location42':
              calculatedPrice = 637;
              break;
            default:
              break;
          }
        }
      }


      // CARMEN ENTRY POINT (DONE)
      if (
        selectedOption === 'option2' &&
        locationdropdown === 'locationK1' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location32' ||
         locationdropdown2 === 'location33' ||
         locationdropdown2 === 'location34' ||
         locationdropdown2 === 'location35' ||
         locationdropdown2 === 'location36' ||
         locationdropdown2 === 'location38' ||
         locationdropdown2 === 'location39' ||
         locationdropdown2 === 'location40' ||
         locationdropdown2 === 'location41' ||
         locationdropdown2 === 'location42')
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 164;
              break;
            case 'location33':
              calculatedPrice = 134;
              break;
            case 'location34':
              calculatedPrice = 106;
              break;
            case 'location35':
              calculatedPrice = 85;
              break;
            case 'location36':
              calculatedPrice = 65;
              break;
            case 'location38':
              calculatedPrice = 52;
              break;
            case 'location39':
              calculatedPrice = 71;
              break;
            case 'location40':
              calculatedPrice = 106;
              break;
            case 'location41':
              calculatedPrice = 127;
              break;
            case 'location42':
              calculatedPrice = 147;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 410;
              break;
            case 'location33':
              calculatedPrice = 334;
              break;
            case 'location34':
              calculatedPrice = 264;
              break;
            case 'location35':
              calculatedPrice = 213;
              break;
            case 'location36':
              calculatedPrice = 163;
              break;
            case 'location38':
              calculatedPrice = 130;
              break;
            case 'location39':
              calculatedPrice = 177;
              break;
            case 'location40':
              calculatedPrice = 265;
              break;
            case 'location41':
              calculatedPrice = 316;
              break;
            case 'location42':
              calculatedPrice = 368;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 492;
              break;
            case 'location33':
              calculatedPrice = 401;
              break;
            case 'location34':
              calculatedPrice = 317;
              break;
            case 'location35':
              calculatedPrice = 255;
              break;
            case 'location36':
              calculatedPrice = 195;
              break;
            case 'location38':
              calculatedPrice = 156;
              break;
            case 'location39':
              calculatedPrice = 213;
              break;
            case 'location40':
              calculatedPrice = 318;
              break;
            case 'location41':
              calculatedPrice = 380;
              break;
            case 'location42':
              calculatedPrice = 442;
              break;
            default:
              break;
          }
        }
      }



      // URDANETA ENTRY POINT (DONE)
      if (
        selectedOption === 'option2' &&
        locationdropdown === 'locationL1' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location32' ||
         locationdropdown2 === 'location33' ||
         locationdropdown2 === 'location34' ||
         locationdropdown2 === 'location35' ||
         locationdropdown2 === 'location36' ||
         locationdropdown2 === 'location37' ||
         locationdropdown2 === 'location39' ||
         locationdropdown2 === 'location40' ||
         locationdropdown2 === 'location41' ||
         locationdropdown2 === 'location42')
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 216;
              break;
            case 'location33':
              calculatedPrice = 186;
              break;
            case 'location34':
              calculatedPrice = 158;
              break;
            case 'location35':
              calculatedPrice = 137;
              break;
            case 'location36':
              calculatedPrice = 117;
              break;
            case 'location37':
              calculatedPrice = 52;
              break;
            case 'location39':
              calculatedPrice = 19;
              break;
            case 'location40':
              calculatedPrice = 54;
              break;
            case 'location41':
              calculatedPrice = 75;
              break;
            case 'location42':
              calculatedPrice = 95;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 540;
              break;
            case 'location33':
              calculatedPrice = 464;
              break;
            case 'location34':
              calculatedPrice = 394;
              break;
            case 'location35':
              calculatedPrice = 343;
              break;
            case 'location36':
              calculatedPrice = 293;
              break;
            case 'location37':
              calculatedPrice = 130;
              break;
            case 'location39':
              calculatedPrice = 47;
              break;
            case 'location40':
              calculatedPrice = 135;
              break;
            case 'location41':
              calculatedPrice = 186;
              break;
            case 'location42':
              calculatedPrice = 238;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 648;
              break;
            case 'location33':
              calculatedPrice = 557;
              break;
            case 'location34':
              calculatedPrice = 473;
              break;
            case 'location35':
              calculatedPrice = 411;
              break;
            case 'location36':
              calculatedPrice = 351;
              break;
            case 'location37':
              calculatedPrice = 156;
              break;
            case 'location39':
              calculatedPrice = 57;
              break;
            case 'location40':
              calculatedPrice = 162;
              break;
            case 'location41':
              calculatedPrice = 224;
              break;
            case 'location42':
              calculatedPrice = 286;
              break;
            default:
              break;
          }
        }
      }

      // BINALONAN ENTRY POINT (DONE)
      if (
        selectedOption === 'option2' &&
        locationdropdown === 'locationM1' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location32' ||
         locationdropdown2 === 'location33' ||
         locationdropdown2 === 'location34' ||
         locationdropdown2 === 'location35' ||
         locationdropdown2 === 'location36' ||
         locationdropdown2 === 'location37' ||
         locationdropdown2 === 'location38' ||
         locationdropdown2 === 'location40' ||
         locationdropdown2 === 'location41' ||
         locationdropdown2 === 'location42')
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 235;
              break;
            case 'location33':
              calculatedPrice = 205;
              break;
            case 'location34':
              calculatedPrice = 177;
              break;
            case 'location35':
              calculatedPrice = 156;
              break;
            case 'location36':
              calculatedPrice = 136;
              break;
            case 'location37':
              calculatedPrice = 71;
              break;
            case 'location38':
              calculatedPrice = 19;
              break;
            case 'location40':
              calculatedPrice = 35;
              break;
            case 'location41':
              calculatedPrice = 56;
              break;
            case 'location42':
              calculatedPrice = 76;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 587;
              break;
            case 'location33':
              calculatedPrice = 511;
              break;
            case 'location34':
              calculatedPrice = 441;
              break;
            case 'location35':
              calculatedPrice = 390;
              break;
            case 'location36':
              calculatedPrice = 340;
              break;
            case 'location37':
              calculatedPrice = 177;
              break;
            case 'location38':
              calculatedPrice = 47;
              break;
            case 'location40':
              calculatedPrice = 88;
              break;
            case 'location41':
              calculatedPrice = 139;
              break;
            case 'location42':
              calculatedPrice = 191;
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location32':
              calculatedPrice = 704;
              break;
            case 'location33':
              calculatedPrice = 614;
              break;
            case 'location34':
              calculatedPrice = 530;
              break;
            case 'location35':
              calculatedPrice = 468;
              break;
            case 'location36':
              calculatedPrice = 408;
              break;
            case 'location37':
              calculatedPrice = 213;
              break;
            case 'location38':
              calculatedPrice = 57;
              break;
            case 'location40':
              calculatedPrice = 106;
              break;
            case 'location41':
              calculatedPrice = 167;
              break;
            case 'location42':
              calculatedPrice = 229;
              break;
            default:
              break;
          }
        }
      }


        // POZORRUBBIO ENTRY POINT (DONE)
        if (
          selectedOption === 'option2' &&
          locationdropdown === 'locationN1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location32' ||
           locationdropdown2 === 'location33' ||
           locationdropdown2 === 'location34' ||
           locationdropdown2 === 'location35' ||
           locationdropdown2 === 'location36' ||
           locationdropdown2 === 'location37' ||
           locationdropdown2 === 'location38' ||
           locationdropdown2 === 'location39' ||
           locationdropdown2 === 'location41' ||
           locationdropdown2 === 'location42')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 270;
                break;
              case 'location33':
                calculatedPrice = 240;
                break;
              case 'location34':
                calculatedPrice = 212;
                break;
              case 'location35':
                calculatedPrice = 191;
                break;
              case 'location36':
                calculatedPrice = 171;
                break;
              case 'location37':
                calculatedPrice = 106;
                break;
              case 'location38':
                calculatedPrice = 54;
                break;
              case 'location39':
                calculatedPrice = 35;
                break;
              case 'location41':
                calculatedPrice = 21;
                break;
              case 'location42':
                calculatedPrice = 41;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 675;
                break;
              case 'location33':
                calculatedPrice = 599;
                break;
              case 'location34':
                calculatedPrice = 530;
                break;
              case 'location35':
                calculatedPrice = 478;
                break;
              case 'location36':
                calculatedPrice = 428;
                break;
              case 'location37':
                calculatedPrice = 265;
                break;
              case 'location38':
                calculatedPrice = 135;
                break;
              case 'location39':
                calculatedPrice = 88;
                break;
              case 'location41':
                calculatedPrice = 51;
                break;
              case 'location42':
                calculatedPrice = 103;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 810;
                break;
              case 'location33':
                calculatedPrice = 719;
                break;
              case 'location34':
                calculatedPrice = 635;
                break;
              case 'location35':
                calculatedPrice = 573;
                break;
              case 'location36':
                calculatedPrice = 514;
                break;
              case 'location37':
                calculatedPrice = 318;
                break;
              case 'location38':
                calculatedPrice = 162;
                break;
              case 'location39':
                calculatedPrice = 106;
                break;
              case 'location41':
                calculatedPrice = 62;
                break;
              case 'location42':
                calculatedPrice = 124;
                break;
              default:
                break;
            }
          }
        }


        // SISON ENTRY POINT (DONE)
        if (
          selectedOption === 'option2' &&
          locationdropdown === 'locationO1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location32' ||
           locationdropdown2 === 'location33' ||
           locationdropdown2 === 'location34' ||
           locationdropdown2 === 'location35' ||
           locationdropdown2 === 'location36' ||
           locationdropdown2 === 'location37' ||
           locationdropdown2 === 'location38' ||
           locationdropdown2 === 'location39' ||
           locationdropdown2 === 'location40' ||
           locationdropdown2 === 'location42')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 290;
                break;
              case 'location33':
                calculatedPrice = 260;
                break;
              case 'location34':
                calculatedPrice = 232;
                break;
              case 'location35':
                calculatedPrice = 212;
                break;
              case 'location36':
                calculatedPrice = 192;
                break;
              case 'location37':
                calculatedPrice = 127;
                break;
              case 'location38':
                calculatedPrice = 75;
                break;
              case 'location39':
                calculatedPrice = 56;
                break;
              case 'location40':
                calculatedPrice = 21;
                break;
              case 'location42':
                calculatedPrice = 21;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 726;
                break;
              case 'location33':
                calculatedPrice = 651;
                break;
              case 'location34':
                calculatedPrice = 581;
                break;
              case 'location35':
                calculatedPrice = 529;
                break;
              case 'location36':
                calculatedPrice = 479;
                break;
              case 'location37':
                calculatedPrice = 316;
                break;
              case 'location38':
                calculatedPrice = 186;
                break;
              case 'location39':
                calculatedPrice = 139;
                break;
              case 'location40':
                calculatedPrice = 51;
                break;
              case 'location42':
                calculatedPrice = 52;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 871;
                break;
              case 'location33':
                calculatedPrice = 781;
                break;
              case 'location34':
                calculatedPrice = 697;
                break;
              case 'location35':
                calculatedPrice = 635;
                break;
              case 'location36':
                calculatedPrice = 575;
                break;
              case 'location37':
                calculatedPrice = 380;
                break;
              case 'location38':
                calculatedPrice = 224;
                break;
              case 'location39':
                calculatedPrice = 167;
                break;
              case 'location40':
                calculatedPrice = 62;
                break;
              case 'location42':
                calculatedPrice = 62;
                break;
              default:
                break;
            }
          }
        }


        // ROSARIO ENTRY POINT (DONE)
        if (
          selectedOption === 'option2' &&
          locationdropdown === 'locationP1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location32' ||
           locationdropdown2 === 'location33' ||
           locationdropdown2 === 'location34' ||
           locationdropdown2 === 'location35' ||
           locationdropdown2 === 'location36' ||
           locationdropdown2 === 'location37' ||
           locationdropdown2 === 'location38' ||
           locationdropdown2 === 'location39' ||
           locationdropdown2 === 'location40' ||
           locationdropdown2 === 'location41')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 311;
                break;
              case 'location33':
                calculatedPrice = 281;
                break;
              case 'location34':
                calculatedPrice = 253;
                break;
              case 'location35':
                calculatedPrice = 232;
                break;
              case 'location36':
                calculatedPrice = 212;
                break;
              case 'location37':
                calculatedPrice = 147;
                break;
              case 'location38':
                calculatedPrice = 95;
                break;
              case 'location39':
                calculatedPrice = 76;
                break;
              case 'location40':
                calculatedPrice = 31;
                break;
              case 'location41':
                calculatedPrice = 21;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 778;
                break;
              case 'location33':
                calculatedPrice = 702;
                break;
              case 'location34':
                calculatedPrice = 632;
                break;
              case 'location35':
                calculatedPrice = 581;
                break;
              case 'location36':
                calculatedPrice = 531;
                break;
              case 'location37':
                calculatedPrice = 368;
                break;
              case 'location38':
                calculatedPrice = 238;
                break;
              case 'location39':
                calculatedPrice = 191;
                break;
              case 'location40':
                calculatedPrice = 103;
                break;
              case 'location41':
                calculatedPrice = 52;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location32':
                calculatedPrice = 933;
                break;
              case 'location33':
                calculatedPrice = 843;
                break;
              case 'location34':
                calculatedPrice = 759;
                break;
              case 'location35':
                calculatedPrice = 697;
                break;
              case 'location36':
                calculatedPrice = 637;
                break;
              case 'location37':
                calculatedPrice = 442;
                break;
              case 'location38':
                calculatedPrice = 286;
                break;
              case 'location39':
                calculatedPrice = 229;
                break;
              case 'location40':
                calculatedPrice = 124;
                break;
              case 'location41':
                calculatedPrice = 62;
                break;
              default:
                break;
            }
          }
        }

        // MERVILLE ENTRY POINT (DONE)
        if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationQ1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location61')
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location61':
                calculatedPrice = 49;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location61':
                calculatedPrice = 98;
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location61':
                calculatedPrice = 147;
                break;
              default:
                break;
            }
          }
        }


         // BICUTAN ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationR1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 72;
                break;
              case 'location61':
                calculatedPrice = 49;
                break;
              case 'location62':
                calculatedPrice = 49;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location45':
                calculatedPrice = 34;
                break;
              case 'location46':
                calculatedPrice = 69;
                break;
              case 'location47':
                calculatedPrice = 74;
                break;
              case 'location48':
                calculatedPrice = 105;
                break;
              case 'location49':
                calculatedPrice = 87;
                break;
              case 'location50':
                calculatedPrice = 93;
                break;
              case 'location51':
                calculatedPrice = 107;
                break;
              case 'location52':
                calculatedPrice = 113;
                break;
              case 'location53':
                calculatedPrice = 123;
                break;
              case 'location54':
                calculatedPrice = 132;
                break;
              case 'location55':
                calculatedPrice = 144;
                break;
              case 'location56':
                calculatedPrice = 152;
                break;
              case 'location57':
                calculatedPrice = 157;
                break;
              case 'location58':
                calculatedPrice = 175;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 145;
                break;
              case 'location61':
                calculatedPrice = 98;
                break;
              case 'location62':
                calculatedPrice = 98;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location45':
                calculatedPrice = 69;
                break;
              case 'location46':
                calculatedPrice = 138;
                break;
              case 'location47':
                calculatedPrice = 147;
                break;
              case 'location48':
                calculatedPrice = 210;
                break;
              case 'location49':
                calculatedPrice = 173;
                break;
              case 'location50':
                calculatedPrice = 185;
                break;
              case 'location51':
                calculatedPrice = 214;
                break;
              case 'location52':
                calculatedPrice = 226;
                break;
              case 'location53':
                calculatedPrice = 246;
                break;
              case 'location54':
                calculatedPrice = 263;
                break;
              case 'location55':
                calculatedPrice = 288;
                break;
              case 'location56':
                calculatedPrice = 304;
                break;
              case 'location57':
                calculatedPrice = 315;
                break;
              case 'location58':
                calculatedPrice = 350;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 218;
                break;
              case 'location61':
                calculatedPrice = 147;
                break;
              case 'location62':
                calculatedPrice = 147;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location45':
                calculatedPrice = 104;
                break;
              case 'location46':
                calculatedPrice = 208;
                break;
              case 'location47':
                calculatedPrice = 222;
                break;
              case 'location48':
                calculatedPrice = 316;
                break;
              case 'location49':
                calculatedPrice = 261;
                break;
              case 'location50':
                calculatedPrice = 279;
                break;
              case 'location51':
                calculatedPrice = 323;
                break;
              case 'location52':
                calculatedPrice = 340;
                break;
              case 'location53':
                calculatedPrice = 369;
                break;
              case 'location54':
                calculatedPrice = 396;
                break;
              case 'location55':
                calculatedPrice = 433;
                break;
              case 'location56':
                calculatedPrice = 457;
                break;
              case 'location57':
                calculatedPrice = 473;
                break;
              case 'location58':
                calculatedPrice = 526;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // SUCAT ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationS1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 118;
                break;
              case 'location61':
                calculatedPrice = 84;
                break;
              case 'location62':
                calculatedPrice = 84;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 34;
                break;
              case 'location46':
                calculatedPrice = 34;
                break;
              case 'location47':
                calculatedPrice = 39;
                break;
              case 'location48':
                calculatedPrice = 70;
                break;
              case 'location49':
                calculatedPrice = 52;
                break;
              case 'location50':
                calculatedPrice = 58;
                break;
              case 'location51':
                calculatedPrice = 72;
                break;
              case 'location52':
                calculatedPrice = 78;
                break;
              case 'location53':
                calculatedPrice = 88;
                break;
              case 'location54':
                calculatedPrice = 97;
                break;
              case 'location55':
                calculatedPrice = 109;
                break;
              case 'location56':
                calculatedPrice = 117;
                break;
              case 'location57':
                calculatedPrice = 122;
                break;
              case 'location58':
                calculatedPrice = 140;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 237;
                break;
              case 'location61':
                calculatedPrice = 168;
                break;
              case 'location62':
                calculatedPrice = 168;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 69;
                break;
              case 'location46':
                calculatedPrice = 69;
                break;
              case 'location47':
                calculatedPrice = 78;
                break;
              case 'location48':
                calculatedPrice = 141;
                break;
              case 'location49':
                calculatedPrice = 104;
                break;
              case 'location50':
                calculatedPrice = 116;
                break;
              case 'location51':
                calculatedPrice = 145;
                break;
              case 'location52':
                calculatedPrice = 157;
                break;
              case 'location53':
                calculatedPrice = 177;
                break;
              case 'location54':
                calculatedPrice = 194;
                break;
              case 'location55':
                calculatedPrice = 219;
                break;
              case 'location56':
                calculatedPrice = 235;
                break;
              case 'location57':
                calculatedPrice = 246;
                break;
              case 'location58':
                calculatedPrice = 281;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 356;
                break;
              case 'location61':
                calculatedPrice = 252;
                break;
              case 'location62':
                calculatedPrice = 252;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 104;
                break;
              case 'location46':
                calculatedPrice = 104;
                break;
              case 'location47':
                calculatedPrice = 118;
                break;
              case 'location48':
                calculatedPrice = 212;
                break;
              case 'location49':
                calculatedPrice = 157;
                break;
              case 'location50':
                calculatedPrice = 175;
                break;
              case 'location51':
                calculatedPrice = 219;
                break;
              case 'location52':
                calculatedPrice = 236;
                break;
              case 'location53':
                calculatedPrice = 265;
                break;
              case 'location54':
                calculatedPrice = 292;
                break;
              case 'location55':
                calculatedPrice = 329;
                break;
              case 'location56':
                calculatedPrice = 353;
                break;
              case 'location57':
                calculatedPrice = 369;
                break;
              case 'location58':
                calculatedPrice = 422;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // ALABANG ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationT1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 164;
                break;
              case 'location61':
                calculatedPrice = 118;
                break;
              case 'location62':
                calculatedPrice = 118;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 69;
                break;
              case 'location45':
                calculatedPrice = 34;
                break;
              case 'location47':
                calculatedPrice = 5;
                break;
              case 'location48':
                calculatedPrice = 36;
                break;
              case 'location49':
                calculatedPrice = 18;
                break;
              case 'location50':
                calculatedPrice = 24;
                break;
              case 'location51':
                calculatedPrice = 38;
                break;
              case 'location52':
                calculatedPrice = 44;
                break;
              case 'location53':
                calculatedPrice = 54;
                break;
              case 'location54':
                calculatedPrice = 63;
                break;
              case 'location55':
                calculatedPrice = 75;
                break;
              case 'location56':
                calculatedPrice = 83;
                break;
              case 'location57':
                calculatedPrice = 88;
                break;
              case 'location58':
                calculatedPrice = 106;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 329;
                break;
              case 'location61':
                calculatedPrice = 237;
                break;
              case 'location62':
                calculatedPrice = 237;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 138;
                break;
              case 'location45':
                calculatedPrice = 69;
                break;
              case 'location47':
                calculatedPrice = 9;
                break;
              case 'location48':
                calculatedPrice = 72;
                break;
              case 'location49':
                calculatedPrice = 35;
                break;
              case 'location50':
                calculatedPrice = 47;
                break;
              case 'location51':
                calculatedPrice = 76;
                break;
              case 'location52':
                calculatedPrice = 88;
                break;
              case 'location53':
                calculatedPrice = 108;
                break;
              case 'location54':
                calculatedPrice = 125;
                break;
              case 'location55':
                calculatedPrice = 150;
                break;
              case 'location56':
                calculatedPrice = 166;
                break;
              case 'location57':
                calculatedPrice = 177;
                break;
              case 'location58':
                calculatedPrice = 212;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 493;
                break;
              case 'location61':
                calculatedPrice = 356;
                break;
              case 'location62':
                calculatedPrice = 356;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 208;
                break;
              case 'location45':
                calculatedPrice = 104;
                break;
              case 'location47':
                calculatedPrice = 14;
                break;
              case 'location48':
                calculatedPrice = 108;
                break;
              case 'location49':
                calculatedPrice = 53;
                break;
              case 'location50':
                calculatedPrice = 71;
                break;
              case 'location51':
                calculatedPrice = 115;
                break;
              case 'location52':
                calculatedPrice = 132;
                break;
              case 'location53':
                calculatedPrice = 161;
                break;
              case 'location54':
                calculatedPrice = 188;
                break;
              case 'location55':
                calculatedPrice = 225;
                break;
              case 'location56':
                calculatedPrice = 249;
                break;
              case 'location57':
                calculatedPrice = 265;
                break;
              case 'location58':
                calculatedPrice = 318;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // FILINVEST ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationU1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 169;
                break;
              case 'location61':
                calculatedPrice = 123;
                break;
              case 'location62':
                calculatedPrice = 123;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 74;
                break;
              case 'location45':
                calculatedPrice = 39;
                break;
              case 'location46':
                calculatedPrice = 5;
                break;
              case 'location48':
                calculatedPrice = 31;
                break;
              case 'location49':
                calculatedPrice = 13;
                break;
              case 'location50':
                calculatedPrice = 19;
                break;
              case 'location51':
                calculatedPrice = 34;
                break;
              case 'location52':
                calculatedPrice = 39;
                break;
              case 'location53':
                calculatedPrice = 49;
                break;
              case 'location54':
                calculatedPrice = 58;
                break;
              case 'location55':
                calculatedPrice = 70;
                break;
              case 'location56':
                calculatedPrice = 78;
                break;
              case 'location57':
                calculatedPrice = 84;
                break;
              case 'location58':
                calculatedPrice = 101;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 338;
                break;
              case 'location61':
                calculatedPrice = 246;
                break;
              case 'location62':
                calculatedPrice = 246;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 147;
                break;
              case 'location45':
                calculatedPrice = 78;
                break;
              case 'location46':
                calculatedPrice = 9;
                break;
              case 'location48':
                calculatedPrice = 63;
                break;
              case 'location49':
                calculatedPrice = 26;
                break;
              case 'location50':
                calculatedPrice = 38;
                break;
              case 'location51':
                calculatedPrice = 67;
                break;
              case 'location52':
                calculatedPrice = 79;
                break;
              case 'location53':
                calculatedPrice = 98;
                break;
              case 'location54':
                calculatedPrice = 116;
                break;
              case 'location55':
                calculatedPrice = 141;
                break;
              case 'location56':
                calculatedPrice = 157;
                break;
              case 'location57':
                calculatedPrice = 168;
                break;
              case 'location58':
                calculatedPrice = 203;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 507;
                break;
              case 'location61':
                calculatedPrice = 370;
                break;
              case 'location62':
                calculatedPrice = 370;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 222;
                break;
              case 'location45':
                calculatedPrice = 118;
                break;
              case 'location46':
                calculatedPrice = 14;
                break;
              case 'location48':
                calculatedPrice = 94;
                break;
              case 'location49':
                calculatedPrice = 39;
                break;
              case 'location50':
                calculatedPrice = 57;
                break;
              case 'location51':
                calculatedPrice = 101;
                break;
              case 'location52':
                calculatedPrice = 118;
                break;
              case 'location53':
                calculatedPrice = 148;
                break;
              case 'location54':
                calculatedPrice = 174;
                break;
              case 'location55':
                calculatedPrice = 211;
                break;
              case 'location56':
                calculatedPrice = 235;
                break;
              case 'location57':
                calculatedPrice = 251;
                break;
              case 'location58':
                calculatedPrice = 304;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }

         // MCX ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationV1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 200;
                break;
              case 'location61':
                calculatedPrice = 154;
                break;
              case 'location62':
                calculatedPrice = 154;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 105;
                break;
              case 'location45':
                calculatedPrice = 70;
                break;
              case 'location46':
                calculatedPrice = 36;
                break;
              case 'location47':
                calculatedPrice = 31;
                break;
              case 'location49':
                calculatedPrice = 18;
                break;
              case 'location50':
                calculatedPrice = 24;
                break;
              case 'location51':
                calculatedPrice = 39;
                break;
              case 'location52':
                calculatedPrice = 44;
                break;
              case 'location53':
                calculatedPrice = 54;
                break;
              case 'location54':
                calculatedPrice = 63;
                break;
              case 'location55':
                calculatedPrice = 75;
                break;
              case 'location56':
                calculatedPrice = 83;
                break;
              case 'location57':
                calculatedPrice = 89;
                break;
              case 'location58':
                calculatedPrice = 106;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 401;
                break;
              case 'location61':
                calculatedPrice = 309;
                break;
              case 'location62':
                calculatedPrice = 309;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 210;
                break;
              case 'location45':
                calculatedPrice = 141;
                break;
              case 'location46':
                calculatedPrice = 72;
                break;
              case 'location47':
                calculatedPrice = 63;
                break;
              case 'location49':
                calculatedPrice = 37;
                break;
              case 'location50':
                calculatedPrice = 49;
                break;
              case 'location51':
                calculatedPrice = 78;
                break;
              case 'location52':
                calculatedPrice = 90;
                break;
              case 'location53':
                calculatedPrice = 109;
                break;
              case 'location54':
                calculatedPrice = 127;
                break;
              case 'location55':
                calculatedPrice = 152;
                break;
              case 'location56':
                calculatedPrice = 168;
                break;
              case 'location57':
                calculatedPrice = 179;
                break;
              case 'location58':
                calculatedPrice = 214;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 601;
                break;
              case 'location61':
                calculatedPrice = 464;
                break;
              case 'location62':
                calculatedPrice = 464;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 316;
                break;
              case 'location45':
                calculatedPrice = 212;
                break;
              case 'location46':
                calculatedPrice = 108;
                break;
              case 'location47':
                calculatedPrice = 94;
                break;
              case 'location49':
                calculatedPrice = 55;
                break;
              case 'location50':
                calculatedPrice = 73;
                break;
              case 'location51':
                calculatedPrice = 117;
                break;
              case 'location52':
                calculatedPrice = 134;
                break;
              case 'location53':
                calculatedPrice = 164;
                break;
              case 'location54':
                calculatedPrice = 190;
                break;
              case 'location55':
                calculatedPrice = 227;
                break;
              case 'location56':
                calculatedPrice = 251;
                break;
              case 'location57':
                calculatedPrice = 268;
                break;
              case 'location58':
                calculatedPrice = 320;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // SUSANA HEIGHTS ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationW1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 182;
                break;
              case 'location61':
                calculatedPrice = 136;
                break;
              case 'location62':
                calculatedPrice = 136;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 87;
                break;
              case 'location45':
                calculatedPrice = 52;
                break;
              case 'location46':
                calculatedPrice = 18;
                break;
              case 'location47':
                calculatedPrice = 13;
                break;
              case 'location48':
                calculatedPrice = 18;
                break;
              case 'location50':
                calculatedPrice = 6;
                break;
              case 'location51':
                calculatedPrice = 21;
                break;
              case 'location52':
                calculatedPrice = 26;
                break;
              case 'location53':
                calculatedPrice = 36;
                break;
              case 'location54':
                calculatedPrice = 45;
                break;
              case 'location55':
                calculatedPrice = 57;
                break;
              case 'location56':
                calculatedPrice = 65;
                break;
              case 'location57':
                calculatedPrice = 71;
                break;
              case 'location58':
                calculatedPrice = 88;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 364;
                break;
              case 'location61':
                calculatedPrice = 272;
                break;
              case 'location62':
                calculatedPrice = 272;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 173;
                break;
              case 'location45':
                calculatedPrice = 104;
                break;
              case 'location46':
                calculatedPrice = 35;
                break;
              case 'location47':
                calculatedPrice = 26;
                break;
              case 'location48':
                calculatedPrice = 37;
                break;
              case 'location50':
                calculatedPrice = 12;
                break;
              case 'location51':
                calculatedPrice = 41;
                break;
              case 'location52':
                calculatedPrice = 53;
                break;
              case 'location53':
                calculatedPrice = 72;
                break;
              case 'location54':
                calculatedPrice = 90;
                break;
              case 'location55':
                calculatedPrice = 115;
                break;
              case 'location56':
                calculatedPrice = 131;
                break;
              case 'location57':
                calculatedPrice = 142;
                break;
              case 'location58':
                calculatedPrice = 177;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 546;
                break;
              case 'location61':
                calculatedPrice = 409;
                break;
              case 'location62':
                calculatedPrice = 409;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 261;
                break;
              case 'location45':
                calculatedPrice = 157;
                break;
              case 'location46':
                calculatedPrice = 53;
                break;
              case 'location47':
                calculatedPrice = 39;
                break;
              case 'location48':
                calculatedPrice = 55;
                break;
              case 'location50':
                calculatedPrice = 18;
                break;
              case 'location51':
                calculatedPrice = 62;
                break;
              case 'location52':
                calculatedPrice = 79;
                break;
              case 'location53':
                calculatedPrice = 109;
                break;
              case 'location54':
                calculatedPrice = 135;
                break;
              case 'location55':
                calculatedPrice = 172;
                break;
              case 'location56':
                calculatedPrice = 196;
                break;
              case 'location57':
                calculatedPrice = 213;
                break;
              case 'location58':
                calculatedPrice = 265;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }



         // SAN PEDRO ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationX1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 188;
                break;
              case 'location61':
                calculatedPrice = 142;
                break;
              case 'location62':
                calculatedPrice = 142;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 93;
                break;
              case 'location45':
                calculatedPrice = 58;
                break;
              case 'location46':
                calculatedPrice = 24;
                break;
              case 'location47':
                calculatedPrice = 19;
                break;
              case 'location48':
                calculatedPrice = 24;
                break;
              case 'location49':
                calculatedPrice = 6;
                break;
              case 'location51':
                calculatedPrice = 15;
                break;
              case 'location52':
                calculatedPrice = 20;
                break;
              case 'location53':
                calculatedPrice = 30;
                break;
              case 'location54':
                calculatedPrice = 39;
                break;
              case 'location55':
                calculatedPrice = 51;
                break;
              case 'location56':
                calculatedPrice = 59;
                break;
              case 'location57':
                calculatedPrice = 65;
                break;
              case 'location58':
                calculatedPrice = 82;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 376;
                break;
              case 'location61':
                calculatedPrice = 284;
                break;
              case 'location62':
                calculatedPrice = 284;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 185;
                break;
              case 'location45':
                calculatedPrice = 116;
                break;
              case 'location46':
                calculatedPrice = 47;
                break;
              case 'location47':
                calculatedPrice = 38;
                break;
              case 'location48':
                calculatedPrice = 49;
                break;
              case 'location49':
                calculatedPrice = 12;
                break;
              case 'location51':
                calculatedPrice = 29;
                break;
              case 'location52':
                calculatedPrice = 41;
                break;
              case 'location53':
                calculatedPrice = 61;
                break;
              case 'location54':
                calculatedPrice = 78;
                break;
              case 'location55':
                calculatedPrice = 103;
                break;
              case 'location56':
                calculatedPrice = 119;
                break;
              case 'location57':
                calculatedPrice = 130;
                break;
              case 'location58':
                calculatedPrice = 165;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 564;
                break;
              case 'location61':
                calculatedPrice = 427;
                break;
              case 'location62':
                calculatedPrice = 427;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 279;
                break;
              case 'location45':
                calculatedPrice = 175;
                break;
              case 'location46':
                calculatedPrice = 71;
                break;
              case 'location47':
                calculatedPrice = 57;
                break;
              case 'location48':
                calculatedPrice = 73;
                break;
              case 'location49':
                calculatedPrice = 18;
                break;
              case 'location51':
                calculatedPrice = 44;
                break;
              case 'location52':
                calculatedPrice = 61;
                break;
              case 'location53':
                calculatedPrice = 91;
                break;
              case 'location54':
                calculatedPrice = 117;
                break;
              case 'location55':
                calculatedPrice = 154;
                break;
              case 'location56':
                calculatedPrice = 178;
                break;
              case 'location57':
                calculatedPrice = 195;
                break;
              case 'location58':
                calculatedPrice = 247;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // SOUTHWOODS ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationY1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 202;
                break;
              case 'location61':
                calculatedPrice = 156;
                break;
              case 'location62':
                calculatedPrice = 156;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 107;
                break;
              case 'location45':
                calculatedPrice = 72;
                break;
              case 'location46':
                calculatedPrice = 38;
                break;
              case 'location47':
                calculatedPrice = 34;
                break;
              case 'location48':
                calculatedPrice = 39;
                break;
              case 'location49':
                calculatedPrice = 21;
                break;
              case 'location50':
                calculatedPrice = 15;
                break;
              case 'location52':
                calculatedPrice = 6;
                break;
              case 'location53':
                calculatedPrice = 16;
                break;
              case 'location54':
                calculatedPrice = 24;
                break;
              case 'location55':
                calculatedPrice = 37;
                break;
              case 'location56':
                calculatedPrice = 45;
                break;
              case 'location57':
                calculatedPrice = 50;
                break;
              case 'location58':
                calculatedPrice = 68;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 405;
                break;
              case 'location61':
                calculatedPrice = 313;
                break;
              case 'location62':
                calculatedPrice = 313;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 214;
                break;
              case 'location45':
                calculatedPrice = 145;
                break;
              case 'location46':
                calculatedPrice = 76;
                break;
              case 'location47':
                calculatedPrice = 67;
                break;
              case 'location48':
                calculatedPrice = 78;
                break;
              case 'location49':
                calculatedPrice = 41;
                break;
              case 'location50':
                calculatedPrice = 29;
                break;
              case 'location52':
                calculatedPrice = 12;
                break;
              case 'location53':
                calculatedPrice = 31;
                break;
              case 'location54':
                calculatedPrice = 49;
                break;
              case 'location55':
                calculatedPrice = 74;
                break;
              case 'location56':
                calculatedPrice = 90;
                break;
              case 'location57':
                calculatedPrice = 100;
                break;
              case 'location58':
                calculatedPrice = 136;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 608;
                break;
              case 'location61':
                calculatedPrice = 471;
                break;
              case 'location62':
                calculatedPrice = 471;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 323;
                break;
              case 'location45':
                calculatedPrice = 219;
                break;
              case 'location46':
                calculatedPrice = 115;
                break;
              case 'location47':
                calculatedPrice = 101;
                break;
              case 'location48':
                calculatedPrice = 117;
                break;
              case 'location49':
                calculatedPrice = 62;
                break;
              case 'location50':
                calculatedPrice = 44;
                break;
              case 'location52':
                calculatedPrice = 17;
                break;
              case 'location53':
                calculatedPrice = 47;
                break;
              case 'location54':
                calculatedPrice = 73;
                break;
              case 'location55':
                calculatedPrice = 110;
                break;
              case 'location56':
                calculatedPrice = 134;
                break;
              case 'location57':
                calculatedPrice = 151;
                break;
              case 'location58':
                calculatedPrice = 203;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }



         // CARMONA ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationZ1' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 208;
                break;
              case 'location61':
                calculatedPrice = 162;
                break;
              case 'location62':
                calculatedPrice = 162;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 113;
                break;
              case 'location45':
                calculatedPrice = 78;
                break;
              case 'location46':
                calculatedPrice = 44;
                break;
              case 'location47':
                calculatedPrice = 39;
                break;
              case 'location48':
                calculatedPrice = 44;
                break;
              case 'location49':
                calculatedPrice = 26;
                break;
              case 'location50':
                calculatedPrice = 20;
                break;
              case 'location51':
                calculatedPrice = 6;
                break;
              case 'location53':
                calculatedPrice = 10;
                break;
              case 'location54':
                calculatedPrice = 19;
                break;
              case 'location55':
                calculatedPrice = 31;
                break;
              case 'location56':
                calculatedPrice = 39;
                break;
              case 'location57':
                calculatedPrice = 44;
                break;
              case 'location58':
                calculatedPrice = 62;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 417;
                break;
              case 'location61':
                calculatedPrice = 325;
                break;
              case 'location62':
                calculatedPrice = 325;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 226;
                break;
              case 'location45':
                calculatedPrice = 157;
                break;
              case 'location46':
                calculatedPrice = 88;
                break;
              case 'location47':
                calculatedPrice = 79;
                break;
              case 'location48':
                calculatedPrice = 90;
                break;
              case 'location49':
                calculatedPrice = 53;
                break;
              case 'location50':
                calculatedPrice = 41;
                break;
              case 'location51':
                calculatedPrice = 12;
                break;
              case 'location53':
                calculatedPrice = 20;
                break;
              case 'location54':
                calculatedPrice = 37;
                break;
              case 'location55':
                calculatedPrice = 62;
                break;
              case 'location56':
                calculatedPrice = 78;
                break;
              case 'location57':
                calculatedPrice = 89;
                break;
              case 'location58':
                calculatedPrice = 124;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 625;
                break;
              case 'location61':
                calculatedPrice = 488;
                break;
              case 'location62':
                calculatedPrice = 488;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 340;
                break;
              case 'location45':
                calculatedPrice = 236;
                break;
              case 'location46':
                calculatedPrice = 132;
                break;
              case 'location47':
                calculatedPrice = 118;
                break;
              case 'location48':
                calculatedPrice = 134;
                break;
              case 'location49':
                calculatedPrice = 79;
                break;
              case 'location50':
                calculatedPrice = 61;
                break;
              case 'location51':
                calculatedPrice = 17;
                break;
              case 'location53':
                calculatedPrice = 29;
                break;
              case 'location54':
                calculatedPrice = 56;
                break;
              case 'location55':
                calculatedPrice = 93;
                break;
              case 'location56':
                calculatedPrice = 117;
                break;
              case 'location57':
                calculatedPrice = 133;
                break;
              case 'location58':
                calculatedPrice = 186;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


         // MAMPLASAN ENTRY POINT (DONE)
         if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationA2' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 218;
                break;
              case 'location61':
                calculatedPrice = 172;
                break;
              case 'location62':
                calculatedPrice = 172;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 123;
                break;
              case 'location45':
                calculatedPrice = 88;
                break;
              case 'location46':
                calculatedPrice = 54;
                break;
              case 'location47':
                calculatedPrice = 49;
                break;
              case 'location48':
                calculatedPrice = 54;
                break;
              case 'location49':
                calculatedPrice = 36;
                break;
              case 'location50':
                calculatedPrice = 30;
                break;
              case 'location51':
                calculatedPrice = 16;
                break;
              case 'location52':
                calculatedPrice = 10;
                break;
              case 'location54':
                calculatedPrice = 9;
                break;
              case 'location55':
                calculatedPrice = 21;
                break;
              case 'location56':
                calculatedPrice = 29;
                break;
              case 'location57':
                calculatedPrice = 35;
                break;
              case 'location58':
                calculatedPrice = 52;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 437;
                break;
              case 'location61':
                calculatedPrice = 345;
                break;
              case 'location62':
                calculatedPrice = 345;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 246;
                break;
              case 'location45':
                calculatedPrice = 177;
                break;
              case 'location46':
                calculatedPrice = 108;
                break;
              case 'location47':
                calculatedPrice = 98;
                break;
              case 'location48':
                calculatedPrice = 109;
                break;
              case 'location49':
                calculatedPrice = 72;
                break;
              case 'location50':
                calculatedPrice = 61;
                break;
              case 'location51':
                calculatedPrice = 31;
                break;
              case 'location52':
                calculatedPrice = 20;
                break;
              case 'location54':
                calculatedPrice = 17;
                break;
              case 'location55':
                calculatedPrice = 42;
                break;
              case 'location56':
                calculatedPrice = 58;
                break;
              case 'location57':
                calculatedPrice = 69;
                break;
              case 'location58':
                calculatedPrice = 104;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 654;
                break;
              case 'location61':
                calculatedPrice = 517;
                break;
              case 'location62':
                calculatedPrice = 517;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 369;
                break;
              case 'location45':
                calculatedPrice = 265;
                break;
              case 'location46':
                calculatedPrice = 161;
                break;
              case 'location47':
                calculatedPrice = 148;
                break;
              case 'location48':
                calculatedPrice = 164;
                break;
              case 'location49':
                calculatedPrice = 109;
                break;
              case 'location50':
                calculatedPrice = 91;
                break;
              case 'location51':
                calculatedPrice = 47;
                break;
              case 'location52':
                calculatedPrice = 29;
                break;
              case 'location54':
                calculatedPrice = 26;
                break;
              case 'location55':
                calculatedPrice = 64;
                break;
              case 'location56':
                calculatedPrice = 87;
                break;
              case 'location57':
                calculatedPrice = 104;
                break;
              case 'location58':
                calculatedPrice = 157;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }



        // STA. ROSA ENTRY POINT (DONE)
        if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationB2' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 227;
                break;
              case 'location61':
                calculatedPrice = 181;
                break;
              case 'location62':
                calculatedPrice = 181;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 132;
                break;
              case 'location45':
                calculatedPrice = 97;
                break;
              case 'location46':
                calculatedPrice = 63;
                break;
              case 'location47':
                calculatedPrice = 58;
                break;
              case 'location48':
                calculatedPrice = 63;
                break;
              case 'location49':
                calculatedPrice = 45;
                break;
              case 'location50':
                calculatedPrice = 39;
                break;
              case 'location51':
                calculatedPrice = 24;
                break;
              case 'location52':
                calculatedPrice = 19;
                break;
              case 'location53':
                calculatedPrice = 9;
                break;
              case 'location55':
                calculatedPrice = 12;
                break;
              case 'location56':
                calculatedPrice = 20;
                break;
              case 'location57':
                calculatedPrice = 26;
                break;
              case 'location58':
                calculatedPrice = 43;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 454;
                break;
              case 'location61':
                calculatedPrice = 362;
                break;
              case 'location62':
                calculatedPrice = 362;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 263;
                break;
              case 'location45':
                calculatedPrice = 194;
                break;
              case 'location46':
                calculatedPrice = 125;
                break;
              case 'location47':
                calculatedPrice = 116;
                break;
              case 'location48':
                calculatedPrice = 127;
                break;
              case 'location49':
                calculatedPrice = 90;
                break;
              case 'location50':
                calculatedPrice = 78;
                break;
              case 'location51':
                calculatedPrice = 49;
                break;
              case 'location52':
                calculatedPrice = 37;
                break;
              case 'location53':
                calculatedPrice = 17;
                break;
              case 'location55':
                calculatedPrice = 25;
                break;
              case 'location56':
                calculatedPrice = 41;
                break;
              case 'location57':
                calculatedPrice = 52;
                break;
              case 'location58':
                calculatedPrice = 87;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 681;
                break;
              case 'location61':
                calculatedPrice = 544;
                break;
              case 'location62':
                calculatedPrice = 544;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 396;
                break;
              case 'location45':
                calculatedPrice = 292;
                break;
              case 'location46':
                calculatedPrice = 188;
                break;
              case 'location47':
                calculatedPrice = 174;
                break;
              case 'location48':
                calculatedPrice = 190;
                break;
              case 'location49':
                calculatedPrice = 135;
                break;
              case 'location50':
                calculatedPrice = 117;
                break;
              case 'location51':
                calculatedPrice = 73;
                break;
              case 'location52':
                calculatedPrice = 56;
                break;
              case 'location53':
                calculatedPrice = 26;
                break;
              case 'location55':
                calculatedPrice = 37;
                break;
              case 'location56':
                calculatedPrice = 61;
                break;
              case 'location57':
                calculatedPrice = 78;
                break;
              case 'location58':
                calculatedPrice = 130;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }



        // ABI/GREENFIELD ENTRY POINT (DONE)
        if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationC2' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 239;
                break;
              case 'location61':
                calculatedPrice = 193;
                break;
              case 'location62':
                calculatedPrice = 193;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 144;
                break;
              case 'location45':
                calculatedPrice = 109;
                break;
              case 'location46':
                calculatedPrice = 75;
                break;
              case 'location47':
                calculatedPrice = 70;
                break;
              case 'location48':
                calculatedPrice = 75;
                break;
              case 'location49':
                calculatedPrice = 57;
                break;
              case 'location50':
                calculatedPrice = 51;
                break;
              case 'location51':
                calculatedPrice = 37;
                break;
              case 'location52':
                calculatedPrice = 31;
                break;
              case 'location53':
                calculatedPrice = 21;
                break;
              case 'location54':
                calculatedPrice = 12;
                break;
              case 'location56':
                calculatedPrice = 8;
                break;
              case 'location57':
                calculatedPrice = 13;
                break;
              case 'location58':
                calculatedPrice = 31;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 479;
                break;
              case 'location61':
                calculatedPrice = 387;
                break;
              case 'location62':
                calculatedPrice = 387;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 288;
                break;
              case 'location45':
                calculatedPrice = 219;
                break;
              case 'location46':
                calculatedPrice = 150;
                break;
              case 'location47':
                calculatedPrice = 141;
                break;
              case 'location48':
                calculatedPrice = 152;
                break;
              case 'location49':
                calculatedPrice = 115;
                break;
              case 'location50':
                calculatedPrice = 103;
                break;
              case 'location51':
                calculatedPrice = 74;
                break;
              case 'location52':
                calculatedPrice = 62;
                break;
              case 'location53':
                calculatedPrice = 42;
                break;
              case 'location54':
                calculatedPrice = 25;
                break;
              case 'location56':
                calculatedPrice = 16;
                break;
              case 'location57':
                calculatedPrice = 27;
                break;
              case 'location58':
                calculatedPrice = 62;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 718;
                break;
              case 'location61':
                calculatedPrice = 581;
                break;
              case 'location62':
                calculatedPrice = 581;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 433;
                break;
              case 'location45':
                calculatedPrice = 329;
                break;
              case 'location46':
                calculatedPrice = 225;
                break;
              case 'location47':
                calculatedPrice = 211;
                break;
              case 'location48':
                calculatedPrice = 227;
                break;
              case 'location49':
                calculatedPrice = 172;
                break;
              case 'location50':
                calculatedPrice = 154;
                break;
              case 'location51':
                calculatedPrice = 110;
                break;
              case 'location52':
                calculatedPrice = 93;
                break;
              case 'location53':
                calculatedPrice = 64;
                break;
              case 'location54':
                calculatedPrice = 37;
                break;
              case 'location56':
                calculatedPrice = 24;
                break;
              case 'location57':
                calculatedPrice = 40;
                break;
              case 'location58':
                calculatedPrice = 93;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }




        // CABUYAO ENTRY POINT (DONE)
        if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationD2' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location57' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 247;
                break;
              case 'location61':
                calculatedPrice = 201;
                break;
              case 'location62':
                calculatedPrice = 201;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 152;
                break;
              case 'location45':
                calculatedPrice = 117;
                break;
              case 'location46':
                calculatedPrice = 83;
                break;
              case 'location47':
                calculatedPrice = 78;
                break;
              case 'location48':
                calculatedPrice = 83;
                break;
              case 'location49':
                calculatedPrice = 65;
                break;
              case 'location50':
                calculatedPrice = 59;
                break;
              case 'location51':
                calculatedPrice = 45;
                break;
              case 'location52':
                calculatedPrice = 39;
                break;
              case 'location53':
                calculatedPrice = 29;
                break;
              case 'location54':
                calculatedPrice = 20;
                break;
              case 'location55':
                calculatedPrice = 8;
                break;
              case 'location57':
                calculatedPrice = 5;
                break;
              case 'location58':
                calculatedPrice = 23;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 495;
                break;
              case 'location61':
                calculatedPrice = 403;
                break;
              case 'location62':
                calculatedPrice = 403;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 304;
                break;
              case 'location45':
                calculatedPrice = 235;
                break;
              case 'location46':
                calculatedPrice = 166;
                break;
              case 'location47':
                calculatedPrice = 157;
                break;
              case 'location48':
                calculatedPrice = 168;
                break;
              case 'location49':
                calculatedPrice = 131;
                break;
              case 'location50':
                calculatedPrice = 119;
                break;
              case 'location51':
                calculatedPrice = 90;
                break;
              case 'location52':
                calculatedPrice = 78;
                break;
              case 'location53':
                calculatedPrice = 58;
                break;
              case 'location54':
                calculatedPrice = 41;
                break;
              case 'location55':
                calculatedPrice = 16;
                break;
              case 'location57':
                calculatedPrice = 11;
                break;
              case 'location58':
                calculatedPrice = 46;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 742;
                break;
              case 'location61':
                calculatedPrice = 605;
                break;
              case 'location62':
                calculatedPrice = 605;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 457;
                break;
              case 'location45':
                calculatedPrice = 353;
                break;
              case 'location46':
                calculatedPrice = 249;
                break;
              case 'location47':
                calculatedPrice = 235;
                break;
              case 'location48':
                calculatedPrice = 251;
                break;
              case 'location49':
                calculatedPrice = 196;
                break;
              case 'location50':
                calculatedPrice = 178;
                break;
              case 'location51':
                calculatedPrice = 134;
                break;
              case 'location52':
                calculatedPrice = 117;
                break;
              case 'location53':
                calculatedPrice = 87;
                break;
              case 'location54':
                calculatedPrice = 61;
                break;
              case 'location55':
                calculatedPrice = 24;
                break;
              case 'location57':
                calculatedPrice = 16;
                break;
              case 'location58':
                calculatedPrice = 69;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


        // SILANGAN ENTRY POINT (DONE)
        if (
          selectedOption === 'option3' &&
          locationdropdown === 'locationE2' &&
          locationdropdown2 &&
          (locationdropdown2 === 'location43' ||
           locationdropdown2 === 'location44' ||
           locationdropdown2 === 'location45' ||
           locationdropdown2 === 'location46' ||
           locationdropdown2 === 'location47' ||
           locationdropdown2 === 'location48' ||
           locationdropdown2 === 'location49' ||
           locationdropdown2 === 'location50' ||
           locationdropdown2 === 'location51' ||
           locationdropdown2 === 'location52' ||
           locationdropdown2 === 'location53' ||
           locationdropdown2 === 'location54' ||
           locationdropdown2 === 'location55' ||
           locationdropdown2 === 'location56' ||
           locationdropdown2 === 'location58' ||
           locationdropdown2 === 'location59' ||
           locationdropdown2 === 'location60' ||
           locationdropdown2 === 'location61' ||
           locationdropdown2 === 'location62')
           
        ) {
          if (selectedClass === 'class1') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 252;
                break;
              case 'location61':
                calculatedPrice = 206;
                break;
              case 'location62':
                calculatedPrice = 206;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 157;
                break;
              case 'location45':
                calculatedPrice = 122;
                break;
              case 'location46':
                calculatedPrice = 88;
                break;
              case 'location47':
                calculatedPrice = 84;
                break;
              case 'location48':
                calculatedPrice = 89;
                break;
              case 'location49':
                calculatedPrice = 71;
                break;
              case 'location50':
                calculatedPrice = 65;
                break;
              case 'location51':
                calculatedPrice = 50;
                break;
              case 'location52':
                calculatedPrice = 44;
                break;
              case 'location53':
                calculatedPrice = 35;
                break;
              case 'location54':
                calculatedPrice = 26;
                break;
              case 'location55':
                calculatedPrice = 13;
                break;
              case 'location56':
                calculatedPrice = 5;
                break;
              case 'location58':
                calculatedPrice = 23;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class2') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 506;
                break;
              case 'location61':
                calculatedPrice = 414;
                break;
              case 'location62':
                calculatedPrice = 414;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 315;
                break;
              case 'location45':
                calculatedPrice = 246;
                break;
              case 'location46':
                calculatedPrice = 177;
                break;
              case 'location47':
                calculatedPrice = 168;
                break;
              case 'location48':
                calculatedPrice = 179;
                break;
              case 'location49':
                calculatedPrice = 142;
                break;
              case 'location50':
                calculatedPrice = 130;
                break;
              case 'location51':
                calculatedPrice = 100;
                break;
              case 'location52':
                calculatedPrice = 89;
                break;
              case 'location53':
                calculatedPrice = 69;
                break;
              case 'location54':
                calculatedPrice = 52;
                break;
              case 'location55':
                calculatedPrice = 27;
                break;
              case 'location56':
                calculatedPrice = 11;
                break;
              case 'location58':
                calculatedPrice = 46;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          } else if (selectedClass === 'class3') {
            switch (locationdropdown2) {
              case 'location60':
                calculatedPrice = 758;
                break;
              case 'location61':
                calculatedPrice = 621;
                break;
              case 'location62':
                calculatedPrice = 621;
                break;
              case 'location43':
                calculatedPrice = 'NO EXIT';
                break;
              case 'location44':
                calculatedPrice = 473;
                break;
              case 'location45':
                calculatedPrice = 369;
                break;
              case 'location46':
                calculatedPrice = 265;
                break;
              case 'location47':
                calculatedPrice = 251;
                break;
              case 'location48':
                calculatedPrice = 268;
                break;
              case 'location49':
                calculatedPrice = 213;
                break;
              case 'location50':
                calculatedPrice = 195;
                break;
              case 'location51':
                calculatedPrice = 151;
                break;
              case 'location52':
                calculatedPrice = 133;
                break;
              case 'location53':
                calculatedPrice = 104;
                break;
              case 'location54':
                calculatedPrice = 78;
                break;
              case 'location55':
                calculatedPrice = 40;
                break;
              case 'location56':
                calculatedPrice = 16;
                break;
              case 'location58':
                calculatedPrice = 69;
                break;
              case 'location59':
                calculatedPrice = 'NO EXIT';
                break;
              default:
                break;
            }
          }
        }


       // CALAMBA ENTRY POINT (DONE)
       if (
        selectedOption === 'option3' &&
        locationdropdown === 'locationF2' &&
        locationdropdown2 &&
        (locationdropdown2 === 'location43' ||
         locationdropdown2 === 'location44' ||
         locationdropdown2 === 'location45' ||
         locationdropdown2 === 'location46' ||
         locationdropdown2 === 'location47' ||
         locationdropdown2 === 'location48' ||
         locationdropdown2 === 'location49' ||
         locationdropdown2 === 'location50' ||
         locationdropdown2 === 'location51' ||
         locationdropdown2 === 'location52' ||
         locationdropdown2 === 'location53' ||
         locationdropdown2 === 'location54' ||
         locationdropdown2 === 'location55' ||
         locationdropdown2 === 'location56' ||
         locationdropdown2 === 'location57' ||
         locationdropdown2 === 'location59' ||
         locationdropdown2 === 'location60' ||
         locationdropdown2 === 'location61' ||
         locationdropdown2 === 'location62')
         
      ) {
        if (selectedClass === 'class1') {
          switch (locationdropdown2) {
            case 'location60':
              calculatedPrice = 270;
              break;
            case 'location61':
              calculatedPrice = 224;
              break;
            case 'location62':
              calculatedPrice = 224;
              break;
            case 'location43':
              calculatedPrice = 'NO EXIT';
              break;
            case 'location44':
              calculatedPrice = 175;
              break;
            case 'location45':
              calculatedPrice = 140;
              break;
            case 'location46':
              calculatedPrice = 106;
              break;
            case 'location47':
              calculatedPrice = 101;
              break;
            case 'location48':
              calculatedPrice = 106;
              break;
            case 'location49':
              calculatedPrice = 88;
              break;
            case 'location50':
              calculatedPrice = 82;
              break;
            case 'location51':
              calculatedPrice = 68;
              break;
            case 'location52':
              calculatedPrice = 62;
              break;
            case 'location53':
              calculatedPrice = 52;
              break;
            case 'location54':
              calculatedPrice = 43;
              break;
            case 'location55':
              calculatedPrice = 31;
              break;
            case 'location56':
              calculatedPrice = 23;
              break;
            case 'location57':
              calculatedPrice = 18;
              break;
            case 'location59':
              calculatedPrice = 'NO EXIT';
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class2') {
          switch (locationdropdown2) {
            case 'location60':
              calculatedPrice = 541;
              break;
            case 'location61':
              calculatedPrice = 449;
              break;
            case 'location62':
              calculatedPrice = 449;
              break;
            case 'location43':
              calculatedPrice = 'NO EXIT';
              break;
            case 'location44':
              calculatedPrice = 350;
              break;
            case 'location45':
              calculatedPrice = 281;
              break;
            case 'location46':
              calculatedPrice = 212;
              break;
            case 'location47':
              calculatedPrice = 203;
              break;
            case 'location48':
              calculatedPrice = 214;
              break;
            case 'location49':
              calculatedPrice = 177;
              break;
            case 'location50':
              calculatedPrice = 165;
              break;
            case 'location51':
              calculatedPrice = 136;
              break;
            case 'location52':
              calculatedPrice = 124;
              break;
            case 'location53':
              calculatedPrice = 104;
              break;
            case 'location54':
              calculatedPrice = 87;
              break;
            case 'location55':
              calculatedPrice = 62;
              break;
            case 'location56':
              calculatedPrice = 46;
              break;
            case 'location57':
              calculatedPrice = 35;
              break;
            case 'location59':
              calculatedPrice = 'NO EXIT';
              break;
            default:
              break;
          }
        } else if (selectedClass === 'class3') {
          switch (locationdropdown2) {
            case 'location60':
              calculatedPrice = 811;
              break;
            case 'location61':
              calculatedPrice = 674;
              break;
            case 'location62':
              calculatedPrice = 674;
              break;
            case 'location43':
              calculatedPrice = 'NO EXIT';
              break;
            case 'location44':
              calculatedPrice = 526;
              break;
            case 'location45':
              calculatedPrice = 422;
              break;
            case 'location46':
              calculatedPrice = 318;
              break;
            case 'location47':
              calculatedPrice = 304;
              break;
            case 'location48':
              calculatedPrice = 320;
              break;
            case 'location49':
              calculatedPrice = 265;
              break;
            case 'location50':
              calculatedPrice = 247;
              break;
            case 'location51':
              calculatedPrice = 203;
              break;
            case 'location52':
              calculatedPrice = 186;
              break;
            case 'location53':
              calculatedPrice = 157;
              break;
            case 'location54':
              calculatedPrice = 130;
              break;
            case 'location55':
              calculatedPrice = 93;
              break;
            case 'location56':
              calculatedPrice = 69;
              break;
            case 'location57':
              calculatedPrice = 53;
              break;
            case 'location59':
              calculatedPrice = 'NO EXIT';
              break;
            default:
              break;
          }
        }
      }


     // STO. TOMAS ENTRY POINT (DONE)
     if (
      selectedOption === 'option3' &&
      locationdropdown === 'locationG2' &&
      locationdropdown2 &&
      (locationdropdown2 === 'location43' ||
       locationdropdown2 === 'location44' ||
       locationdropdown2 === 'location45' ||
       locationdropdown2 === 'location46' ||
       locationdropdown2 === 'location47' ||
       locationdropdown2 === 'location48' ||
       locationdropdown2 === 'location49' ||
       locationdropdown2 === 'location50' ||
       locationdropdown2 === 'location51' ||
       locationdropdown2 === 'location52' ||
       locationdropdown2 === 'location53' ||
       locationdropdown2 === 'location54' ||
       locationdropdown2 === 'location55' ||
       locationdropdown2 === 'location56' ||
       locationdropdown2 === 'location57' ||
       locationdropdown2 === 'location58' ||
       locationdropdown2 === 'location60' ||
       locationdropdown2 === 'location61' ||
       locationdropdown2 === 'location62')
       
    ) {
      if (selectedClass === 'class1') {
        switch (locationdropdown2) {
          case 'location60':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location61':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location62':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location43':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location44':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location45':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location46':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location47':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location48':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location49':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location50':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location51':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location52':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location53':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location54':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location55':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location56':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location57':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location58':
            calculatedPrice = 29;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class2') {
        switch (locationdropdown2) {
          case 'location60':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location61':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location62':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location43':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location44':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location45':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location46':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location47':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location48':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location49':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location50':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location51':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location52':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location53':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location54':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location55':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location56':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location57':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location58':
            calculatedPrice = 57;
            break;
          default:
            break;
        }
      } else if (selectedClass === 'class3') {
        switch (locationdropdown2) {
          case 'location60':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location61':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location62':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location43':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location44':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location45':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location46':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location47':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location48':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location49':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location50':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location51':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location52':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location53':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location54':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location55':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location56':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location57':
            calculatedPrice = 'NO EXIT';
            break;
          case 'location58':
            calculatedPrice = 86;
            break;
          default:
            break;
        }
      }
    }


   // SKYWAY ENTRY POINT (DONE)
   if (
    selectedOption === 'option3' &&
    locationdropdown === 'locationH2' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location43' ||
     locationdropdown2 === 'location44' ||
     locationdropdown2 === 'location45' ||
     locationdropdown2 === 'location46' ||
     locationdropdown2 === 'location47' ||
     locationdropdown2 === 'location48' ||
     locationdropdown2 === 'location49' ||
     locationdropdown2 === 'location50' ||
     locationdropdown2 === 'location51' ||
     locationdropdown2 === 'location52' ||
     locationdropdown2 === 'location53' ||
     locationdropdown2 === 'location54' ||
     locationdropdown2 === 'location55' ||
     locationdropdown2 === 'location56' ||
     locationdropdown2 === 'location57' ||
     locationdropdown2 === 'location58' ||
     locationdropdown2 === 'location59' ||
     locationdropdown2 === 'location61' ||
     locationdropdown2 === 'location62')
     
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location61':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 72;
          break;
        case 'location45':
          calculatedPrice = 118;
          break;
        case 'location46':
          calculatedPrice = 164;
          break;
        case 'location47':
          calculatedPrice = 169;
          break;
        case 'location48':
          calculatedPrice = 200;
          break;
        case 'location49':
          calculatedPrice = 182;
          break;
        case 'location50':
          calculatedPrice = 188;
          break;
        case 'location51':
          calculatedPrice = 202;
          break;
        case 'location52':
          calculatedPrice = 208;
          break;
        case 'location53':
          calculatedPrice = 218;
          break;
        case 'location54':
          calculatedPrice = 227;
          break;
        case 'location55':
          calculatedPrice = 239;
          break;
        case 'location56':
          calculatedPrice = 247;
          break;
        case 'location57':
          calculatedPrice = 252;
          break;
        case 'location58':
          calculatedPrice = 270;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location61':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 145;
          break;
        case 'location45':
          calculatedPrice = 237;
          break;
        case 'location46':
          calculatedPrice = 329;
          break;
        case 'location47':
          calculatedPrice = 338;
          break;
        case 'location48':
          calculatedPrice = 401;
          break;
        case 'location49':
          calculatedPrice = 364;
          break;
        case 'location50':
          calculatedPrice = 376;
          break;
        case 'location51':
          calculatedPrice = 405;
          break;
        case 'location52':
          calculatedPrice = 417;
          break;
        case 'location53':
          calculatedPrice = 437;
          break;
        case 'location54':
          calculatedPrice = 454;
          break;
        case 'location55':
          calculatedPrice = 479;
          break;
        case 'location56':
          calculatedPrice = 495;
          break;
        case 'location57':
          calculatedPrice = 506;
          break;
        case 'location58':
          calculatedPrice = 541;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location61':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 218;
          break;
        case 'location45':
          calculatedPrice = 356;
          break;
        case 'location46':
          calculatedPrice = 493;
          break;
        case 'location47':
          calculatedPrice = 507;
          break;
        case 'location48':
          calculatedPrice = 601;
          break;
        case 'location49':
          calculatedPrice = 546;
          break;
        case 'location50':
          calculatedPrice = 564;
          break;
        case 'location51':
          calculatedPrice = 608;
          break;
        case 'location52':
          calculatedPrice = 625;
          break;
        case 'location53':
          calculatedPrice = 654;
          break;
        case 'location54':
          calculatedPrice = 681;
          break;
        case 'location55':
          calculatedPrice = 718;
          break;
        case 'location56':
          calculatedPrice = 742;
          break;
        case 'location57':
          calculatedPrice = 758;
          break;
        case 'location58':
          calculatedPrice = 811;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    }
  }



   // MAG ENTRY POINT (DONE)
   if (
    selectedOption === 'option3' &&
    locationdropdown === 'locationI2' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location43' ||
     locationdropdown2 === 'location44' ||
     locationdropdown2 === 'location45' ||
     locationdropdown2 === 'location46' ||
     locationdropdown2 === 'location47' ||
     locationdropdown2 === 'location48' ||
     locationdropdown2 === 'location49' ||
     locationdropdown2 === 'location50' ||
     locationdropdown2 === 'location51' ||
     locationdropdown2 === 'location52' ||
     locationdropdown2 === 'location53' ||
     locationdropdown2 === 'location54' ||
     locationdropdown2 === 'location55' ||
     locationdropdown2 === 'location56' ||
     locationdropdown2 === 'location57' ||
     locationdropdown2 === 'location58' ||
     locationdropdown2 === 'location59' ||
     locationdropdown2 === 'location60' ||
     locationdropdown2 === 'location62')
     
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 49;
          break;
        case 'location44':
          calculatedPrice = 49;
          break;
        case 'location45':
          calculatedPrice = 84;
          break;
        case 'location46':
          calculatedPrice = 118;
          break;
        case 'location47':
          calculatedPrice = 123;
          break;
        case 'location48':
          calculatedPrice = 154;
          break;
        case 'location49':
          calculatedPrice = 136;
          break;
        case 'location50':
          calculatedPrice = 142;
          break;
        case 'location51':
          calculatedPrice = 156;
          break;
        case 'location52':
          calculatedPrice = 162;
          break;
        case 'location53':
          calculatedPrice = 172;
          break;
        case 'location54':
          calculatedPrice = 181;
          break;
        case 'location55':
          calculatedPrice = 193;
          break;
        case 'location56':
          calculatedPrice = 201;
          break;
        case 'location57':
          calculatedPrice = 206;
          break;
        case 'location58':
          calculatedPrice = 224;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 98;
          break;
        case 'location44':
          calculatedPrice = 98;
          break;
        case 'location45':
          calculatedPrice = 168;
          break;
        case 'location46':
          calculatedPrice = 237;
          break;
        case 'location47':
          calculatedPrice = 246;
          break;
        case 'location48':
          calculatedPrice = 309;
          break;
        case 'location49':
          calculatedPrice = 272;
          break;
        case 'location50':
          calculatedPrice = 284;
          break;
        case 'location51':
          calculatedPrice = 313;
          break;
        case 'location52':
          calculatedPrice = 325;
          break;
        case 'location53':
          calculatedPrice = 345;
          break;
        case 'location54':
          calculatedPrice = 362;
          break;
        case 'location55':
          calculatedPrice = 387;
          break;
        case 'location56':
          calculatedPrice = 403;
          break;
        case 'location57':
          calculatedPrice = 414;
          break;
        case 'location58':
          calculatedPrice = 449;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 147;
          break;
        case 'location44':
          calculatedPrice = 147;
          break;
        case 'location45':
          calculatedPrice = 252;
          break;
        case 'location46':
          calculatedPrice = 356;
          break;
        case 'location47':
          calculatedPrice = 370;
          break;
        case 'location48':
          calculatedPrice = 464;
          break;
        case 'location49':
          calculatedPrice = 409;
          break;
        case 'location50':
          calculatedPrice = 427;
          break;
        case 'location51':
          calculatedPrice = 471;
          break;
        case 'location52':
          calculatedPrice = 488;
          break;
        case 'location53':
          calculatedPrice = 517;
          break;
        case 'location54':
          calculatedPrice = 544;
          break;
        case 'location55':
          calculatedPrice = 581;
          break;
        case 'location56':
          calculatedPrice = 605;
          break;
        case 'location57':
          calculatedPrice = 621;
          break;
        case 'location58':
          calculatedPrice = 674;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    }
  }



   // C-5 ENTRY POINT (DONE)
   if (
    selectedOption === 'option3' &&
    locationdropdown === 'locationJ2' &&
    locationdropdown2 &&
    (locationdropdown2 === 'location43' ||
     locationdropdown2 === 'location44' ||
     locationdropdown2 === 'location45' ||
     locationdropdown2 === 'location46' ||
     locationdropdown2 === 'location47' ||
     locationdropdown2 === 'location48' ||
     locationdropdown2 === 'location49' ||
     locationdropdown2 === 'location50' ||
     locationdropdown2 === 'location51' ||
     locationdropdown2 === 'location52' ||
     locationdropdown2 === 'location53' ||
     locationdropdown2 === 'location54' ||
     locationdropdown2 === 'location55' ||
     locationdropdown2 === 'location56' ||
     locationdropdown2 === 'location57' ||
     locationdropdown2 === 'location58' ||
     locationdropdown2 === 'location59' ||
     locationdropdown2 === 'location60' ||
     locationdropdown2 === 'location61')
     
  ) {
    if (selectedClass === 'class1') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location61':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 49;
          break;
        case 'location45':
          calculatedPrice = 84;
          break;
        case 'location46':
          calculatedPrice = 118;
          break;
        case 'location47':
          calculatedPrice = 123;
          break;
        case 'location48':
          calculatedPrice = 154;
          break;
        case 'location49':
          calculatedPrice = 136;
          break;
        case 'location50':
          calculatedPrice = 142;
          break;
        case 'location51':
          calculatedPrice = 156;
          break;
        case 'location52':
          calculatedPrice = 162;
          break;
        case 'location53':
          calculatedPrice = 172;
          break;
        case 'location54':
          calculatedPrice = 181;
          break;
        case 'location55':
          calculatedPrice = 193;
          break;
        case 'location56':
          calculatedPrice = 201;
          break;
        case 'location57':
          calculatedPrice = 206;
          break;
        case 'location58':
          calculatedPrice = 224;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class2') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 98;
          break;
        case 'location45':
          calculatedPrice = 168;
          break;
        case 'location46':
          calculatedPrice = 237;
          break;
        case 'location47':
          calculatedPrice = 246;
          break;
        case 'location48':
          calculatedPrice = 309;
          break;
        case 'location49':
          calculatedPrice = 272;
          break;
        case 'location50':
          calculatedPrice = 284;
          break;
        case 'location51':
          calculatedPrice = 313;
          break;
        case 'location52':
          calculatedPrice = 325;
          break;
        case 'location53':
          calculatedPrice = 345;
          break;
        case 'location54':
          calculatedPrice = 362;
          break;
        case 'location55':
          calculatedPrice = 387;
          break;
        case 'location56':
          calculatedPrice = 403;
          break;
        case 'location57':
          calculatedPrice = 414;
          break;
        case 'location58':
          calculatedPrice = 449;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    } else if (selectedClass === 'class3') {
      switch (locationdropdown2) {
        case 'location60':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location62':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location43':
          calculatedPrice = 'NO EXIT';
          break;
        case 'location44':
          calculatedPrice = 147;
          break;
        case 'location45':
          calculatedPrice = 252;
          break;
        case 'location46':
          calculatedPrice = 356;
          break;
        case 'location47':
          calculatedPrice = 370;
          break;
        case 'location48':
          calculatedPrice = 464;
          break;
        case 'location49':
          calculatedPrice = 409;
          break;
        case 'location50':
          calculatedPrice = 427;
          break;
        case 'location51':
          calculatedPrice = 471;
          break;
        case 'location52':
          calculatedPrice = 488;
          break;
        case 'location53':
          calculatedPrice = 517;
          break;
        case 'location54':
          calculatedPrice = 544;
          break;
        case 'location55':
          calculatedPrice = 581;
          break;
        case 'location56':
          calculatedPrice = 605;
          break;
        case 'location57':
          calculatedPrice = 621;
          break;
        case 'location58':
          calculatedPrice = 674;
          break;
        case 'location59':
          calculatedPrice = 'NO EXIT';
          break;
        default:
          break;
      }
    }
  }



    // Set the calculated price
    let priceText;
    if (calculatedPrice === 'NO EXIT' || 'N/A') {
      priceText = calculatedPrice;
    } else {
      priceText = `₱${calculatedPrice.toLocaleString('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
    setPrice(priceText);
  };

  const handleNewFunction = () => {
    // Reset form state and set the flag to start a new function
    setSelectedOption('');
    setlocationdropdown('');
    setlocationdropdown2('');
    setVehicleDropdown('');
    setSelectedClass('');
    setPrice(null);
    
  };

  
  const containerStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100vh',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    backgroundColor: '#333', // Light pink background
    transition: 'background-color 0.3s ease-in-out',
    animation: 'fadeIn 0.5s ease-in-out',
    backgroundImage: 'url("https://i.pinimg.com/736x/11/ef/db/11efdbb0a8801a2ca6019be3216559dc.jpg")',
    
  };
  
  const formStyle = {
    position: 'relative',
    width: '300px',
    marginBottom: '20px',
    padding: '20px',
    backgroundColor: '#555',
    boxShadow: '0 0 10px rgba(46, 204, 113, 0.3)', // Light pink shadow
    marginTop: '20px',
    transition: 'box-shadow 0.3s ease-in-out, border-color 0.5s ease-in-out',
    animation: `
      fadeInUp 0.5s ease-in-out,
      moveBorder 2s infinite
    `, // Applied animation for border
  };
  
  const labelStyle = {
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#e74c3c', // Pink text
    transition: 'color 0.3s ease-in-out',
  };
  
  const selectStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '16px',
    border: '2px solid #e74c3c', // Pink border
    borderRadius: '4px',
    transition: 'border-color 0.3s ease-in-out',
  };
  
  const buttonStyle = {
    backgroundColor: '#000',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease-in-out',

  };
  
  const priceStyle = {
    marginTop: '20px',
    fontWeight: 'bold',
    color: '#D6EFFF',
    transition: 'color 0.3s ease-in-out',
    animation: price ? 'fadeInUp 0.5s ease-in-out' : '',
    border: '2px solid #000', 
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#000',
  };
  
  const newFunctionButtonStyle = {
    backgroundColor: '000', // Light blue
    color: 'white',
    padding: '12px 15px',
   
    borderRadius: '10px',
    cursor: 'pointer',
    display: price ? 'block' : 'none',
    transition: 'background-color 0.3s ease-in-out',
    animation: 'fadeInUp 0.5s ease-in-out',
    ':hover': {
     // Dark blue on hover
    },
  };
  
  
  const adminPageStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100%', // Set to 100% height
    width: '300px', // Set a specific width or adjust as needed
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f2f2f2',
  };
  

  return (
    
    <div style={containerStyle} className='container'>
   {showUpdateDeletePage ? (
  <div>
    <label>Confirmation ID:</label>
    <input
      type="text"
      value={confirmationId}
      onChange={(e) => setConfirmationId(e.target.value)}
    />
    {/* Pass confirmationId, setConfirmationId, and selectedData as props */}
    <UpdateDeletePage
      onUpdate={handleUpdateDataWithConfirmation}
      onDelete={handleDeleteDataWithConfirmation}
      confirmationId={confirmationId}
      setConfirmationId={setConfirmationId}
      selectedData={selectedData}
    />
  </div>
        ) : (
    <div style={containerStyle} className='container'>
    {isLoggedIn ? (
       <div style={isAdmin ? adminPageStyle :{}} >
         {isAdmin && (
            <>
         <h2>Add New Data</h2>
         <label>Expressway:</label>
         <input
           type="text"
           value={newData.expressway}
           onChange={(e) => setNewData({ ...newData, expressway: e.target.value })}
         />
         <label>Entry:</label>
         <input
           type="text"
           value={newData.entry}
           onChange={(e) => setNewData({ ...newData, entry: e.target.value })}
         />
         <label>Exit:</label>
         <input
           type="text"
           value={newData.exit}
           onChange={(e) => setNewData({ ...newData, exit: e.target.value })}
         />
         <label>Vehicle:</label>
         <input
           type="text"
           value={newData.vehicle}
           onChange={(e) => setNewData({ ...newData, vehicle: e.target.value })}
         />
         <label>Class:</label>
         <input
           type="text"
           value={newData.vehicleClass}
           onChange={(e) => setNewData({ ...newData, vehicleClass: e.target.value })}
         />
         <label>Price:</label>
         <input
        type="number"
       value={newData.price}
           onChange={(e) => setNewData({ ...newData, price: parseInt(e.target.value, 10) })}
        />
         <button style={buttonStyle} onClick={handleAddNewData} className='submit'>
           Add Data
         </button>
         {/* Button to fetch all data */}
         <button style={buttonStyle} onClick={fetchAllData} className='submit'>
                Fetch All Data
              </button>
              <button onClick={() => handleShowUpdateDeletePage(data._id)}>
            Update Data
          </button>
              </>
            )}
          </div>
        ) : (
     <div style={formStyle} className='form'>
       {isCreateAccount ? (
         <>
           <label>Create Account</label>
           <input
             type="text"
             placeholder="Username"
             value={createUsername}
             onChange={(e) => setCreateUsername(e.target.value)}
           />
           <input
             type="password"
             placeholder="Password"
             value={createPassword}
             onChange={(e) => setCreatePassword(e.target.value)}
           />
           <button style={buttonStyle} onClick={handleCreateAccount} className='submit'>
             Create Account
           </button>
           <p>
             Already have an account?{' '}
             <button
               style={buttonStyle}
               onClick={() => setIsCreateAccount(false)}
               className='toggleButton'
             >
               Login
             </button>
           </p>
         </>
       ) : (
         <>
           <label>Login</label>
           <input
             type="text"
             placeholder="Username"
             value={loginUsername}
             onChange={(e) => setLoginUsername(e.target.value)}
           />
           <input
             type="password"
             placeholder="Password"
             value={loginPassword}
             onChange={(e) => setLoginPassword(e.target.value)}
           />
           <button style={buttonStyle} onClick={handleLogin} className='submit'>
             Login
           </button>
           <p>
             Don't have an account?{' '}
             <button
               style={buttonStyle}
               onClick={() => setIsCreateAccount(true)}
               className='toggleButton'
             >
               Create Account
             </button>
             </p>
                </>
              )}
            </div>
          )}
    <div style={containerStyle} className='container'>
      {isLoggedIn && (
        <div style={formStyle} className='form'>
        <label style={labelStyle}>Select EXPRESSWAY:</label>
        <select style={selectStyle} value={selectedOption} onChange={handleOptionChange}>
          <option value="">Select...</option>
          <option value="option1">SCTEX/NLEX</option>
          <option value="option2">TPLEX</option>
          <option value="option3">Skyway-SLEX-MCX</option>
        </select>

        {selectedOption && (
          <div>
            <label style={labelStyle}>FROM</label>
            <select style={selectStyle} value={locationdropdown} onChange={handlelocationdropdownChange}>
              <option value="">Select...</option>
              {selectedOption === 'option1' && (
                <>
              <option value="locationA">Mindanao Avenue</option>
              <option value="locationB">Karuhatan</option>
              <option value="locationC">Valenzuela</option>
              <option value="locationD">Lawang Bato</option>
              <option value="locationE">Meycauayan</option>
              <option value="locationF">Marilao</option>
              <option value="locationG">Ciudad de Victoria</option>
              <option value="locationH">Bocaue</option>
              <option value="locationI">Tambubong</option>
              <option value="locationJ">Balagtas</option>
              <option value="locationK">Tabang</option>
              <option value="locationL">Sta. Rita</option>
              <option value="locationM">Pulilan</option>
              <option value="locationN">San Simon</option>
              <option value="locationO">San Fernando</option>
              <option value="locationP">Mexico</option>
              <option value="locationQ">Angeles</option>
              <option value="locationR">Dau</option>
              <option value="locationS">Sta. Ines</option>
              <option value="locationT">Tipo/SFEX</option>
              <option value="locationU">Dinalupihan</option>
              <option value="locationV">Floridablanca</option>
              <option value="locationW">Porac</option>
              <option value="locationX">Clark South</option>
              <option value="locationY">Mabalacat (Mabiga)</option>
              <option value="locationZ">Clark North</option>
              <option value="locationA1">Dolores</option>
              <option value="locationB1">Concepcion</option>
              <option value="locationC1">San Miguel</option>
              <option value="locationD1">Tarlac</option>
              <option value="locationE1">Balintawak</option>
              </>
              )}
              {selectedOption === 'option2' && (
                <>
                  <option value="locationF1">Lapaz</option>
                  <option value="locationG1">Victoria</option>
                  <option value="locationH1">Gerona</option>
                  <option value="locationI1">Paniqui</option>
                  <option value="locationJ1">Moncada</option>
                  <option value="locationK1">Carmen</option>
                  <option value="locationL1">Urdaneta</option>
                  <option value="locationM1">Binalonan</option>
                  <option value="locationN1">Pozorrubbio</option>
                  <option value="locationO1">Sison</option>
                  <option value="locationP1">Rosario</option>
                </>
              )}
              {selectedOption === 'option3' && (
                <>
                <option value="locationQ1">Merville</option>
                <option value="locationR1">Bicutan</option>
                <option value="locationS1">Sucat</option>
                <option value="locationT1">Alabang</option>
                <option value="locationU1">Filinvest</option>
                <option value="locationV1">MCX</option>
                <option value="locationW1">Susana Heights</option>
                <option value="locationX1">San Pedro</option>
                <option value="locationY1">Southwoods</option>
                <option value="locationZ1">Carmona</option>
                <option value="locationA2">Mamplasan</option>
                <option value="locationB2">Sta. Rosa</option>
                <option value="locationC2">ABI/Greenfield</option>
                <option value="locationD2">Cabuyao</option>
                <option value="locationE2">Silangan</option>
                <option value="locationF2">Calamba</option>
                <option value="locationG2">Sto. Tomas</option>
                <option value="locationH2">Skyway</option>
                <option value="locationI2">Mag</option>
                <option value="locationJ2">C-5</option>
                </>
              )}
            </select>
            <label style={labelStyle}>TO</label>
            <select style={selectStyle} value={locationdropdown2} onChange={handlelocationdropdown2Change}>
              <option value="">Select...</option>
              {selectedOption === 'option1' && (
                <>
              <option value="location1">Balintawak</option>
              <option value="location2">Mindanao Avenue</option>
              <option value="location3">Karuhatan</option>
              <option value="location4">Valenzuela</option>
              <option value="location5">Lawang Bato</option>
              <option value="location6">Meycauayan</option>
              <option value="location7">Marilao</option>
              <option value="location8">Ciudad de Victoria</option>
              <option value="location9">Bocaue</option>
              <option value="location10">Tambubong</option>
              <option value="location11">Balagtas</option>
              <option value="location12">Tabang</option>
              <option value="location13">Sta. Rita</option>
              <option value="location14">Pulilan</option>
              <option value="location15">San Simon</option>
              <option value="location16">San Fernando</option>
              <option value="location17">Mexico</option>
              <option value="location18">Angeles</option>
              <option value="location19">Dau</option>
              <option value="location20">Sta. Ines</option>
              <option value="location21">Tipo/SFEX</option>
              <option value="location22">Dinalupihan</option>
              <option value="location23">Floridablanca</option>
              <option value="location24">Porac</option>
              <option value="location25">Clark South</option>
              <option value="location26">Mabalacat (Mabiga)</option>
              <option value="location27">Clark North</option>
              <option value="location28">Dolores</option>
              <option value="location29">Concepcion</option>
              <option value="location30">San Miguel</option>
              <option value="location31">Tarlac</option>
              </>
              )}
              {selectedOption === 'option2' && (
                <>
                  <option value="location32">Lapaz</option>
                  <option value="location33">Victoria</option>
                  <option value="location34">Gerona</option>
                  <option value="location35">Paniqui</option>
                  <option value="location36">Moncada</option>
                  <option value="location37">Carmen</option>
                  <option value="location38">Urdaneta</option>
                  <option value="location39">Binalonan</option>
                  <option value="location40">Pozorrubbio</option>
                  <option value="location41">Sison</option>
                  <option value="location42">Rosario</option>
                </>
              )}
               {selectedOption === 'option3' && (
                <>
                <option value="location43">Merville</option>
                <option value="location44">Bicutan</option>
                <option value="location45">Sucat</option>
                <option value="location46">Alabang</option>
                <option value="location47">Filinvest</option>
                <option value="location48">MCX</option>
                <option value="location49">Susana Heights</option>
                <option value="location50">San Pedro</option>
                <option value="location51">Southwoods</option>
                <option value="location52">Carmona</option>
                <option value="location53">Mamplasan</option>
                <option value="location54">Sta. Rosa</option>
                <option value="location55">ABI/Greenfield</option>
                <option value="location56">Cabuyao</option>
                <option value="location57">Silangan</option>
                <option value="location58">Calamba</option>
                <option value="location59">Sto. Tomas</option>
                <option value="location60">Skyway</option>
                <option value="location61">Mag</option>
                <option value="location62">C-5</option>
                </>
              )}
            </select>
          </div>
        )}

        {locationdropdown2 && (
          <div>
            <label style={labelStyle}>Select a class:</label>
            <select style={selectStyle} value={selectedClass} onChange={handleClassChange}>
              <option value="">Select...</option>
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
              <option value="class3">Class 3</option>
            </select>
          </div>
        )}

        {selectedClass && (
          <div>
            <label style={labelStyle}>Select a vehicle:</label>
            <select style={selectStyle} value={vehicleDropdown} onChange={handleVehicleDropdownChange}>
              <option value="">Select...</option>
              {selectedClass === 'class1' && (
                <>
                  <option value="Car">Car</option>
                  <option value="Van">Van</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Jeepney">Jeepney</option>
                  <option value="Pick-up">Pick-up</option>
                </>
              )}
              {selectedClass === 'class2' && (
                <>
                  <option value="Bus">Bus</option>
                  <option value="Truck">Truck</option>
                </>
              )}
              {selectedClass === 'class3' && (
                <>
                  <option value="Large Truck">Large Truck</option>
                  <option value="Large Truck with Trailer">Large Truck with Trailer</option>
                </>
              )}
            </select>
          </div>
        )}

        {vehicleDropdown && (
          <div>
            <button style={buttonStyle} onClick={handleSubmit} className='submit'>
              Submit
            </button>
          </div>
        )}
      

      {price && (
        <p style={priceStyle} className='price'>
          Price: {price}
        </p>
      )} 
    
      <button style={newFunctionButtonStyle} onClick={handleNewFunction} className='newFunctionButton'>
        Ulitin mo ba?
      </button>
      <img
        src="https://th.bing.com/th/id/OIP.cGDCkyqbDQ0i1cpN-4J5UAHaHa?rs=1&pid=ImgDetMain"  
        alt="Lelouch Lamperouge"
        style={{ width: '100px', borderRadius: '50%', marginTop: '20px'}}
         className="responsive-image"
         />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default DropdownMenuWithInputsAndVehiclesAndSubmit;


