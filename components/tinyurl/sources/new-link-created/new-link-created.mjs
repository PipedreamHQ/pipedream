import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-new-link-created",
  name: "New Shortened URL Created",
  description: "Emits an event when a new shortened URL is created. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tinyurl,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    emitNewLinkFilterDomain: {
      propDefinition: [
        tinyurl,
        "emitNewLinkFilterDomain",
      ],
    },
    emitNewLinkFilterTag: {
      propDefinition: [
        tinyurl,
        "emitNewLinkFilterTag",
      ],
    },
  },
  hooks: {
    async deploy() {
      const lastTs = (await this.db.get("lastTs")) || 0;
      const emittedLinks = [];

      await this.tinyurl.pollNewLinks(
        {
          domainFilter: this.emitNewLinkFilterDomain,
          tagFilter: this.emitNewLinkFilterTag,
        },
        (link) => {
          const ts = link.created_at
            ? Date.parse(link.created_at)
            : Date.now();
          if (ts > lastTs) {
            emittedLinks.unshift({
              ...link,
              ts,
            });
          }
        },
      );

      const recentLinks = emittedLinks.slice(0, 50);
      recentLinks.forEach((link) => {
        this.$emit(link, {
          id: link.id || link.created_at || link.ts,
          summary: `New TinyURL: ${link.destination_url}`,
          ts: link.ts,
        });
      });

      if (recentLinks.length > 0) {
        const latestTs = recentLinks[0].ts;
        this.db.set("lastTs", latestTs);
      } else {
        this.db.set("lastTs", lastTs);
      }
    },
    async activate() {
      // No webhook subscription needed for polling source
    },
    async deactivate() {
      // No webhook subscription to remove for polling source
    },
  },
  async run() {
    const lastTs = (await this.db.get("lastTs")) || 0;
    const newLinks = [];

    await this.tinyurl.pollNewLinks(
      {
        domainFilter: this.emitNewLinkFilterDomain,
        tagFilter: this.emitNewLinkFilterTag,
      },
      (link) => {
        const ts = link.created_at
          ? Date.parse(link.created_at)
          : Date.now();
        if (ts > lastTs) {
          newLinks.push({
            ...link,
            ts,
          });
        }
      },
    );

    newLinks.sort((a, b) => b.ts - a.ts).slice(0, 50)
      .forEach((link) => {
        this.$emit(link, {
          id: link.id || link.created_at || link.ts,
          summary: `New TinyURL: ${link.destination_url}`,
          ts: link.ts,
        });
      });

    if (newLinks.length > 0) {
      const latestTs = newLinks[0].ts;
      this.db.set("lastTs", latestTs);
    }
  },
};
