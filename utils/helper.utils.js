const throwError = (errorMessage, code) => {
  const error = new Error(errorMessage);
  if (!!code) {
    error.code = code;
  }

  console.log(error.message);
};

const createNoteObject = (data) => {
  const { description, title } = data;
  let note;
  if (Array.isArray(description)) {
    note = {
      title,
      description: {
        isTodo: true,
        value: description,
      },
    };
  } else {
    note = {
      title,
      description: {
        isTodo: false,
        value: description,
      },
    };
  }

  return note;
};

module.exports = {
  throwError,
  createNoteObject,
};
