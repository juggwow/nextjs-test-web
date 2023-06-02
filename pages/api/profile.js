export default async function handler(req, res) {
  switch (req.method) {
    case "POST":
      const body = JSON.parse(req.body);
      const options = {
        fname: body.fname,
        lname: body.lname,
        role: body.role,
        company: body.company,
        mobile: body.mobile,
        class_id: parseInt(body.classId),
      };
      // if (body.role !== "STUDENT" || body.role !== "TRAINER") {
      //   res.status(400).json({ massage: "Not exist this role" });
      // }
      const api_res = await fetch(
        process.env.NEXT_PUBLIC_HOST+"/" + body.role.toLowerCase() + "profile",
        {
          method: "POST",
          body: JSON.stringify(options),
          headers: {
            Authorization: "Baerer " + body.token,
          },
        }
      );
      if (api_res.status !== 200) {
        const result = await api_res.json();
        res.status(api_res.status).json(result);
        res.end();
      } else {
        res.status(200).json({ message: "success" });
        res.end();
      }
      break;
    case "GET":
      const pro_res = await fetch(process.env.NEXT_PUBLIC_HOST+"/profile", {
        method: "POST",
        headers: {
          Authorization: "Baerer " + body.token,
        },
      });
      const profile = await api_res.json();
      res.status(pro_res.status).json(profile);
      res.end();
      break;
    default:
      res.status(404);
      res.end();
  }
}
