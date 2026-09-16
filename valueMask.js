import IMask from 'imask';
import applyFilter from './applyFilter';

const instances = {
  money: new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }),
  phone: IMask.createMask({
    mask: '(00) 00000-0000',
  }),
  date: IMask.createMask({
    mask: '00/00/0000',
  }),
  number: IMask.createMask({
    mask: /^-?[0-9.,]*$/,
  }),
  cep: IMask.createMask({
    mask: '00000-000',
  }),
  cpf: IMask.createMask({
    mask: '000.000.000-00',
  }),
  cnpj: IMask.createMask({
    mask: '00.000.000/0000-00',
  }),
  'cpf/cnpj': IMask.createMask({
    mask: [{ mask: '000.000.000-00' }, { mask: '00.000.000/0000-00' }],
  }),
};

const valueMask = {
  money: Object.assign(
    (value) =>
      instances.money.format(
        typeof value === 'number'
          ? value
          : Number(applyFilter('number', value)) / 100
      ),
    {
      input: 'decimal',
      parse(value) {
        return Number(
          value.replace('R$', '').replace(/\./g, '').replace(',', '.')
        );
      },
    }
  ),
  phone: Object.assign(
    (value) => instances.phone.resolve(applyFilter('number', value)),
    {
      input: 'tel',
      parse(value) {
        return applyFilter('number', value);
      },
    }
  ),
  date: Object.assign(
    (value) => {
      if (value instanceof Date) {
        return value.toLocaleDateString('pt-br');
      }

      const zeroFixed = value
        .match(/[0-9]?[0-9]\//g)
        ?.map((str) => str.replace('/', '').padStart(2, '0'));

      return instances.date.resolve(
        applyFilter(
          'number',
          value
            .split('/')
            .map((str, i) => zeroFixed?.[i] || str)
            .join('/')
        )
      );
    },
    {
      input: 'numeric',
      parse(value) {
        const [day, month, year] = value.split('/');

        return new Date(`${year}-${month}-${day}T00:00:00`);
      },
    }
  ),
  number: Object.assign(
    (
      value,
      options = {
        maxDecimalPlaces: 'auto',
        allowNegative: false,
        allowDecimals: false,
        allowLeadingZeros: false,
      }
    ) => {
      const {
        maxDecimalPlaces,
        allowNegative,
        allowDecimals,
        allowLeadingZeros,
      } = options;

      let valueIn = instances.number.resolve(String(value));

      if (!allowNegative) {
        valueIn = valueIn.replace('-', '');
      }

      if (!allowDecimals) {
        valueIn = valueIn.replace(/\./g, '').replace(/,/g, '');
      } else {
        valueIn = valueIn
          .replace(/,/g, '.')
          .replace('.', 'x')
          .replace(/\./g, '')
          .replace('x', '.');

        if (maxDecimalPlaces !== 'auto') {
          const [integer, decimal] = valueIn.split('.');

          if (decimal) {
            valueIn = `${integer}.${decimal.slice(0, maxDecimalPlaces)}`;
          }
        }
      }

      if (!allowLeadingZeros) {
        if (valueIn.startsWith('-')) {
          valueIn = `-${valueIn.slice(1).replace(/^0+(?=\d)/, '')}`;
        } else {
          valueIn = valueIn.replace(/^0+(?=\d)/, '');
        }
      }

      return valueIn;
    },
    {
      input: 'decimal',
      parse(value) {
        return Number(value);
      },
    }
  ),
  cep: Object.assign(
    (value) => instances.cep.resolve(applyFilter('number', value)),
    {
      input: 'numeric',
      parse(value) {
        return applyFilter('number', value);
      },
    }
  ),
  cpf: Object.assign(
    (value) => instances.cpf.resolve(applyFilter('number', value)),
    {
      input: 'numeric',
      parse(value) {
        return applyFilter('number', value);
      },
    }
  ),
  cnpj: Object.assign(
    (value) => instances.cnpj.resolve(applyFilter('number', value)),
    {
      input: 'numeric',
      parse(value) {
        return applyFilter('number', value);
      },
    }
  ),
  'cpf/cnpj': Object.assign(
    (value) => instances['cpf/cnpj'].resolve(applyFilter('number', value)),
    {
      input: 'numeric',
      parse(value) {
        return applyFilter('number', value);
      },
    }
  ),
};

export default valueMask;
