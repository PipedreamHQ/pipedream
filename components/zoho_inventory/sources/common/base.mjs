import zohoInventory from "../../zoho_inventory.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  props: {
    zohoInventory,
    db: "$.service.db",
    http: "$.interface.http",
    timer: {
      type: "$.interface.timer",
      label: "Polling Interval",
      description: "Pipedream will poll the Zoho Inventory API on this schedule",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
    organization: {
      propDefinition: [
        zohoInventory,
        "organization",
      ],
    },
    maxResults: {
      propDefinition: [
        zohoInventory,
        "maxResults",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent();
    },
  },
  methods: {
    getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    setLastTimestamp(lastTimestamp) {
      this.db.set("lastTimestamp", lastTimestamp);
    },
    isLater(date, compareDate) {
      if (!compareDate) {
        return true;
      }
      return date > compareDate;
    },
    async *paginate(resourceFn, params = {}, resourceType, lastTimestamp) {
      params = {
        page: 1,
        per_page: constants.DEFAULT_PAGE_SIZE,
        ...params,
      };
      let count = 0;
      let hasMorePages = true;
      while (hasMorePages) {
        const results = await resourceFn({
          params,
        });
        const items = results[resourceType];
        for (const item of items) {
          if (this.isLater(Date.parse(item.created_time), lastTimestamp)) {
            yield item;
            count++;
          }
          if (count >= this.maxResults) {
            return;
          }
        }
        hasMorePages = results?.page_context?.has_more_page;
        if (hasMorePages) {
          params.page++;
        }
      }
    },
    async processEvent() {
      const lastTimestamp = this.getLastTimestamp();
      let maxTimestamp = lastTimestamp;

      const params = {
        organization_id: this.organization,
      };

      const resourceFn = this.getResourceFn();
      const resourceType = this.getResourceType();
      const items = await this.paginate(resourceFn, params, resourceType, lastTimestamp);

      for await (const item of items) {
        if (this.isLater(Date.parse(item.created_time), maxTimestamp)) {
          maxTimestamp = Date.parse(item.created_time);
        }
        const meta = this.generateMeta(item);
        this.$emit(item, meta);
      }

      this.setLastTimestamp(maxTimestamp);
    },
  },
  async run() {
    await this.processEvent();
  },
};
