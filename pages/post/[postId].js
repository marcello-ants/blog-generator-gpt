import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import AppLayout from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";

const Post = (props) => {
  console.log("props", props);

  return (
    <div>
      <p>post</p>
    </div>
  );
};

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    // const props = await getAppProps(context);
    const userSession = await getSession(context.req, context.res);
    const client = await clientPromise;
    const db = client.db("blogify-ai");

    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(context.params.postId),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }

    return {
      props: {
        id: context.params.postId,
        postContent: post.postContent,
        title: post.title,
        metaDescription: post.metaDescription,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        // ...props,
      },
    };
  },
});

export default Post;
