/**
 * Fill checkbox
 * @param {object} question
 */
export const fillCheckBox = (question, answer) => {
  const options = getOptions(question);
  for (let option of options) {
    const optionValue = option.value.toLowerCase();
    if (answer === optionValue) {
      option.click();
      question.answer = answer;
    }
  }
};

/**
 * Get checkbox options
 * @param {object} question
 * @returns {HTMLElement}
 */
const getOptions = question => {
  const { questionFields } = question;
  const options = [];
  for (let field of questionFields) {
    const fieldInput = getFieldInput(field);
    options.push(fieldInput);
  }
  return options;
};

/**
 * Get field input
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
const getFieldInput = field => {
  return field.getElementsByTagName("input")[0];
};
