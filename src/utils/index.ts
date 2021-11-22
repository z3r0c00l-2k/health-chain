export const getRevertMessage = (error: Error) => {
  try {
    const message = error.message;
    const json = JSON.parse(message.slice(58, message.length - 2));
    const errorMessageToShow: string =
      json.data.data[Object.keys(json.data.data)[0]].reason;
    if (errorMessageToShow) {
      alert(errorMessageToShow);
    }
    return errorMessageToShow || '';
  } catch (error) {
    return '';
  }
};
