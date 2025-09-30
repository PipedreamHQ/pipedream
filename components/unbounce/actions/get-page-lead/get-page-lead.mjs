import unbounce from "../../unbounce.app.mjs";

export default {
  key: "unbounce-get-page-lead",
  name: "Get Page Lead",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get info of single Lead. [See the documentation](https://developer.unbounce.com/api_reference/#id_pages__page_id__leads__lead_id_)",
  type: "action",
  props: {
    unbounce,
    pageId: {
      propDefinition: [
        unbounce,
        "pageId",
      ],
    },
    leadId: {
      propDefinition: [
        unbounce,
        "leadId",
        ({ pageId }) => ({
          pageId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      unbounce,
      pageId,
      leadId,
    } = this;

    const response = unbounce.getLead({
      pageId,
      leadId,
    });

    $.export("$summary", `The Lead with Id: ${leadId} successfully fetched!`);
    return response;
  },
};
