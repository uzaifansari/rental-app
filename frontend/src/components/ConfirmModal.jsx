import React, { useEffect } from "react";
import "./ConfirmModal.css";

const ConfirmModal = ({ isOpen, title, message, confirmText = "Confirm", cancelText = "Cancel", onConfirm, onCancel, danger = true }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onCancel(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onCancel]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">{danger ? "⚠️" : "✦"}</div>
        <h3 className="modal-title">{title}</h3>
        <p className="modal-message">{message}</p>
        <div className="modal-actions">
          <button className="modal-btn-cancel" onClick={onCancel}>{cancelText}</button>
          <button className={`modal-btn-confirm ${danger ? "danger" : "accent"}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;