import app from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-create-check",
  name: "Create Check",
  description: "Creates a new check. [See the documentation](https://apiv3.onlinecheckwriter.com/#211cb6e4-bda7-46de-9e84-a5e8b2709206)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    bankAccountId: {
      propDefinition: [
        app,
        "bankAccountId",
      ],
    },
    payeeId: {
      propDefinition: [
        app,
        "payeeId",
      ],
    },
    categoryId: {
      propDefinition: [
        app,
        "categoryId",
      ],
    },
    issueDate: {
      propDefinition: [
        app,
        "issueDate",
      ],
    },
    amount: {
      propDefinition: [
        app,
        "amount",
      ],
    },
    memo: {
      propDefinition: [
        app,
        "memo",
      ],
    },
    note: {
      propDefinition: [
        app,
        "note",
      ],
    },
    invoiceNumber: {
      propDefinition: [
        app,
        "invoiceNumber",
      ],
    },
    noSign: {
      propDefinition: [
        app,
        "noSign",
      ],
    },
    noAmount: {
      propDefinition: [
        app,
        "noAmount",
      ],
    },
    noDate: {
      propDefinition: [
        app,
        "noDate",
      ],
    },
    noPayee: {
      propDefinition: [
        app,
        "noPayee",
      ],
    },
  },
  methods: {
    createChecks(args = {}) {
      return this.app.post({
        path: "/checks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChecks,
      bankAccountId,
      payeeId,
      categoryId,
      issueDate,
      amount,
      memo,
      note,
      invoiceNumber,
      noSign,
      noAmount,
      noDate,
      noPayee,
    } = this;

    const response = await createChecks({
      $,
      data: {
        checks: [
          {
            bankAccountId,
            payeeId,
            categoryId,
            issueDate,
            amount,
            memo,
            note,
            invoiceNumber,
            noSign,
            noAmount,
            noDate,
            noPayee,
          },
        ],
      },
    });

    $.export("$summary", `Successfully created a new check with ID \`${response.data.checks[0].checkId}\`.`);
    return response;
  },
};
