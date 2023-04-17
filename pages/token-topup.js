import { withPageAuthRequired } from "@auth0/nextjs-auth0";

const TokenTopup = () => {
  return (
    <div>
      <p>token topup</p>
    </div>
  );
};

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {},
  };
});

export default TokenTopup;
