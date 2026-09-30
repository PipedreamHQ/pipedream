import getProjectUpdate from "@pipedream/linear_app/actions/get-project-update/get-project-update.mjs";
import utils from "../../common/utils.mjs";

/* eslint-disable pipedream/required-properties-type */
/* eslint-disable pipedream/required-properties-name */
/* eslint-disable pipedream/required-properties-version */

export default {
  ...getProjectUpdate,
  ...utils.getAppProps(getProjectUpdate),
  key: "linear-get-project-update",
  description: "Retrieve a single project update by its ID in Linear. Use **List Project Updates** first to obtain a valid update ID. Returns the full update including `id`, `body`, `health`, `createdAt`, and author. Example: `projectUpdateId: \"7df5e7f9-a357-4539-ae94-4a004fec635f\"` → returns `{id: \"7df5e7f9-a357-4539-ae94-4a004fec635f\", body: \"Q3 milestone complete.\", health: \"onTrack\", createdAt: \"2024-01-15T10:00:00Z\"}`. [See the documentation](https://studio.apollographql.com/public/Linear-API/variant/current/schema/reference/objects/ProjectUpdate?query=projectUpdate).",
  version: "0.0.2",
  ai: "optimized",
};
