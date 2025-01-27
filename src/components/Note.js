import React, { useState, useEffect } from "react";
import "./Note.css";
import NoteList from "./NoteList";
import CreateNote from "./CreateNote";
import { db } from "../firebase"; // Firestore関連の関数をインポート
import { collection, addDoc, onSnapshot } from "firebase/firestore";

function Note() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Firestoreからデータをリアルタイムで取得
    const unsubscribe = onSnapshot(collection(db, "notes"), (snapshot) => {
      const notesData = snapshot.docs.map((doc) => ({
        id: doc.id, // ドキュメントID
        ...doc.data(), // ドキュメントの内容
      }));
      setNotes(notesData);
    });

    // クリーンアップ（コンポーネントがアンマウントされた時）
    return () => unsubscribe();
  }, []);

  const addNote = async (noteText) => {
    if (!noteText.trim()) return;

    // Firestoreに新しい議事録を追加
    await addDoc(collection(db, "notes"), {
      text: noteText,
      timestamp: new Date(),
    });
  };

  return (
    <div className="Note">
      <h1>ノート</h1>
      <CreateNote addNote={addNote} />
      <NoteList notes={notes} />
    </div>
  );
}

export default Note;
