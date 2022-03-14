import { spotifyApi } from "../../spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../utils/cookies";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  spotifyApi.authorizationCodeGrant(code as string).then(
    (data) => {
      spotifyApi.setAccessToken(data.body["access_token"]);
      spotifyApi.setRefreshToken(data.body["refresh_token"]);
      setCookie(res, "access_token", data.body["access_token"], {
        httpOnly: true,
        secure: true,
        path: "/",
      });
      res.status(200).redirect("/");
    },
    (err) => {
      console.log("Something went wrong!", err);
    }
  );
};

export default callback;
