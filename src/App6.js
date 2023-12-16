import React, { useState } from 'react';
import jcbData from './mumbaii.json'; // Adjust the path according to your project structure

const JCBList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });

  // Function to get user's current location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  // Call this function when the component mounts
  useState(() => {
    getUserLocation();
  }, []);

  // Function to calculate distance between two coordinates
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  };

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter JCB data based on search term
  const filteredJCBData = Object.values(jcbData).filter(jcb =>
    jcb.name.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.address.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1>JCB Listings</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
      />
      <div>
        {filteredJCBData.map((jcb, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>{jcb.name}</h2>
            <p><strong>Address:</strong> {jcb.address}, {jcb.area}, {jcb.city} - {jcb.pin}</p>
            <p><strong>Contact:</strong> {jcb.contact_number}</p>
            <p><strong>Rating:</strong> {jcb.rating}</p>
            {jcb.main_image && <img src={jcb.main_image} alt={jcb.name} style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />}
            <button onClick={() => alert(`Address: ${jcb.address}\nDistance from you: ${calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(jcb.latitude), parseFloat(jcb.longitude)).toFixed(2)} km`)}>
              Show Address and Distance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JCBList;

