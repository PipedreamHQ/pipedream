import app from "../../remote_retrieval.app.mjs";

export default {
  key: "remote_retrieval-create-device-order",
  name: "Create Device Order",
  description: "Creates a device return order. [See the documentation](https://www.remoteretrieval.com/api-documentation/#create-order)",
  type: "action",
  version: "0.1.0",
  props: {
    app,

    employeeInfoEmail: {
        type: "string",
        label: "Employee Info Email",
        description: "Used in email communications with the employee."
      },
      employeeInfoName: {
        type: "string",
        label: "Employee Info Name",
        description: "Employee full name to print on the shipping label."
      },
      employeeInfoAdd_1: {
        type: "string",
        label: "Employee Info Address Line 1",
        description: "The first line of the employee address"
      },
      employeeInfoAdd_2: {
        type: "string",
        label: "Employee Info Address Line 2",
        description: "The second line is optional for employee address",
        optional: true ,
      },
      employeeInfoCity: {
        type: "string",
        label: "Employee Info City",
        description: "City of employee",
      },
      employeeInfoState: {
        type: "string",
        label: "Employee Info State",
        description: "State of employee",
      },
      employeeInfoZip: {
        type: "string",
        label: "Employee Info Zip",
        description: "Zip code of employee",
      },
      employeeInfoPhone: {
        type: "string",
        label: "Employee Info Phone",
        description: "Phone of employee",
      },
      employeeInfoCountry: {
        type: "string",
        label: "Employee Info Country",
        description: "This service is only for USA",
         options: ["US"],
        default:  "US",
      },    

      companyInfoPerson: {
        type: "string",
        label: "Company Info Person Name",
        description: "Receipient Name"
      },
      companyInfoCompanyName: {
        type: "string",
        label: "Company Info Company Name",
        description: "Company Name"        
      },
      companyInfoAdd_1: {
        type: "string",
        label: "Company Info Address Line 1",
        description: "The first line of the company address"
      },
      companyInfoAdd_2: {
        type: "string",
        label: "Company Info Address Line 2",
        description: "The second line is optional for company address",
      },
      companyInfoCity: {
        type: "string",
        label: "Company Info City",
        description: "Company city",        
      },
      companyInfoState: {
        type: "string",
        label: "Company Info State",
        description: "Company State(Example: TX,AL,NJ)",        
      },
      companyInfoZip: {
        type: "string",
        label: "Company Info Zip",
        description: "Company Zip",        
      },
      companyInfoPhone: {
        type: "string",
        label: "Company Info Phone",
        description: "Company Phone",                
      },   
      companyInfoEmail: {
        type: "string",
        label: "Company Info Email",
        description: "Company Email",                        
      },
      typeOfEquipment: {
        type: "string",
        label: "Type of Equipment",
        description: "You can choose 'Laptop' or 'Monitor'",
        options: ['Laptop','Monitor'],
        default: "Laptop"
      },      
      orderType: {
        type: "string",
        label: "Order Type",
        description: "You can choose 'Return to Company' or 'Sell this Equipment'",
        options: ['Return to Company','Sell this Equipment'],
        default: "Return to Company"
      },         
  },

  methods: {
    createDeviceReturn(args = {}) {
      return this.app.post({
        path: "/create-order/",
        ...args,
      });
    },
  },


 async run({ $: step }) {
    const {
        employeeInfoEmail,
        employeeInfoName,
        employeeInfoAdd_1,
        employeeInfoAdd_2,
        employeeInfoCity,
        employeeInfoState,
        employeeInfoZip,
        employeeInfoPhone,
        companyInfoPerson,
        companyInfoCompanyName,
        companyInfoAdd_1,
        companyInfoAdd_2,
        companyInfoCity,
        companyInfoState,
        companyInfoZip,
        companyInfoPhone,
        companyInfoEmail,
        typeOfEquipment,
        orderType
        
    } = this;

    const response = await createDeviceReturn({
      step,
      data: {
        type_of_equipment: typeOfEquipment,
        order_type: orderType,
        employee_info: {
          email: employeeInfoEmail,
          name: employeeInfoName,
          address_line_1: employeeInfoAdd_1,
          address_line_2: employeeInfoAdd_2,
          address_city: employeeInfoCity,
          address_state: employeeInfoState,
          address_zip: employeeInfoZip,
          phone: employeeInfoPhone,
        },
        company_info: {
            return_person_name: companyInfoPerson,
            return_company_name: companyInfoCompanyName,
            return_address_line_1: companyInfoAdd_1,
            return_address_line_2: companyInfoAdd_2,
            return_address_city: companyInfoCity,
            return_address_state: companyInfoState,
            return_address_zip: companyInfoZip,
            email: companyInfoEmail,
            phone: companyInfoPhone,
        },
      },
    });

    step.export("$summary", `Successfully created device return order with ID \`${response.order}\``);

    return response;
  },



};
