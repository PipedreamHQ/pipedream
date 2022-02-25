import  * as flpnodejs from 'fraudlabspro-nodejs';

export default {
  name: "Screen Order",
  description: "Screen an order transaction for payment fraud. This action will detect all possibles fraud traits based on the input parameters supplied. The more input parameter supplied, the higher accuracy of fraud detection. Please refer to the [documentation](https://www.fraudlabspro.com/developer/api/screen-order) for the explanation of the result returned.",
  key: "fraudlabs_pro-screen-order",
  version: "0.0.1",
  type: "action",
  props: {
    flp_api_key: {
      type: "app",
      app: "fraudlabs_pro",
      description: "API license key. You can sign up for a trial key at [here](https://www.fraudlabspro.com/subscribe?id=1).",
    },
    ip_address: {
      type: "string",
      label: "IP Address",
      description: "IP address of online transaction. It supports both IPv4 and IPv6 address format.",
    },
    format: {
      type: "string",
      label: "Result Format",
      description: "*(optional)* Format of the result. Available values are `json` or `xml`. If unspecified, json format will be used for the response message.",
      optional: true,
    },
    last_name: {
      type: "string",
      label: "last_name",
      description: "*(optional)* User's last name.",
      optional: true,
    },
    first_name: {
      type: "string",
      label: "first_name",
      description: "*(optional)* User's first name.",
      optional: true,
    },
    bill_addr: {
      type: "string",
      label: "bill_addr",
      description: "*(optional)* Street address of billing address.",
      optional: true,
    },
    bill_city: {
      type: "string",
      label: "bill_city",
      description: "*(optional)* City of billing address.",
      optional: true,
    },
    bill_state: {
      type: "string",
      label: "bill_state",
      description: "*(optional)* State of billing address. It supports state codes, e.g. `NY` (New York), for state or province of United States or Canada. Please refer to [state & province codes](https://www.fraudlabspro.com/developer/reference/state-and-province-codes) for complete list.",
      optional: true,
    },
    bill_country: {
      type: "string",
      label: "bill_country",
      description: "*(optional)* Country of billing address. It requires the input of ISO-3166 alpha-2 country code, e.g. `US` for United States. Please refer to [Country Codes](https://www.fraudlabspro.com/developer/reference/country-codes) for complete list.",
      optional: true,
    },
    bill_zip_code: {
      type: "string",
      label: "bill_zip_code",
      description: "*(optional)* Postal or ZIP code of billing address.",
      optional: true,
    },
    ship_last_name: {
      type: "string",
      label: "ship_last_name",
      description: "*(optional)* Receiver's last name.",
      optional: true,
    },
    ship_first_name: {
      type: "string",
      label: "ship_first_name",
      description: "*(optional)* Receiver's first name.",
      optional: true,
    },
    ship_addr: {
      type: "string",
      label: "ship_addr",
      description: "*(optional)* Street address of shipping address.",
      optional: true,
    },
    ship_city: {
      type: "string",
      label: "ship_city",
      description: "*(optional)* City of shipping address.",
      optional: true,
    },
    ship_state: {
      type: "string",
      label: "ship_state",
      description: "*(optional)* State of shipping address. It supports state codes, e.g. `NY` - New York, for state or province of United States or Canada. Please refer to [state & province codes](https://www.fraudlabspro.com/developer/reference/state-and-province-codes) for complete list.",
      optional: true,
    },
    ship_country: {
      type: "string",
      label: "ship_country",
      description: "*(optional)* Country of shipping address. It requires the input of ISO-3166 alpha-2 country code, e.g. `US` for United States. Please refer to [Country Codes](https://www.fraudlabspro.com/developer/reference/country-codes) for complete list.",
      optional: true,
    },
    ship_zip_code: {
      type: "string",
      label: "ship_zip_code",
      description: "*(optional)* Postal or ZIP code of shipping address.",
      optional: true,
    },
    email_domain: {
      type: "string",
      label: "email_domain",
      description: "*(optional)* Domain name of email address. For example, the domain of email address support@fraudlabspro.com is **fraudlabspro.com**. If you didn't supply this value, the system will automatically extract the domain name from the email field.",
      optional: true,
    },
    user_phone: {
      type: "string",
      label: "user_phone",
      description: "*(optional)* User's phone number.",
      optional: true,
    },
    email: {
      type: "string",
      label: "email",
      description: "*(optional)* User's email address.",
      optional: true,
    },
    email_hash: {
      type: "string",
      label: "email_hash",
      description: "*(optional)* SHA1-64k hash of user's email address. Please refer to [SHA1-64k Hash Function](https://www.fraudlabspro.com/developer/reference/sha1-64k-hash) for details.",
      optional: true,
    },
    username_hash: {
      type: "string",
      label: "username_hash",
      description: "*(optional)* SHA1-64k hash of user's username. Please refer to [SHA1-64k Hash Function](https://www.fraudlabspro.com/developer/reference/sha1-64k-hash) for details.",
      optional: true,
    },
    bin_no: {
      type: "string",
      label: "bin_no",
      description: "*(optional)* First 6-9 digits of credit card number to identify issuing bank.",
      optional: true,
    },
    card_hash: {
      type: "string",
      label: "card_hash",
      description: "*(optional)* SHA1-64k hash of credit number. Please refer to [SHA1-64k Hash Function](https://www.fraudlabspro.com/developer/reference/sha1-64k-hash) for details.",
      optional: true,
    },
    avs_result: {
      type: "string",
      label: "avs_result",
      description: "*(optional)* The single character AVS result returned by the credit card processor. Please refer to [AVS & CVV2 Response Codes](https://www.fraudlabspro.com/developer/reference/avs-and-cvv2-response-codes) for details.",
      optional: true,
    },
    cvv_result: {
      type: "string",
      label: "cvv_result",
      description: "*(optional)* The single character CVV2 result returned by the credit card processor. Please refer to [AVS & CVV2 Response Codes](https://www.fraudlabspro.com/developer/reference/avs-and-cvv2-response-codes) for details. NOTE: This is not for the input of the actual CVV code from the back of the credit card.",
      optional: true,
    },
    user_order_id: {
      type: "string",
      label: "user_order_id",
      description: "*(optional)* Merchant identifier to uniquely identify a transaction. It supports maximum of 15 characters user order id input.",
      optional: true,
    },
    user_order_memo: {
      type: "string",
      label: "user_order_memo",
      description: "*(optional)* Merchant description of an order transaction. It supports maximum of 200 characters.",
      optional: true,
    },
    amount: {
      type: "string",
      label: "amount",
      description: "*(optional)* Amount of the transaction.",
      optional: true,
    },
    quantity: {
      type: "string",
      label: "quantity",
      description: "*(optional)* Total quantity of the transaction.",
      optional: true,
    },
    currency: {
      type: "string",
      label: "currency",
      description: "*(optional)* Currency code used in the transaction. It requires the input of ISO-4217 (3 characters) currency code, e.g. `USD` for US Dollar. Please refer to [Currency Codes](https://www.fraudlabspro.com/developer/reference/currency-codes) for complete list.",
      optional: true,
    },
    department: {
      type: "string",
      label: "department",
      description: "*(optional)* Merchant identifier to uniquely identify a product or service department.",
      optional: true,
    },
    payment_mode: {
      type: "string",
      label: "payment_mode",
      description: "*(optional)* Payment mode of transaction. Valid values: `creditcard` | `affirm` | `paypal` | `googlecheckout` | `bitcoin` | `cod` | `moneyorder` | `wired` | `bankdeposit` | `elviauthorized` | `paymitco` | `cybersource` | `sezzle` | `viabill` | `amazonpay` | `pmnts_gateway` | `giftcard` | `ewayrapid` | `others`.",
      optional: true,
    },
    flp_checksum: {
      type: "string",
      label: "flp_checksum",
      description: "*(optional)* Checksum for the device validation. Please visit [Agent Javascript](https://www.fraudlabspro.com/developer/javascript) to learn about the use of this parameter.",
      optional: true,
    },
  },
  async run() {

    var flp = new flpnodejs.FraudValidation(this.flp_api_key.$auth.api_key);

    const result_format = (typeof this.format === "undefined") ? "json" :`${this.format}`;
    
    var params = {
        format: result_format,
        ip: `${this.ip_address}`,
        last_name: (typeof this.last_name === "undefined") ? "" :`${this.last_name}`,
        first_name: (typeof this.first_name === "undefined") ? "" :`${this.first_name}`,
        bill_addr: (typeof this.bill_addr === "undefined") ? "" :`${this.bill_addr}`,
        bill_city: (typeof this.bill_city === "undefined") ? "" :`${this.bill_city}`,
        bill_state: (typeof this.bill_state === "undefined") ? "" :`${this.bill_state}`,
        bill_country: (typeof this.bill_country === "undefined") ? "" :`${this.bill_country}`,
        bill_zip_code: (typeof this.bill_zip_code === "undefined") ? "" :`${this.bill_zip_code}`,
        ship_last_name: (typeof this.ship_last_name === "undefined") ? "" :`${this.ship_last_name}`,
        ship_first_name: (typeof this.ship_first_name === "undefined") ? "" :`${this.ship_first_name}`,
        ship_addr: (typeof this.ship_addr === "undefined") ? "" :`${this.ship_addr}`,
        ship_city: (typeof this.ship_city === "undefined") ? "" :`${this.ship_city}`,
        ship_state: (typeof this.ship_state === "undefined") ? "" :`${this.ship_state}`,
        ship_country: (typeof this.ship_country === "undefined") ? "" :`${this.ship_country}`,
        ship_zip_code: (typeof this.ship_zip_code === "undefined") ? "" :`${this.ship_zip_code}`,
        email_domain: (typeof this.email_domain === "undefined") ? "" :`${this.email_domain}`,
        user_phone: (typeof this.user_phone === "undefined") ? "" :`${this.user_phone}`,
        email: (typeof this.email === "undefined") ? "" :`${this.email}`,
        email_hash: (typeof this.email_hash === "undefined") ? "" :`${this.email_hash}`,
        username_hash: (typeof this.username_hash === "undefined") ? "" :`${this.username_hash}`,
        bin_no: (typeof this.bin_no === "undefined") ? "" :`${this.bin_no}`,
        card_hash: (typeof this.card_hash === "undefined") ? "" :`${this.card_hash}`,
        avs_result: (typeof this.avs_result === "undefined") ? "" :`${this.avs_result}`,
        cvv_result: (typeof this.cvv_result === "undefined") ? "" :`${this.cvv_result}`,
        user_order_id: (typeof this.user_order_id === "undefined") ? "" :`${this.user_order_id}`,
        user_order_memo: (typeof this.user_order_memo === "undefined") ? "" :`${this.user_order_memo}`,
        amount: (typeof this.amount === "undefined") ? "" :`${this.amount}`,
        quantity: (typeof this.quantity === "undefined") ? "" :`${this.quantity}`,
        currency: (typeof this.currency === "undefined") ? "" :`${this.currency}`,
        department: (typeof this.department === "undefined") ? "" :`${this.department}`,
        payment_mode: (typeof this.cvv_result === "undefined") ? "" :`${this.payment_mode}`,
        flp_checksum: (typeof this.flp_checksum === "undefined") ? "" :`${this.flp_checksum}`,
    };

    const process1 = await new Promise((resolve, reject) => {
                         flp.validate(params, (err, data) => {
                                if (err) {
                                    reject(err)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
                                    return        // and we don't want to go any further
                                }
                                resolve(data)
                            })
                        })
                    .then(data => {
                        //console.log(data);
                        return (data);
                    })
                    .catch(err => {console.error(err)});
    return process1;

  },
}