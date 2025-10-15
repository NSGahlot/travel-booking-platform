import { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../AdminNav";

const DB_URL =
  "https://travel-website-project-27e70-default-rtdb.firebaseio.com";

// Fixed image URL for all categories
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function AdminCategories() {
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Fetch categories from Firebase
  const fetchCategories = async () => {
    const res = await axios.get(`${DB_URL}/categories.json`);
    if (res.data) {
      const loaded = Object.entries(res.data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setCategories(loaded);
    } else setCategories([]);
  };

  // Add or Update category
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    if (editingId) {
      await axios.patch(`${DB_URL}/categories/${editingId}.json`, {
        name: categoryName,
        image: FIXED_IMAGE_URL,
      });
      setEditingId(null);
    } else {
      await axios.post(`${DB_URL}/categories.json`, {
        name: categoryName,
        image: FIXED_IMAGE_URL,
      });
    }

    setCategoryName("");
    fetchCategories();
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setCategoryName(cat.name);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${DB_URL}/categories/${id}.json`);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div style={{ width: "400px", margin: "50px auto", textAlign: "center" }}>
      <AdminNav />
      <h2>Manage Categories</h2>

      <form onSubmit={handleAddOrUpdate}>
        <input
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          required
        />
        <br />
        <button type="submit">
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      <h3 style={{ marginTop: "30px" }}>All Categories</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {categories.map((cat) => (
          <li key={cat.id} style={{ margin: "8px 0" }}>
            {cat.name}
            {cat.image && (
              <img
                src={cat.image}
                alt={cat.name}
                width="50"
                style={{ marginLeft: "10px", verticalAlign: "middle" }}
              />
            )}
            <button
              style={{ marginLeft: "10px" }}
              onClick={() => handleEdit(cat)}
            >
              Edit
            </button>
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => handleDelete(cat.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminCategories;
