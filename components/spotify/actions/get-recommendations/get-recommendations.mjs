import { ConfigurationError } from "@pipedream/platform";
import spotify from "../../spotify.app.mjs";

export default {
  name: "Get Recommendations",
  description: "Create a list of recommendations based on the available information for a given seed entity and matched against similar artists and tracks. If there is sufficient information about the provided seeds, a list of tracks will be returned together with pool size details. [See the docs here](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-recommendations).",
  key: "spotify-get-recommendations",
  version: "0.1.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    spotify,
    seedArtists: {
      propDefinition: [
        spotify,
        "artistId",
      ],
      type: "string[]",
      label: "Seed Artists",
      description: "An array of Spotify IDs for seed artists. Type to search for any artist on Spotify. Up to 5 seed values may be provided in any combination of `seedArtists`, `seedTracks` and `seedGenres`.",
      withLabel: false,
      optional: true,
    },
    seedGenres: {
      propDefinition: [
        spotify,
        "genres",
      ],
      optional: true,
    },
    seedTracks: {
      propDefinition: [
        spotify,
        "trackId",
      ],
      type: "string[]",
      label: "Seed Tracks",
      description: "An array of Spotify IDs for a seed track. Type to search for any track on Spotify. Up to 5 seed values may be provided in any combination of `seedArtists`, `seedTracks` and `seedGenres`.",
      withLabel: false,
      optional: true,
    },
    limit: {
      propDefinition: [
        spotify,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const {
      seedArtists = [],
      seedGenres = [],
      seedTracks = [],
      limit,
    } = this;

    const numSeeds = seedArtists.length + seedGenres.length + seedTracks.length;
    if (numSeeds > 5 || numSeeds < 1) {
      throw new ConfigurationError("Must provide between 1 and 5 seeds in in any combination of `seedArtists`, `seedTracks` and `seedGenres`.");
    }

    const params = {
      seed_artists: seedArtists.join(),
      seed_genres: seedGenres.join(),
      seed_tracks: seedTracks.join(),
      limit,
    };

    const response = await this.spotify.getRecommendations({
      $,
      ...params,
    });

    if (response.tracks.length === 0) {
      $.export("$summary", "No recommendations found");
      return;
    }
    $.export("$summary", `Successfully retrieved ${response.tracks.length} recommendation(s).`);
    return response;
  },
};
