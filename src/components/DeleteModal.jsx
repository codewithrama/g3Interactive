import "./DeleteModal.css";

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="delete-icon-container">
            <div className="delete-icon-circle">
              <span className="delete-exclamation">!</span>
            </div>
          </div>
          <p className="delete-question">Are you sure want to delete?</p>
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            NO, CANCEL
          </button>
          <button className="delete-button" onClick={onConfirm}>
            YES, DELETE
          </button>
        </div>
      </div>
    </div>
  );
}
