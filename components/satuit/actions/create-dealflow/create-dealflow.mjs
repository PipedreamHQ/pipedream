import app from "../../satuit.app.mjs";

export default {
  key: "satuit-create-dealflow",
  name: "Create Dealflow",
  description: "Creates a new dealflow within the Satuit platform, setting up a new series of business interactions. [See the documentation](https://satuittechnologies.zendesk.com/hc/en-us/articles/360055725213-Satuit-REST-API-Postman-Documentation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    iBusKey: {
      propDefinition: [
        app,
        "business",
      ],
    },
    cRep: {
      propDefinition: [
        app,
        "rep",
      ],
    },
    cUserChar1: {
      type: "string",
      label: "Name",
      description: "The name of the deal flow",
    },
    cUserPick6: {
      type: "string",
      label: "Description",
      description: "The description of the deal flow",
    },
    nUserNum2: {
      type: "string",
      label: "Number",
      description: "The number of the deal flow",
    },
    dUserDate6: {
      type: "string",
      label: "Date",
      description: "The date of the deal flow. Eg. `2021-01-01`",
    },
  },
  methods: {
    createDealFlow(args = {}) {
      return this.app.post({
        path: "/dealflow",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createDealFlow,
      iBusKey,
      cRep,
      cUserChar1,
      cUserPick6,
      nUserNum2,
      dUserDate6,
    } = this;

    const response = await createDealFlow({
      $,
      data: {
        ibuskey: iBusKey,
        crep: cRep,
        cuserchar1: cUserChar1,
        cuserpick6: cUserPick6,
        nusernum2: nUserNum2,
        duserdate6: dUserDate6,
      },
    });

    $.export("$summary", `Successfully created dealflow with ID \`${response?.Result?.id}\``);

    return response;
  },
};
