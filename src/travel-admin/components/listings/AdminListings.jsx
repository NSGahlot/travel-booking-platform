import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { getListings } from "../../../services/listingService";

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
  const adminToken = useSelector((state) => state.admin.token);

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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const authQuery = adminToken ? `?auth=${adminToken}` : "";

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getListings();

      if (data) {
        const loaded = Object.entries(data).map(([id, value]) => ({
          id,
          ...value,
        }));

        dispatch(setListings(loaded));
      } else {
        dispatch(setListings([]));
      }
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("We couldn't load listings right now. Please try again.");
      dispatch(setListings([]));
    } finally {
      setIsLoading(false);
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
      setError("Please complete the required fields before saving.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (editingId) {
        await axios.put(
          `${DB_URL}/listings/${editingId}.json${authQuery}`,
          newListing,
        );
        dispatch(updateListing({ id: editingId, ...newListing }));
        setEditingId(null);
      } else {
        const payload = { ...newListing, createdAt: Date.now() };
        const res = await axios.post(
          `${DB_URL}/listings.json${authQuery}`,
          payload,
        );
        dispatch(addListing({ id: res.data.name, ...payload }));
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
      setError("We couldn't save this listing. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setError("");

    try {
      await axios.delete(`${DB_URL}/listings/${id}.json${authQuery}`);
      dispatch(deleteListing(id));
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError("We couldn't delete this listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (listing) => {
    setEditingId(listing.id);
    setNewListing({ ...listing });
  };

  return (
    <div className="admin-listings-container">
      <h2 className="admin-title">Admin Listings</h2>
      {error && <p className="no-listings">{error}</p>}
      {/* Add/Edit Form */}
      <div className="form-card">
        <label className="sr-only" htmlFor="listing-name">
          Name
        </label>
        <input
          id="listing-name"
          name="name"
          type="text"
          placeholder="Name"
          value={newListing.name}
          onChange={(e) =>
            setNewListing({ ...newListing, name: e.target.value })
          }
          className="form-input"
        />
        <label className="sr-only" htmlFor="listing-price">
          Price
        </label>
        <input
          id="listing-price"
          name="price"
          type="number"
          placeholder="Price"
          value={newListing.price}
          onChange={(e) =>
            setNewListing({ ...newListing, price: Number(e.target.value) })
          }
          className="form-input"
        />
        <label className="sr-only" htmlFor="listing-address">
          Address
        </label>
        <input
          id="listing-address"
          name="address"
          type="text"
          placeholder="Address"
          value={newListing.address}
          onChange={(e) =>
            setNewListing({ ...newListing, address: e.target.value })
          }
          className="form-input"
        />
        <label className="sr-only" htmlFor="listing-category">
          Category
        </label>
        <select
          id="listing-category"
          name="category"
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
        <label className="sr-only" htmlFor="listing-description">
          Description
        </label>
        <textarea
          id="listing-description"
          name="description"
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
        <label className="checkbox-row" htmlFor="listing-available">
          <input
            id="listing-available"
            name="available"
            type="checkbox"
            checked={newListing.available}
            onChange={(e) =>
              setNewListing({ ...newListing, available: e.target.checked })
            }
          />
          Available
        </label>

        <button
          onClick={handleAddOrUpdate}
          className="primary-btn"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : editingId
              ? "Update Listing"
              : "Add Listing"}
        </button>
      </div>

      {/* Listings Table */}
      {isLoading ? (
        <p className="no-listings">Loading listings...</p>
      ) : listings.length === 0 ? (
        <p className="no-listings">
          No listings yet. Add your first stay to get started.
        </p>
      ) : (
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
                        `${DB_URL}/listings/${l.id}.json${authQuery}`,
                        updatedListing,
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
                    disabled={deletingId === l.id}
                  >
                    {deletingId === l.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminListings;
