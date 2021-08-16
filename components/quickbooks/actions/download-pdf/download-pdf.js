const quickbooks = require("../../quickbooks.app");
const fs = require('fs')

module.exports = {
	name: 'Download PDF',
	description: 'Download an invoice, bill, purchase order, etc. as a PDF and save it in the temporary file system for use in a later step.',
	key: 'download_pdf',
	version: '0.0.8',
	type: 'action',
	props: {
		quickbooks,
		entity: {
			propDefinition: [
				quickbooks,
				'entity',
			]
		},
		id: {
			type: 'string',
			label: 'Record Id',
		},
		file_name: {
			type: 'string',
			label: 'File Name',
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
		const file_path = await this.downloadPDF(this.entity, this.id, this.file_name)
		$.export('file_path', file_path)
	}
}