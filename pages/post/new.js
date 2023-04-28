import { useState } from "react";
import { useRouter } from "next/router";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppLayout from "../../components/AppLayout";
import { getAppProps } from "../../utils/getAppProps";

const NewPost = (props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/generatePost`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ topic, keywords }),
      });

      const json = await response.json();

      if (json?.postId) {
        router.push(`/post/${json.postId}`);
      }
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-hidden">
      {loading ? (
        <div className="w-full h-full flex flex-col justify-center items-center text-green-500 animate-pulse">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6>Loading...</h6>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col overflow-auto">
          <form
            className="bg-slate-100 w-full max-w-screen-sm border border-slate-200 rounded-md p-4 m-auto shadow-slate-200 shadow-xl"
            onSubmit={handleSubmit}
          >
            <div>
              <label>
                <strong>Generate a blog post on the topic of:</strong>
              </label>
              <textarea
                value={topic}
                maxLength={80}
                className="w-full block border border-slate-500 my-2 px-4 py-2 rounded-sm resize-none"
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <label>
                <strong>Targeting the following keywords:</strong>
              </label>
              <textarea
                value={keywords}
                maxLength={80}
                className="w-full block border border-slate-500 my-2 px-4 py-2 rounded-sm resize-none"
                onChange={(e) => setKeywords(e.target.value)}
              />
              <small className="block mb-2">
                Separate keywords with a comma
              </small>
            </div>
            <button
              type="submit"
              className="btn"
              disabled={!topic.trim() || !keywords.trim()}
            >
              generate
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);

    if (!props.availableTokens) {
      return {
        redirect: {
          destination: "/token-topup",
          permanent: false,
        },
      };
    }

    return {
      props,
    };
  },
});

export default NewPost;
