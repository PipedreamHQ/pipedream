import createDocument from "@pipedream/linear_app/actions/create-document/create-document.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...createDocument,
  ...utils.getAppProps(createDocument),
  key: "linear-create-document",
  description: "Create a new Linear document (a spec, brief, runbook or meeting notes) and attach it to exactly one project, initiative or team so teammates can find it. Set exactly one of `projectId`, `initiativeId` or `teamId`. If the user did not say where the document belongs and the choice is ambiguous, ask them before calling this tool rather than guessing. Use **List Projects**, **List Initiatives** or **Get Teams** to look up the ID. To change an existing document, use **Update Document** instead; to check whether a document already exists, use **Search Documents**. `content` is markdown. The response does not echo the body back; use **Get Document** to read it. Example: `title: \"Dust Storm Shelter Spec\"`, `content: \"# Overview\\n\\nShelter requirements...\"`, `projectId: \"a1b2c3d4-0000-0000-0000-000000000001\"` → returns `{success: true, document: {id: \"29a25062-...\", title: \"Dust Storm Shelter Spec\", slugId: \"10b5bc2940c7\", url: \"https://linear.app/.../document/dust-storm-shelter-spec-10b5bc2940c7\", project: {id: \"a1b2c3d4-...\", name: \"Mars Colony\"}}}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/Mutation?query=documentCreate)",
  version: "0.0.1",
  ai: "optimized",
};
