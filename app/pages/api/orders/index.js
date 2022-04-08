import {
  doc,
  collection,
  getDoc,
  updateDoc,
  addDoc,
  increment,
} from "firebase/firestore";

import { database } from "../../../firebaseConfig";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { productId, amount } = req.body;

    const docRef = doc(database, "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(400).json({ message: "Product not found" });
    }

    const product = docSnap.data();
    if (product.sold + Number(amount) > product.supply) {
      return res.status(422).json({ message: "Insufficient product supply" });
    }

    await updateDoc(docRef, {
      sold: increment(amount),
    }).catch((e) => res.status(500).json({ message: e.message }));

    // Create order
    const ordersCol = collection(docRef, "orders");
    const orderDocRef = await addDoc(ordersCol, {
      ...req.body,
      created: new Date().toISOString(),
    }).catch((e) => res.status(500).json({ message: e.message }));

    return res.status(200).json({ orderId: orderDocRef.id });
  }
}
