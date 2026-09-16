function formatDate(date) {
  const day = date.getDate();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default formatDate;
