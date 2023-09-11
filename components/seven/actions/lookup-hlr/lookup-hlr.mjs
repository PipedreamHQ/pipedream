import {apiKey, getClient} from '../../utils.mjs'

export default {
    description: 'Look up home location register information via seven.',
    key: 'seven_lookup_hlr',
    name: 'Look up HLR',
    props: {
        apiKey,
        number: {
            description: 'The mobile phone number for looking up.',
            label: 'Mobile Phone Number',
            type: 'string',
        },
    },
    type: 'action',
    version: '0.0.1',
    async run({$}) {
        const params = {
            number: this.number,
            type: 'hlr',
        }
        const res = await getClient(this.apiKey).lookup(params)

        $.export('$summary', `HLR lookup performed: ${JSON.stringify(res)}`)

        return res
    },
}
