import clerk from "../../clerk.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "clerk-update-user",
  name: "Update User",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Update a user's attributes. You can set the user's primary contact identifiers (email address and phone numbers) by updating the `Primary Email Address Id` and `Primary Phone Number Id` attributes respectively. Both IDs should correspond to verified identifications that belong to the user. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Users#operation/CreateUser)",
  type: "action",
  props: {
    clerk,
    userId: {
      propDefinition: [
        clerk,
        "userId",
      ],
    },
    externalId: {
      propDefinition: [
        clerk,
        "externalId",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        clerk,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        clerk,
        "lastName",
      ],
      optional: true,
    },
    primaryEmailAddressId: {
      propDefinition: [
        clerk,
        "primaryEmailAddressId",
        ({ userId }) => ({
          userId,
        }),
      ],
      optional: true,
    },
    notifyPrimaryEmailAddressChanged: {
      type: "boolean",
      label: "Notify Primary Email Address Changed",
      description: "If set to `true`, the user will be notified that their primary email address has changed. By default, no notification is sent.",
      optional: true,
    },
    primaryPhoneNumberId: {
      propDefinition: [
        clerk,
        "primaryPhoneNumberId",
        ({ userId }) => ({
          userId,
        }),
      ],
      optional: true,
    },
    primaryWeb3WalletId: {
      propDefinition: [
        clerk,
        "primaryWeb3WalletId",
        ({ userId }) => ({
          userId,
        }),
      ],
      optional: true,
    },
    username: {
      propDefinition: [
        clerk,
        "username",
      ],
      optional: true,
    },
    profileImageId: {
      type: "string",
      label: "Profile Image Id",
      description: "The ID of the image to set as the user's profile image",
      optional: true,
    },
    password: {
      propDefinition: [
        clerk,
        "password",
      ],
      optional: true,
    },
    skipPasswordChecks: {
      propDefinition: [
        clerk,
        "skipPasswordChecks",
      ],
      optional: true,
    },
    signOutOfOtherSessions: {
      type: "boolean",
      label: "Sign Out Of Other Sessions",
      description: "Set to `true` to sign out the user from all their active sessions once their password is updated. This parameter can only be used when providing a `password`.",
      optional: true,
    },
    totpSecret: {
      propDefinition: [
        clerk,
        "totpSecret",
      ],
      optional: true,
    },
    backupCodes: {
      propDefinition: [
        clerk,
        "backupCodes",
      ],
      optional: true,
    },
    publicMetadata: {
      propDefinition: [
        clerk,
        "publicMetadata",
      ],
      optional: true,
    },
    privateMetadata: {
      propDefinition: [
        clerk,
        "privateMetadata",
      ],
      optional: true,
    },
    unsafeMetadata: {
      propDefinition: [
        clerk,
        "unsafeMetadata",
      ],
      optional: true,
    },
    deleteSelfEnable: {
      type: "boolean",
      label: "Delete Self Enable",
      description: "If `true`, the user can delete themselves with the Frontend API.",
      optional: true,
    },
    createOrganizationEnabled: {
      type: "boolean",
      label: "Create Organization Enabled",
      description: "If true, the user can create organizations with the Frontend API.",
      optional: true,
    },
    createdAt: {
      propDefinition: [
        clerk,
        "createdAt",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      clerk,
      userId,
    } = this;

    const response = await clerk.updateUser({
      $,
      userId,
      data: {
        external_id: this.externalId,
        first_name: this.firstName,
        last_name: this.lastName,
        primary_email_address_id: this.primaryEmailAddressId,
        notify_primary_email_address_changed: this.notifyPrimaryEmailAddressChanged,
        primary_phone_number_id: this.primaryPhoneNumberId,
        primary_web3_wallet_id: this.primaryWeb3WalletId,
        username: this.username,
        profile_image_id: this.profileImageId,
        password: this.password,
        skip_password_checks: this.skipPasswordChecks,
        sign_out_of_other_sessions: this.signOutOfOtherSessions,
        totp_secret: this.totpSecret,
        backup_codes: parseObject(this.backupCodes),
        public_metadata: parseObject(this.publicMetadata),
        private_metadata: parseObject(this.privateMetadata),
        unsafe_metadata: parseObject(this.unsafeMetadata),
        delete_self_enabled: this.deleteSelfEnable,
        create_organization_enabled: this.createOrganizationEnabled,
        created_at: this.createdAt,
      },
    });

    $.export("$summary", `The user with Id: ${userId} was successfully updated!`);
    return response;
  },
};
