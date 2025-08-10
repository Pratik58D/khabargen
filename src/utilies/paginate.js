//taking model , filter conditions , pagination setting like: limit ,page,sort order



export const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  

  const [data, totalItems] = await Promise.all([
    model.find(query)
      .sort(options.sort || { createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(options.populate || ""),
    model.countDocuments(query)
  ]);

  return {
    page,
    totalPages: Math.ceil(totalItems / limit),
    totalItems,
    data
  };
};
