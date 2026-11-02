import common from "../common/insert-chip.mjs";

const {
  googleDocs, documentId, ...locationProps
} = common.props;

export default {
  ...common,
  key: "google_docs-insert-rich-link",
  name: "Insert File Chip (Rich Link)",
  description: "Insert a file smart chip (rich link) to a Google Drive file into a Google Doc — the chip shows the file's live title and icon, unlike a plain hyperlink. Use it to reference another Doc, Sheet, Slides deck, Drive file or Drive folder. Only Google Drive URLs are accepted: YouTube, Calendar, Maps and other websites fail with `The URL is invalid`, and `Error fetching chip data` means the file doesn't exist or this account can't open it. Get a document's URL from **Find Document** (`url`). Place the chip with **Placeholder** (replace text such as `{{spec}}` that you wrote with **Insert Text**) or with **Position**; in a multi-tab document either set **Tab ID** (from **List Tabs**) or use **Placeholder**. Example: call with documentId=`1AbC...`, url=`https://docs.google.com/document/d/1XyZ.../edit`, placeholder=`{{spec}}` → returns `chipsInserted`, each chip's `tabId` and `index`, and the document `url`. [See the documentation](https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/request#InsertRichLinkRequest)",
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
    url: {
      type: "string",
      label: "File URL",
      description: "URL of the Google Drive file or folder to link, e.g. `https://docs.google.com/document/d/1XyZ.../edit`, `https://docs.google.com/spreadsheets/d/1XyZ.../edit`, or `https://drive.google.com/drive/folders/1XyZ...`. Google sets the chip's title from the file, so no title is needed.",
    },
    ...locationProps,
  },
  methods: {
    ...common.methods,
    chipRequest() {
      return [
        "insertRichLink",
        {
          richLinkProperties: {
            uri: this.url.trim(),
          },
        },
      ];
    },
  },
  async run({ $ }) {
    const result = await this.insertChips();
    $.export("$summary", `Inserted ${result.chipsInserted} file chip${result.chipsInserted === 1
      ? ""
      : "s"} into document ${this.documentId}`);
    return result;
  },
};
