import clerk from "../../clerk.app.mjs";
import {
  parseError, parseObject,
} from "../../common/utils.mjs";

export default {
  key: "clerk-create-user",
  name: "Create User",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Creates a new user. Your user management settings determine how you should setup your user model. [See the documentation](https://clerk.com/docs/reference/backend-api/tag/Users#operation/CreateUser)",
  type: "action",
  props: {
    clerk,
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
    emailAddress: {
      type: "string[]",
      label: "Email Addresses",
      description: "Email addresses to add to the user. Must be unique across your instance. The first email address will be set as the user's primary email address.",
    },
    phoneNumber: {
      type: "string[]",
      label: "Phone Numbers",
      description: "Phone numbers to add to the user. Must be unique across your instance. The first phone number will be set as user's primary phone number.",
      optional: true,
    },
    web3Wallet: {
      type: "string[]",
      label: "Web3 Wallets",
      description: "Web3 wallets to add to the user. Must be unique across your instance. The first wallet will be set as the user's primary wallet.",
      optional: true,
    },
    username: {
      propDefinition: [
        clerk,
        "username",
      ],
      optional: true,
    },
    password: {
      propDefinition: [
        clerk,
        "password",
      ],
    },
    passwordDigest: {
      type: "string",
      label: "Password Digest",
      description: "In case you already have the password digests and not the passswords, you can use them for the newly created user via this property. The digests should be generated with one of the supported algorithms. The hashing algorithm can be specified using the `Password Hasher` property.",
      optional: true,
    },
    passwordHasher: {
      type: "string",
      label: "Password Hasher",
      description: "The hashing algorithm that was used to generate the password digest. The algorithms that Clerk supports at the moment are `bcrypt`, `bcrypt_sha256_django`, `md5`, `pbkdf2_sha256`, `pbkdf2_sha256_django`, `phpass`, `scrypt_firebase` and 2 `argon2` variants, `argon2i` and `argon2id`. Each of the above expects the incoming digest to be of a particular format. [See the documentarion](https://clerk.com/docs/reference/backend-api/tag/Users#operation/CreateUser!path=password_hasher&t=request) for further information.",
      optional: true,
    },
    skipPasswordChecks: {
      propDefinition: [
        clerk,
        "skipPasswordChecks",
      ],
      optional: true,
    },
    skipPasswordRequirement: {
      type: "boolean",
      label: "Skip Password Requirement",
      description: "When set to `true`, `password` is not required anymore when creating the user and can be omitted. This is useful when you are trying to create a user that doesn't have a password, in an instance that is using passwords. Please note that you cannot use this flag if password is the only way for a user to sign into your instance.",
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
    createdAt: {
      propDefinition: [
        clerk,
        "createdAt",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    if (this.passwordDigest) {
      this.password = null;
    }
    try {
      const response = await this.clerk.createUser({
        $,
        data: {
          external_id: this.externalId,
          first_name: this.firstName,
          last_name: this.lastName,
          email_address: parseObject(this.emailAddress),
          phone_number: parseObject(this.phoneNumber),
          web3_wallet: parseObject(this.web3Wallet),
          username: this.username,
          password: this.password,
          password_digest: this.passwordDigest,
          password_hasher: this.passwordHasher,
          skip_password_checks: this.skipPasswordChecks,
          skip_password_requirement: this.skipPasswordRequirement,
          totp_secret: this.totpSecret,
          backup_codes: parseObject(this.backupCodes),
          public_metadata: parseObject(this.publicMetadata),
          private_metadata: parseObject(this.privateMetadata),
          unsafe_metadata: parseObject(this.unsafeMetadata),
          created_at: this.createdAt,
        },
      });

      $.export("$summary", `A new user with Id: ${response.id} was successfully created!`);
      return response;
    } catch (err) {
      return parseError(err);
    }
  },
};
