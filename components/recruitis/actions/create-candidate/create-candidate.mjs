import { ConfigurationError } from "@pipedream/platform";
import app from "../../recruitis.app.mjs";

export default {
  key: "recruitis-create-candidate",
  name: "Create Candidate",
  description: "Create a new candidate. [See the documentation](https://docs.recruitis.io/api/#tag/Candidates/paths/~1candidates/post)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    phone: {
      propDefinition: [
        app,
        "phone",
      ],
    },
    twitter: {
      propDefinition: [
        app,
        "twitter",
      ],
    },
    facebook: {
      propDefinition: [
        app,
        "facebook",
      ],
    },
    linkedin: {
      propDefinition: [
        app,
        "linkedin",
      ],
    },
    skype: {
      propDefinition: [
        app,
        "skype",
      ],
    },
    gdprAgreement: {
      propDefinition: [
        app,
        "gdprAgreement",
      ],
    },
  },
  async run({ $ }) {
    if (this.linkedin && !this.linkedin.includes("/in")) {
      throw new ConfigurationError("Linkedin URL is wrong, it should contain \"/in\". E.g https://linkedin.com/in/pipedream");
    }

    const response = await this.app.createCandidate({
      $,
      data: {
        job_id: this.jobID,
        email: this.email,
        name: this.name,
        phone: this.phone,
        twitter: this.twitter,
        facebook: this.facebook,
        linkedin: this.linkedin,
        skype: this.skype,
        gdpr_agreement: this.gdprAgreement,
      },
    });

    $.export("$summary", `Successfully created user with ID: '${response.payload.id}'`);

    return response;
  },
};
