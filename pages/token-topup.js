import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import AppLayout from "../components/AppLayout";
import { getAppProps } from "../utils/getAppProps";

const TokenTopup = () => {
  const handleClick = async () => {
    await fetch(`/api/addTokens`, {
      method: "POST",
    });
  };

  return (
    <div>
      <p>token topup</p>
      <button className="btn" onClick={handleClick}>
        add tokens
      </button>
    </div>
  );
};

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(context) {
    const props = await getAppProps(context);
    return {
      props,
    };
  },
});

export default TokenTopup;
