import { FormContext } from '@unform/core';
import React from 'react';

function useForm(formRef) {
  if (!formRef) {
    throw new Error('A referência de um formulário deve ser passada');
  }

  const { scopePath } = React.useContext(FormContext);

  const fullPath = React.useCallback(
    (field) => {
      if (scopePath) {
        return `${scopePath}.${field}`;
      }

      return field;
    },
    [scopePath]
  );

  return React.useMemo(
    () => ({
      form: {
        getFieldValue: (field) => {
          return formRef.current.getFieldValue(fullPath(field));
        },
        setFieldValue: (field, value) => {
          formRef.current.setFieldValue(fullPath(field), value);
        },
        setFieldError: (field, error) => {
          formRef.current.setFieldError(fullPath(field), error);
        },
      },
    }),
    [formRef, fullPath]
  );
}

export default useForm;
