import fs from "fs";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../lever.app.mjs";

export default {
  key: "lever-download-opportunity-files",
  name: "Download Opportunity Files",
  description:
    "Downloads one or more candidate documents — résumés/CVs, other attached files, and/or offer documents — and saves them to the local file system for use in a later step."
    + " Use this when asked to download, export, or retrieve the actual files (not just their metadata)."
    + " Set `resources` to the document types to pull from: `resumes` (CVs/résumés), `files` (other attachments), `offers` (offer documents). You can select more than one to grab everything at once."
    + " By default it downloads **all** matching documents of the selected types for the opportunity; narrow the set with `fileNameContains` (case-insensitive name/extension filter) and/or `itemIds` (specific document ids from **List Opportunity Items**)."
    + " Use **Search Opportunities** to find the opportunity ID."
    + " Each file is saved to the temporary directory; the action exports `file_paths` and returns a `files` array (each with `resource`, `id`, `name`, `file_path`). Documents that fail to download are reported in `errors` rather than aborting the batch."
    + " Example: to get a candidate's CV and any other documents, call with opportunityId=\"<id>\", resources=[\"resumes\",\"files\"] → downloads every résumé and file and exports their paths. Add fileNameContains=\".pdf\" to limit to PDFs."
    + " [See the documentation](https://hire.lever.co/developer/documentation#download-a-resume-file)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    opportunityId: {
      propDefinition: [
        app,
        "opportunityId",
      ],
      description: "The ID of the opportunity whose documents to download. Use **Search Opportunities** to find opportunity IDs.",
    },
    resources: {
      type: "string[]",
      label: "Document Types",
      description: "Which document types to download from. Select one or more.",
      options: [
        "resumes",
        "files",
        "offers",
      ],
    },
    fileNameContains: {
      type: "string",
      label: "File Name Contains",
      description: "Only download documents whose file name contains this text (case-insensitive). Matches extensions too, e.g. `.pdf`. Omit to download all.",
      optional: true,
    },
    itemIds: {
      type: "string[]",
      label: "Document IDs",
      description: "Restrict to these specific document ids (across the selected types). Use **List Opportunity Items** to find ids. Omit to download all matching documents.",
      optional: true,
    },
    // The otherwise ephemeral /tmp directory is synced to a remote directory (when the execution
    // context configures one), so files written here are available to future steps.
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
      optional: true,
    },
  },
  methods: {
    // Filename lives at different paths per document type: resumes nest it under
    // `file`, files expose it at the top level, offers have neither — fall back to id.
    documentName(resource, item) {
      return item.file?.name ?? item.name ?? `${resource.replace(/s$/, "")}-${item.id}`;
    },
  },
  async run({ $ }) {
    const filter = this.fileNameContains?.toLowerCase();
    const onlyIds = this.itemIds?.length
      ? new Set(this.itemIds)
      : null;

    const files = [];
    const errors = [];

    for (const resource of this.resources) {
      const listResponse = await this.app.listOpportunityItems(this.opportunityId, resource, {
        $,
      });
      const items = listResponse.data ?? listResponse ?? [];
      for (const item of items) {
        if (onlyIds && !onlyIds.has(item.id)) continue;
        const name = this.documentName(resource, item);
        if (filter && !name.toLowerCase().includes(filter)) continue;
        try {
          const data = await this.app.downloadOpportunityFile(
            this.opportunityId,
            resource,
            item.id,
            {
              $,
            },
          );
          const filePath = `${process.env.STASH_DIR || "/tmp"}/${name}`;
          fs.writeFileSync(filePath, Buffer.from(data));
          files.push({
            resource,
            id: item.id,
            name,
            file_path: filePath,
          });
        } catch (err) {
          errors.push({
            resource,
            id: item.id,
            name,
            error: err.message,
          });
        }
      }
    }

    if (!files.length && errors.length) {
      const detail = errors.map((e) => `${e.name} (${e.error})`).join("; ");
      throw new ConfigurationError(`Failed to download ${errors.length} file(s): ${detail}`);
    }

    $.export("$summary", `Downloaded ${files.length} file${files.length === 1
      ? ""
      : "s"}${errors.length
      ? ` (${errors.length} failed)`
      : ""}`);
    $.export("file_paths", files.map((f) => f.file_path));
    return {
      files,
      errors,
    };
  },
};
