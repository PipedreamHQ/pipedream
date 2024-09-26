export const prepareCategories = (data, prefix = "") => {
  return data.reduce((acc, cur) => {
    const resp = [];
    const label = prefix + cur.category_name;
    resp.push(...acc, {
      label,
      value: cur.category_id,
    });
    if (cur.subcategories) {
      resp.push(...prepareCategories(cur.subcategories, label + " - "));
    }
    return resp;
  }, []);
};
