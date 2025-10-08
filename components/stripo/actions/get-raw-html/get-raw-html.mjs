import stripo from "../../stripo.app.mjs";

export default {
  key: "stripo-get-raw-html",
  name: "Get Raw HTML & CSS",
  description: "Retrieves the HTML and CSS code of the selected email message in Stripo. [See the documentation](https://api.stripo.email/reference/getrawemail)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    stripo,
    emailId: {
      propDefinition: [
        stripo,
        "emailId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.stripo.getRawHtml({
      $,
      emailId: this.emailId,
    });
    $.export("$summary", `Successfully retrieved HTML & CSS from email with ID: ${this.emailId}`);
    return response;
  },
};
