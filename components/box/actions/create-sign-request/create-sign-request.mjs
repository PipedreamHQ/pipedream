import { ConfigurationError } from "@pipedream/platform";
import app from "../../box.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  name: "Create Box Sign Request",
  description: "Creates a signature request. This involves preparing a document for signing and sending the signature request to signers. [See the documentation](https://developer.box.com/reference/post-sign-requests/).",
  key: "box-create-sign-request",
  version: "0.0.2",
  type: "action",
  props: {
    app,
    signers: {
      type: "string[]",
      label: "Signers",
      description: "Array of signers for the signature request. Each signer should be a JSON object with at least an email property. [See the documentation](https://developer.box.com/reference/post-sign-requests/#param-signers) for more information. Example: `{\"email\": \"signer@example.com\", \"role\": \"signer\"}`",
    },
    name: {
      type: "string",
      label: "Request Name",
      description: "Name of the signature request",
      optional: true,
    },
    parentFolder: {
      propDefinition: [
        app,
        "parentId",
      ],
      label: "Parent Folder",
      description: "The destination folder to place final, signed document and signing log. Uses root folder (0) if not specified",
      optional: true,
    },
    emailSubject: {
      type: "string",
      label: "Email Subject",
      description: "Subject of sign request email. If not provided, a default subject will be used",
      optional: true,
    },
    emailMessage: {
      type: "string",
      label: "Email Message",
      description: "Message to include in sign request email. If not provided, a default message will be used",
      optional: true,
    },
    redirectUrl: {
      type: "string",
      label: "Redirect URL",
      description: "The URI that a signer will be redirected to after signing a document",
      optional: true,
    },
    declinedRedirectUrl: {
      type: "string",
      label: "Declined Redirect URL",
      description: "The URI that a signer will be redirected to after declining to sign a document",
      optional: true,
    },
    additionalOptions: {
      type: "object",
      label: "Additional Options",
      description: "Additional parameters to send in the request. See the [documentation](https://developer.box.com/reference/post-sign-requests/) for all available parameters. Values will be parsed as JSON where applicable",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      signers,
      name,
      parentFolder,
      emailSubject,
      emailMessage,
      redirectUrl,
      declinedRedirectUrl,
      additionalOptions,
    } = this;

    const parsedSigners = signers.map((signer) => {
      try {
        return typeof signer === "string"
          ? JSON.parse(signer)
          : signer;
      } catch (error) {
        throw new ConfigurationError(`Error parsing signer as JSON: ${error}`);
      }
    });

    const data = {
      signers: parsedSigners,
      name,
      email_subject: emailSubject,
      email_message: emailMessage,
      redirect_url: redirectUrl,
      declined_redirect_url: declinedRedirectUrl,
      ...(additionalOptions
        ? utils.parseObjectEntries(additionalOptions)
        : {}),
    };

    if (parentFolder) {
      data.parent_folder = {
        id: parentFolder,
        type: "folder",
      };
    }

    const response = await this.app.createSignRequest({
      $,
      data,
    });

    $.export("$summary", `Successfully created Box sign request (ID: ${response.id})`);
    return response;
  },
};
