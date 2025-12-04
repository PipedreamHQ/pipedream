import app from "../../chmeetings.app.mjs";

export default {
  key: "chmeetings-create-person",
  name: "Create Person",
  description: "Create a new person in ChMeetings. [See the documentation](https://api.chmeetings.com/scalar/?_gl=1*xb9g3y*_gcl_au*MTI4MjM0MTM4Mi4xNzUzNzIxOTQw#tag/people/post/apiv1people)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    firstName: {
      propDefinition: [
        app,
        "firstName",
      ],
    },
    lastName: {
      propDefinition: [
        app,
        "lastName",
      ],
    },
    email: {
      propDefinition: [
        app,
        "email",
      ],
    },
    mobile: {
      propDefinition: [
        app,
        "mobile",
      ],
    },
    birthDate: {
      propDefinition: [
        app,
        "birthDate",
      ],
    },
    church: {
      propDefinition: [
        app,
        "church",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.createPerson({
      $,
      data: {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        mobile: this.mobile,
        birth_date: this.birthDate,
        church: this.church,
      },
    });
    $.export("$summary", "Successfully created new contribution with ID: " + response.id);
    return response;
  },
};
