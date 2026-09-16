function applyFilter(filter, value) {
  const regExp = {
    letter: /[^a-zA-Z]/g,
    number: /[^0-9]/g,
    'letter/number': /[^0-9a-zA-Z]/g,
  }[filter];

  return value.replace(regExp, '');
}
export default applyFilter;
