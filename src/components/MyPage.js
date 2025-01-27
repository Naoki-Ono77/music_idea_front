import React, { useState, useEffect } from "react";
import "./MyPage.css"
import { auth } from "../firebase";
import { getAuth, updateProfile } from "firebase/auth"; // 必要なメソッドをインポート

const MyPage = () => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("");

  // 編集開始時に保存されるユーザー名を保持
  const [originalUserName, setOriginalUserName] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
        setOriginalUserName(user.displayName || ""); // 編集前のユーザー名を保存
        setUserName(user.displayName || "");
      } else {
        console.error("ユーザーが認証されていません");
      }
    });
    return unsubscribe;
  }, []);

  const saveChanges = async () => {
    if (!userName.trim()) {
      alert("ユーザー名を入力してください");
      return;
    }

    if (!auth.currentUser) {
      alert("現在のユーザーが認証されていません");
      return;
    }

    try {
      const user = getAuth().currentUser; // ユーザーを取得

      // updateProfile を使用してユーザー名を更新
      await updateProfile(user, {
        displayName: userName,
      });

      // ユーザー情報を再取得して反映
      await user.reload();
      setCurrentUser(user);

      alert("ユーザー名が更新されました");
      setIsEditing(false);
    } catch (error) {
      console.error("ユーザー名の更新に失敗しました:", error.message);
      alert(`ユーザー名の更新に失敗しました: ${error.message}`);
    }
  };

  const cancelEditing = () => {
    setUserName(originalUserName); // 編集前の名前に戻す
    setIsEditing(false); // 編集モードを終了
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="新しいユーザー名"
          />
          <button onClick={saveChanges}>保存</button>
          <button onClick={cancelEditing}>キャンセル</button>
        </div>
      ) : (
        <div>
          <p>
            ユーザー名:{currentUser?.displayName || "ユーザー名が未設定です"}
            <button onClick={() => setIsEditing(!isEditing)}>編集</button>
          </p>
        </div>
      )}
    </div>
  );
};

export default MyPage;
