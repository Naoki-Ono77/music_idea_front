// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// AuthContextの作成
const AuthContext = createContext();

// AuthProvider: 認証情報をアプリ全体に提供するコンポーネント
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // ログインしているユーザー情報
  const [loading, setLoading] = useState(true); // 初期ロード状態

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe(); // クリーンアップ
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// useAuth: コンテキストを簡単に使うためのカスタムフック
export const useAuth = () => useContext(AuthContext);
