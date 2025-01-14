import flags from "./flags";
import routes from "./routes";

export const GenerateUserLink = (username: string) => {
  return `${settings.homePage}/user/${username}`;
};

const settings = {
  apiRoot: "https://ws.audioscrobbler.com/2.0/",
  homePage: "https://www.last.fm",
  prefixPath: "https://www.last.fm/music",
  search: {
    fieldName: "username",
    maxUserLength: 60,
    minUserLength: 1,
  },
  select: {
    indicatorWidth: 625,
    options: [
      {
        analyticsName: "Top Albums",
        buttonTextKey: "select.reports.topAlbums",
        indicatorTextKey: "select.indicators.topAlbums",
        route: routes.search.lastfm.top20albums,
        flag: flags.lastfm_top20_albums,
      },
      {
        analyticsName: "Top Artists",
        buttonTextKey: "select.reports.topArtists",
        indicatorTextKey: "select.indicators.topArtists",
        route: routes.search.lastfm.top20artists,
        flag: flags.lastfm_top20_artists,
      },
      {
        analyticsName: "Top Tracks",
        buttonTextKey: "select.reports.topTracks",
        indicatorTextKey: "select.indicators.topTracks",
        route: routes.search.lastfm.top20tracks,
        flag: flags.lastfm_top20_tracks,
      },
      {
        analyticsName: "Playcount by Artist",
        buttonTextKey: "select.reports.playCountByArtist",
        indicatorTextKey: "select.indicators.playCountByArtist",
        route: routes.search.lastfm.playCountByArtist,
        flag: flags.lastfm_playcount_by_artist,
      },
    ],
  },
};

export default settings;
