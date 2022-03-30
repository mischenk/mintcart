import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

import { database } from "../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "POST") {
    const urlCol = collection(database, "products");
    const {
      contract,
      chainId,
      seller,
      name,
      description,
      slug,
      tokenUri,
      price,
      supply,
    } = req.body;

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
    })
      .then(() => {
        res.status(200).json({ success: true });
      })
      .catch((e) => {
        res.status(500).json({ message: e.message });
      });
  }
}
