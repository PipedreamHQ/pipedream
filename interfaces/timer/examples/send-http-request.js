module.exports = {
  name: 'invoke-http-function',
  version: '0.0.1',
  props: {
    timer: {
      type: '$.interface.timer',
      default: {
        cron: '0 0 * * *',
      },
    },
  },
  async run() {
    const axios = require('axios');

    const resp = await axios({
      method: 'GET',
      url: `https://swapi.co/api/films/`,
    });

    console.log(resp.data);
  },
};
