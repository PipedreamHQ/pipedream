import ignisign from "../../ignisign.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "ignisign-create-signer",
  name: "Create Signer",
  description: "Creates a new signer entity in IgniSign. [See the documentation](https://ignisign.io/docs/ignisign-api/create-signer)",
  version: "0.0.1",
  type: "action",
  props: {
    ignisign,
    signerprofileid: {
      propDefinition: [
        ignisign,
        "signerprofileid",
      ],
    },
    firstname: {
      propDefinition: [
        ignisign,
        "firstname",
      ],
    },
    email: {
      propDefinition: [
        ignisign,
        "email",
      ],
    },
    externalid: {
      propDefinition: [
        ignisign,
        "externalid",
      ],
      optional: true,
    },
    lastname: {
      propDefinition: [
        ignisign,
        "lastname",
      ],
      optional: true,
    },
    phonenumber: {
      propDefinition: [
        ignisign,
        "phonenumber",
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
    birthdate: {
      propDefinition: [
        ignisign,
        "birthdate",
      ],
      optional: true,
    },
    birthplace: {
      propDefinition: [
        ignisign,
        "birthplace",
      ],
      optional: true,
    },
    birthcountry: {
      propDefinition: [
        ignisign,
        "birthcountry",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.ignisign.createSigner({
      data: {
        signerProfileId: this.signerprofileid,
        firstName: this.firstname,
        email: this.email,
        externalId: this.externalid,
        lastName: this.lastname,
        phoneNumber: this.phonenumber,
        nationality: this.nationality,
        birthDate: this.birthdate,
        birthPlace: this.birthplace,
        birthCountry: this.birthcountry,
      },
    });

    $.export("$summary", `Successfully created signer with ID: ${response.signerId}`);
    return response;
  },
};
