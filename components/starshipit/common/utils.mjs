export default {
  parseFloatProp(ctx, propType, i, itemType) {
    const value = ctx[`${propType}_${i}_${itemType}`];
    return value
      ? parseFloat(value)
      : undefined;
  },
};
