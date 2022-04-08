import { doc, getDoc } from "firebase/firestore";

import { database } from "../../../../../firebaseConfig";

export default async function handler(req, res) {
  if (req.method == "GET") {
    const { productId, orderId } = req.query;
    const productRef = doc(database, "products", productId);
    const orderRef = doc(database, "products", productId, "orders", orderId);

    const productSnap = await getDoc(productRef).catch((e) =>
      res.status(500).json({ message: e.message })
    );

    if (!productSnap.exists()) {
      return res.status(400).json({ message: "Product not found" });
    }

    const product = productSnap.data();

    const orderSnap = await getDoc(orderRef).catch((e) =>
      res.status(500).json({ message: e.message })
    );

    if (!orderSnap.exists()) {
      return res.status(400).json({ message: "Order not found" });
    }

    const order = orderSnap.data();

    res.status(200).json({
      product,
      order,
    });
  }
}
