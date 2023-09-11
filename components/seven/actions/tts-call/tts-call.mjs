import {apiKey, debug, getClient} from '../../utils.mjs'

export default {
    description: 'Make a text-to-speech call via seven.',
    key: 'seven_tts_call',
    name: 'Make text-to-speech call',
    props: {
        apiKey,
        debug,
        from: {
            description: 'Caller ID. Must be verified or a shared one.',
            label: 'From',
            optional: true,
            type: 'string',
        },
        text: {
            description: 'The text of the message you want to send, limited to 10000 characters.',
            label: 'Message Body',
            type: 'string',
        },
        to: {
            description: 'The destination phone number.',
            label: 'To',
            type: 'string',
        },
        xml: {
            default: false,
            description: 'Set to true if text is of XML format.',
            label: 'XML',
            optional: true,
            type: 'boolean',
        },
    },
    type: 'action',
    version: '0.0.1',
    async run({$}) {
        const params = {
            debug: this.debug,
            from: this.from ?? '',
            json: true,
            text: this.text,
            to: this.to,
            xml: this.xml,
        }
        const res = await getClient(this.apiKey).voice(params)

        $.export('$summary', `Voice call successfully sent: ${JSON.stringify(res)}`)

        return res
    },
}
