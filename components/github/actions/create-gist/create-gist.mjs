import github from "../../github.app.mjs";
import utils from "../../actions/common/utils.mjs";

export default {
  key: "github-create-gist",
  name: "Create Gist",
  description: "Allows you to add a new gist with one or more files. [See the documentation](https://docs.github.com/en/rest/gists/gists?apiVersion=2022-11-28#create-a-gist)",
  version: "0.0.13",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    github,
    description: {
      label: "Description",
      description: "The description of the gist",
      type: "string",
    },
    files: {
      label: "Files",
      description: "The files that will be added to the gist. The key is the file name and the value is the content of the file. Ex: `{\"file1.txt\": \"content of file 1\", \"file2.txt\": \"content of file 2\"}`",
      type: "object",
    },
    public: {
      label: "Public",
      description: "Indicates whether the gist is public or not",
      type: "boolean",
    },
  },
  async run({ $ }) {
    const res = await this.github.createGist({
      description: this.description,
      files: utils.convertFiles(this.files),
      public: this.public,
    });

    $.export("$summary", `Successfully created gist with ID "${res.id}".`);
    return res;
  },
};
