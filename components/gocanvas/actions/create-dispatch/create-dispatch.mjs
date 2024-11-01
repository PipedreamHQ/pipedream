import gocanvas from "../../gocanvas.app.mjs";

export default {
  key: "gocanvas-create-dispatch",
  name: "Create Dispatch",
  description: "Creates a dispatch item in GoCanvas.",
  version: "0.0.1",
  type: "action",
  props: {
    gocanvas,
    dispatchApp: gocanvas.propDefinitions.dispatchApp,
  },
  async run({ $ }) {
    const response = await this.gocanvas.createDispatchItem({
      dispatchApp: this.dispatchApp,
    });
    $.export("$summary", `Successfully created dispatch item in ${this.dispatchApp}`);
    return response;
  },
};
