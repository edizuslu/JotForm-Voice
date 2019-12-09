import { answer2Email } from "../SpeechRecognation/filterCommand";
import { getElementByTagName } from "../Form/getFormData";

/**
 * Fill email
 * @param {object} question
 * @param {string} answer
 */
export const fillEmail = (question, answer) => {
  const { questionFields } = question;
  const emailElement = questionFields[0];
  const emailInput = getElementByTagName(emailElement, "input")[0];
  if (answer === "delete") {
    clearInput(emailInput, emailElement);
  } else {
    const prevValue = emailInput.value;
    answer = answer2Email(answer, prevValue);
    fillInput(emailInput, emailElement, answer, prevValue);
    question.answer = emailInput.value;
  }
};

/**
 * Clear email input
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 */
const clearInput = (input, jfField) => {
  input.value = "";
  jfField.className = jfField.className.replace(" isFilled", "");
};

/**
 * Fill email input
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 * @param {string} answer
 * @param {string} prevValue
 */
const fillInput = (input, jfField, answer, prevValue) => {
  input.value = prevValue !== undefined ? prevValue + answer : answer;
  jfField.className += " isFilled";
  jfField.answer = answer;
};
