import typeform from "../../typeform.app.mjs";
import utils from "../utils.mjs";

const { reduceProperties } = utils;

export default {
  key: "typeform-create-form",
  name: "Create a Form",
  description: "Creates a form with its corresponing fields. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    typeform,
    title: {
      propDefinition: [
        typeform,
        "title",
      ],
    },
    workspaceHref: {
      propDefinition: [
        typeform,
        "workspaceHref",
      ],
    },
  },
  async run({ $ }) {
    const initialProps = {
      title: this.title,
    };

    const additionalProps = {
      workspace: [
        {
          href: this.workspaceHref,
        },
        this.workspaceHref,
      ],
    };

    const data = reduceProperties({
      initialProps,
      additionalProps,
    });

    const resp = await this.typeform.createForm({
      $,
      data,
    });

    $.export("$summary", `Successfully created a new form, "${resp.title}"`);

    return resp;
  },
};
