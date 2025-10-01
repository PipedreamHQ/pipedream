import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import evernote from "../../evernote.app.mjs";

export default {
  key: "evernote-create-notebook",
  name: "Create Notebook",
  description: "Creates a new notebook in Evernote. [See the documentation](https://dev.evernote.com/doc/reference/NoteStore.html#Fn_NoteStore_createNotebook)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    evernote,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the notebook.",
    },
    defaultNotebook: {
      type: "boolean",
      label: "Default Notebook",
      description: "If true, this notebook should be used for new notes whenever the user has not (or cannot) specify a desired target notebook.",
      optional: true,
    },
    published: {
      type: "boolean",
      label: "Published",
      description: "If this is set to true, then the Notebook will be accessible either to the public, or for business users to their business, via the 'publishing' or 'businessNotebook' specifications, which must also be set. If this is set to false, the Notebook will not be available to the public (or business).",
      optional: true,
      reloadProps: true,
    },
    publishing: {
      type: "object",
      label: "Publishing",
      description: "If the Notebook has been opened for public access, then this will point to the set of publishing information for the Notebook (URI, description, etc.). A Notebook cannot be published without providing this information, but it will persist for later use if publishing is ever disabled on the Notebook. [See the documentation](https://dev.evernote.com/doc/reference/Types.html#Struct_Publishing) for further details.",
      hidden: true,
    },
    stack: {
      type: "string",
      label: "Stack",
      description: "If this is set, then the notebook is visually contained within a stack of notebooks with this name. All notebooks in the same account with the same 'stack' field are considered to be in the same stack. Notebooks with no stack set are \"top level\" and not contained within a stack.",
      optional: true,
    },
  },
  async additionalProps(props) {
    props.publishing.hidden = !this.published;

    return {};
  },
  async run({ $ }) {
    try {
      const data = {
        name: this.name,
        defaultNotebook: this.defaultNotebook,
        published: this.published,
        stack: this.stack,
      };
      const publishing = parseObject(this.publishing);
      if (publishing) data.publishing = publishing;
      const response = await this.evernote.createNotebook({
        ...data,
      });

      $.export("$summary", `Created notebook ${response.name} with ID: ${response.guid}`);
      return response;
    } catch ({ parameter }) {
      throw new ConfigurationError(parameter);
    }
  },
};
