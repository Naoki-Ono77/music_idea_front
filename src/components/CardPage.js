import React, { useState, useEffect } from "react";
import Card from "./Card";
import Error from "./Error"; // エラー表示コンポーネント
import "./Idea.css";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db, auth } from "../firebase";

const CardPage = ({PageName}) => {
  const [cards, setCards] = useState([]);
  const [newCardText, setNewCardText] = useState("");
  const [newCardCategory, setNewCardCategory] = useState("General");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [error, setError] = useState("");
  const [newCardTitle, setNewCardTitle] = useState("");

  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Firestoreからカードを取得
        const cardQuerySnapshot = await getDocs(
          query(collection(db, `cardsfor${PageName}`), orderBy("isFavorite", "desc"), orderBy("createdAt", "asc"))
        );
        const fetchedCards = cardQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCards(fetchedCards);

        // Firestoreからカテゴリを取得
        const categoryQuerySnapshot = await getDocs(
          collection(db, `categoriesfor${PageName}`)
        );
        const fetchedCategories = categoryQuerySnapshot.docs.map(
          (doc) => doc.data().name
        );
        setCategories(["General", ...fetchedCategories]);
      } catch (e) {
        console.error("Error fetching data from Firestore: ", e);
        setError("データの取得中にエラーが発生しました。");
      }
    };

    fetchInitialData();
  }, [PageName]);

  const saveCategoryToFirestore = async (category) => {
    try {
      await addDoc(collection(db, `categoriesfor${PageName}`), { name: category });
      console.log(`Category "${category}" saved to Firestore.`);
    } catch (e) {
      console.error("Error adding category to Firestore: ", e);
      throw e;
    }
  };

  const addCard = async () => {
    if (!newCardTitle.trim()) {
      setError("タイトルを入力してください。");
      return;
    }
    const newCard = {
      text: newCardText,
      title: newCardTitle,
      category: newCardCategory,
      isFavorite: false,
      comments: [],
      createdAt: new Date(),
    };

    try {
      const docRef = await addDoc(collection(db, `cardsfor${PageName}`), newCard);
      newCard.id = docRef.id;
      // "update" コレクションに履歴を追加
      const updatesDoc = {
        name: `${currentUser.displayName}`,
        item: `${PageName}`,
        title: newCardTitle,
        action: "追加",
        timestamp: new Date(),
      };

      // "update" コレクションに新しいドキュメントを追加
      await addDoc(collection(db, "updates"), updatesDoc);
      setCards([...cards, newCard]);
      setNewCardTitle("");
      setNewCardText("");
      setNewCardCategory("General");
    } catch (e) {
      console.error("Error adding card to Firestore: ", e);
      setError("カードの追加中にエラーが発生しました。");
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() !== "" && !categories.includes(newCategory)) {
      try {
        await saveCategoryToFirestore(newCategory);
        setCategories([...categories, newCategory]);
        setNewCategory("");
      } catch (e) {
        setError("カテゴリーの保存中にエラーが発生しました。");
      }
    }
  };

  const deleteCategoryFromFirestore = async (categoryToDelete) => {
    try {
      const categoryQuerySnapshot = await getDocs(
        collection(db, `categoriesfor${PageName}`)
      );
  
      // 指定されたカテゴリに一致するドキュメントを検索
      const categoryDoc = categoryQuerySnapshot.docs.find(
        (doc) => doc.data().name === categoryToDelete
      );
  
      if (categoryDoc) {
        // 一致したドキュメントを削除
        await deleteDoc(doc(db, `categoriesfor${PageName}`, categoryDoc.id));
        console.log(`Category "${categoryToDelete}" deleted from Firestore.`);
      } else {
        console.warn(`Category "${categoryToDelete}" not found in Firestore.`);
      }
    } catch (e) {
      console.error("Error deleting category from Firestore: ", e);
      throw e;
    }
  };
  
  const deleteCategory = async (categoryToDelete) => {
    const isCategoryUsed = cards.some(
      (card) => card.category === categoryToDelete
    );
  
    if (isCategoryUsed) {
      setError(
        `Cannot delete category "${categoryToDelete}" because it is in use.`
      );
      return;
    }
  
    try {
      // Firestoreからカテゴリを削除
      await deleteCategoryFromFirestore(categoryToDelete);
  
      // 状態からカテゴリを削除
      setCategories(
        categories.filter((category) => category !== categoryToDelete)
      );
  
      setError("");
    } catch (e) {
      setError("カテゴリーの削除中にエラーが発生しました。");
    }
  };
  

  const updateCardInFirestore = async (id, updatedCard) => {
    try {
      const cardRef = doc(db, `cardsfor${PageName}`, id);
      await updateDoc(cardRef, updatedCard);
      // "update" コレクションに履歴を追加
      const updatesDoc = {
        name: `${currentUser.displayName}`,
        item: `${PageName}`,
        title: updatedCard.title,
        action: "更新",
        timestamp: new Date(),
      };

      // "update" コレクションに新しいドキュメントを追加
      await addDoc(collection(db, "updates"), updatesDoc);
    } catch (e) {
      console.error("Error updating Firestore document: ", e);
    }
  };

  const deleteCardInfirestore = async (id) => {
    try {
      const cardRef = doc(db, `cardsfor${PageName}`, id);
      await deleteDoc(cardRef);
    } catch (e) {
      console.error("Error updating Firestore document: ", e);
    }
  };

  const updateCard = (id, updatedCard) => {
    setCards(cards.map((card) => (card.id === id ? updatedCard : card)));
    updateCardInFirestore(id, updatedCard);
  };

  const deleteCard = (id) => {
    setCards(cards.filter((card) => card.id !== id));
    deleteCardInfirestore(id);
  };

  const filteredCards =
    selectedCategory === "All"
      ? cards
      : cards.filter((card) => card.category === selectedCategory);

  return (
    <div className="Idea">
      {error && <Error message={error} onClose={() => setError("")} />}
      <div className="container">
        <div className="editarea">
          <input
            type="text"
            placeholder="タイトルを入力"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
          />
          <textarea
            placeholder="ここに入力"
            value={newCardText}
            onChange={(e) => setNewCardText(e.target.value)}
          />
          <select
            value={newCardCategory}
            onChange={(e) => setNewCardCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <button onClick={addCard}>追加</button>

          <div className="add-category">
            <label htmlFor="add-category">カテゴリーを追加</label>
            <input
              type="text"
              placeholder="カテゴリ名を入力"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button onClick={addCategory}>決定</button>
          </div>

          <div className="delete-category">
            <label htmlFor="delete-category">カテゴリーを削除</label>
            <select
              id="delete-category"
              onChange={(e) => deleteCategory(e.target.value)}
            >
              <option value="">カテゴリーを選択</option>
              {categories
                .filter((category) => category !== "General")
                .map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>

          <div className="filter-category">
            <label htmlFor="filter-category">表示するカテゴリーを選択</label>
            <select
              id="filter-category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">全て</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="card-container">
        {filteredCards.map((card) => (
          <Card
            key={card.id}
            card={card}
            categories={categories}
            onUpdate={(updatedCard) => {
              updateCard(card.id, updatedCard);
            }}
            onDelete={deleteCard}
          />
        ))}
      </div>
    </div>
  );
};

export default CardPage;
