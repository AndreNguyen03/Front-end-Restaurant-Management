import React from "react";
import { FaStar, FaEdit, FaTrash } from "react-icons/fa";
import profile_icon from "../../assets/frontend_assets/profile_icon.png";
import "./CommentCard.css";

const CommentCard = ({
  comment,
  user,
  handleEditComment,
  handleDeleteComment,
}) => {
  return (
    <div className="comment-card">
      <div className="comment-header">
        <div className="comment-profile">
          <img src={profile_icon} alt="Profile" className="comment-avatar" />
          <div className="comment-id">ID: {comment.customerId}</div>
        </div>
        <div className="comment-meta">
          <span className="comment-date">
            {new Date(comment.createdAt).toLocaleString()}
            {comment.isEdited && (
              <span className="edited">
                {" "}
                (edited at {new Date(comment.updatedAt).toLocaleString()})
              </span>
            )}
          </span>
        </div>
      </div>

      <div className="comment-rating">
        <span className="comment-point">
          {comment.point} <FaStar className="star-icon" />
        </span>
      </div>

      <div className="comment-content">
        <p>{comment.content}</p>
      </div>

      {user?.id === comment.customerId && (
        <div className="comment-actions">
          <FaEdit
            className="action-icon edit-icon"
            onClick={() => handleEditComment(comment._id)}
          />
          <FaTrash
            className="action-icon delete-icon"
            onClick={() => handleDeleteComment(comment._id)}
          />
        </div>
      )}
    </div>
  );
};

export default CommentCard;
