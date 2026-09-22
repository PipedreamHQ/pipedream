import gosquared from "../../gosquared.app.mjs";

export default {
  key: "gosquared-create-update-profile",
  name: "Create/Update Profile",
  description: "Create or update a user profile in GoSquared People CRM. [See the documentation](https://www.gosquared.com/docs/tracking/identify/)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    gosquared,
    siteToken: {
      propDefinition: [
        gosquared,
        "siteToken",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the user. This is used as the unique identifier.",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the user",
      optional: true,
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the user",
      optional: true,
    },
    companyName: {
      type: "string",
      label: "Company Name",
      description: "The name of the company.",
      optional: true,
    },
    companySize: {
      type: "string",
      label: "Company Size",
      description: "The number of employees the company has.",
      optional: true,
    },
    companyIndustry: {
      type: "string",
      label: "Company Industry",
      description: "The industry the company is in.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.gosquared.identify({
      $,
      params: {
        site_token: this.siteToken,
      },
      data: {
        person_id: `email:${this.email}`,
        properties: {
          email: this.email,
          first_name: this.firstName,
          last_name: this.lastName,
          company: {
            name: this.companyName,
            industry: this.companyIndustry,
            size: this.companySize,
          },
        },
      },
    });

    $.export("$summary", `Successfully created/updated profile for ${this.email}`);
    return response;
  },
};

