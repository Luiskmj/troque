const shippingServicesCorreios = [
  {
    id: 'sedex_reverso',
    name: 'SEDEX Reverso',
    label: '03247 - SEDEX Reverso',
    value: '03247',
  },
  {
    id: 'sedex_10_reverso',
    name: 'SEDEX 10 Reverso',
    label: '03182 - SEDEX 10 Reverso',
    value: '03182',
  },
  {
    id: 'sedex_12_reverso',
    name: 'SEDEX 12 Reverso',
    label: '03174 - SEDEX 12 Reverso',
    value: '03174',
  },
  {
    id: 'sedex_hoje_reverso',
    name: 'SEDEX HOJE Reverso',
    label: '03190 - SEDEX HOJE Reverso',
    value: '03190',
  },
  {
    id: 'pac_reverso',
    name: 'PAC Reverso',
    label: '03301 - PAC Reverso',
    value: '03301',
  },
];

shippingServicesCorreios.default = shippingServicesCorreios.find(
  ({ id }) => id === 'pac_reverso'
);

export { shippingServicesCorreios };
