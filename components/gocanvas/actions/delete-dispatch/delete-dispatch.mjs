import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-delete-dispatch",
  name: "Delete Dispatch",
  description: "Removes a specific dispatch from GoCanvas. The 'description' of the dispatch to be deleted is a required prop.",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    gocanvas,
    dispatchDescription: gocanvas.propDefinitions.dispatchDescription,
  },
  async run({ $ }) {
    const response = await this.gocanvas.removeDispatch({
      dispatchDescription: this.dispatchDescription,
    });
    $.export("$summary", `Successfully deleted dispatch with description: ${this.dispatchDescription}`);
    return response;
  },
};
