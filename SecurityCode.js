import { db } from "./src/firebase.js";
import { collection, doc, setDoc } from "firebase/firestore";

const saveSecurityCode = async (code) => {
  const codeRef = doc(collection(db, "securityCodes"), "friendCode");
  await setDoc(codeRef, { code });
};

// セキュリティコードを保存
saveSecurityCode("123456").then(() => {
  console.log("セキュリティコードが保存されました！");
}).catch((error) => {
  console.error("セキュリティコードの保存中にエラーが発生しました: ", error);
});
