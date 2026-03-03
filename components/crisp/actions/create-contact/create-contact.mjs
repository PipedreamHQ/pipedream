import crisp from "../../crisp.app.mjs";

export default {
  key: "crisp-create-contact",
  name: "Create Contact",
  description: "Create a new contact. [See the documentation](https://docs.crisp.chat/references/rest-api/v1/#add-new-people-profile)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    crisp,
    email: {
      propDefinition: [
        crisp,
        "email",
      ],
    },
    nickname: {
      propDefinition: [
        crisp,
        "nickname",
      ],
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
    const response = await this.crisp.createPerson({
      $,
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
      $.export("$summary", `Successfully created contact with ID: ${response.data.people_id}.`);
    }

    return response;
  },
};
