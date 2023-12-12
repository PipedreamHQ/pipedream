import adalo from "../../adalo.app.mjs";

export default {
  props: {
    adalo,
    collectionId: {
      label: "Collection ID",
      description: "The ID of the collection",
      type: "string",
    },
  },
};
