import app from "../../facebook_lead_ads.app.mjs";

export default {
  type: "action",
  key: "facebook_lead_ads-list_leads",
  name: "List Leads",
  description: "List Leads from a Form or Campaign. [See the documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/retrieving#reading-store-locator-question-value)",
  version: "0.0.1",
  props: {
    app,
    pageId: {
      propDefinition: [
        app,
        "pageId",
      ],
    },
    formId: {
      propDefinition: [
        app,
        "formId",
        (c) => ({
          pageId: c.pageId,
        }),
      ],
      name: "Resource Id",
      description: "The ID of the resource to retrieve leads from. It may be a form, campaign or ad group id",
    },
    additionalParams: {
      type: "object",
      label: "Additional Parameters",
      description: "Additional parameters to include in the request URL.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = [];

    let res;
    let after = undefined;
    do {
      const params = {
        ...this.additionalParams,
        after,
      };
      res = await this.app.listLeadsByAdOrFormId(this.formId, params);
      data.push(...res.data);
      after = res.paging?.cursors?.after;
    } while (res.paging.next);

    if (data.length === 0) {
      $.export("summary", "No leads found");
    } else {
      $.export("summary", `Found ${data.length} lead(s)`);
    }
    return data;
  },
};
