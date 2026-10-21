import { ConfigurationError } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

// https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist
const MAX_PLAYLIST_ITEMS_PER_REQUEST = 100;
const ITEM_URI_REGEX = /^spotify:(track|episode):[A-Za-z0-9]+$/;

export default {
  name: "Add Items to a Playlist",
  description: "Add tracks or podcast episodes to an existing Spotify playlist that the current user can modify."
    + " Use **List Playlist ID Options** to find the playlist ID, or **Create a Playlist** to make a new one first."
    + " Items are identified by Spotify URI, not bare ID: tracks as `spotify:track:<id>` and episodes as `spotify:episode:<id>`. Use **Search** with type `track` or `episode` to find them: pass the `uri` from `tracks.items[]` or `episodes.items[]`."
    + ` Up to ${MAX_PLAYLIST_ITEMS_PER_REQUEST} items per call; split larger batches into several calls.`
    + " Items are added in the order given, appended to the end unless `Position` is set."
    + " Returns `{ snapshot_id }`, the playlist's new version ID."
    + " Use **Get a Playlist's Items** to confirm the result, or **Remove Items from a Playlist** to undo."
    + " [See the documentation](https://developer.spotify.com/documentation/web-api/reference/add-items-to-playlist)",
  key: "spotify-add-items-to-playlist",
  version: "0.2.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    spotify,
    playlistId: {
      type: "string",
      label: "Playlist ID",
      description: "The Spotify ID of the playlist to add items to, e.g. `3cEYpjA9oz9GiPac4AsH4n` (the ID only, not the `spotify:playlist:` URI or the URL). Use **List Playlist ID Options** to find it.",
    },
    uris: {
      type: "string[]",
      label: "Track or Episode URIs",
      description: `Spotify URIs of the items to add, in the order they should appear, e.g. \`["spotify:track:4iV5W9uYEdYUVa79Axb7Rh", "spotify:episode:512ojhOuo1ktJprKbVcKyQ"]\`. Only track and episode URIs are accepted. Maximum ${MAX_PLAYLIST_ITEMS_PER_REQUEST} per call. Use **Search** to find URIs.`,
    },
    position: {
      type: "integer",
      label: "Position",
      description: "Zero-based index at which to insert the items. `0` inserts at the top of the playlist; `2` inserts before the current third item. Omit to append to the end.",
      min: 0,
      optional: true,
    },
  },
  async run({ $ }) {
    const playlistId = this.playlistId?.value ?? this.playlistId;
    const uris = this.spotify.sanitizedArray(this.uris);

    if (!uris.length) {
      throw new ConfigurationError("Provide at least one track or episode URI in `uris`.");
    }
    if (uris.length > MAX_PLAYLIST_ITEMS_PER_REQUEST) {
      throw new ConfigurationError(`Spotify accepts at most ${MAX_PLAYLIST_ITEMS_PER_REQUEST} items per request; got ${uris.length}. Split them across several calls.`);
    }
    const invalid = uris.filter((uri) => !ITEM_URI_REGEX.test(uri));
    if (invalid.length) {
      throw new ConfigurationError(`Invalid item URI(s): ${invalid.join(", ")}. Use the form \`spotify:track:<id>\` or \`spotify:episode:<id>\`, e.g. the \`uri\` from **Search** results.`);
    }

    const { data: resp } = await this.spotify._makeRequest({
      $,
      method: "POST",
      url: `/playlists/${playlistId}/items`,
      data: {
        position: this.position,
        uris,
      },
    });

    $.export("$summary", `Successfully added ${uris.length} item${uris.length === 1
      ? ""
      : "s"} to playlist ${playlistId}`);

    return resp;
  },
};
