// src/components/Signup.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [securityCode, setSecurityCode] = useState(""); // ユーザーが入力するセキュリティコード
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // セキュリティコードをFirestoreから取得し、チェックする
  const checkSecurityCode = async (inputCode) => {
    const codeRef = doc(db, "securityCodes", "friendCode"); // Firestore の 'friendCode' ドキュメントを取得
    const docSnap = await getDoc(codeRef);

    if (docSnap.exists()) {
      const storedCode = docSnap.data().code;
      return inputCode === storedCode; // 入力コードと保存されたコードが一致するかを確認
    } else {
      console.log("セキュリティコードが見つかりませんでした。");
      return false;
    }
  };

  // サインアップ処理
  const handleSignup = async (e) => {
    e.preventDefault();

    // セキュリティコードをチェック
    const isCodeValid = await checkSecurityCode(securityCode);
    if (!isCodeValid) {
      setError("無効なセキュリティコードです。");
      return;
    }

    try {
      // ユーザー作成
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Firebase Authenticationにユーザー名（displayName）を設定
      await updateProfile(user, { displayName: username });

      // Firestoreにユーザー情報を保存
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date(),
      });

      alert("サインアップが成功しました。ログインしてください。");
      navigate("/login");
    } catch (error) {
      setError("サインアップに失敗しました: " + error.message);
    }
  };

  return (
    <div>
      <h2>サインアップ</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="name">ユーザー名</label>
          <input
            type="text"
            id="name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="securityCode">セキュリティコード</label>
          <input
            type="password"
            id="securityCode"
            value={securityCode}
            onChange={(e) => setSecurityCode(e.target.value)}
            required
          />
        </div>
        <button type="submit">サインアップ</button>
      </form>
      {error && <p>{error}</p>}
      <p>
        すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link>
      </p>
    </div>
  );
};

export default Signup;
