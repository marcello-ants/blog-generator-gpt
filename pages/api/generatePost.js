import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";

const handler = async (req, res) => {
  const { user } = await getSession(req, res);

  const client = await clientPromise;
  const db = client.db("blogify-ai");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    res.status(403);
    return;
  }

  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(config);

  const { topic, keywords } = req.body;

  if (!topic || !keywords) {
    res.status(422);
    return;
  }

  if (topic.length > 80 || keywords.length > 80) {
    res.status(422);
    return;
  }

  const prompt = `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
  The response should be formatted in SEO-friendly HTML, limited to the following HTML tags: h1, h2, h3, h4, h5, h6, p, i, strong, ol, ul, li.`;

  const postContentResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
  });

  const postContent = postContentResult.data.choices[0]?.message.content;

  const titleResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: "Generate appropriate title tag text for the above blog post",
      },
    ],
    temperature: 0,
  });

  const metaDescriptionResult = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a blog post generator.",
      },
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
    temperature: 0,
  });

  const title = titleResult.data.choices[0]?.message.content;
  const metaDescription =
    metaDescriptionResult.data.choices[0]?.message.content;

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1,
      },
    }
  );

  const post = await db.collection("posts").insertOne({
    postContent: postContent || "",
    title: title || "",
    metaDescription: metaDescription || "",
    topic,
    keywords,
    userId: userProfile._id,
    created: new Date(),
  });

  res.status(200).json({
    postId: post.insertedId,
  });
};

export default withApiAuthRequired(handler);
