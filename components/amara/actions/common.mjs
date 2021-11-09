import maxBy from "lodash.maxby";
import amara from "../amara.app.mjs";
import constants from "../constants.mjs";

export default {
  props: {
    amara,
  },
  methods: {
    async paginateVideos({
      $, limit, params, max = constants.DEFAULT_MAX_ITEMS,
    }) {
      let videos = [];
      let nextVideos = [];
      let lastId;

      do {
        const lastLimit = max - videos.length;

        const nextResponse = await this.amara.listVideos({
          $,
          params: {
            ...params,
            offset: lastId,
            limit: lastLimit < limit
              ? lastLimit
              : limit,
          },
        });

        if (!nextResponse) {
          throw new Error("No response from the Amara API.");
        }

        nextVideos = nextResponse.objects;

        if (!limit) {
          limit = nextResponse.meta.limit;
        }

        const lastVideo = maxBy(nextVideos, (message) => message.id);

        lastId = lastVideo?.id;
        videos = videos.concat(nextVideos);

      } while (nextVideos.length && videos.length < max);

      return videos;
    },
  },
};
