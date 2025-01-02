import React, { useState, useContext, useEffect } from "react";
import "./Comment.css";
import { AuthContext } from "../../context/AuthContext";
import CommentCard from "../../components/CommentCard/CommentCard";
import { toast } from "react-toastify";

const CommentPage = () => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [point, setPoint] = useState(5);
  const [visibleComments, setVisibleComments] = useState(5);
  const [filterOption, setFilterOption] = useState("dateDesc");

  // State cho popup chỉnh sửa
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editPoint, setEditPoint] = useState(5);

  // Hàm lấy danh sách bình luận
  const fetchComments = async () => {
    try {
      const response = await fetch("http://localhost:3056/api/comment/list", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();

      if (data.comments) {
        let userComments = [];
        let otherComments = [];

        data.comments.forEach((comment) => {
          if (user && comment.customerId === user.id) {
            userComments.push(comment);
          } else {
            otherComments.push(comment);
          }
        });

        userComments.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        // Sắp xếp bình luận của người khác theo filterOption
        otherComments.sort((a, b) => {
          switch (filterOption) {
            case "rateAsc":
              return a.point - b.point;
            case "rateDesc":
              return b.point - a.point;
            case "dateAsc":
              return new Date(a.createdAt) - new Date(b.createdAt);
            case "dateDesc":
              return new Date(b.createdAt) - new Date(a.createdAt);
            default:
              return 0;
          }
        });

        // Kết hợp bình luận của người dùng ở đầu và các bình luận khác
        const sortedComments = [...userComments, ...otherComments];
        setComments(sortedComments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments. Please try again later.");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [isAuthenticated, filterOption, user]);

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  // Hàm thêm bình luận
  const handleAddComment = async () => {
    if (!user || !user.id) {
      toast.error("You must be logged in to add a comment.");
      return;
    }

    if (newComment.trim() === "") {
      toast.error("Comment cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3056/api/comment/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          point: point,
        }),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        fetchComments();
        setNewComment("");
        setPoint(5);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment. Please try again later.");
    }
  };

  // Hàm xóa bình luận
  const handleDeleteComment = async (id) => {
    try {
      const response = await fetch("http://localhost:3056/api/comment/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ commentId: id }),
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setComments(comments.filter((comment) => comment._id !== id));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment. Please try again later.");
    }
  };

  // Hàm chỉnh sửa bình luận
  const handleEditComment = (id, currentContent, currentPoint) => {
    setEditCommentId(id);
    setEditContent(currentContent);
    setEditPoint(currentPoint);
    setEditPopupVisible(true);
  };

  // Hàm xác nhận chỉnh sửa
  const handleConfirmEdit = async () => {
    try {
      const requestBody = {
        commentId: editCommentId,
        content: editContent,
        point: editPoint,
      };

      const response = await fetch("http://localhost:3056/api/comment/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });

      const data = await response.json();
      if (data.success) {
        fetchComments();
        toast.success(data.message);
        setEditPopupVisible(false);
      } else {
        toast.error(data.message || "Failed to edit comment.");
      }
    } catch (error) {
      console.error("Error editing comment:", error);
      toast.error("Failed to edit comment. Please try again later.");
    }
  };

  // Hàm load thêm bình luận
  const handleLoadMore = () => {
    setVisibleComments(visibleComments + 5);
  };

  return (
    <div className="comment-page">
      <h1>Bình luận của khách hàng</h1>

      {isAuthenticated ? (
        <div className="add-comment">
          <div className="rate-section">
            <label htmlFor="rate" className="rate-label">
              Đánh giá nhà hàng này:
            </label>
            <input
              id="rate"
              type="number"
              min="1"
              max="5"
              value={point}
              onChange={(e) => setPoint(Number(e.target.value))}
              inputMode="numeric"
              pattern="[1-5]"
              onKeyDown={(e) => e.preventDefault()}
            />
            <span className="star-icon">⭐</span>
          </div>
          <div className="content-button-section">
            <textarea
              className="comment-input"
              placeholder="Nhập bình luận của bạn..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button className="post-button" onClick={handleAddComment}>
              Đăng bình luận
            </button>
          </div>
        </div>
      ) : (
        <p class="login-message-comment">Vui lòng đăng nhập để gửi bình luận.</p>
      )}

      {/* Bộ lọc*/}
      <div className="sort-section">
        <label htmlFor="filterOption">Sắp xếp theo:</label>
        <select
          id="filterOption"
          value={filterOption}
          onChange={handleFilterChange}
        >
          <option value="rateDesc">Đánh giá: Cao đến thấp</option>
          <option value="rateAsc">Đánh giá: Thấp đến Cao</option>
          <option value="dateDesc">Ngày: Mới nhất Đầu tiên</option>
          <option value="dateAsc">Ngày: Cũ nhất Đầu tiên</option>
        </select>
      </div>

      <div className="comments-list">
        {comments.length > 0 ? (
          comments
            .slice(0, visibleComments)
            .map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                user={user}
                handleEditComment={() =>
                  handleEditComment(comment._id, comment.content, comment.point)
                }
                handleDeleteComment={handleDeleteComment}
              />
            ))
        ) : (
          <p>Không có bình luận nào.</p>
        )}
      </div>
      {comments.length > visibleComments && (
        <button className="load-more" onClick={handleLoadMore}>
          Tải thêm
        </button>
      )}

      {/* Popup chỉnh sửa */}
      {editPopupVisible && (
        <div className="edit-popup">
          <div className="edit-popup-content">
            <h2>Chỉnh sửa bình luận</h2>

            <div className="rate-section">
              <label>Đánh giá nhà hàng này:</label>
              <input
                type="number"
                min="1"
                max="5"
                value={editPoint}
                onChange={(e) => setEditPoint(Number(e.target.value))}
              />
              <span className="star-icon">★</span>
            </div>

            <div className="content-section">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Edit your comment..."
              />
            </div>

            <div className="edit-popup-buttons">
              <button className="confirm-btn" onClick={handleConfirmEdit}>
                Xác nhận
              </button>
              <button
                className="cancel-btn"
                onClick={() => setEditPopupVisible(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentPage;
