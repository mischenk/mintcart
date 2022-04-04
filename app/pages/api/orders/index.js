import { collection, addDoc } from "firebase/firestore";

import { database } from "../../../firebaseConfig";

export default function handler(req, res) {
  if (req.method == "POST") {
    const urlCol = collection(database, "orders");
    return addDoc(urlCol, {
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
