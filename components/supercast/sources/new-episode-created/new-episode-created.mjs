import supercastApp from "../../supercast.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "supercast-new-episode-created",
  name: "New Episode Created",
  description: "Emits an event when a new episode is created in Supercast. [See the documentation](https://supercast.readme.io/reference/postepisodes)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    supercast: {
      type: "app",
      app: "supercast",
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
    channelSubdomain: {
      propDefinition: [
        supercastApp,
        "channelSubdomain",
      ],
    },
  },
  methods: {
    _getPublishedAt() {
      return this.db.get("publishedAt") ?? null;
    },
    _setPublishedAt(publishedAt) {
      this.db.set("publishedAt", publishedAt);
    },
  },
  hooks: {
    async deploy() {
      // Fetch the most recent episodes to determine the last `published_at` timestamp
      const params = {
        channelSubdomain: this.channelSubdomain,
      };
      const episodes = await this.supercast.createEpisode(params);

      if (episodes.length > 0) {
        const lastEpisode = episodes[episodes.length - 1];
        this._setPublishedAt(lastEpisode.published_at);
      }
    },
  },
  async run() {
    const lastPublishedAt = this._getPublishedAt();
    const params = lastPublishedAt
      ? {
        published_after: lastPublishedAt,
      }
      : {};

    // Fetch new episodes since the last `published_at` timestamp
    const episodes = await this.supercast.createEpisode({
      channelSubdomain: this.channelSubdomain,
      ...params,
    });

    for (const episode of episodes) {
      this.$emit(episode, {
        id: episode.id,
        summary: episode.title,
        ts: Date.parse(episode.published_at),
      });
    }

    if (episodes.length > 0) {
      const lastEpisode = episodes[episodes.length - 1];
      this._setPublishedAt(lastEpisode.published_at);
    }
  },
};
