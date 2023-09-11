import {apiKey, getClient} from '../../utils.mjs'

export default {
    description: 'Look up phone number formatting via seven.',
    key: 'seven_lookup_format',
    name: 'Look up format',
    props: {
        apiKey,
        number: {
            description: 'The phone number for looking up.',
            label: 'Phone Number',
            type: 'string',
        },
    },
    type: 'action',
    version: '0.0.1',
    async run({$}) {
        const params = {
            number: this.number,
            type: 'format',
        }
        const res = await getClient(this.apiKey).lookup(params)

        $.export('$summary', `Formatting lookup performed: ${JSON.stringify(res)}`)

        return res
    },
}
