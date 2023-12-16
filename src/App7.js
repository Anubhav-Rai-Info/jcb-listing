import React, { useState, useEffect } from 'react';
import jcbData from './mumbaii.json'; // Adjust the path according to your project structure

const JCBList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [sortedData, setSortedData] = useState([]);

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

  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Sort JCBs based on distance from the user's location
  const sortJCBs = () => {
    const sorted = Object.values(jcbData).sort((a, b) => {
      return calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(a.latitude), parseFloat(a.longitude))
        - calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(b.latitude), parseFloat(b.longitude));
    });
    setSortedData(sorted);
  };

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter and sort JCB data based on search term and sorted state
  const filteredJCBData = sortedData.filter(jcb =>
    jcb.name.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.address.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setSortedData(Object.values(jcbData));
  }, []);

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
      <button onClick={sortJCBs} style={{ padding: '10px', marginBottom: '20px' }}>
        Sort by Nearest
      </button>
      <div>
        {filteredJCBData.map((jcb, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
            <h2>{jcb.name}</h2>
            <p><strong>Address:</strong> {jcb.address}, {jcb.area}, {jcb.city} - {jcb.pin}</p>
            <p><strong>Contact:</strong> {jcb.contact_number}</p>
            <p><strong>Rating:</strong> {jcb.rating}</p>
            {jcb.main_image && <img src={jcb.main_image} alt={jcb.name} style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JCBList;

