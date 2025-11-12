import app from "../../contactout.app.mjs";

export default {
  key: "contactout-linkedin-profile-enrich",
  name: "Enrich LinkedIn Profile",
  description: "Get profile details for a LinkedIn profile using either a LinkedIn URL or email address. [See the documentation](https://api.contactout.com/#from-linkedin-url).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    inputType: {
      type: "string",
      label: "Input Type",
      description: "Choose whether to enrich using a LinkedIn profile URL or email address",
      options: [
        {
          label: "LinkedIn Profile URL",
          value: "profile",
        },
        {
          label: "Email Address",
          value: "email",
        },
      ],
      reloadProps: true,
    },
  },
  async additionalProps() {
    const props = {};

    if (this.inputType === "profile") {
      props.profile = {
        type: "string",
        label: "LinkedIn Profile URL",
        description: "The LinkedIn profile URL to enrich (regular LinkedIn URLs only, not Sales Navigator or Talent/Recruiter URLs). URL must begin with `http` and must contain `linkedin.com/in/` or `linkedin.com/pub/`.",
      };
    } else if (this.inputType === "email") {
      props.email = {
        type: "string",
        label: "Email Address",
        description: "The email address to find and enrich LinkedIn profile for",
      };
    }

    return props;
  },
  async run({ $ }) {
    const {
      app,
      inputType,
      profile,
      email,
    } = this;

    // Validate that the correct input is provided based on inputType
    if (inputType === "profile" && !profile) {
      throw new Error("LinkedIn profile URL is required when input type is 'profile'");
    }
    if (inputType === "email" && !email) {
      throw new Error("Email address is required when input type is 'email'");
    }

    // Build params based on input type
    const params = {};
    if (inputType === "profile") {
      params.profile = profile;
    } else if (inputType === "email") {
      params.email = email;
    }

    const response = await app.enrichLinkedInProfile({
      $,
      params,
    });

    const inputValue = inputType === "profile"
      ? profile
      : email;
    $.export("$summary", `Successfully enriched LinkedIn profile from ${inputType}: ${inputValue}`);
    return response;
  },
};
