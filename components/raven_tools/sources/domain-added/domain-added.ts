import { defineSource } from "@pipedream/types";
import { DOCS } from "../../common/constants";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import raven_tools from "../../app/raven_tools.app";
import { Domain } from "domain";

export default defineSource({
  key: "raven_tools-domain-added",
  name: "Domain Added",
  description: `Emit new event when a domain is added [See docs here](${DOCS.domainAdded})`,
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    raven_tools,
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
    async getAndProcessData() {
      const data: Domain[] = await this.raven_tools.listDomains();
      data.forEach(this.emitEvent);
    },
    emitEvent(data: Domain) {
      const ts = Date.now();
      this.$emit(data, {
        id: ts,
        summary: `New Domain "${data}"`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
