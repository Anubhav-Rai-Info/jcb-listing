import React, { useState, useEffect } from 'react';
import jcbData from './mumbaii.json'; // Adjust the path according to your project structure

const JCBList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [sorted, setSorted] = useState(false);
  const [sortedData, setSortedData] = useState([]);

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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
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

  const toggleSort = () => {
    if (!sorted) {
      const sortedArray = [...Object.values(jcbData)].sort((a, b) => {
        return calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(a.latitude), parseFloat(b.longitude))
          - calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(b.latitude), parseFloat(b.longitude));
      });
      setSortedData(sortedArray);
    } else {
      setSortedData(Object.values(jcbData));
    }
    setSorted(!sorted);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredJCBData = (sorted ? sortedData : Object.values(jcbData)).filter(jcb =>
    jcb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jcb.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jcb.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>JCB Listings</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ width: '100%', padding: '10px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      <button onClick={toggleSort} style={{ padding: '10px', marginBottom: '20px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#4CAF50', color: 'white' }}>
        {sorted ? 'Show Original Order' : 'Sort by Nearest'}
      </button>
      <div>
        {filteredJCBData.map((jcb, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', transition: 'transform 0.3s ease-in-out', background: '#f9f9f9', cursor: 'pointer' }}
               onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
               onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
            <h2>{jcb.name}</h2>
            <p><strong>Address:</strong> {jcb.address}, {jcb.area}, {jcb.city} - {jcb.pin}</p>
            <p><strong>Contact:</strong> {jcb.contact_number}</p>
            <p><strong>Rating:</strong> {jcb.rating}</p>
            <p><strong>Distance:</strong> {jcb.distance !== undefined ? `${jcb.distance.toFixed(2)} km` : 'N/A'}</p>
            {jcb.main_image && <img src={jcb.main_image} alt={jcb.name} style={{ maxWidth: '100%', height: 'auto', borderRadius: '5px' }} />}
            <button onClick={() => alert(`Address: ${jcb.address}\nDistance from you: ${calculateDistance(userLocation.latitude, userLocation.longitude, parseFloat(jcb.latitude), parseFloat(jcb.longitude))?.toFixed(2)} km`)} style={{ marginTop: '10px', padding: '5px 10px', borderRadius: '5px', border: 'none', cursor: 'pointer', background: '#4CAF50', color: 'white' }}>
              Show Address and Distance
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JCBList;

