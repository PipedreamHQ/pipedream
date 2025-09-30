import ignisign from "../../ignisign.app.mjs";

export default {
  key: "ignisign-create-signer",
  name: "Create Signer",
  description: "Creates a new signer entity in IgniSign. [See the documentation](https://ignisign.io/docs/ignisign-api/create-signer)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ignisign,
    signerProfileId: {
      propDefinition: [
        ignisign,
        "signerProfileId",
      ],
      optional: true,
    },
    externalId: {
      propDefinition: [
        ignisign,
        "externalId",
      ],
      optional: true,
    },
    firstName: {
      propDefinition: [
        ignisign,
        "firstName",
      ],
      optional: true,
    },
    lastName: {
      propDefinition: [
        ignisign,
        "lastName",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        ignisign,
        "email",
      ],
    },
    phoneNumber: {
      propDefinition: [
        ignisign,
        "phoneNumber",
      ],
      optional: true,
    },
    nationality: {
      propDefinition: [
        ignisign,
        "nationality",
      ],
      optional: true,
    },
    birthDate: {
      propDefinition: [
        ignisign,
        "birthDate",
      ],
      optional: true,
    },
    birthPlace: {
      propDefinition: [
        ignisign,
        "birthPlace",
      ],
      optional: true,
    },
    birthCountry: {
      propDefinition: [
        ignisign,
        "birthCountry",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      ignisign,
      ...data
    } = this;

    const response = await ignisign.createSigner({
      $,
      data,
    });

    $.export("$summary", `Successfully created signer with ID: ${response.signerId}`);
    return response;
  },
};
