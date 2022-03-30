import { collection, getDocs, query, where } from "firebase/firestore";

import { database } from "../../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "GET") {
    const { seller, chainId } = req.query;
    const productsRef = collection(database, "products");
    const q = query(
      productsRef,
      where("chainId", "==", Number(chainId)),
      where("seller", "==", seller.toLowerCase())
    );

    return getDocs(q)
      .then((data) => {
        const products = data.docs.map((doc) => {
          const docData = doc.data();
          return {
            ...docData,
          };
        });
        res.status(200).json({
          products,
        });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
