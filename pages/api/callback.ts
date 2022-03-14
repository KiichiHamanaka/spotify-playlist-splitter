import { spotifyApi } from "../../spotify";
import { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "../../utils/cookies";

const callback = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;
  const refreshableUserTokensResponse =
    await spotifyApi.getRefreshableUserTokens(code as string);
  spotifyApi.setAccessToken(refreshableUserTokensResponse.access_token);
  setCookie(res, "access_token", refreshableUserTokensResponse.access_token, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
  res.status(200).redirect("/");
};

export default callback;
