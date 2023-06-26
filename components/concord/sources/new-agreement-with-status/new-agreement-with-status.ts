import app from "../../app/concord.app";
import { defineSource } from "@pipedream/types";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import { Agreement } from "../../common/types/entities";
import { AGREEMENT_LIST_STATUSES } from "../../common/constants";

export default defineSource({
  key: "concord-new-agreement-with-status",
  name: "New Agreement with Status",
  description: "Emit new event for new agreements with the specified status(es) [See the documentation](https://api.doc.concordnow.com/#tag/Agreement/operation/ListAgreements)",
  version: "0.0.1",
  type: "source",
  props: {
    app,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL as number,
      },
    },
    organizationId: {
      propDefinition: [
        app,
        "organizationId",
      ],
    },
    statuses: {
      label: "Status(es)",
      description: "One or more statuses to emit events for. If none are selected, events will be emitted for all statuses.",
      type: "string[]",
      options: AGREEMENT_LIST_STATUSES,
      optional: true,
    },
    search: {
      label: "Filter by search pattern",
      description: "If set, events will only be emitted for agreement matching the specified pattern",
      type: "string",
      optional: true,
    },
  },
  hooks: {
    async deploy() {
      await this.getAndProcessData();
    },
  },
  methods: {
    getSavedIds(): string[] {
      return this.db.get("savedIds");
    },
    setSavedIds(data: string[]) {
      this.db.set("savedIds", data);
    },
    async getAndProcessData() {
      const {
        organizationId, search, statuses,
      } = this;
      const data: Agreement[] = await this.app.listAgreements({
        organizationId,
        search,
        statuses,
      });
      if (data) {
        const savedIds: string[] = this.getSavedIds() ?? [];

        data
          .filter(({ uuid }) => !savedIds.includes(uuid))
          .reverse()
          .forEach((obj) => {
            this.emitEvent(obj);
            savedIds.push(obj.uuid);
          });

        this.setSavedIds(savedIds);
      }
    },
    emitEvent(data: Agreement) {
      const ts = Date.now();
      const { uuid: id } = data;
      this.$emit(data, {
        id,
        summary: `New Agreement (${data.status}): "${data.title}"`,
        ts,
      });
    },
  },
  async run() {
    await this.getAndProcessData();
  },
});
