import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function CreateNote() {
  const [noteText, setNoteText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (noteText.trim()) {
      // Firestoreにデータを保存
      await addDoc(collection(db, 'notes'), {
        text: noteText,
        timestamp: new Date(),
      });
      setNoteText('');
    }
  };

  return (
    <div>
      <h2>新しい議事録</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="議事録を入力..."
          rows="4"
          cols="50"
        />
        <button type="submit">保存</button>
      </form>
    </div>
  );
}

export default CreateNote;
