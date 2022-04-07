import { doc, collection, addDoc } from "firebase/firestore";

import { database } from "../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "POST") {
    const { productId } = req.body;
    const ordersCol = collection(database, "products", productId, "orders");
    //const ordersCol = collection(productDoc, "orders");

    return addDoc(ordersCol, {
      ...req.body,
      created: new Date().toISOString(),
    })
      .then(() => {
        res.status(200).json({ success: true });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
