import { SpotifyWebApi } from "spotify-web-api-ts";
import { AuthorizationScope } from "spotify-web-api-ts/types/types/SpotifyAuthorization";

const scopes: AuthorizationScope[] = [
  "user-library-read",
  "user-library-modify",
  "user-read-private",
  "playlist-modify-public",
];
const state = "spotify-favorite-converter";

export const spotifyApi = new SpotifyWebApi({
  redirectUri: process.env.SpotifyRedirectURL,
  clientId: process.env.SpotifyClientID,
  clientSecret: process.env.SpotifyClientSecret,
});

export const authorizeURL = spotifyApi.getRefreshableAuthorizationUrl({
  scope: scopes,
  state,
});

export const convertPlaylists = async (playlistName: string) => {
  const user = await spotifyApi.users.getMe();
  console.log("よっこらしょういち");
  console.log(user);
  const playlist = await spotifyApi.playlists.createPlaylist(
    user.id,
    playlistName
  );
  await addTrackToPlayList(playlist.id);
};

export const addTrackToPlayList = async (
  playListId: string,
  offset: number = 0
) => {
  const getSavedTracksResponse = await spotifyApi.library.getSavedTracks({
    offset: offset,
    limit: 50,
  });
  const trackURIs = getSavedTracksResponse.items.map((item) => item.track.uri);
  await spotifyApi.playlists.addItemsToPlaylist(playListId, trackURIs);
  if (getSavedTracksResponse.next !== null) {
    const nextOffsetRegExp = getSavedTracksResponse.next
      .match(/(?<=offset=)(.*)(.*)(?=&)/)!
      .find((str) => str) as string;
    const nextOffset = parseInt(nextOffsetRegExp);
    await addTrackToPlayList(playListId, nextOffset);
  }
  return;
};
