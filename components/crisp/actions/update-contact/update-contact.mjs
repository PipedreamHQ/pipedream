import crisp from "../../crisp.app.mjs";

export default {
  key: "crisp-update-contact",
  name: "Update Contact",
  description: "Update a contact. [See the documentation](https://docs.crisp.chat/references/rest-api/v1/#update-people-profile)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    crisp,
    personId: {
      propDefinition: [
        crisp,
        "personId",
      ],
    },
    email: {
      propDefinition: [
        crisp,
        "email",
      ],
      optional: true,
    },
    nickname: {
      propDefinition: [
        crisp,
        "nickname",
      ],
      optional: true,
    },
    phone: {
      propDefinition: [
        crisp,
        "phone",
      ],
    },
    address: {
      propDefinition: [
        crisp,
        "address",
      ],
    },
    description: {
      propDefinition: [
        crisp,
        "description",
      ],
    },
    website: {
      propDefinition: [
        crisp,
        "website",
      ],
    },
    company: {
      propDefinition: [
        crisp,
        "company",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.crisp.updatePerson({
      $,
      personId: this.personId,
      data: {
        email: this.email,
        person: {
          nickname: this.nickname,
          phone: this.phone,
          address: this.address,
          description: this.description,
          website: this.website,
        },
        company: this.company
          ? {
            name: this.company,
          }
          : undefined,
      },
    });
    if (response?.data?.people_id) {
      $.export("$summary", `Successfully updated contact with ID: ${response.data.people_id}.`);
    }

    return response;
  },
};
