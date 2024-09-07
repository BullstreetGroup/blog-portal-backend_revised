import capitalize from 'capitalize';

export const handleResponse = ({
  res, statusCode = 200, msg = 'Success', data = {}, result = 1,
}) => {
  res.status(statusCode).send({
    result,
    msg,
    data,
  });
};

export const handleError = ({
  res, statusCode = 500, error, err = 'error', result = 0, language = 'English',
}) => {
  err = error || err;
  if (err.code === 11000) {
    let keyName = 'some arbitrary key';
    const matches = err.message.match(/index:(.*)_1/);
    if (matches) keyName = matches[1] || keyName;
    statusCode = 409;
    err = `${capitalize(keyName.trim())} you entered is already registered`;
  }
  res.error = err;
  const messageOrCode = err instanceof Error ? err.message : (err.msg || err);
  let message = messageOrCode;
 
  res.status(statusCode).send({
    result,
    msg: message,
  });
};
