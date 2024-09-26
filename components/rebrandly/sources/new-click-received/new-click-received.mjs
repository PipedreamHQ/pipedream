import rebrandly from "../../rebrandly.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Click Received",
  version: "0.0.1",
  key: "rebrandly-new-click-received",
  description: "Emit new event on each new click received by a link.",
  type: "source",
  dedupe: "unique",
  props: {
    rebrandly,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: `${data.id}-${data.clicks}`,
        summary: `Link ${data.id} clicked`,
        ts: Date.parse(data.lastClickAt),
      });
    },
    getParams() {
      return {
        orderBy: "lastClickAt",
        orderDir: "desc",
      };
    },
    getClickedLinks(links) {
      return links?.filter((link) => link.lastClickAt) || [];
    },
    _setLastClickAt(lastClickAt) {
      this.db.set("lastClickAt", lastClickAt);
    },
    _getLastClickAt() {
      return this.db.get("lastClickAt") || 0;
    },
  },
  hooks: {
    async deploy() {
      const links = await this.rebrandly.getLinks({
        params: {
          ...this.getParams(),
          limit: 10,
        },
      });
      const clickedLinks = this.getClickedLinks(links);

      const [
        lastClickedLink,
      ] = clickedLinks;

      if (lastClickedLink?.lastClickAt) {
        this._setLastClickAt(Date.parse(lastClickedLink.lastClickAt));
      }

      clickedLinks.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastClickAt = this._getLastClickAt();
    let maxLastClickAt = lastClickAt;

    while (true) {
      const links = await this.rebrandly.getLinks({
        params: this.getParams(),
      });
      const clickedLinks = this.getClickedLinks(links);
      const ts = Date.parse(clickedLinks[0]?.lastClickAt);
      if (ts > maxLastClickAt) {
        maxLastClickAt = ts;
        this._setLastClickAt(ts);
      }
      for (const link of clickedLinks) {
        if (Date.parse(link.lastClickAt) > lastClickAt) {
          this.emitEvent(link);
        } else {
          return;
        }
      }
      if (links.length < 25) {
        return;
      }
    }
  },
};
