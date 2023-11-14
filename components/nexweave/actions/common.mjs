export default {
  async additionalProps() {
    const itemDetails = await this.getItemDetails();
    return Object.fromEntries(itemDetails?.result?.variables?.map?.((variable) => ([
      variable.key,
      {
        type: "string",
        label: `Variable: "${variable.key}"`,
        description: `Default value: "${variable.default}"`,
        optional: true,
      },
    ])) ?? {});
  },
  async run({ $ }) {
    const response = await this.nexweave.createExperience({
      $,
      data: this.getData(),
    });

    $.export("$summary", this.getSummary());
    return response;
  },
};
