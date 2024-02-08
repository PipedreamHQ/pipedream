import { axios } from "@pipedream/platform";
import herobotChatbotMarketing from "../../herobot_chatbot_marketing.app.mjs";

export default {
  key: "herobot_chatbot_marketing-new-tag-added",
  name: "New Tag Added",
  description: "Emits an event when a new tag is added to a specific user. [See the documentation](https://my.herobot.app/api/swagger/)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    herobotChatbotMarketing,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    userId: {
      propDefinition: [
        herobotChatbotMarketing,
        "userId",
      ],
    },
  },
  methods: {
    ...herobotChatbotMarketing.methods,
    async fetchTags() {
      const response = await this.herobotChatbotMarketing.getTags({
        userId: this.userId,
      });
      return response.tags.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    getStoredLatestTagId() {
      return this.db.get("latestTagId") || null;
    },
    storeLatestTagId(tagId) {
      this.db.set("latestTagId", tagId);
    },
  },
  hooks: {
    async deploy() {
      const tags = await this.fetchTags();
      if (tags.length) {
        this.storeLatestTagId(tags[0].id);
      }
    },
  },
  async run() {
    const tags = await this.fetchTags();
    const latestStoredTagId = this.getStoredLatestTagId();
    if (tags.length && tags[0].id !== latestStoredTagId) {
      const newTag = tags.find((tag) => tag.id === tags[0].id);
      this.$emit(newTag, {
        id: newTag.id,
        summary: `New Tag: ${newTag.name}`,
        ts: Date.now(),
      });
      this.storeLatestTagId(tags[0].id);
    }
  },
};
