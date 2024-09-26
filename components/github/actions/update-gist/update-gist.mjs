import github from "../../github.app.mjs";
import utils from "../../actions/common/utils.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "github-update-gist",
  name: "Update Gist",
  description: "Allows you to update a gist's description and to update, delete, or rename gist files. Files from the previous version of the gist that aren't explicitly changed during an edit are unchanged. At least one of description or files is required. [See docs here](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#update-a-gist)",
  version: "0.0.6",
  type: "action",
  props: {
    github,
    gistId: {
      propDefinition: [
        github,
        "gistId",
      ],
    },
    description: {
      label: "Description",
      description: "The description of the gist",
      type: "string",
      optional: true,
    },
    files: {
      label: "Files",
      description: "The gist files to be updated, renamed, or deleted. Each key must match the current filename (including extension) of the targeted gist file. For example: `hello.py`. To delete a file, set the whole file to null. For example: `hello.py : null`",
      type: "object",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.description && !this.files) {
      throw new ConfigurationError("At least one of description or files is required.");
    }

    const res = await this.github.updateGist(this.gistId, {
      description: this.description,
      files: utils.convertFiles(this.files),
    });

    $.export("$summary", `Successfully updated gist with ID "${res.id}".`);
    return res;
  },
};
