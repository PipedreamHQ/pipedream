import zenscrape from "../../zenscrape.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import md5 from "md5";

export default {
  key: "zenscrape-website-content-updated",
  name: "Website Content Updated",
  description: "Emit new event when the content of a URL has updated. [See the documentation](https://app.zenscrape.com/documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    zenscrape,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    url: {
      propDefinition: [
        zenscrape,
        "url",
      ],
    },
    premium: {
      propDefinition: [
        zenscrape,
        "premium",
      ],
    },
    location: {
      propDefinition: [
        zenscrape,
        "location",
      ],
    },
    keepHeaders: {
      propDefinition: [
        zenscrape,
        "keepHeaders",
      ],
    },
    render: {
      propDefinition: [
        zenscrape,
        "render",
      ],
    },
  },
  methods: {
    _getContentHash() {
      return this.db.get("contentHash");
    },
    _setContentHash(contentHash) {
      this.db.set("contentHash", contentHash);
    },
    generateMeta() {
      const ts = Date.now();
      return {
        id: ts,
        summary: "Website Content Updated",
        ts,
      };
    },
  },
  async run() {
    const contentHash = this._getContentHash();

    const content = await this.zenscrape.getContent({
      params: {
        url: this.url,
        premium: this.premium,
        location: this.location,
        keep_headers: this.keepHeaders,
        render: this.render,
      },
    });

    const newContentHash = md5(JSON.stringify(content));

    if (newContentHash === contentHash) {
      return;
    }

    this._setContentHash(newContentHash);

    const meta = this.generateMeta();
    this.$emit(content, meta);
  },
};
