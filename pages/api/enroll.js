export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const body = JSON.parse(req.body);
      const options = {
        class_id: parseInt(body.classId),
      };
      const api_res = await fetch(process.env.NEXT_PUBLIC_HOST+"/enrollments", {
        method: "POST",
        body: JSON.stringify(options),
        headers: {
          Authorization: "Baerer " + body.token,
        },
      });
      if (api_res.status !== 200) {
        const result = await api_res.json();
        res.status(api_res.status).json(result);
        res.end();
      } else {
        res.status(200).json({ message: "success" });
        res.end();
      }
      break;
    default:
      res.status(404);
      res.end();
  }
}
