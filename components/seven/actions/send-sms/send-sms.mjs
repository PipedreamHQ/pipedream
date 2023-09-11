import {apiKey, debug, getClient} from '../../utils.mjs'

export default {
    description: 'Send SMS via seven.',
    key: 'seven_send_sms',
    name: 'Send SMS',
    props: {
        apiKey,
        debug,
        flash: {
            default: false,
            label: 'Flash',
            optional: true,
            type: 'boolean',
        },
        foreignId: {
            label: 'Foreign ID',
            optional: true,
            type: 'string',
        },
        from: {
            label: 'From',
            optional: true,
            type: 'string',
        },
        label: {
            label: 'Label',
            optional: true,
            type: 'string',
        },
        performanceTracking: {
            default: false,
            label: 'Performance Tracking',
            optional: true,
            type: 'boolean',
        },
        text: {
            description: 'The text of the message you want to send, limited to 1520 characters.',
            label: 'Message Body',
            type: 'string',
        },
        to: {
            description: 'The destination phone number(s) separated by comma.',
            label: 'To',
            type: 'string',
        },
    },
    type: 'action',
    version: '0.0.1',
    async run({$}) {
        const params = {
            debug: this.debug,
            flash: this.flash,
            from: this.from ?? '',
            json: true,
            label: this.label ?? '',
            foreign_id: this.foreignId ?? '',
            performance_tracking: this.performanceTracking,
            text: this.text,
            to: this.to,
        }
        const res = await getClient(this.apiKey).sms(params)

        $.export('$summary', `SMS successfully sent: ${JSON.stringify(res)}`)

        return res
    },
}
