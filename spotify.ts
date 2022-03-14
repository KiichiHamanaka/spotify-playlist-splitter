import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node";

const CLIENTID = process.env.SpotifyClientID!;
const CLIENTSECRET = process.env.SpotifyClientSecret!;
const REDIRECTURL = "http://localhost:3000/api/callback/";

export const fetchGet = (url: string) => axios.get(url).then((res) => res.data);

export const spotifyApi = new SpotifyWebApi({
  redirectUri: REDIRECTURL,
  clientId: CLIENTID,
  clientSecret: CLIENTSECRET,
});

const scopes = [
  "user-library-read",
  "user-library-modify",
  "playlist-modify-public",
];
const state = "some-state-of-my-choice";

export const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

export const convertPlaylists = async (name: string) => {
  const result = await spotifyApi.createPlaylist(name);
  const playListId: string = result.body.id as string;
  await addTrackToPlayList(playListId);
};

export const addTrackToPlayList = async (
  playListId: string,
  offset: number = 0
) => {
  const result = await spotifyApi.getMySavedTracks({
    offset: offset,
    limit: 50,
  });
  const trackIdArray = result.body.items.map((item) => item.track.uri);
  await spotifyApi.addTracksToPlaylist(playListId, trackIdArray);
  if (result.body.next !== null) {
    const nextOffsetRegExp = result.body.next
      .match(/(?<=offset=)(.*)(.*)(?=&)/)!
      .find((str) => str) as string;
    const nextOffset = parseInt(nextOffsetRegExp);
    await addTrackToPlayList(playListId, nextOffset);
  }
  return;
};
