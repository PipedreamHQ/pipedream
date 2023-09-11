import {apiKey, getClient} from '../../utils.mjs'

export default {
    description: 'Look up caller name information via seven.',
    key: 'seven_lookup_cnam',
    name: 'Look up CNAM',
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
            type: 'cnam',
        }
        const res = await getClient(this.apiKey).lookup(params)

        $.export('$summary', `CNAM lookup performed: ${JSON.stringify(res)}`)

        return res
    },
}
