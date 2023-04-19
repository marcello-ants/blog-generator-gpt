import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

const handler = async (req, res) => {
  const { user } = await getSession(req, res);

  const client = await clientPromise;
  const db = client.db("blogify-ai");

  const userProfile = await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: 10,
      },
      $setOnInsert: {
        auth0Id: user.sub,
      },
    },
    {
      upsert: true,
    }
  );

  res.status(200).json({ name: "John Doe" });
};

export default handler;
