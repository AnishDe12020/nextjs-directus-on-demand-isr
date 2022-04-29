import directus from "../../lib/directus";

const handler = async (req, res) => {
  const { collection } = req.body;
  const headers = req.headers;

  if (!headers["x-webhook-secret"]) {
    return res.status(403).send("Forbidden");
  }

  const receivedSecret = headers["x-webhook-secret"];

  const secret = process.env.REVALIDATE_SECRET;

  if (receivedSecret !== secret) {
    return res.status(403).send("Forbidden");
  }

  if (collection === "blog") {
    const { keys } = req.body;

    for (const key of keys) {
      const directusRes = await directus
        .items(collection)
        .readOne(key, { fields: ["slug"] });

      await res.unstable_revalidate(`/${directusRes.slug}`);
      await res.unstable_revalidate("/");
    }
  }

  return res.status(200).send("Success");
};

export default handler;
