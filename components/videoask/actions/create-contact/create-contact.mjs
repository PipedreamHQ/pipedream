import videoask from "../../videoask.app.mjs";

export default {
  key: "videoask-create-contact",
  name: "Create Contact",
  description: "Creates a new contact directly in VideoAsk. [See the documentation](https://developers.videoask.com/#48ed4b01-13f2-4596-9612-b60825a91511)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    videoask,
    organizationId: {
      propDefinition: [
        videoask,
        "organizationId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the new contact",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the new contact",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the new contact",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.videoask.createContact({
      $,
      organizationId: this.organizationId,
      data: {
        email: this.email,
        name: this.name,
        phone_number: this.phone,
      },
    });
    $.export("$summary", `Successfully created contact with ID: ${response.id}`);
    return response;
  },
};
