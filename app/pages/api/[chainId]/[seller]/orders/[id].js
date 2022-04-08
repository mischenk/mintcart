import {
  doc,
  collection,
  getDoc,
  updateDoc,
  addDoc,
  increment,
} from "firebase/firestore";

import { database } from "../../../../../firebaseConfig";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { chainId, id } = req.query;

    const orderRef = doc(database, "orders", id);

    const orderSnap = await getDoc(orderRef).catch((e) =>
      res.status(500).json({ message: e.message })
    );

    if (!orderSnap.exists()) {
      return res.status(400).json({ message: "Order not found" });
    }

    const order = orderSnap.data();

    res.status(200).json({
      order,
    });
  }
}
