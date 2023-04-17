import AppLayout from "../../components/AppLayout";

const NewPost = (props) => {
  console.log("new post props", props);
  return (
    <div>
      <h1>new post</h1>
    </div>
  );
};

NewPost.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export default NewPost;
