import { collection, getDocs, query, where } from "firebase/firestore";

import { database } from "../../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "GET") {
    const { seller, slug } = req.query;
    const productsRef = collection(database, "products");
    const q = query(
      productsRef,
      where("seller", "==", seller.toLowerCase()),
      where("slug", "==", slug.toLowerCase())
    );

    return getDocs(q)
      .then((data) => {
        const product = data.docs ? data.docs[0].data() : {};
        res.status(200).json({
          product,
        });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
