import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "songup_ai",
  propDefinitions: {
    prompt: {
      type: "string",
      label: "Song Idea",
      description: "What the song is about: who it is for, names, the occasion, the mood or style. Up to 1,000 characters. Example: `A happy birthday song for my sister Sara, upbeat pop`.",
    },
    language: {
      type: "string",
      label: "Language",
      description: "Leave empty to sing in the language of the song idea.",
      optional: true,
      async options() {
        const { languages } = await this.listLanguages();
        return languages.map(({
          name, native,
        }) => ({
          label: native === name
            ? name
            : `${name} (${native})`,
          value: name,
        }));
      },
    },
    musicType: {
      type: "string",
      label: "Music Type",
      description: "The kind of track to make.",
      optional: true,
      options: constants.MUSIC_TYPES,
      default: "Full Vocal Song",
    },
    style: {
      type: "string",
      label: "Style",
      description: "A genre or style, for example Pop, Rock, Lo-fi or Bollywood.",
      optional: true,
    },
    lyrics: {
      type: "string",
      label: "Lyrics",
      description: "Your own words, up to 3,000 characters. Needs SongUp AI Pro once the first free songs are used. Leave empty and SongUp AI writes the words.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The song title.",
      optional: true,
    },
    songId: {
      type: "string",
      label: "Song ID",
      description: "The id returned by **Create Song**.",
    },
  },
  methods: {
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${constants.BASE_URL}${path}`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
          "Accept": "application/json",
        },
        ...opts,
      });
    },
    getMe(opts = {}) {
      return this._makeRequest({
        path: "/me",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    listSongs(opts = {}) {
      return this._makeRequest({
        path: "/songs",
        ...opts,
      });
    },
    getSong({
      songId, ...opts
    }) {
      return this._makeRequest({
        path: `/songs/${encodeURIComponent(songId)}`,
        ...opts,
      });
    },
    createSong(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/songs",
        ...opts,
      });
    },
  },
};
