import flodesk from "../../flodesk.app.mjs";
import { ConfigurationError } from "@pipedream/platform";
import lodash from "lodash";

export default {
  key: "flodesk-create-or-update-subscriber",
  name: "Create or Update Subscriber",
  description: "Creates or updates a subscriber in Flodesk. [See the documentation](https://developers.flodesk.com/#tag/subscriber/operation/createOrUpdateSubscriber)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    flodesk,
    subscriberId: {
      propDefinition: [
        flodesk,
        "subscriberId",
      ],
      description: "The subscriber's id. Either `email` or `subscriberId` must be included.",
      optional: true,
    },
    email: {
      type: "string",
      label: "Email",
      description: "The subscriber's email. Either `email` or `subscriberId` must be included.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The subscriber's first name.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The subscriber's last name.",
      optional: true,
    },
    customFields: {
      propDefinition: [
        flodesk,
        "customFields",
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};
    if (!this.customFields?.length) {
      return props;
    }
    for (const field of this.customFields) {
      props[field.value] = {
        type: "string",
        label: `${field.label} Value`,
      };
    }
    return props;
  },
  async run({ $ }) {
    if (!this.subscriberId && !this.email) {
      throw new ConfigurationError("Either `email` or `subscriberId` must be included.");
    }

    const customFields = {};
    if (this.customFields?.length) {
      for (const field of this.customFields) {
        customFields[field.value] = this[field.value];
      }
    }

    const response = await this.flodesk.createOrUpdateSubscriber({
      data: lodash.pickBy({
        id: this.subscriberId,
        email: this.email,
        first_name: this.firstName,
        last_name: this.lastName,
        custom_fields: customFields,
      }),
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created or updated subscriber with ID ${response.id}`);
    }

    return response;
  },
};
