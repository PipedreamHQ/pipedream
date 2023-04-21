import dockCerts from "../../dock_certs.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dock_certs-issue-certificate",
  name: "Issue Certificate",
  description: "Issue a new certificate to a specified user. [See the documentation](https://docs.api.dock.io/#credentials)",
  version: "0.0.1",
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
    algorithm: {
      type: "string",
      label: "Algorithm",
      description: "Specifies which signing algorithm to use to sign the issued credential. Defaults to `ed25519`.",
      options: [
        "ed25519",
        "secp256k1",
        "sr25519",
        "dockbbs+",
      ],
      default: "ed25519",
      optional: true,
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
  },
  async run({ $ }) {
    if (this.persist && !this.password) {
      throw new ConfigurationError("Password required if `persist` is `true`.");
    }

    const data = {
      issuer: this.issuerProfile,
      anchor: this.anchor,
      persist: this.persist,
      password: this.password,
      template: this.template,
      algorithm: this.algorithm,
      credential: {
        type: [
          this.type,
        ],
        subject: {
          id: this.subject,
        },
      },
    };

    const response = await this.dockCerts.issueCredential({
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully issued certificate with ID ${response.id}`);
    }

    return response;
  },
};
