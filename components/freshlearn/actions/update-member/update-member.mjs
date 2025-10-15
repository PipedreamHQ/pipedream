import freshlearn from "../../freshlearn.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "freshlearn-update-member",
  name: "Update Member",
  description: "Updates the details of an existing member. [See the documentation](https://freshlearn.com/support/api#updateMember)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
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
      description: "Member’s email address, (email can not be modified)",
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
    },
    city: {
      propDefinition: [
        freshlearn,
        "city",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.freshlearn.updateMember({
      data: utils.cleanObject({
        email: this.email,
        fullName: this.fullName,
        source: this.source,
        phone: this.phone,
        city: this.city,
      }),
      $,
    });

    if (response?.id) {
      $.export("$summary", `Successfully created new member with ID ${response.id}.`);
    }

    return response;
  },
};
