module.exports = function paginate(sourceList, page, perPage) {
  const totalCount = sourceList.length;
  const sliceBegin = page * perPage;
  const sliceEnd = sliceBegin + perPage;
  const pageList = sourceList.slice(sliceBegin, sliceEnd);
  const isNextPage = totalCount - (page + 1) * perPage > 0;

  return {
    pageData: pageList,
    nextPage: isNextPage ? page + 1 : null,
    totalCount: totalCount,
  };
};
