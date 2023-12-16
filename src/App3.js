import React from 'react';
import jcbData from './mumbaii.json'; // Adjust the path according to your project structure

const JCBList = () => {
  return (
    <div>
      <h1>JCB Listings</h1>
      <div>
        {Object.values(jcbData).map((jcb, index) => (
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

