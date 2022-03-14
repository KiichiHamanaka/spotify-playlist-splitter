import type { GetServerSideProps } from "next";
import styles from "../styles/Home.module.css";
import { convertPlaylists, spotifyApi } from "../spotify";

type Props = {
  data?: string;
};

const getSong: React.VFC<Props> = ({ data }) => {
  return <div className={styles.container}>{data}</div>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const name: string = (context.query.name as string) || "MyFavorites";
  if (context.req.cookies["access_token"]) {
    spotifyApi.setAccessToken(context.req.cookies["access_token"]);
    await convertPlaylists(name);
    return {
      props: {
        data: "finish",
      },
    };
  } else {
    return {
      props: {
        data: "notSignin",
      },
    };
  }
};

export default getSong;
