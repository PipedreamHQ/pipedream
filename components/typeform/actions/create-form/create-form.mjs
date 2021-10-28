import typeform from "../../typeform.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "typeform-create-form",
  name: "Create a Form",
  description: "Create a new form. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.1",
  methods: {
    ...common.methods,
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

    const data = this.reduceProperties({
      initialProps,
      additionalProps,
    });

    const resp = await this.typeform.createForm({
      $,
      data,
    });

    $.export("$summary", `🎉 Successfully created a new form, "${resp.title}"`)
    
    return resp
  },
};
