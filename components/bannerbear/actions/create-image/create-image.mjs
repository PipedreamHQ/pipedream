import { axios } from "@pipedream/platform";

import bannerbear from '../../bannerbear.app.mjs'

export default {
  key: "bannerbear-create-image",
  name: "Create an Image",
  description: "Create an image using template and modifications. [See the docs](https://developers.bannerbear.com/#post-v2-images)",
  version: "0.0.1",
  type: "action",
  props: {
    bannerbear,
    template: {
      propDefinition: [
        bannerbear,
        "template",
      ],
    },
    modifications: {
      type: 'object',
      description: 'A list of modifications you want to make. [See the docs](https://developers.bannerbear.com/#post-v2-images)'
    }
  },
  async run({ $ }) {
    const response = await axios($, {
      method: 'POST',
      url: 'https://sync.api.bannerbear.com/v2/images',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bannerbear.getAuthKey()}`
      },
      data: {
        template: this.template,
        modifications: this.modifications
      }
    })

    return response;
  },
};
