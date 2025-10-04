import widgetform from "../../widgetform.app.mjs";

export default {
  key: "widgetform-get-recent-submissions",
  name: "Get Recent Submissions",
  description: "Retrieves the 10 most recent submissions. [See the documentation](https://usewidgetform.notion.site/Zapier-API-185312164ccf808eb902f411608aa35d)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    widgetform,
    form: {
      propDefinition: [
        widgetform,
        "form",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.widgetform.listResponses({
      $,
    });
    const submissions = this.form
      ? response.filter(({ form_name }) => form_name === this.form)
      : response;
    $.export("$summary", `Successfully retrieved ${submissions.length} submission${submissions.length === 1
      ? ""
      : "s"}`);
    return submissions;
  },
};
