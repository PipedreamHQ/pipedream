// Code shared by all Knack actions
import knack from "../../knack.app.mjs";
export default {
  props: {
    knack,
    objectKey: {
      type: "string",
      label: "Object Key",
      description: `The key of the object which this record belongs to.
      \\
      See [the Knack API docs](https://docs.knack.com/docs/object-based-requests) for more information.`,
    },
  },
};
