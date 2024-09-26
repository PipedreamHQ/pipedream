export default {
  parseOne(obj) {
    let parsed;
    try {
      parsed = JSON.parse(obj);
    } catch (e) {
      parsed = obj;
    }
    return parsed;
  },
  parseObject(obj) {
    let parsed = {};
    for (let key in obj) {
      parsed[key] = this.parseOne(obj[key]);
    }
    return parsed;
  },
  parseArray(arr) {
    const parsed = [];
    arr.forEach((e) => {
      parsed.push(this.parseOne(e));
    });
    return parsed;
  },
};
