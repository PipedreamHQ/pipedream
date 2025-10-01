import zenler from "../../zenler.app.mjs";

export default {
  key: "zenler-register-live-class",
  name: "Register Live Class",
  description: "Registers a live class. [See the docs here](https://www.newzenler.com/api/documentation/public/api-doc.html#1966fea2-8274-49bd-f96d-54c215f9d301)",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    zenler,
    liveClassId: {
      propDefinition: [
        zenler,
        "liveClassId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the live class",
    },
    email: {
      type: "string",
      label: "Email",
      description: "Email of the live class",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "Last Name",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      liveClassId,
      name,
      email,
      lastName,
    } = this;

    const response = await this.zenler.registerLiveClass({
      liveClassId,
      data: {
        name,
        email,
        last_name: lastName,
      },
    });

    if (typeof(response) === "string") {
      console.log(response);
      throw new Error("Response error");
    }

    const { data } = response;

    $.export("$summary", data.message);

    return response;
  },
};
