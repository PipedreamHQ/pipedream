import common from "../common/insert-chip.mjs";

const {
  googleDocs, documentId, ...locationProps
} = common.props;

export default {
  ...common,
  key: "google_docs-insert-person",
  name: "Insert Person Chip",
  description: "Insert a person smart chip (an @-mention) for an email address into a Google Doc — a real people chip with a hover card, not plain text. Use it whenever someone should be mentioned or tagged in a doc: owners, assignees, attendees, reviewers. For a Google account the chip shows the person's name; any other valid address shows as an email chip. Mentioning someone does not share the document with them. Place the chip with **Placeholder** (replace text such as `{{owner}}` that you wrote with **Insert Text**) or with **Position**; in a multi-tab document either set **Tab ID** (from **List Tabs**) or use **Placeholder**. Use **Find Document** to resolve a document's name to its ID. Example: after inserting `Owner: {{owner}}`, call with documentId=`1AbC...`, email=`alan.grant@example.com`, placeholder=`{{owner}}` → returns `chipsInserted`, each chip's `tabId` and `index`, and the document `url`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertPersonRequest)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    googleDocs,
    documentId,
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the person to mention, e.g. `alan.grant@example.com`. Google fills in the person's name from their account; a name cannot be supplied.",
    },
    ...locationProps,
  },
  methods: {
    ...common.methods,
    chipRequest() {
      return [
        "insertPerson",
        {
          personProperties: {
            email: this.email.trim(),
          },
        },
      ];
    },
  },
  async run({ $ }) {
    const result = await this.insertChips();
    $.export("$summary", `Inserted ${result.chipsInserted} person chip${result.chipsInserted === 1
      ? ""
      : "s"} for ${this.email} into document ${this.documentId}`);
    return result;
  },
};
