import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import raven_tools from "../../app/raven_tools.app";
import { Domain } from "../../common/types";

export default defineSource({
  key: "raven_tools-domain-added",
  name: "Domain Added",
  description: `Emit new event when a domain is added [See docs here](${DOCS.domainAdded})`,
  version: "0.0.1",
  type: "source",
  props: {
    raven_tools,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    getSavedDomains(): Domain[] {
      return this.db.get("domains");
    },
    setSavedDomains(domains: Domain[]) {
      this.db.set("domains", domains);
    },
    async getAndProcessData() {
      const data: Domain[] = await this.raven_tools.listDomains();
      const savedDomains: Domain[] = this.getSavedDomains() ?? [];
      data.filter((d) => !savedDomains.includes(d)).forEach(this.emitEvent);
      this.setSavedDomains(data);
    },
    emitEvent(data: Domain) {
      const ts = Date.now();
      this.$emit(data, {
        id: ts + data,
        summary: `New Domain "${data}"`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
