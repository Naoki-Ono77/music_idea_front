import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDocs, collection, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase"; // Firestoreインスタンスをインポート

const Home = () => {
  // ステートでカードデータを管理
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true); // データが読み込まれているかを管理

  useEffect(() => {
    const fetchData = async () => {
      try {
        // クエリを構築
        const q = query(
          collection(db, "updates"), // コレクションの取得
          orderBy("timestamp", "desc"), // createdAt順に並べ替え（最新のものから）
          limit(20) // 最大20件のみ取得
        );

        // クエリを使ってデータを取得
        const querySnapshot = await getDocs(q);

        // 取得したドキュメントを配列に変換
        const fetchedCards = querySnapshot.docs.map((doc) => ({
          id: doc.id, // ドキュメントID
          ...doc.data(), // ドキュメントデータ
        }));

        // ステートにデータを保存
        setCards(fetchedCards);
        setLoading(false); // データの読み込みが完了したらloadingをfalseに
      } catch (e) {
        console.error("Error getting documents: ", e);
        setLoading(false); // エラー時にもローディングを終了
      }
    };

    fetchData();
  }, []); // コンポーネントの初回レンダリング時のみ実行

  if (loading) {
    return <p>Loading...</p>; // データが読み込まれるまで「Loading...」を表示
  }

  return (
    <div>
      <h1>Home</h1>
      <p>更新内容</p>

      {/* 取得したデータを画面に表示 */}
      <ul>
        {cards.map((update) => (
          <li key={update.id}>
            <p>
              <strong><Link to={`${update.item}`}>{update.item}</Link></strong>:{update.name}によって「{update.title}」が
              {update.timestamp?.toDate().toLocaleString()}に{update.action}
              されました
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
