import app from "../../onlinecheckwriter.app.mjs";

export default {
  key: "onlinecheckwriter-create-mail-check",
  name: "Create Mail Check",
  description: "Creates a mail check. [See the documentation](https://apiv3.onlinecheckwriter.com/#f4562b65-70e8-4c4d-8444-8898e61ab7f0).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    isShippingToCustomAddress: {
      type: "boolean",
      label: "Shipping To Custom Address?",
      description: "Value is `true` if sending mail to custom address. Default `false`",
      optional: true,
    },
    customFromAddressId: {
      description: "Must be a custom from address ID. Required if **Shipping To Custom Address?** is `true`.",
      propDefinition: [
        app,
        "customFromAddressId",
      ],
    },
    customToAddressId: {
      description: "Must be a custom to address ID. Required if **Shipping To Custom Address?** is `true`.",
      propDefinition: [
        app,
        "customToAddressId",
      ],
    },
    customShippingTypeId: {
      label: "Custom Shipping Type ID",
      description: "Must be a valid custom shipping type ID. Required if **Shipping To Custom Address?** is `true`.",
      propDefinition: [
        app,
        "shippingTypeId",
      ],
    },
    checkId: {
      propDefinition: [
        app,
        "checkId",
      ],
    },
    shippingTypeId: {
      optional: false,
      description: "The shipping type ID of the check.",
      propDefinition: [
        app,
        "shippingTypeId",
      ],
    },
    paperTypeId: {
      propDefinition: [
        app,
        "paperTypeId",
      ],
    },
    informTypeId: {
      propDefinition: [
        app,
        "informTypeId",
      ],
    },
    enableSmsInform: {
      propDefinition: [
        app,
        "enableSmsInform",
      ],
    },
    enableEmailInform: {
      type: "boolean",
      label: "Enable Email Inform",
      description: "Value is `true` if email inform is enabled. Default `false`.",
      optional: true,
    },
    payeeEmail: {
      description: "Required if **Enable Email Inform** is `true` and there is no email on the associated payee.",
      propDefinition: [
        app,
        "payeeEmail",
      ],
    },
    payeePhone: {
      description: "Required if **Enable SMS Inform** is `true` and there is no phone on the associated payee.",
      propDefinition: [
        app,
        "payeePhone",
      ],
    },
  },
  methods: {
    createMailChecks(args = {}) {
      return this.app.post({
        path: "/mailchecks",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createMailChecks,
      isShippingToCustomAddress,
      customFromAddressId,
      customToAddressId,
      customShippingTypeId,
      checkId,
      shippingTypeId,
      paperTypeId,
      informTypeId,
      enableSmsInform,
      enableEmailInform,
      payeeEmail,
      payeePhone,
    } = this;

    const response = await createMailChecks({
      $,
      data: {
        isShippingToCustomAddress,
        customFromAddressId,
        customToAddressId,
        customShippingTypeId,
        mailChecks: [
          {
            checkId,
            shippingTypeId,
            paperTypeId,
            informTypeId,
            ...(enableSmsInform !== undefined && {
              enableSmsInform: +enableSmsInform,
            }),
            ...(enableEmailInform !== undefined && {
              enableEmailInform: +enableEmailInform,
            }),
            payeeEmail,
            payeePhone,
          },
        ],
      },
    });
    $.export("$summary", "Successfully created and mailed checks.");
    return response;
  },
};
