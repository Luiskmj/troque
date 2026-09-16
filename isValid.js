import applyFilter from './applyFilter';

const regExps = {
  money: /^[1-9]\d{0,2}(\.\d{3})*,\d{2}$/,
  email:
    // eslint-disable-next-line
    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
  phone: /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}-?[0-9]{4}$/,
  cep: /^[0-9]{5}-?[0-9]{3}$/,
  cpf: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/,
  cnpj: /^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/,
};

const isValid = {
  money: (value) =>
    regExps.money.test(value.replace('R$', '').replace(/\s/g, '')),
  email: (value) => regExps.email.test(value),
  phone: (value) => regExps.phone.test(applyFilter('number', value)),
  date: (value) => value instanceof Date && !Number.isNaN(Number(value)),
  cep: (value) => regExps.cep.test(applyFilter('number', value)),
  cpf: (value) => regExps.cpf.test(applyFilter('number', value)),
  cnpj: (value) => regExps.cnpj.test(applyFilter('number', value)),
  'cpf/cnpj': (value) => isValid.cpf(value) || isValid.cnpj(value),
};
export default isValid;
