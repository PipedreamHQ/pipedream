import app from "../../google_docs.app.mjs";
import common from "@pipedream/google_drive/actions/find-file/find-file.mjs";
import { getListFilesOpts } from "@pipedream/google_drive/common/utils.mjs";

import utils from "../../common/utils.mjs";

const {
  // eslint-disable-next-line no-unused-vars
  name, description, type, ...others
} = common;
const props = utils.adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "google_docs-find-document",
  name: "Find Document",
  version: "0.0.4",
  description,
  type,
  props: {
    googleDrive: app,
    ...props,
  },
  async run({ $ }) {
    const q = this.getQuery();
    const opts = getListFilesOpts(this.drive, {
      q,
    });
    const files = (await this.googleDrive.listFilesInPage(null, opts)).files?.filter(({ mimeType }) => mimeType === "application/vnd.google-apps.document") || [];

    $.export("$summary", `Successfully found ${files.length} file${files.length === 1
      ? ""
      : "s"} with the query "${q}"`);
    return files;
  },
};
