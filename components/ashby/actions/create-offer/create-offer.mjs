import app from "../../ashby.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "ashby-create-offer",
  name: "Create Offer",
  description: "Creates a new offer. [See the documentation](https://developers.ashbyhq.com/reference/offercreate)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    offerProcessId: {
      propDefinition: [
        app,
        "offerProcessId",
      ],
    },
    offerFormId: {
      type: "string",
      label: "Offer Form ID",
      description: "The ID of the form associated with the offer. The ID is included in the response of the [offer.start API](https://developers.ashbyhq.com/reference/offerstart).",
    },
    fieldSubmissions: {
      type: "string[]",
      label: "Field Submissions",
      description: `Array of field submission objects. Each object should contain:
- **path** (string, required): The form field's "path" value
- **value** (string, required): The field value (can be a primitive or complex type depending on field type)

You can find these referebce values in the response of the [offer.start API](https://developers.ashbyhq.com/reference/offerstart).

Each item can be a JSON string or object with the structure:
\`\`\`json
[
  {
    "path": "96377e55-cd34-49e2-aff0-5870ec102360",
    "value": "2025-11-07"
  },
  {
    "path": "ded2358d-443f-484f-91fa-ec7a13de842b",
    "value": {
      "value": 10000,
      "currencyCode": "USD"
    }
  }
]
\`\`\``,
    },
  },
  async run({ $ }) {
    const {
      app,
      offerProcessId,
      offerFormId,
      fieldSubmissions,
    } = this;

    const response = await app.createOffer({
      $,
      data: {
        offerProcessId,
        offerFormId,
        offerForm: {
          fieldSubmissions: utils.parseJson(fieldSubmissions),
        },
      },
    });

    $.export("$summary", `Successfully created offer for process ${offerProcessId}`);

    return response;
  },
};
