import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const Post = () => {
  return (
    <div>
      <p>post</p>
    </div>
  );
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});

export default Post;
