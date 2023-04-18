import { useState } from "react";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../../components/AppLayout";

const NewPost = (props) => {
  const [postContent, setPostContent] = useState("");

  const handleClick = async () => {
    const response = await fetch(`/api/generatePost`, {
      method: "POST",
    });

    const json = await response.json();
    setPostContent(json.post.postContent);
  };

  return (
    <div>
      <h1>new post</h1>
      <button onClick={handleClick}>generate</button>
      <div
        className="max-width-screen-sm p-10"
        dangerouslySetInnerHTML={{ __html: postContent }}
      />
    </div>
  );
};

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});

export default NewPost;
