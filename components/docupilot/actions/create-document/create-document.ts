import docupilot from "../../app/docupilot.app";
import {
  defineAction, UserProp,
} from "@pipedream/types";

export default defineAction({
  name: "Create Document",
  description:
    "Create a document [See docs here](https://help.docupilot.app/create-document/api-and-webhook-integration#api-integration)",
  key: "docupilot-create-document",
  version: "0.0.17",
  type: "action",
  props: {
    docupilot,
    createUrl: {
      type: "string",
      label: "Template URL",
      description: `Choose a template in the Docupilot dashboard, and go to the **Create** tab, then to **API integrations**.
        \\
        Copy the ***POST Merge URL*** here. Example: \`https://api.docupilot.app/documents/create/46ac75c3/5e7d03ec\``,
    },
    templateId: {
      type: "integer",
      label: "Template ID",
      description: `While in the previous page, copy the Template ID from your browser's URL.
        \\
        Example: id **48479** in URL \`https://dashboard.docupilot.app/templates/48479/generate/integrations\``,
      reloadProps: true,
    },
  },
  methods: {
    processProp(
      {
        name, type, fields,
      },
      {
        props, counterObj, additionalOptions, parentObjName = "",
      },
    ) {
      switch (type) {
      case "object":
        fields.forEach((childProp) =>
          this.processProp(childProp, {
            props,
            counterObj,
            additionalOptions,
            parentObjName: `${name}.`,
          }));
        break;

      case "string":
        props[`schemaProp${counterObj.counter++}`] = {
          type,
          label: parentObjName + name,
        };
        break;

      case "array":
        props[`schemaProp${counterObj.counter++}`] = {
          type: "string[]",
          label: parentObjName + name,
          description: `Each item in the array should be a JSON-stringified object with the properties: \`${fields
            .map(({ name }) => name)
            .join("`, `")}\``,
        };
        break;

      default:
        additionalOptions.push(name);
        break;
      }
    },
  },
  async additionalProps(): Promise<any> {
    const props: {[key: string]: UserProp;} = {};
    const additionalOptions = [];
    const counterObj = {
      counter: 0,
    };

    if (this.templateId) {
      const schema = await this.docupilot.getTemplateSchema(this.templateId);
      schema.forEach((prop) =>
        this.processProp(prop, {
          props,
          counterObj,
          additionalOptions,
        }));
    }

    props.additionalOptions = {
      type: "object",
      label: "Additional Options",
      description: "Any additional parameters to be passed to the template.",
      optional: true,
    };

    if (additionalOptions.length) {
      props.additionalOptions.description += ` These parameters should be included: \`${additionalOptions.join(
        "`, `",
      )}\``;
    }

    return props;
  },
  async run({ $ }): Promise<any> {
    const params = {
      $,
      data: {},
    };
    const data = await this.docupilot.createDocument(params);

    $.export("$summary", "Created document successfully");

    return data;
  },
});
