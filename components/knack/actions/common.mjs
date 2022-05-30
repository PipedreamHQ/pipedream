import knack from "../knack.app.mjs";

export default {
  props: {
    knack,
    objectKey: {
      type: "string",
      label: "Object Key",
      description:
        `The key of the object whose record(s) to operate on.
        \\
        For more info, see [the Knack API docs.](https://docs.knack.com/docs/object-based-requests)`,
    },
  },
};
