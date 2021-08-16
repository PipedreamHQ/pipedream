const quickbooks = require("../quickbooks.app");

module.exports = {
	name: 'Download PDF',
	description: 'Download an invoice, bill, purchase order, etc. as a PDF and save it in the temporary file system for use in a later step.',
	key: 'download_pdf',
	version: '0.0.1',
	type: 'action',
	props: {
		quickbooks
	},
	methods: {},
	async run(){
		// const fs = require('fs')

		// const {name, operation, id} = steps.trigger.event.event_notification.body.eventNotifications[0].dataChangeEvent.entities[0]
		// const po = steps.trigger.event.record_details.PurchaseOrder

		// const po_number = po.DocNumber.replace('/', ' ')
		// const vendor_name = po.VendorRef.name.replace(' [V]', '')
		// const file_name = `${po.TxnDate} PO ${po_number} for ${vendor_name.replace('&', ' and ')}.pdf`
		// const file_path = await downloadPDF(id, file_name)

		// this.qb_id = id
		// this.po = po
		// this.file_name = file_name
		// this.file_path = file_path

		// async function downloadPDF(id, file_name){
		//   const file = await require("@pipedreamhq/platform").axios(this, {
		//     url: `https://quickbooks.api.intuit.com/v3/company/${this.quickbooks.$auth.company_id}/purchaseorder/${id}/pdf`,
		//     headers: {
		//       Authorization: `Bearer ${this.quickbooks.$auth.oauth_access_token}`,
		//       'accept': 'application/pdf',
		//     },
		//     responseType: 'arraybuffer',
		//   })

		//   const file_path = '/tmp/' + file_name
		//   fs.writeFileSync(file_path, file)

		//   return file_path
		// }
	}
}