import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import handleError from '../common/handleError';

function useSubmitHandler(
  { onLoading, onSuccess, onError, onValidationError },
  formRef,
  validationSchema
) {
  const [status, setStatus] = React.useState('');

  const history = useHistory();

  const onSubmit = async (data) => {
    formRef.current.setErrors({});
    setStatus('');

    try {
      if (validationSchema) {
        await validationSchema.validate(data, { abortEarly: false });
      }

      setStatus('loading');

      if (onLoading) {
        await onLoading(data);
      }

      setStatus('success');

      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        if (onValidationError) {
          await onValidationError(err);
        } else {
          formRef.current.setErrors(
            err.inner.reduce(
              (prev, error) => ({
                ...prev,
                [error.path]: error.message,
              }),
              {}
            )
          );
        }
      } else {
        setStatus('error');

        if (onError) {
          await onError(err);
        } else {
          handleError(err, history);
        }
      }
    }
  };

  return {
    status,
    onSubmit,
  };
}

export default useSubmitHandler;
