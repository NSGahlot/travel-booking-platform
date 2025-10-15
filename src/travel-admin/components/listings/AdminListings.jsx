import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../AdminNav";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

// Fixed image for all listings
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function AdminListings() {
  const [categories, setCategories] = useState([]);
  const [listings, setListings] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    address: "",
    category: "",
    description: "",
    available: true,
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get(`${DB_URL}/categories.json`);
    if (res.data) {
      const loaded = Object.entries(res.data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setCategories(loaded);
    }
  };

  // Fetch listings
  const fetchListings = async () => {
    const res = await axios.get(`${DB_URL}/listings.json`);
    if (res.data) {
      const loaded = Object.entries(res.data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setListings(loaded);
    } else setListings([]);
  };

  useEffect(() => {
    fetchCategories();
    fetchListings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category) return;

    const payload = { ...formData, image: FIXED_IMAGE_URL };

    if (editingId) {
      await axios.patch(`${DB_URL}/listings/${editingId}.json`, payload);
      setEditingId(null);
    } else {
      await axios.post(`${DB_URL}/listings.json`, payload);
    }

    setFormData({
      name: "",
      price: "",
      address: "",
      category: "",
      description: "",
      available: true,
    });

    fetchListings();
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setFormData({
      name: listing.name || "",
      price: listing.price || "",
      address: listing.address || "",
      category: listing.category || "",
      description: listing.description || "",
      available: listing.available ?? true,
    });
  };

  const handleDelete = async (id) => {
    await axios.delete(`${DB_URL}/listings/${id}.json`);
    fetchListings();
  };

  return (
    <div style={{ width: "600px", margin: "50px auto", textAlign: "center" }}>
      <AdminNav />
      <h2>Manage Listings</h2>

      <form onSubmit={handleAddOrUpdate} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Listing Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Price per night"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
        <br />
        <input
          type="text"
          placeholder="Address / City"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <br />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <br />
        <textarea
          placeholder="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <br />
        <label>
          Available:{" "}
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">
          {editingId ? "Update Listing" : "Add Listing"}
        </button>
      </form>

      <h3>All Listings</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {listings.map((l) => (
          <li
            key={l.id}
            style={{
              margin: "10px 0",
              border: "1px solid #ccc",
              padding: "10px",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            <strong>{l.name}</strong> - {l.category} - ₹{l.price}
            <br />
            <em>{l.address}</em>
            <p>{l.description}</p>
            <img
              src={l.image}
              alt={l.name}
              width="80"
              style={{ marginTop: "5px" }}
            />
            <br />
            <button
              style={{ marginRight: "10px" }}
              onClick={() => handleEdit(l)}
            >
              Edit
            </button>
            <button onClick={() => handleDelete(l.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminListings;
