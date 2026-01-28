import common from "../common/base.mjs";

export default {
  ...common,
  key: "marketo-new-lead",
  name: "New Lead",
  description: "Emit new event when a new lead is created. [See the documentation](https://developer.adobe.com/marketo-apis/api/mapi/#tag/Activities/operation/getLeadActivitiesUsingGET)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    fields: {
      propDefinition: [
        common.props.app,
        "fields",
      ],
      description: "Fields to include in the response for the lead. If not specified, default fields will be returned.",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(activity) {
      return {
        id: `${activity.leadId}-${activity.activityDate}`,
        summary: `New lead created: ${activity.leadId}`,
        ts: Date.parse(activity.activityDate),
      };
    },
    async processEvent(item) {
      const {
        leadId, activityDate,
      } = item;

      if (this.fields?.length) {
        const { result } = await this.app.getLeadsByFilterType({
          filterType: "id",
          filterValues: [
            leadId,
          ],
          fields: this.fields,
        });
        item.leadDetails = result?.[0];
      }

      return Date.parse(activityDate);
    },
  },
  async run() {
    const lastTs = this._getLastTs();

    if (!lastTs) {
      const sinceDatetime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { nextPageToken } = await this.app.getPagingToken({
        sinceDatetime,
      });
      this._setLastTs(Date.now());

      const results = await this.app.getActivities({
        activityTypeIds: [
          12,
        ],
        nextPageToken,
      });

      const items = results.result || [];

      items.slice(-25).reverse()
        .forEach((item) => {
          this.processEvent(item);
          this.emitEvent(item);
        });

      return;
    }

    const sinceDatetime = new Date(lastTs).toISOString();
    const { nextPageToken } = await this.app.getPagingToken({
      sinceDatetime,
    });

    let maxTs = lastTs;

    const results = await this.app.getActivities({
      activityTypeIds: [
        12,
      ],
      nextPageToken,
    });

    const items = results.result || [];

    for (const item of items) {
      const ts = await this.processEvent(item);
      if (ts > maxTs) {
        maxTs = ts;
      }
      this.emitEvent(item);
    }

    this._setLastTs(maxTs);
  },
};
