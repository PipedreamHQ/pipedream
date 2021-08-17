const quickbooks = require("../../quickbooks.app");
const fs = require('fs')

module.exports = {
	name: 'Download PDF',
	description: 'Download an invoice, bill, purchase order, etc. as a PDF and save it in the temporary file system for use in a later step.',
	key: 'download_pdf',
	version: '0.1.3',
	type: 'action',
	props: {
		quickbooks,
		entity: {
			type: 'string',
			label: 'Document Type',
			options: [
			  "CreditMemo",
			  "Estimate",
			  "Invoice",
			  "Payment",
			  "PurchaseOrder",
			  "RefundReceipt",
			  "SalesReceipt",
			],
		},
		id: {
			type: 'string',
			label: 'Record Id',
		},
		file_name: {
			type: 'string',
			label: 'File Name (Optional)',
			optional: true,
		},
	},
	methods: {
		async downloadPDF(entity, id, file_name){
		  const file = await require("@pipedreamhq/platform").axios(this, {
		    url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/${entity.toLowerCase()}/${id}/pdf`,
		    headers: {
		      Authorization: `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
		      'accept': 'application/pdf',
		    },
		    responseType: 'arraybuffer',
		  })

		  const file_path = '/tmp/' + file_name
		  fs.writeFileSync(file_path, file)

		  return file_path
		}
	},
	async run({ $ }){
		const file_name = this.file_name || this.id
		const file_name_with_extension = file_name.endsWith('.pdf') ? file_name : file_name + '.pdf' 

		const file_path = await this.downloadPDF(this.entity, this.id, file_name_with_extension)
		$.export('file_path', file_path)
		$.export('file_name', file_name_with_extension)
	}
}