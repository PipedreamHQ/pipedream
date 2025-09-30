import rocketreachApp from "../../rocketreach.app.mjs";

export default {
  key: "rocketreach-lookup-profile",
  name: "lookup profile",
  description: "Lookup the profile of a person. [See docs here](https://rocketreach.co/api?section=api_section_ws_lookupProfile)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    rocketreachApp,
    currentEmployer: {
      label: "Current Employer",
      type: "string",
      description: "Current employer's name",
      optional: true,
    },
    id: {
      label: "ID",
      type: "string",
      description: "RocketReach specific ID of the person you are looking for",
      optional: true,
    },
    email: {
      label: "Email",
      type: "string",
      description: "Email address of the person you're looking for",
      optional: true,
    },
    name: {
      label: "Name",
      type: "string",
      propDefinition: [
        rocketreachApp,
        "name",
      ],
    },
    linkedinUrl: {
      label: "LinkedIn URL",
      type: "string",
      propDefinition: [
        rocketreachApp,
        "linkedinUrl",
      ],
    },
  },
  async run({ $ }) {
    if (this.name && !this.currentEmployer && !this.email && !this.id && !this.linkedinUrl) {
      throw new Error("This action requires more information. Please enter one or more of the following above: Current employer, Email, ID, LinkedIn URL.");
    }
    else if (!this.name && this.currentEmployer && !this.email && !this.id && !this.linkedinUrl) {
      throw new Error("This action requires more information. Please enter one or more of the following above: Name, Email, ID, LinkedIn URL.");
    }
    const params = {
      name: this.name,
      current_employer: this.currentEmployer,
      li_url: this.linkedinUrl,
      id: this.id,
      email: this.email,
    };
    const response = await this.rocketreachApp.lookupProfile(params, $);

    $.export("$summary", `Successfully found "${response.name}"`);
    return response;
  },
};
