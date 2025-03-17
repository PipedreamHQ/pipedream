import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-new-tag",
  name: "New Tag Created",
  description: "Emit new event when a new tag is created in Evernote. Useful for tracking new organizational labels. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    evernote,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    tagFilter: {
      propDefinition: [
        "evernote",
        "tagFilter",
      ],
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      const tags = await this.evernote.listTags();
      const sortedTags = tags.sort((a, b) => new Date(b.created) - new Date(a.created));
      const recentTags = sortedTags.slice(0, 50);
      for (const tag of recentTags) {
        this.evernote.emitNewTagEvent(tag);
      }
      const tagIds = tags.map((tag) => tag.id);
      await this.db.set("tagIds", tagIds);
    },
    async activate() {
      // No activation logic required
    },
    async deactivate() {
      // No deactivation logic required
    },
  },
  async run() {
    const currentTags = await this.evernote.listTags();
    const storedTagIds = (await this.db.get("tagIds")) || [];
    let newTags = currentTags.filter((tag) => !storedTagIds.includes(tag.id));

    if (this.tagFilter) {
      newTags = newTags.filter((tag) => tag.id === this.tagFilter);
    }

    for (const tag of newTags) {
      this.evernote.emitNewTagEvent(tag);
    }

    const currentTagIds = currentTags.map((tag) => tag.id);
    await this.db.set("tagIds", currentTagIds);
  },
};
