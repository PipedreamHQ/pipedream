export default {
  parseObject(obj) {
    let parsed;
    try {
      parsed = JSON.parse(obj);
    } catch (e) {
      parsed = obj;
    }
    return parsed;
  },
  parseArray(arr) {
    const parsed = [];
    arr.forEach(e => {
      parsed.push(this.parseObject(e));
    });
    return parsed;
  },
};
