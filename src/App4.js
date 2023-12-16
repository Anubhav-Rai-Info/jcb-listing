import React, { useState } from 'react';
import jcbData from './mumbaii.json'; // Adjust the path according to your project structure

const JCBList = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Function to handle search input changes
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter JCB data based on search term
  const filteredJCBData = Object.values(jcbData).filter(jcb =>
    jcb.name.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.address.toLowerCase().includes(searchTerm.toLowerCase())
    || jcb.area.toLowerCase().includes(searchTerm.toLowerCase())
    // Add more conditions here if you want to search in other fields
  );

  return (
    <div>
      <h1>JCB Listings</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ margin: '10px 0', padding: '5px' }}
      />
      <div>
        {filteredJCBData.map((jcb, index) => (
          <div key={index} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
            <h2>{jcb.name}</h2>
            <p><strong>Address:</strong> {jcb.address}, {jcb.area}, {jcb.city} - {jcb.pin}</p>
            <p><strong>Contact:</strong> {jcb.contact_number}</p>
            <p><strong>Rating:</strong> {jcb.rating}</p>
            {jcb.main_image && <img src={jcb.main_image} alt={jcb.name} style={{ maxWidth: '100%', height: 'auto' }} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JCBList;

