import { collection, getDocs, query, where } from "firebase/firestore";
import { useLayoutEffect } from "react";

import { database } from "../../../../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "GET") {
    const { chainId, seller, slug } = req.query;
    const productsRef = collection(database, "products");
    const q = query(
      productsRef,
      where("chainId", "==", Number(chainId)),
      where("seller", "==", seller.toLowerCase()),
      where("slug", "==", slug.toLowerCase())
    );

    return getDocs(q)
      .then((data) => {
        if (!data.docs.length) {
          return res.status(404).json({ message: "Product not found" });
        }

        const product = data.docs[0].data();
        res.status(200).json({
          product,
        });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
