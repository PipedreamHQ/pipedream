import { axios } from "@pipedream/platform";

export default {
  key: "rocketreach-lookup-profile",
  name: "lookup profile",
  description: "Lookup the profile of a person",
  version: "0.0.1",
  type: "action",
  props: {
    rocketreach: {
      type: "app",
      app: "rocketreach",
    },
    name: {
      type: "string",
      description: "Name of the person you are looking for",
      optional: true,
    },
    currentEmployer: {
      type: "string",
      description: "Current employer name",
      optional: true,
    },
    linkedinUrl: {
      type: "string",
      description: "LinkedIn URL",
      optional: true,
    },
    id: {
      type: "string",
      description: "RocketReach specific Id of the person you are looking for",
      optional: true,
    },
    email: {
      type: "string",
      description: "Email address of the person you're looking for",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.name && !this.currentEmployer && !this.email && !this.id && !this.linkedinUrl) {
      throw new Error("This action requires more information. Please enter one or more of the following above: current employer, email, id, LinkedIn URL.");
    }
    else if (!this.name && this.currentEmployer && !this.email && !this.id && !this.linkedinUrl) {
      throw new Error("This action requires more information. Please enter one or more of the following above: name, email, id, LinkedIn URL.");
    }
    const response = await axios($, {
      url: "https://api.rocketreach.co/v2/api/lookupProfile",
      method: "GET",
      params: {
        api_key: `${this.rocketreach.$auth.api_key}`,
        name: this.name,
        current_employer: this.currentEmployer,
        li_url: this.linkedinUrl,
        id: this.id,
        email: this.email,
      },
    });

    $.export("$summary", `Successfully found "${response.name}"`);
    return response;
  },
};
