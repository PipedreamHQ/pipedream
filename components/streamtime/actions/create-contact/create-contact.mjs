import streamtime from "../../streamtime.app.mjs";

export default {
  key: "streamtime-create-contact",
  name: "Create Contact",
  description: "Create a new contact in Streamtime. [See the documentation](https://documenter.getpostman.com/view/802974/RWgtSwbn?version=latest#5df35cec-ec19-4721-a683-df1e391d6bf0).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    streamtime,
    companyId: {
      propDefinition: [
        streamtime,
        "companyId",
      ],
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "First name of the contact",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last name of the contact",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the contact",
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "Phone number of the contact",
    },
    position: {
      type: "string",
      label: "Position",
      description: "Job position of the contact",
    },
  },
  async run({ $ }) {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      position: this.position,
      contactStatus: {
        id: 1, // Active
      },
    };

    const response = await this.streamtime.createContact({
      companyId: this.companyId,
      data,
      $,
    });

    if (response.id) {
      $.export("$summary", `Successfully created contact with ID ${response.id}.`);
    }

    return response;
  },
};
