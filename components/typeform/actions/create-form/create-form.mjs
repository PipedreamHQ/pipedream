import common from "../common.mjs";

const { typeform } = common.props;

export default {
  ...common,
  key: "typeform-create-form",
  name: "Create a Form",
  description: "Creates a form with its corresponing fields. [See the docs here](https://developer.typeform.com/create/reference/create-form/)",
  type: "action",
  version: "0.0.1",
  props: {
    ...common.props,
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

    return await this.typeform.createForm({
      $,
      data,
    });
  },
};
