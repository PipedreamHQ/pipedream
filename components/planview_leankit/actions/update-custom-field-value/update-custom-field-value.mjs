import { ConfigurationError } from "@pipedream/platform";
import planviewLeankit from "../../planview_leankit.app.mjs";

export default {
  key: "planview_leankit-update-custom-field-value",
  name: "Update Custom Field Value",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update custom field value on a card. [See the docs here](https://success.planview.com/Planview_AgilePlace/AgilePlace_API/01_v2/card/update)",
  type: "action",
  props: {
    planviewLeankit,
    cardId: {
      propDefinition: [
        planviewLeankit,
        "cardId",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (this.cardId) {
      const { customFields } = await this.planviewLeankit.getCard({
        cardId: this.cardId,
      });

      customFields.map(({
        label, value, fieldId,
      }) => {
        props["customField" + fieldId] = {
          type: "string",
          label,
          default: value,
          description: `Custom Field ${label}.`,
        };
      });
    }
    return props;
  },
  async run({ $ }) {
    const {
      planviewLeankit,
      cardId,
      ...customFields
    } = this;

    const dataFields = [];
    let i = 0;

    for (const [
      key,
      value,
    ] of Object.entries(customFields)) {
      const fieldId = key.substr(11);
      dataFields.push({
        "op": "replace",
        "path": `/customFields/${i++}`,
        "value": {
          fieldId,
          value,
        },
      });
    }

    try {
      const response = await planviewLeankit.updateCard({
        $,
        cardId: cardId,
        data: dataFields,
      });

      $.export("$summary", `${dataFields.length} Custom Fields were successfully updated!`);
      return response;
    } catch (error) {
      throw new ConfigurationError(error);
    }

  },
};
