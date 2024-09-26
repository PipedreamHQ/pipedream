import base from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...base,
  key: "jw_player-new-media-available",
  name: "New Media Available (Instant)",
  description: "Emit new event when a new media conversion is completed or a media becomes available.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...base.methods,
    getEvents() {
      return [
        "media_available",
      ];
    },
    generateMeta(media) {
      return {
        id: media.id,
        summary: `New Media with ID ${media.id}`,
        ts: Date.parse(media.created),
      };
    },
  },
  async run(event) {
    const { body } = event;
    const media = await this.jwPlayer.getMedia({
      siteId: body.site_id,
      mediaId: body.media_id,
    });
    const meta = this.generateMeta(media);
    this.$emit({
      body,
      media,
    }, meta);
  },
  sampleEmit,
};
