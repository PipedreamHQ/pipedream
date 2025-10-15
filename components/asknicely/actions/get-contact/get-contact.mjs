import asknicely from "../../asknicely.app.mjs";

export default {
  key: "asknicely-get-contact",
  name: "Get Contact",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Get the details of a particular contact. [See the documentation](https://demo.asknice.ly/help/apidocs/getcontact)",
  type: "action",
  props: {
    asknicely,
    key: {
      type: "string",
      label: "Key",
      description: "By default this is email, but you could search by any value eg a customer property set via the API.",
      default: "email",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Value to search, eg email address of a contact.",
    },
  },
  async run({ $ }) {
    const {
      asknicely,
      ...params
    } = this;

    const response = await asknicely.getContact({
      $,
      ...params,
    });

    $.export("$summary", `The contact with Id: ${response.data?.id} was successfully fetched!`);
    return response;
  },
};
