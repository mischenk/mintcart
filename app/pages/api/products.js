import { app, database } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, description, slug } = req.query;
    const db = collection(database, "products");

    try {
      addDoc(db, {
        name,
        description,
        slug,
      });

      return res.status(200).end();
    } catch (err) {
      console.log("Error: ", err);
      res.status(500).json({ statusCode: 500, message: err });
    }

    return res.end(`Post: ${pid}`);
  }
}
