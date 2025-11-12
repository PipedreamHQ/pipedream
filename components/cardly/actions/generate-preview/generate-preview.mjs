import cardly from "../../cardly.app.mjs";

export default {
  key: "cardly-generate-preview",
  name: "Generate Preview",
  description: "Generates a preview in Cardly. [See the documentation](https://api.card.ly/v2/docs#endpoint-post-order-preview)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    cardly,
    artId: {
      propDefinition: [
        cardly,
        "artId",
      ],
    },
    templateId: {
      propDefinition: [
        cardly,
        "templateId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The recipient's first name, as it should appear on the envelope.",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The recipient's last name, as it should appear on the envelope.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The recipient's company, if required, as it should appear below their name on the envelope.",
      optional: true,
    },
    address: {
      type: "string",
      label: "Address",
      description: "The recipient's street number, name and type.",
    },
    address2: {
      type: "string",
      label: "Address 2",
      description: "Unit, floor, apartment etc. additional information for the recipient's address.",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "Suburb or city for the recipient.",
    },
    region: {
      type: "string",
      label: "Region",
      description: "State / province / region for the recipient, if required. UK and NZ currently do not require a region specified. Conditionally required based on the country supplied.",
    },
    country: {
      type: "string",
      label: "Country",
      description: "The 2-character ISO code for the country relating to this recipient.",
    },
    postcode: {
      type: "string",
      label: "Postcode",
      description: "The postcode for this recipient. Note that this may be empty for countries that do not utilise postcodes.",
    },
  },
  async run({ $ }) {
    const { data } = await this.cardly.generatePreview({
      data: {
        artwork: this.artId,
        template: this.templateId,
        recipient: {
          firstName: this.firstName,
          lastName: this.lastName,
          company: this.company,
          address: this.address,
          address2: this.address2,
          city: this.city,
          region: this.region,
          country: this.country,
          postcode: this.postcode,
        },
      },
      $,
    });

    if (data) {
      $.export("summary", "Successully generated preview.");
    }

    return data;
  },
};
