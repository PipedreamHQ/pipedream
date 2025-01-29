import { axios } from "@pipedream/platform";
import tinyurl from "../../tinyurl.app.mjs";

export default {
  key: "tinyurl-new-link-metadata-instant",
  name: "New Link Metadata Updated",
  description: "Emit a new event when metadata (e.g., title or tags) of an existing link is updated. Useful for monitoring changes across link campaigns. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    tinyurl,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    emitMetadataUpdateFilter: {
      propDefinition: [
        "tinyurl",
        "emitMetadataUpdateFilter",
      ],
    },
  },
  hooks: {
    async deploy() {
      try {
        const response = await this.tinyurl.pollMetadataUpdates({
          emitMetadataUpdateFilter: this.emitMetadataUpdateFilter,
        });
        const links = response.slice(0, 50);
        for (const link of links) {
          this.$emit(
            link,
            {
              id: link.id
                ? String(link.id)
                : undefined,
              summary: `Metadata for link ${link.id}`,
              ts: link.updated_at
                ? Date.parse(link.updated_at)
                : Date.now(),
            },
          );
        }
        const linksMap = links.reduce((map, link) => {
          map[link.id] = link.metadata;
          return map;
        }, {});
        await this.db.set("links", linksMap);
      } catch (error) {
        this.$emit(error, {
          summary: "Error during deploy",
          ts: Date.now(),
        });
      }
    },
    async activate() {
      // No activation steps required
    },
    async deactivate() {
      // No deactivation steps required
    },
  },
  async run() {
    try {
      const currentLinks = await this.tinyurl.pollMetadataUpdates({
        emitMetadataUpdateFilter: this.emitMetadataUpdateFilter,
      });
      const storedLinks = (await this.db.get("links")) || {};
      const updatedLinksMap = {};

      for (const link of currentLinks) {
        updatedLinksMap[link.id] = link.metadata;
        const previousMetadata = storedLinks[link.id];
        if (
          previousMetadata &&
          JSON.stringify(previousMetadata) !== JSON.stringify(link.metadata)
        ) {
          this.$emit(
            link,
            {
              id: link.id
                ? String(link.id)
                : undefined,
              summary: `Metadata updated for link ${link.id}`,
              ts: link.updated_at
                ? Date.parse(link.updated_at)
                : Date.now(),
            },
          );
        }
      }

      await this.db.set("links", updatedLinksMap);
    } catch (error) {
      this.$emit(error, {
        summary: "Error during run",
        ts: Date.now(),
      });
    }
  },
};
