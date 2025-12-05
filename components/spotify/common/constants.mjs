export const ITEM_TYPES = {
  ALBUM: "album",
  ARTIST: "artist",
  PLAYLIST: "playlist",
  TRACK: "track",
  SHOW: "show",
  EPISODE: "episode",
};

export const ITEM_TYPES_LIST = [
  {
    label: "Album",
    value: ITEM_TYPES.ALBUM,
  },
  {
    label: "Artist",
    value: ITEM_TYPES.ARTIST,
  },
  {
    label: "Playlist",
    value: ITEM_TYPES.PLAYLIST,
  },
  {
    label: "Track",
    value: ITEM_TYPES.TRACK,
  },
  {
    label: "Show",
    value: ITEM_TYPES.SHOW,
  },
  {
    label: "Episode",
    value: ITEM_TYPES.EPISODE,
  },
];

export const ITEM_TYPES_RESULT_NAME = {
  [ITEM_TYPES.ALBUM]: "albums",
  [ITEM_TYPES.ARTIST]: "artists",
  [ITEM_TYPES.PLAYLIST]: "playlists",
  [ITEM_TYPES.TRACK]: "tracks",
  [ITEM_TYPES.SHOW]: "shows",
  [ITEM_TYPES.EPISODE]: "episodes",
};
