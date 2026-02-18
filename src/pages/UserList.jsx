import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "../services/userService";
import { showToast } from "../utils/toast";
import DeleteModal from "../components/DeleteModal";
import "./UserList.css";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 1,
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers(page, 10, search, statusFilter);
      let sortedData = [...result.data];

      // Apply sorting
      if (sortConfig.key) {
        sortedData.sort((a, b) => {
          let aVal = a[sortConfig.key];
          let bVal = b[sortConfig.key];

          // Handle different data types
          if (typeof aVal === "string") {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }

          if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
          if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      setUsers(sortedData);
      setPagination(result);
    } catch {
      showToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return "⇅";
    }
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, sortConfig]);

  const handleStatusToggle = async (userId) => {
    try {
      await userService.toggleUserStatus(userId);
      showToast("Status changed successfully!", "success");
      loadUsers();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleDeleteClick = (userId, userName) => {
    setDeleteModal({ isOpen: true, userId, userName });
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(deleteModal.userId);
      showToast("User deleted successfully", "success");
      setDeleteModal({ isOpen: false, userId: null, userName: "" });
      loadUsers();
    } catch {
      showToast("Failed to delete user", "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
  };

  const handleEdit = (userId) => {
    navigate(`/users/edit/${userId}`);
  };

  const handleAddNew = () => {
    navigate("/users/add");
  };

  return (
    <div className="user-list-container">
      <div className="user-list-header">
        <h1>Jobs Management</h1>
        <div className="user-list-header-actions">
          <div className="user-avatar">A</div>
          <button className="icon-button">🔔</button>
          <div className="percentage">86%</div>
          <button className="share-button">Share</button>
          <button className="add-button" onClick={handleAddNew}>
            + Add New User
          </button>
        </div>
      </div>

      <div className="user-list-filters">
        <div className="search-container">
          <span className="search-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="status-filter-wrapper">
          <label htmlFor="status-filter" className="status-filter-label">
            Status
          </label>
          <select
            id="status-filter"
            className={`status-filter ${statusFilter ? "has-value" : ""}`}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <div className="user-table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Name{" "}
                    <span className="sort-icon">{getSortIcon("name")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("email")}>
                    Email{" "}
                    <span className="sort-icon">{getSortIcon("email")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("phone")}>
                    Phone Number{" "}
                    <span className="sort-icon">{getSortIcon("phone")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("role")}>
                    Role{" "}
                    <span className="sort-icon">{getSortIcon("role")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("status")}>
                    Status{" "}
                    <span className="sort-icon">{getSortIcon("status")}</span>
                  </th>
                  <th className="sortable" onClick={() => handleSort("title")}>
                    Title{" "}
                    <span className="sort-icon">{getSortIcon("title")}</span>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{(page - 1) * 10 + index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className={`status-toggle ${user.status === "Active" ? "active" : "inactive"}`}
                        onClick={() => handleStatusToggle(user.id)}
                        aria-label={`Toggle status for ${user.name}`}
                      >
                        <span className="toggle-slider"></span>
                      </button>
                    </td>
                    <td>{user.title}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-button edit"
                          onClick={() => handleEdit(user.id)}
                          aria-label={`Edit ${user.name}`}
                          title="Edit"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                          </svg>
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDeleteClick(user.id, user.name)}
                          aria-label={`Delete ${user.name}`}
                          title="Delete"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-container">
            <div className="pagination-info">
              Showing {users.length > 0 ? (page - 1) * 10 + 1 : 0} to{" "}
              {Math.min(page * 10, pagination.total)} of {pagination.total}{" "}
              results
            </div>
            <div className="pagination-controls">
              <button
                className="pagination-button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                &lt;
              </button>
              {Array.from(
                { length: pagination.totalPages },
                (_, i) => i + 1,
              ).map((pageNum) => (
                <button
                  key={pageNum}
                  className={`pagination-button ${pageNum === page ? "active" : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}
              <button
                className="pagination-button"
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page === pagination.totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      )}

      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        userName={deleteModal.userName}
      />
    </div>
  );
}
