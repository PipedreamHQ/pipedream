import app from "../../lever.app.mjs";

export default {
  key: "lever-get-posting",
  name: "Get Posting",
  description:
    "Returns full details for a single job posting by ID, including its complete job description."
    + " Use this to read a specific role's description, requirements, and closing text — the response `content` object holds `description`/`descriptionHtml`, `lists` (e.g. requirements), and `closing`/`closingHtml`, plus `salaryDescription`, `salaryRange`, `categories` (team, department, location, commitment, level), `state`, and application `urls`."
    + " Use **List Postings** to find posting IDs."
    + " Example: call with postingId=\"<id>\" → returns the posting with its full job description under `content.description`."
    + " [See the documentation](https://hire.lever.co/developer/documentation#retrieve-a-single-posting)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    postingId: {
      propDefinition: [
        app,
        "postingId",
      ],
      description: "The ID of the posting to retrieve. Use **List Postings** to find posting IDs.",
      optional: false,
    },
  },
  async run({ $ }) {
    const response = await this.app.getPosting(this.postingId, {
      $,
    });
    const posting = response.data ?? response;
    const name = posting.text ?? posting.id;
    $.export("$summary", `Retrieved posting ${name}`);
    return posting;
  },
};
