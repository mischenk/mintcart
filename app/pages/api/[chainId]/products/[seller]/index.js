import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

import { database } from "../../../../../firebaseConfig";

export default function handler(req, res) {
  const { chainId, seller } = req.query;
  if (req.method == "GET") {
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
  if (req.method == "POST") {
    const { contract, name, description, slug, tokenUri, price, supply } =
      req.body;

    const urlCol = collection(database, "products");
    return addDoc(urlCol, {
      contract: contract.toLowerCase(),
      chainId: Number(chainId),
      seller: seller.toLowerCase(),
      name,
      description,
      slug,
      tokenUri,
      price: Number(price),
      supply: Number(supply),
      sold: 0,
    })
      .then(() => {
        res.status(200).json({ success: true });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
