function getFieldRule({ isRequired }) {
  const message =
    typeof isRequired === 'string' ? isRequired : 'Este campo é obrigatório';

  return {
    required: isRequired ? message : false,
  };
}
export default getFieldRule;
