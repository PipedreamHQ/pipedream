import freshlearn from "../../freshlearn.app.mjs";

export default {
  key: "freshlearn-create-member",
  name: "Create Member",
  description: "Creates a new member within FreshLearn. [See the documentation](https://freshlearn.com/support/api#createMember)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    freshlearn,
    email: {
      propDefinition: [
        freshlearn,
        "email",
      ],
    },
    fullName: {
      propDefinition: [
        freshlearn,
        "fullName",
      ],
    },
    source: {
      propDefinition: [
        freshlearn,
        "source",
      ],
    },
    phone: {
      propDefinition: [
        freshlearn,
        "phone",
      ],
      optional: true,
    },
    city: {
      propDefinition: [
        freshlearn,
        "city",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.createMember({
      data: {
        email: this.email,
        fullName: this.fullName,
        source: this.source,
        phone: this.phone,
        city: this.city,
      },
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created new member with ID ${response.id}.`);
    }

    return response;
  },
};
