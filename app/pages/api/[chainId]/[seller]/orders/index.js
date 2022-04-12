import {
  doc,
  collection,
  getDoc,
  getDocs,
  updateDoc,
  addDoc,
  increment,
  query,
  where,
} from "firebase/firestore";

import { database } from "../../../../../firebaseConfig";

export default async function handler(req, res) {
  const { chainId, seller } = req.query;

  if (req.method == "GET") {
    const ordersRef = collection(database, "orders");

    const q = query(
      ordersRef,
      where("chainId", "==", Number(chainId)),
      where("seller", "==", seller.toLowerCase())
    );

    return getDocs(q)
      .then((data) => {
        const orders = data.docs.map((doc) => {
          const docData = doc.data();
          return {
            ...docData,
          };
        });
        res.status(200).json({
          orders,
        });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
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
    const ordersCol = collection(database, "orders");
    const orderDocRef = await addDoc(ordersCol, {
      ...req.body,
      seller,
      chainId: Number(chainId),
      created: new Date().toISOString(),
    }).catch((e) => res.status(500).json({ message: e.message }));

    return res.status(200).json({ orderId: orderDocRef.id });
  }
}
