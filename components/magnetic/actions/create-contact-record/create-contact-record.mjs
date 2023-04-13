import magnetic from "../../magnetic.app.mjs";

export default {
  key: "magnetic-create-contact-record",
  name: "Create Contact Record",
  description: "Make a record on an existing contact. [See docs here](https://app.magnetichq.com/Magnetic/API.do#cl-f-contactcomment)",
  //version: "0.0.1",
  version: "0.0.13",
  type: "action",
  props: {
    magnetic,
    contact: {
      propDefinition: [
        magnetic,
        "contact",
      ],
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to be added",
    },
    commentType: {
      propDefinition: [
        magnetic,
        "commentType",
      ],
    },
    followUpDate: {
      type: "string",
      label: "Follow Up Date",
      description: "Follow Up Date of the new task in ISO 8601 format",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      contactId: this.contactId,
    };
    const data = {
      message: this.message,
      type: this.commentType,
      //    followUpDate: Date.parse(this.followUpDate)/1000,
    };

    const response = await this.magnetic.createContactComment({
      params,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created contact record with ID ${response.id}`);
    }

    return response;
  },
};
