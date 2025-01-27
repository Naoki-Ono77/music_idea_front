import React, { useState } from "react";
import { FaEdit, FaTrashAlt, FaCommentDots } from "react-icons/fa";
import "./Card.css";

const Card = ({ card, categories, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title || ""); // タイトル状態を追加
  const [text, setText] = useState(card.text);
  const [category, setCategory] = useState(card.category);
  const [comment, setComment] = useState("");
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

  const saveChanges = () => {
    console.log({
      id: card.id,
      title,
      text,
      category,
      comments: [...card.comments],
    }); // 渡すオブジェクトを確認
    onUpdate({
      id: card.id,
      title,
      text,
      category,
      isFavorite: card.isFavorite,
      comments: [...card.comments],
    });
    setIsEditing(false);
  };

  const addComment = () => {
    if (comment.trim()) {
      onUpdate({
        ...card,
        comments: [...card.comments, comment],
      });
      setComment("");
    }
  };

  const deleteComment = (index) => {
    const updatedComments = card.comments.filter((_, i) => i !== index);
    onUpdate({
      ...card,
      comments: updatedComments,
    });
  };

  const startEditingComment = (index) => {
    setEditingCommentIndex(index);
    setEditingCommentText(card.comments[index]);
  };

  const saveEditedComment = () => {
    const updatedComments = card.comments.map((c, i) =>
      i === editingCommentIndex ? editingCommentText : c
    );
    onUpdate({
      ...card,
      comments: updatedComments,
    });
    setEditingCommentIndex(null);
    setEditingCommentText("");
  };

  const onToggleFavorite = () => {
    onUpdate({
      ...card,
      isFavorite: !card.isFavorite, // 親に状態を渡す
    });
  };

  return (
    <div className="card">
      {isEditing ? (
        <div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit title"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Edit text"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button onClick={saveChanges}>保存</button>
          <button onClick={() => setIsEditing(false)}>キャンセル</button>
        </div>
      ) : (
        <div>
          <div className="category">
            <p>{card.category}</p>
          </div>
          <h3>{card.title}</h3>
          <p className="card-text">{card.text}</p>
        </div>
      )}

      <div className="card-actions">
        <button onClick={() => setIsEditing(!isEditing)}>
          <FaEdit />
        </button>
        <button onClick={() => onDelete(card.id)}>
          <FaTrashAlt />
        </button>
        <button onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
          <FaCommentDots />
          {card.comments.length > 0 && (
            <span className="comments-count">{card.comments.length}</span>
          )}
        </button>
        <button onClick={onToggleFavorite}>
          {card.isFavorite ? "★" : "☆"}
        </button>
      </div>

      {isCommentsVisible && (
        <div className="comments-content">
          <h4>コメント</h4>
          {card.comments.map((c, index) => (
            <div key={index} className="comment-item">
              {editingCommentIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editingCommentText}
                    onChange={(e) => setEditingCommentText(e.target.value)}
                  />
                  <button onClick={saveEditedComment}>保存</button>
                  <button onClick={() => setEditingCommentIndex(null)}>
                    キャンセル
                  </button>
                </div>
              ) : (
                <div>
                  <p className="comment-text">{c}</p>
                  <button onClick={() => startEditingComment(index)}>
                    編集
                  </button>
                  <button onClick={() => deleteComment(index)}>削除</button>
                </div>
              )}
            </div>
          ))}
          <input
            type="text"
            placeholder="コメントを追加"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={addComment}>追加</button>
        </div>
      )}
    </div>
  );
};

export default Card;
