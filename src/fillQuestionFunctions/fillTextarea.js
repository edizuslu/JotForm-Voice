import { getElementByTagName } from "../Form/getFormData";

/**
 * Fill text area
 * @param {object} question
 * @param {string} answer
 */
export const fillTextarea = (question, answer) => {
  const inputArea = getInputArea(question);
  answer = answer === "delete" ? "" : answer;
  inputArea.innerHTML = answer;
};

/**
 * Get input area
 * @param {object} question
 * @returns {HTMLElement}
 */
const getInputArea = question => {
  const { questionFields } = question;
  const textField = questionFields[0];
  const inputArea = textField.getElementsByClassName("jfTextarea-editor")[0];
  return inputArea === undefined
    ? getElementByTagName(textField, "textarea")[0]
    : inputArea;
};
