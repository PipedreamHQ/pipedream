import app from "../../google_docs.app.mjs";
import common from "@pipedream/google_drive/actions/create-file-from-template/create-file-from-template.mjs";

import utils from "../../common/utils.mjs";

const {
  // eslint-disable-next-line no-unused-vars
  name, description, type, ...others
} = common;
const props = utils.adjustPropDefinitions(others.props, app);

export default {
  ...others,
  key: "google_docs-create-document-from-template",
  name: "Create New Document From Template",
  version: "0.0.7",
  description,
  type,
  props: {
    googleDrive: app,
    ...props,
    drive: {
      propDefinition: [
        app,
        "watchedDrive",
      ],
      optional: true,
    },
    templateId: {
      propDefinition: [
        app,
        "docId",
        (c) => ({
          driveId: c.drive,
        }),
      ],
      label: "Template",
      description:
        "Select the template document you'd like to use as the template, or use a custom expression to reference a document ID from a previous step. Template documents should contain placeholders in the format `{{xyz}}`.",
    },
    folderId: {
      propDefinition: [
        app,
        "folderId",
        (c) => ({
          drive: c.drive,
        }),
      ],
      description:
        "Select the folder of the newly created Google Doc and/or PDF, or use a custom expression to reference a folder ID from a previous step.",
      optional: true,
    },
  },
};
