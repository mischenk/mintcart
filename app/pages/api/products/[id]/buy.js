import { increment, doc, getDoc, updateDoc } from "firebase/firestore";

import { database } from "../../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "PUT") {
    const { id } = req.query;
    const { amount } = req.body;

    const docRef = doc(database, "products", id);
    getDoc(docRef).then((docSnap) => {
      if (!docSnap.exists()) {
        return res.status(404).json({ message: "Product not found" });
      }

      const product = docSnap.data();
      if (product.sold + Number(amount) > product.supply) {
        return res.status(422).json({ message: "Insufficient product supply" });
      }

      return updateDoc(docRef, {
        sold: increment(amount),
      })
        .then(() => {
          res.status(200).json({ success: true });
        })
        .catch((e) => {
          res.status(500).json({ message: e.message });
        });
    });
  }
}
