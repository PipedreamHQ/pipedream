import asknicely from "../../asknicely.app.mjs";

export default {
  key: "asknicely-get-responses",
  name: "Get Responses",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get the details of a particular contact. [See the documentation](https://demo.asknice.ly/help/apidocs/getcontact)",
  type: "action",
  props: {
    asknicely,
    filter: {
      type: "string",
      label: "Filter",
      description: "Leave blank or **answered** for all survey responses **raw** for all surveys sent, this includes surveys sent and have not been responded to. **published** for only customer testimonials.",
      options: [
        "answered",
        "published",
        "raw",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      asknicely,
      ...args
    } = this;

    const response = asknicely.paginate({
      fn: asknicely.getResponses,
      ...args,
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} response${responseArray.length > 1
      ? "s were"
      : " was"} successfully fetched!`);

    return responseArray;
  },
};
