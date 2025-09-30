import clerk from "../../clerk.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "clerk-create-user-invitation",
  name: "Create User Invitation",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new invitation for the given email address and sends the invitation email. Keep in mind that you cannot create an invitation if there is already one for the given email address. Also, trying to create an invitation for an email address that already exists in your application will result to an error. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Invitations#operation/CreateInvitation)",
  type: "action",
  props: {
    clerk,
    emailAddress: {
      type: "string",
      label: "Email Address",
      description: "The email address the invitation will be sent to.",
    },
    publicMetadata: {
      propDefinition: [
        clerk,
        "publicMetadata",
      ],
      description: "Metadata that will be attached to the newly created invitation. The value of this property should be a well-formed JSON object. Once the user accepts the invitation and signs up, these metadata will end up in the user's public metadata.",
      optional: true,
    },
    redirectUrl: {
      type: "string",
      label: "Redirect URL",
      description: "Optional URL which specifies where to redirect the user once they click the invitation link. This is only required if you have implemented a [custom flow](https://clerk.com/docs/custom-flows/invitations#custom-flow) and you're not using Clerk Hosted Pages or Clerk Components.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.clerk.createUserInvitation({
      $,
      data: {
        email_address: this.emailAddress,
        public_metadata: parseObject(this.publicMetadata),
        redirect_url: this.redirectUrl,
      },
    });

    $.export("$summary", `A new invitation with Id: ${response.id} was successfully created!`);
    return response;
  },
};
