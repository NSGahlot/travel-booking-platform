// src/travel-user/components/listings/UserListings.jsx

import { useState, useEffect } from "react";
import axios from "axios";

function UserListings() {
  const [listings, setListings] = useState([]);

  const fetchListings = async () => {
    const res = await axios.get("https://your-firebase-url/listings.json");
    if (res.data) {
      const loaded = Object.entries(res.data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setListings(loaded);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <div style={{ width: "600px", margin: "50px auto", textAlign: "center" }}>
      <h2>All Listings</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {listings.map((l) => (
          <li key={l.id} style={{ margin: "10px 0" }}>
            <strong>{l.name}</strong> - {l.category} - ₹{l.price}
            <p>{l.address}</p>
            <p>{l.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserListings; // ✅ Make sure this line exists
