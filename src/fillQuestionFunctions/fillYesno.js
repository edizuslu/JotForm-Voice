import { getElementByTagName } from "../Form/getFormData";
import { readQuestionHeader } from "../Text2Speech/speaker";

/**
 * Read multiple optional fields
 * @param {object} question
 */
export const fillYesno = (question, answer) => {
  const yesNoOptions = getYesnoOptions(question);
  for (let option of yesNoOptions) {
    const optionValue = option.value.toLowerCase();
    if (answer === optionValue) {
      question.answer = answer;
      option.click();
      window.currentQuestion += 1;
      readQuestionHeader();
    }
  }
};

/**
 * Get yes no question options
 * @param {object} question
 * @returns {HTMLAllCollection}
 */
export const getYesnoOptions = question => {
  const { questionFields } = question;
  const yesnoField = questionFields[0];
  return getElementByTagName(yesnoField, "input");
};
