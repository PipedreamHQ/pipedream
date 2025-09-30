import littleGreenLight from "../../little_green_light.app.mjs";

export default {
  key: "little_green_light-update-constituent",
  name: "Update Constituent",
  description: "Updates a constituent along with related objects in Little Green Light. [See the documentation](https://api.littlegreenlight.com/api-docs/static.html#update_constituent)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    littleGreenLight,
    constituentId: {
      propDefinition: [
        littleGreenLight,
        "constituentId",
      ],
    },
    externalConstituentId: {
      type: "string",
      label: "External Constituent Id",
      description: "The external identifier to the new constituent.",
      optional: true,
    },
    isOrg: {
      type: "boolean",
      label: "Is Org",
      description: "This constituent is an organization or company.",
      optional: true,
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The first name of the constituent.",
    },
    middleName: {
      type: "string",
      label: "Middle Name",
      description: "The middle name of the constituent.",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The last name of the constituent.",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email Address of the constituent.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.littleGreenLight.updateConstituent({
      $,
      constituentId: this.constituentId,
      data: {
        external_constituent_id: this.externalConstituentId,
        is_org: this.isOrg,
        first_name: this.firstName,
        org_name: this.firstName,
        middle_name: this.middleName,
        last_name: this.lastName,
        email_addresses: [
          {
            address: this.email,
          },
        ],
      },
    });

    $.export("$summary", `Successfully updated constituent with ID ${this.constituentId}!`);
    return response;
  },
};
