import { ConfigurationError } from "@pipedream/platform";
import { parseObj } from "../../common/utils.mjs";
import endorsal from "../../endorsal.app.mjs";

export default {
  key: "endorsal-create-contact",
  name: "Create Contact",
  description: "Creates a new contact for requesting testimonials. [See the documentation](https://developers.endorsal.io/docs/endorsal/b3a6mtczmzu5na-create-a-new-contact)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    endorsal,
    campaignID: {
      propDefinition: [
        endorsal,
        "campaignID",
      ],
    },
    name: {
      propDefinition: [
        endorsal,
        "name",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        endorsal,
        "email",
      ],
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone of the contact. `Email` OR `Phone` is required.",
      optional: true,
    },
    avatar: {
      propDefinition: [
        endorsal,
        "avatar",
      ],
      optional: true,
    },
    location: {
      propDefinition: [
        endorsal,
        "location",
      ],
      optional: true,
    },
    position: {
      propDefinition: [
        endorsal,
        "position",
      ],
      optional: true,
    },
    company: {
      propDefinition: [
        endorsal,
        "company",
      ],
      optional: true,
    },
    website: {
      type: "string",
      label: "Website",
      description: "The website of the contact.",
      optional: true,
    },
    externalID: {
      type: "string",
      label: "External ID",
      description: "ID from platform from which contact was imported.",
      optional: true,
    },
    importedFrom: {
      type: "string",
      label: "Imported From",
      description: "Name of platform from which contact was imported.",
      optional: true,
    },
    customAttributes: {
      type: "object",
      label: "Custom Attributes",
      description: "Custom key/value pairs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      endorsal,
      campaignID,
      email,
      phone,
      customAttributes,
      ...data
    } = this;

    if (!email && !phone) {
      throw new ConfigurationError("You must provide either **Email** or **Phone**.");
    }

    const response = await endorsal.createContact({
      params: {
        campaignID,
      },
      data: {
        email,
        phone,
        customAttributes: parseObj(customAttributes),
        ...data,
      },
    });

    $.export("$summary", `Successfully created contact with ID: ${response.data?._id}`);
    return response;
  },
};
