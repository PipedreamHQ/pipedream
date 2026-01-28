import common from "../common/base.mjs";

export default {
  ...common,
  key: "marketo-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a form is submitted. [See the documentation](https://developer.adobe.com/marketo-apis/api/mapi/#tag/Activities/operation/getLeadActivitiesUsingGET)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    formId: {
      propDefinition: [
        common.props.app,
        "formId",
      ],
    },
    fields: {
      propDefinition: [
        common.props.app,
        "fields",
      ],
      description: "Fields to include in the response. If not specified, all fields will be returned.",
    },
  },
  methods: {
    ...common.methods,
    generateMeta(submission) {
      return {
        id: `${submission.leadId}-${submission.activityDate}`,
        summary: `New form submission from lead ${submission.leadId}`,
        ts: Date.parse(submission.activityDate),
      };
    },
    getResourceFn() {
      return this.app.getActivities;
    },
    getParams(lastTs) {
      const sinceDatetime = lastTs
        ? new Date(lastTs).toISOString()
        : new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      return {
        activityTypeIds: [
          2,
        ],
        sinceDatetime,
      };
    },
    async processEvent(item) {
      const {
        formId, leadId, activityDate,
      } = item.primaryAttributeValue
        ? item
        : (item.attributes || []).reduce((acc, attr) => {
          acc[attr.name] = attr.value;
          return acc;
        }, item);

      if (formId?.toString() === this.formId?.toString()) {
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
          2,
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
        2,
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
