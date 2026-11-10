import updateDocument from "@pipedream/linear_app/actions/update-document/update-document.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...updateDocument,
  ...utils.getAppProps(updateDocument),
  key: "linear-update-document",
  description: "Update an existing Linear document: rename it, rewrite its body, move it to another project, initiative or team, or change its icon or color. Only the fields you provide are changed; set at least one besides `documentId`. **`content` replaces the whole body.** To append to or edit part of a document, first read the current body with **Get Document**, then send the full combined markdown. Leave `content` unset for a rename so the body is kept. To move the document, set at most one of `projectId`, `initiativeId` or `teamId`. Use **Search Documents** to find the document ID. To create a new document, use **Create Document**. The response does not echo the body back; use **Get Document** to read it. Example (rename): `documentId: \"10b5bc2940c7\"`, `title: \"[DRAFT] Q3 Hiring Plan\"` → returns `{success: true, document: {id: \"29a25062-...\", title: \"[DRAFT] Q3 Hiring Plan\", slugId: \"10b5bc2940c7\", url: \"https://linear.app/...\"}}`. Example (replace body): `documentId: \"10b5bc2940c7\"`, `content: \"# Q3 Hiring Plan\\n\\nUpdated goals...\"`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=documentUpdate)",
  version: "0.0.1",
  ai: "optimized",
};
