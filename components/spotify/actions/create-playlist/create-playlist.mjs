import lodash from "lodash";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Create a Playlist",
  description: "Create a playlist for a Spotify user. The playlist will be empty until you add tracks.",
  key: "spotify-create-playlist",
  version: "0.0.36",
  type: "action",
  props: {
    spotify,
    name: {
      type: "string",
      label: "Name",
      description: "The name for the new playlist, for example \"Your Coolest Playlist\". This name does not need to be unique; a user may have several playlists with the same name",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Value for playlist description as displayed in Spotify Clients and in the Web API",
      optional: true,
    },
    isPublic: {
      type: "boolean",
      label: "Public",
      description: "Defaults to `true`. If `true` the playlist will be public, if `false` it will be private",
      optional: true,
    },
    isCollaborative: {
      type: "boolean",
      label: "Collaborative",
      description: "Defaults to `false`. If `true` the playlist will be collaborative. Note that to create a collaborative playlist you must also set `public` to `false`",
      optional: true,
    },
  },
  async run() {
    const {
      name,
      description,
      isPublic,
      isCollaborative,
    } = this;

    const data = {
      name,
      description,
      public: isPublic,
      collaborative: isCollaborative,
    };

    const res = await this.spotify._makeRequest(
      "POST",
      `/users/${this.spotify.$auth.oauth_uid}/playlists`,
      null,
      data,
    );

    return {
      data: lodash.get(res, "data"),
      headers: lodash.get(res, "headers"),
    };
  },
};
