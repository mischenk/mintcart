import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "firebase/firestore/lite";

import { database } from "../../firebaseConfig";

export default function handler(req, res) {
  const urlCol = collection(database, "products");

  if (req.method == "GET") {
    const { contract, chain, seller } = req.query;
    return getDocs(
      query(
        urlCol,
        where("contract", "==", contract.toLowerCase()),
        where("chain", "==", Number(chain)),
        where("seller", "==", seller.toLowerCase())
      )
    )
      .then((products) => {
        res.status(200).json({
          products: products.docs.map((doc) => {
            const docData = doc.data();
            return {
              seller: docData["seller"],
              name: docData["name"],
              description: docData["description"],
              slug: docData["slug"],
            };
          }),
        });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  } else if (req.method == "POST") {
    const { contract, chain, seller, name, description, slug } = req.body;

    return addDoc(urlCol, {
      contract: contract.toLowerCase(),
      chain: Number(chain),
      seller: seller.toLowerCase(),
      name,
      description,
      slug,
    })
      .then(() => {
        res.status(200).json({ success: true });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
