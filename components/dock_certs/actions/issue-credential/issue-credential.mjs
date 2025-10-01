import dockCerts from "../../dock_certs.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dock_certs-issue-credential",
  name: "Issue Credential",
  description: "Issue a new credential. [See the documentation](https://docs.api.dock.io/#credentials)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    dockCerts,
    issuerProfile: {
      propDefinition: [
        dockCerts,
        "profile",
      ],
    },
    anchor: {
      type: "boolean",
      label: "Anchor",
      description: "Whether to anchor the credential on the blockchain as soon as it is issued. Defaults to false.",
      default: false,
      optional: true,
    },
    persist: {
      type: "boolean",
      label: "Persist",
      description: "Whether to store an encrypted version of this credential with Dock Certs. Defaults to false, if true you must supply password.",
      default: false,
      optional: true,
    },
    password: {
      type: "string",
      label: "Password",
      description: "Password used to encrypt the credential if you choose to store it. The same password must be used to retrieve the credential contents. Dock does not store this password.",
      optional: true,
    },
    template: {
      propDefinition: [
        dockCerts,
        "templateDesign",
      ],
    },
    type: {
      propDefinition: [
        dockCerts,
        "credentialType",
      ],
    },
    subject: {
      type: "string",
      label: "Credential Subject",
      description: "A unique identifier of the recipient. Example: DID, Email Address, National ID Number, Employee ID, Student ID, etc.",
    },
    status: {
      propDefinition: [
        dockCerts,
        "registry",
      ],
      description: "Identifier of the credential's revocation registry",
      optional: true,
    },
    expirationDate: {
      type: "string",
      label: "Expiration Date",
      description: "The date and time in GMT that the credential expired is specified in RFC 3339 format. The default value of the expirationDate will be empty if the user does not provide it.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.persist && !this.password) {
      throw new ConfigurationError("Password required if `persist` is `true`.");
    }

    const data = {
      anchor: this.anchor,
      persist: this.persist,
      password: this.password,
      template: this.template,
      credential: {
        type: [
          this.type,
        ],
        subject: {
          id: this.subject,
        },
        status: this.status,
        issuer: this.issuerProfile,
        expirationDate: this.expirationDate,
      },
    };

    const response = await this.dockCerts.issueCredential({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully issued credential with ID ${response.id}.`);
    }

    return response;
  },
};
