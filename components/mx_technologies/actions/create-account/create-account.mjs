import { ACCOUNT_TYPE_OPTIONS } from "../../common/constants.mjs";
import mxTechnologies from "../../mx_technologies.app.mjs";

export default {
  key: "mx_technologies-create-account",
  name: "Create Account",
  description: "Creates a new account for a specific user. [See the documentation](https://docs.mx.com/api-reference/platform-api/reference/create-manual-account)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mxTechnologies,
    userId: {
      propDefinition: [
        mxTechnologies,
        "userId",
      ],
    },
    accountType: {
      type: "string",
      label: "Account Type",
      description: "The general or parent type of the **account**.",
      options: ACCOUNT_TYPE_OPTIONS,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The human-readable name for the **account**.",
    },
    apr: {
      type: "string",
      label: "APR",
      description: "The annual percentage rate associated with the **account**.",
      optional: true,
    },
    apy: {
      type: "string",
      label: "APY",
      description: "The annual percentage yield associated with the **account**.",
      optional: true,
    },
    availableBalance: {
      type: "string",
      label: "Available Balance",
      description: "The balance that is available for use in asset accounts like checking and savings. **PENDING** transactions are typically taken into account with the available balance, but this may not always be the case. `available_balance` will usually be a positive value for all account types, determined in the same way as the **balance** field.",
      optional: true,
    },
    balance: {
      type: "string",
      label: "Balance",
      description: "The current balance of the account. **PENDING** transactions are typically not taken into account with the current balance, but this may not always be the case. This is the value used for the account balance displayed in MX UIs. The balance will usually be a positive value for all account types. Asset-type accounts (**CHECKING**, **SAVINGS**, **INVESTMENT**) may have a negative balance if they are in overdraft. Debt-type accounts (**CREDIT_CARD**, **LOAN**, **LINE_OF_CREDIT**, **MORTGAGE**) may have a negative balance if they are overpaid.",
      optional: true,
    },
    cashSurrenderValue: {
      type: "string",
      label: "Cash Surrender Value",
      description: "The sum of money paid to the policyholder or annuity holder in the event the policy is voluntarily terminated before it matures, or the insured event occurs.",
      optional: true,
    },
    creditLimit: {
      type: "string",
      label: "Credit Limit",
      description: "The credit limit associated with the **account**.",
      optional: true,
    },
    currencyCode: {
      type: "string",
      label: "Currency Code",
      description: "The three-character ISO 4217 currency code.",
      optional: true,
    },
    deathBenefit: {
      type: "integer",
      label: "Death Benefit",
      description: "The amount paid to the beneficiary of the account upon death of the account owner.",
      optional: true,
    },
    interestRate: {
      type: "string",
      label: "Interest Rate",
      description: "The interest rate associated with the **account**.",
      optional: true,
    },
    isClosed: {
      type: "boolean",
      label: "Is Closed",
      description: "This indicates whether an account has been closed.",
      optional: true,
    },
    isHidden: {
      type: "boolean",
      label: "Is Hidden",
      description: "This indicates whether the account is hidden.",
      optional: true,
    },
    loanAmount: {
      type: "string",
      label: "Loan Amount",
      description: "The amount of the loan associated with the **account**.",
      optional: true,
    },
    metadata: {
      propDefinition: [
        mxTechnologies,
        "metadata",
      ],
      description: "Additional information a partner can store on the **account**.",
      optional: true,
    },
    nickname: {
      type: "string",
      label: "Nickname",
      description: "An alternate name for the **account**.",
      optional: true,
    },
    originalBalance: {
      type: "string",
      label: "Original Balance",
      description: "The original balance associated with the **account**.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.mxTechnologies.createManualAccount({
      $,
      userGuid: this.userId,
      data: {
        account: {
          account_type: this.accountType,
          name: this.name,
          apr: this.apr && parseFloat(this.apr),
          apy: this.apy && parseFloat(this.apy),
          available_balance: this.availableBalance && parseFloat(this.availableBalance),
          balance: this.balance && parseFloat(this.balance),
          cash_surrender_value: this.cashSurrenderValue && parseFloat(this.cashSurrenderValue),
          credit_limit: this.creditLimit && parseFloat(this.creditLimit),
          currency_code: this.currencyCode,
          death_benefit: this.deathBenefit,
          interest_rate: this.interestRate && parseFloat(this.interestRate),
          is_closed: this.isClosed,
          is_hidden: this.isHidden,
          loan_amount: this.loanAmount && parseFloat(this.loanAmount),
          metadata: this.metadata && JSON.stringify(this.metadata),
          nickname: this.nickname,
          original_balance: this.originalBalance && parseFloat(this.originalBalance),
        },
      },
    });

    $.export("$summary", `Successfully created a new account with Id: ${response.account.guid}`);
    return response;
  },
};
