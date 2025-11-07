// src/travel-admin/components/categories/AdminCategories.jsx
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../../features/admin/categorySlice";
import "./AdminCategories.css";

function AdminCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categories.categories);

  const [newCat, setNewCat] = useState("");
  const [editingCat, setEditingCat] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // ✅ Add new category
  const handleAdd = () => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert("Category already exists!");
      return;
    }
    dispatch(addCategory(trimmed));
    setNewCat("");
  };

  // ✅ Update category
  const handleUpdate = () => {
    const trimmed = editingValue.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed) && trimmed !== editingCat) {
      alert("Category already exists!");
      return;
    }
    dispatch(updateCategory({ oldName: editingCat, newName: trimmed }));
    setEditingCat(null);
    setEditingValue("");
  };

  return (
    <div className="admin-categories-container">
      <h2 className="admin-categories-title">Admin Categories</h2>

      {/* Add New Category */}
      <div className="add-category-row">
        <input
          type="text"
          placeholder="New Category"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          className="category-input"
        />
        <button onClick={handleAdd} className="add-btn">
          Add
        </button>
      </div>

      {/* Category List */}
      <table className="category-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c}>
              <td>
                {editingCat === c ? (
                  <input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    className="edit-input"
                  />
                ) : (
                  c
                )}
              </td>
              <td>
                {editingCat === c ? (
                  <>
                    <button onClick={handleUpdate} className="save-btn">
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingCat(c);
                        setEditingValue(c);
                      }}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteCategory(c))}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminCategories;
