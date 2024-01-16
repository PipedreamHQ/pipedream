export default {
  templateAlias: {
    type: "string",
    label: "Template",
    description: "The template to use for this email.",
    async options(context) {
      let { page } = context;
      const data = await this.listTemplates(page++);
      const options =
        data.Templates?.map((obj) => {
          return {
            label: obj.Name,
            value: obj.Alias,
          };
        }) ?? [];

      return {
        options,
        context: {
          page,
        },
      };
    },
  },
  templateModel: {
    type: "object",
    label: "Template Model",
    description:
      "The model to be applied to the specified template to generate the email body and subject.",
  },
};
