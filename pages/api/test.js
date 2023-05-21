import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db("sample_supplies");
  switch (req.method) {
    case "POST":
      let bodyObject = req.body;
      let myPost = await db.collection("posts").insertOne(bodyObject);
      res.json(myPost);
      break;
    case "GET":
      const allPosts = await db.collection("sales").findOne({});
      res.json({ status: 200, data: allPosts });
      break;
  }
}
