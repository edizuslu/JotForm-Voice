import { getElementByTagName } from "../Form/getFormData";

/**
 * Fill number
 * @param {object} question
 * @param {string} answer
 */
export const fillNumber = (question, answer) => {
  const numberInput = getNumberInput(question);
  answer = parseAnswerToNumber(answer);
  numberInput.value = answer;
  question.answer = answer;
};

/**
 * Get number input area
 * @param {object} question
 * @returns {HTMLElement}
 */
const getNumberInput = question => {
  const { questionFields } = question;
  const numberField = questionFields[0];
  return getElementByTagName(numberField, "input")[0];
};

/**
 * Parse answer to number
 * @param {string} answer
 * @returns {number}
 */
const parseAnswerToNumber = answer => {
  try {
    answer = parseInt(answer, 10);
    return answer;
  } catch (err) {
    console.log("Answer is not valid for number type question.");
    return 0;
  }
};
