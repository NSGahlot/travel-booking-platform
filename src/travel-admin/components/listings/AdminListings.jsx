import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  setListings,
  addListing,
  deleteListing,
  updateListing,
} from "../../../features/admin/listingSlice";
import { setCategories } from "../../../features/admin/categorySlice";
import "./AdminListings.css";

const DB_URL = "https://travel-app-2d78a-default-rtdb.firebaseio.com";
const FIXED_IMAGE_URL =
  "https://static2.tripoto.com/media/filter/nl/img/2025875/TripDocument/1601531054_these_traveling_tips_helps_me_having_hassle_free_journey.jpg";

function AdminListings() {
  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings.listings || []);
  const categories = useSelector((state) => state.categories.categories || []);

  const [newListing, setNewListing] = useState({
    name: "",
    price: "",
    address: "",
    description: "",
    category: "",
    image: "",
    available: true,
  });
  const [editingId, setEditingId] = useState(null);

  const fetchListings = useCallback(async () => {
    try {
      const res = await axios.get(`${DB_URL}/listings.json`);
      if (res.data) {
        const loaded = Object.entries(res.data).map(([id, value]) => ({
          id,
          ...value,
        }));
        dispatch(setListings(loaded));
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchListings();

    if (categories.length === 0) {
      dispatch(setCategories(["Villa", "Apartment", "Houseboat"]));
    }
  }, [fetchListings, categories.length, dispatch]);

  const handleAddOrUpdate = async () => {
    if (
      !newListing.name ||
      !newListing.price ||
      !newListing.address ||
      !newListing.category
    ) {
      alert("Name, Price, Address and Category are required.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${DB_URL}/listings/${editingId}.json`, newListing);
        dispatch(updateListing({ id: editingId, ...newListing }));
        setEditingId(null);
      } else {
        const res = await axios.post(`${DB_URL}/listings.json`, newListing);
        dispatch(addListing({ id: res.data.name, ...newListing }));
      }

      setNewListing({
        name: "",
        price: "",
        address: "",
        description: "",
        category: "",
        image: "",
        available: true,
      });
    } catch (err) {
      console.error("Error saving listing:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${DB_URL}/listings/${id}.json`);
      dispatch(deleteListing(id));
    } catch (err) {
      console.error("Error deleting listing:", err);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setNewListing({ ...listing });
  };

  return (
    <div className="admin-listings-container">
      <h2 className="admin-title">Admin Listings</h2>

      {/* Add/Edit Form */}
      <div className="form-card">
        <input
          type="text"
          placeholder="Name"
          value={newListing.name}
          onChange={(e) =>
            setNewListing({ ...newListing, name: e.target.value })
          }
          className="form-input"
        />
        <input
          type="number"
          placeholder="Price"
          value={newListing.price}
          onChange={(e) =>
            setNewListing({ ...newListing, price: Number(e.target.value) })
          }
          className="form-input"
        />
        <input
          type="text"
          placeholder="Address"
          value={newListing.address}
          onChange={(e) =>
            setNewListing({ ...newListing, address: e.target.value })
          }
          className="form-input"
        />
        <select
          value={newListing.category}
          onChange={(e) =>
            setNewListing({ ...newListing, category: e.target.value })
          }
          className="form-input"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Description"
          value={newListing.description}
          onChange={(e) =>
            setNewListing({ ...newListing, description: e.target.value })
          }
          className="form-input"
        />
        {/* <input
          type="text"
          placeholder="Image URL"
          value={newListing.image}
          onChange={(e) =>
            setNewListing({ ...newListing, image: e.target.value })
          }
          className="form-input"
        /> */}

        {/* Availability Checkbox */}
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={newListing.available}
            onChange={(e) =>
              setNewListing({ ...newListing, available: e.target.checked })
            }
          />
          Available
        </label>

        <button onClick={handleAddOrUpdate} className="primary-btn">
          {editingId ? "Update Listing" : "Add Listing"}
        </button>
      </div>

      {/* Listings Table */}
      <table className="listings-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Address</th>
            <th>Description</th>
            <th>Image</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.id} className="row-center">
              <td>{l.name}</td>
              <td>{l.category}</td>
              <td>₹{l.price}</td>
              <td>{l.address}</td>
              <td className="desc-cell">{l.description}</td>
              <td>
                <img src={l.image || FIXED_IMAGE_URL} alt={l.name} />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={l.available}
                  onChange={async (e) => {
                    const updatedListing = {
                      ...l,
                      available: e.target.checked,
                    };
                    await axios.put(
                      `${DB_URL}/listings/${l.id}.json`,
                      updatedListing
                    );
                    dispatch(updateListing(updatedListing));
                  }}
                />
              </td>
              <td>
                <button onClick={() => handleEdit(l)} className="edit-btn">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(l.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminListings;
