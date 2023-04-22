import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import AppLayout from "../../components/AppLayout";
import clientPromise from "../../lib/mongodb";
import { getAppProps } from "../../utils/getAppProps";

const Post = (props) => {
  return (
    <div className="h-full overflow-auto">
      <div className="max-w-screen-sm mx-auto">
        <div className="post-section">SEO title and meta description</div>
        <div className="border border-stone-200 rounded-md p-4 my-2">
          <div className="text-blue-600 text-2xl font-bold">{props.title}</div>
          <div className="mt-2">{props.metaDescription}</div>
        </div>
        <div className="post-section">Keywords</div>
        <div className="flex flex-wrap gap-1 pt-2">
          {props.keywords.split(",").map((keyword, i) => (
            <div key={i} className="bg-slate-800 text-white rounded-full p-2">
              <FontAwesomeIcon icon={faHashtag} /> {keyword}
            </div>
          ))}
        </div>
        <div className="post-section">Blog post</div>
        <div dangerouslySetInnerHTML={{ __html: props.postContent || "" }} />
      </div>
    </div>
  );
};

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);

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
        ...props,
      },
    };
  },
});

export default Post;
