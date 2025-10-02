import { ConfigurationError } from "@pipedream/platform";
import zohoSubscriptions from "../../zoho_subscriptions.app.mjs";

export default {
  key: "zoho_subscriptions-create-subscription",
  name: "Create Subscription",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  description: "Create a new subscription. [See the documentation](https://www.zoho.com/billing/api/v1/subscription/#create-a-subscription)",
  type: "action",
  props: {
    zohoSubscriptions,
    organizationId: {
      propDefinition: [
        zohoSubscriptions,
        "organizationId",
      ],
    },
    addToUnbilledCharges: {
      type: "boolean",
      label: "Add To Unbilled Charges",
      description: "When the value is given as true, the subscription would be created and charges for the current billing cycle will be put as unbilled. This can be converted to invoice at any later point of time.",
      optional: true,
    },
    customerId: {
      propDefinition: [
        zohoSubscriptions,
        "customerId",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
      reloadProps: true,
    },
    paymentTerms: {
      propDefinition: [
        zohoSubscriptions,
        "paymentTerms",
      ],
      optional: true,
    },
    paymentTermsLabel: {
      propDefinition: [
        zohoSubscriptions,
        "paymentTermsLabel",
      ],
      optional: true,
    },
    customFields: {
      propDefinition: [
        zohoSubscriptions,
        "customFields",
      ],
      optional: true,
    },
    contactpersons: {
      propDefinition: [
        zohoSubscriptions,
        "contactPersonId",
        ({
          customerId, organizationId,
        }) => ({
          customerId,
          organizationId,
        }),
      ],
      type: "string[]",
      optional: true,
    },
    cardId: {
      propDefinition: [
        zohoSubscriptions,
        "cardId",
        ({
          customerId, organizationId,
        }) => ({
          customerId,
          organizationId,
        }),
      ],
      optional: true,
    },
    startsAt: {
      type: "string",
      label: "Starts At",
      description: "Generally the subscription will start on the day it is created. But, the date can also be a future or past date depending upon your usecase. For future dates, the subscription status would be Future till the starts_at date. And for past dates, the subscription status can be `Trial`, `Live` or `Expired` depending on the subscription interval that you have selected. Format: `0000-00-00`",
      optional: true,
    },
    exchangeRate: {
      type: "string",
      label: "Exchange Rate",
      description: "This will be the exchange rate provided for the organization's currency and the customer's currency. The subscription fee would be the multiplicative product of the original price and the exchange rate.",
      optional: true,
    },
    placeOfSupply: {
      type: "string",
      label: "Place Of Supply",
      description: "Place of Supply for the customer's subscription. **India GST only**.",
      optional: true,
    },
    planCode: {
      propDefinition: [
        zohoSubscriptions,
        "planCode",
        ({ organizationId }) => ({
          organizationId,
        }),
      ],
    },
    planDescription: {
      type: "string",
      label: "Plan Description",
      description: "Description of the plan exclusive to this subscription. This will be displayed in place of the plan name in invoices generated for this subscription.",
      optional: true,
    },
    price: {
      type: "string",
      label: "Price",
      description: "Price of a plan for a particular subscription. If a value is provided here, the plan’s price for this subscription will be changed to the given value. If no value is provided, the plan’s price would be the same as what it was when it was created.",
      optional: true,
    },
    setupFee: {
      type: "string",
      label: "Setup Fee",
      description: "Setup fee for the plan.",
      optional: true,
    },
    setupFeeTaxId: {
      type: "string",
      label: "Setup Fee Tax Id",
      description: "Unique ID for tax of setup fee. `Setup Fee Tax Id` must be empty for applying tax Exemption.",
      optional: true,
    },
    itemCustomFields: {
      type: "object",
      label: "Item Custom Fields",
      description: "Custom fields for an item.",
      optional: true,
    },
    quantity: {
      type: "integer",
      label: "Quantity",
      description: "Required quantity of the chosen plan.",
      optional: true,
    },
    taxId: {
      type: "string",
      label: "Tax Id",
      description: "Unique ID of Tax or Tax Group that must be associated with the plan. `tax_id` must be empty for applying tax Exemption.",
      optional: true,
    },
    taxExemptionId: {
      type: "string",
      label: "Tax Exemption Id",
      description: "Unique ID of the tax exemption. **GST only**",
      optional: true,
    },
    taxExemptionCode: {
      type: "string",
      label: "Tax Exemption Code",
      description: "Unique code of the tax exemption. **GST only**",
      optional: true,
    },
    tdsTaxId: {
      type: "string",
      label: "TDS Tax Id",
      description: "ID of the TDS tax. **Mexico only**",
      optional: true,
    },
    satItemKeyCode: {
      type: "string",
      label: "Sat Item Key Code",
      description: "Add SAT Item Key Code for your goods/services. Download the [CFDI Catalogs](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls). **Mexico only**",
      optional: true,
    },
    unitkeyCode: {
      type: "string",
      label: "Unit Key Code",
      description: "Add SAT Unit Key Code for your goods/services. Download the [CFDI Catalogs](http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI_V_4_07122022.xls). **Mexico only**",
      optional: true,
    },
    setupFeeTaxExemptionId: {
      type: "string",
      label: "Setup Fee Tax Exemption Id",
      description: "Unique Tax Exemption ID that must be applied to setup fee. **GST only**",
      optional: true,
    },
    setupFeeTaxExemptionCode: {
      type: "string",
      label: "Setup Fee Tax Exemption Code",
      description: "Unique code of the tax exemption that must be applied to setup fee. **GST only**",
      optional: true,
    },
    excludeTrial: {
      type: "boolean",
      label: "Exclude Trial",
      description: "This is set to true if the respective plan's trial period needs to be excluded for this subscription.",
      optional: true,
    },
    excludeSetupFee: {
      type: "boolean",
      label: "Exclude Setup Fee",
      description: "This is set to true if the respective plan's setup fee needs to be excluded for this subscription.",
      optional: true,
    },
    billingCycles: {
      type: "integer",
      label: "Billing Cycles",
      description: "`Billing Cycles` specified at the time of creation of the plan would be the default value. If this needs to be overridden for this particular subscription, a value can be provided here.",
      optional: true,
    },
    trialDays: {
      type: "integer",
      label: "Trial Days",
      description: "Number of free trial days granted to a customer subscribed to this plan. Trial days for the subscription mentioned here will override the number of trial days provided at the time plan creation. This will be applicable even if `Exclude Trial` = true. Default is `0` only if `Exclude Trial` is `true`",
      optional: true,
    },
    addons: {
      type: "string[]",
      label: "Addons",
      description: "List of addon objects which are to be included in the subscription.",
      optional: true,
    },
    couponCode: {
      type: "string",
      label: "Coupon Code",
      description: "The coupon code of the coupon which is to be applied to the subscription.",
      optional: true,
    },
    autoCollect: {
      type: "boolean",
      label: "Auto Collect",
      description: "`Auto Collect` is set to `true` for creating an online subscription which will charge the customer's card automatically on every renewal. To create an offline subscriptions, set `Auto Collect` to `false`.",
      default: false,
    },
    referenceId: {
      type: "string",
      label: "Reference Id",
      description: "A string of your choice is required to easily identify and keep track of your subscriptions.",
      optional: true,
    },
    salespersonName: {
      type: "string",
      label: "Sales Person Name",
      description: "Name of the sales person assigned for the subscription.",
      optional: true,
    },
    paymentGateways: {
      type: "string[]",
      label: "Payment Gateways",
      description: "Payment gateway associated with the subscription.",
      options: [
        "test_gateway",
        "payflow_pro",
        "stripe",
        "2checkout",
        "authorize_net",
        "payments_pro",
        "forte",
        "worldpay",
        "wepay",
      ],
      optional: true,
    },
    createBackdatedInvoice: {
      type: "boolean",
      label: "Create Backdated Invoice",
      description: "To allow creation of invoice for current billing cycle for back dated subscriptions.",
      optional: true,
    },
    canChargeSetupFeeImmediately: {
      type: "boolean",
      label: "Can Charge Setup Fee Immediately",
      description: "If set to `true`, a separate invoice will be raised for the setup fee as soon as the subscription's trial period starts. Set the value as `false`, or remove this optional argument if you want the setup fee to be billed at the end of the trial period, along with the other subscription related charges.",
      optional: true,
    },
    templateId: {
      type: "string",
      label: "Template Id",
      description: "Default Invoice Template ID for all the invoices created from the subscription.",
      optional: true,
    },
    cfdiUsage: {
      type: "string",
      label: "CFDI Usage",
      description: "Choose CFDI Usage. **Mexico only**",
      options: [
        "acquisition_of_merchandise",
        "return_discount_bonus",
        "general_expense",
        "buildings",
        "furniture_office_equipment",
        "transport_equipment",
        "computer_equipmentdye_molds_tools",
        "telephone_communication",
        "satellite_communication",
        "other_machinery_equipment",
        "hospital_expense",
        "medical_expense_disability",
        "funeral_expense",
        "donation",
        "interest_mortage_loans",
        "contribution_sar",
        "medical_expense_insurance_pormium",
        "school_transportation_expense",
        "deposit_saving_account",
        "payment_educational_service",
        "no_tax_effect",
        "payment",
        "payroll",
      ],
      optional: true,
    },
    allowPartialPayments: {
      type: "boolean",
      label: "Allow Partial Payments",
      description: "Boolean to check if partial payments are allowed for the contact. **Mexico only**",
      optional: true,
    },
    accountId: {
      type: "string",
      label: "Account Id",
      description: "Account ID of the bank account from which payment is made by the customer.",
      optional: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (!this.customerId) {
      return props;
    }
    try {
      const { customer } = await this.zohoSubscriptions.getCustomer({
        customerId: this.customerId,
      });
      const { contact_person: contactperson } = await this.zohoSubscriptions.getContactPerson({
        customerId: this.customerId,
        contactpersonId: customer.primary_contactperson_id,
      });
      if (!customer.email && !contactperson.email) {
        existingProps.contactpersons.hidden = true;
        props.contactEmail = {
          type: "string",
          label: "Contact Email",
        };
      }
    } catch {
      props.contactEmail = {
        type: "string",
        label: "Contact Email",
        optional: true,
      };
    }
    return props;
  },
  async run({ $ }) {
    const {
      zohoSubscriptions,
      organizationId,
      addToUnbilledCharges,
      customerId,
      paymentTerms,
      paymentTermsLabel,
      customFields,
      contactpersons,
      cardId,
      startsAt,
      exchangeRate,
      placeOfSupply,
      planCode,
      planDescription,
      price,
      setupFee,
      setupFeeTaxId,
      itemCustomFields,
      quantity,
      taxId,
      taxExemptionId,
      taxExemptionCode,
      tdsTaxId,
      satItemKeyCode,
      unitkeyCode,
      setupFeeTaxExemptionId,
      setupFeeTaxExemptionCode,
      excludeTrial,
      excludeSetupFee,
      billingCycles,
      trialDays,
      addons,
      couponCode,
      autoCollect,
      referenceId,
      salespersonName,
      paymentGateways,
      createBackdatedInvoice,
      canChargeSetupFeeImmediately,
      templateId,
      cfdiUsage,
      allowPartialPayments,
      accountId,
      contactEmail,
    } = this;

    if (autoCollect && !cardId) {
      throw new ConfigurationError("If setting Auto-Collect to `true`, you must fill in the card Id.");
    }

    if (autoCollect && !accountId) {
      throw new ConfigurationError("If setting Auto-Collect to `true`, you must fill in the Account Id.");
    }

    let exchangeRateFloat = null;
    if (exchangeRate) {
      try {
        exchangeRateFloat = parseFloat(exchangeRate);
      } catch (e) {
        throw new ConfigurationError("Exchange Rate must be a double.");
      }
    }

    let priceFloat = null;
    if (price) {
      try {
        priceFloat = parseFloat(price);
      } catch (e) {
        throw new ConfigurationError("Plan price must be a double.");
      }
    }

    let setupFeeFLoat = null;
    if (setupFee) {
      try {
        setupFeeFLoat = parseFloat(setupFee);
      } catch (e) {
        throw new ConfigurationError("Setup Fee must be a double.");
      }
    }

    const { customer } = await zohoSubscriptions.getCustomer({
      customerId,
    });
    if (contactEmail) {
      await zohoSubscriptions.updateCustomer({
        customerId,
        data: {
          display_name: customer.display_name,
          email: contactEmail,
        },
      });
    } else {
      const { contact_person: contactperson } = await zohoSubscriptions.getContactPerson({
        customerId,
        contactpersonId: customer.primary_contactperson_id,
      });
      if (!customer.email && !contactperson.email) {
        throw new ConfigurationError("Customer must have an email address");
      }
    }

    const response = await zohoSubscriptions.createSubscription({
      $,
      organizationId,
      data: {
        add_to_unbilled_charges: addToUnbilledCharges,
        customer_id: customerId,
        payment_terms: paymentTerms,
        payment_terms_label: paymentTermsLabel,
        custom_fields: customFields && Object.entries(customFields).map(([
          key,
          value,
        ]) => ({
          label: key,
          value: value,
        })),
        contactpersons: contactpersons && contactpersons.map((item) => ({
          contactperson_id: item,
        })),
        card_id: cardId,
        starts_at: startsAt,
        exchange_rate: exchangeRateFloat,
        place_of_supply: placeOfSupply,
        plan: {
          plan_code: planCode,
          plan_description: planDescription,
          price: priceFloat,
          setup_fee: setupFeeFLoat,
          setup_fee_tax_id: setupFeeTaxId,
          item_custom_fields: itemCustomFields && Object.entries(itemCustomFields).map(([
            key,
            value,
          ]) => ({
            label: key,
            value: value,
          })),
          quantity,
          tax_id: taxId,
          tax_exemption_id: taxExemptionId,
          tax_exemption_code: taxExemptionCode,
          tds_tax_id: tdsTaxId,
          sat_item_key_code: satItemKeyCode,
          unitkey_code: unitkeyCode,
          setup_fee_tax_exemption_id: setupFeeTaxExemptionId,
          setup_fee_tax_exemption_code: setupFeeTaxExemptionCode,
          exclude_trial: excludeTrial,
          exclude_setup_fee: excludeSetupFee,
          billing_cycles: billingCycles,
          trial_days: excludeTrial
            ? 0
            : trialDays,
        },
        addons,
        coupon_code: couponCode,
        reference_id: referenceId,
        salesperson_name: salespersonName,
        payment_gateways: paymentGateways && paymentGateways.map((item) => ({
          payment_gateway: item,
        })),
        create_backdated_invoice: createBackdatedInvoice,
        can_charge_setup_fee_immediately: canChargeSetupFeeImmediately,
        template_id: templateId,
        cfdi_usage: cfdiUsage,
        allow_partial_payments: allowPartialPayments,
        account_id: accountId,
      },
    });

    $.export("$summary", `A new subscription with Id: ${response.subscription?.subscription_id} was successfully created!`);
    return response;
  },
};
