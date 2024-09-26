export default {
  async run({ $ }) {
    const response = await this.listMetaobjects({
      type: this.type,
      $,
    });

    const numObjects = (response.data.metaobjects.nodes).length;
    $.export("$summary", `Successfully retrieved ${numObjects} metaobject${numObjects === 1
      ? ""
      : "s"}`);

    return response;
  },
};
