import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function NoteList() {
  const [notes, setNotes] = useState([]);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    // Firestoreからデータをリアルタイムで取得
    const unsubscribe = onSnapshot(collection(db, 'notes'), (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(notesData);
    });

    // クリーンアップ（コンポーネントがアンマウントされた時）
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    // Firestoreのドキュメントを削除
    await deleteDoc(doc(db, 'notes', id));
  };

  const startEditing = (id, currentText) => {
    setEditingNoteId(id);
    setEditText(currentText);
  };

  const handleEdit = async (id) => {
    if (editText.trim()) {
      // Firestoreのドキュメントを更新
      await updateDoc(doc(db, 'notes', id), { text: editText });
      setEditingNoteId(null); // 編集モード終了
      setEditText('');
    }
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setEditText('');
  };

  return (
    <div>
      <h2>議事録一覧</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {editingNoteId === note.id ? (
              <div>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="3"
                  cols="50"
                />
                <button onClick={() => handleEdit(note.id)}>保存</button>
                <button onClick={cancelEditing}>キャンセル</button>
              </div>
            ) : (
              <div>
                <p>{note.text}</p>
                <button onClick={() => startEditing(note.id, note.text)}>編集</button>
                <button onClick={() => handleDelete(note.id)}>削除</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NoteList;

