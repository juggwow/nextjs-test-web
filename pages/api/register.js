export default async function handler(req, res) {
    switch (req.method) {
      case "POST":
        const api_res = await fetch(process.env.NEXT_PUBLIC_HOST+"/register", {
          method: "POST",
          body: req.body,
        });
        if (api_res.status !== 200) {
          res.status(api_res.status).json(result);
          res.end();
        } else {
          res.status(200);
          res.end();
        }
        break;
      default:
        res.status(404);
        res.end();
    }
  }
  