import { getElementByTagName } from "../Form/getFormData";

/**
 * Fill textbox
 * @param {object} question
 */
export const fillTextbox = (question, answer) => {
  const textBoxInput = getTextboxInput(question);
  if (answer === "delete") {
    clearTextBox(textBoxInput);
  } else {
    const prevValue = textBoxInput.value;
    question.answer = fillText(textBoxInput, answer, prevValue);
  }
};

/**
 * Get textbox input
 * @param {object} question
 * @returns {HTMLElement}
 */
const getTextboxInput = question => {
  const { questionFields } = question;
  const textBoxField = questionFields[0];
  return getElementByTagName(textBoxField, "input")[0];
};

/**
 * Clear textbox.
 * @param {HTMLElement} textBoxInput
 */
const clearTextBox = textBoxInput => {
  textBoxInput.value = "";
  textBoxInput.parentElement.className = textBoxInput.parentElement.className.replace(
    " isFilled",
    ""
  );
};

/**
 * @param {HTMLElement} textBoxInput
 * @param {string} answer
 * @param {string} prevValue
 * @returns {string}
 */
const fillText = (textBoxInput, answer, prevValue) => {
  answer = formatAnswerCaseRule(answer, prevValue);
  textBoxInput.value = answer;
  textBoxInput.parentElement.className += " isFilled";
  return answer;
};

/**
 * Format answer according to case rule
 * @param {string} answer
 * @param {string} prevValue
 * @returns {string}
 */
const formatAnswerCaseRule = (answer, prevValue) => {
  const firstLetter = answer.substring(0, 1).toUpperCase();
  return prevValue !== ""
    ? prevValue + firstLetter + answer.substring(1) + ". "
    : firstLetter + answer.substring(1) + ". ";
};
