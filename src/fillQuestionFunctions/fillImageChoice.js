import { getElementByTagName } from "../Form/getFormData";
import { readQuestionHeader } from "../Text2Speech/speaker";

/**
 * Fill image choice
 * @param {object} question
 * @param {string} answer
 */
export const fillImageChoice = (question, answer) => {
  const { questionFields } = question;
  const radioFields = questionFields;
  for (let field of radioFields) {
    const radioOption = getElementByTagName(field, "input")[0];
    const optionValue = getOptionValue(radioOption);
    if (answer === optionValue) {
      selectOption(radioOption, answer, question);
    }
  }
};

/**
 * Get option value
 * @param {HTMLElement} radioOption
 * @returns {string}
 */
const getOptionValue = radioOption => {
  const radioValue = radioOption.value;
  const indexOfImage = radioValue.indexOf("|");
  return indexOfImage > 0
    ? radioValue.substring(0, indexOfImage).toLowerCase()
    : radioValue.toLowerCase();
};

/**
 * Select option
 * @param {HTMLElement} radioOption
 * @param {string} answer
 * @param {object} question
 */
const selectOption = (radioOption, answer, question) => {
  question.answer = answer;
  radioOption.click();
  window.currentQuestion += 1;
  readQuestionHeader();
};
