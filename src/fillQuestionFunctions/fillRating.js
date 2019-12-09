import {
  readQuestionHeader,
  readEndOfTheFormMessage
} from "../Text2Speech/speaker";
import { isLastQuestion, getElementByTagName } from "../Form/getFormData";

/**
 * Fill rating
 * @param {object} question
 * @param {string} answer
 */
export const fillRating = (question, answer) => {
  const { questionFields } = question;
  const field = questionFields[0];
  const ratingOptions = getElementByTagName(field, "li");
  for (let option of ratingOptions) {
    const optionValue = option.getAttribute("data-value");
    if (optionValue === answer) {
      question.answer = answer;
      const ratingButton = getRatingOptionButton(option);
      ratingButton.click();
      if (isLastQuestion()) {
        readEndOfTheFormMessage();
      } else {
        window.currentQuestion += 1;
        readQuestionHeader();
      }
    }
  }
};

/**
 * Get rating option button
 * @param {HTMLElement} option
 * @returns {HTMLElement}
 */
const getRatingOptionButton = option => {
  return getElementByTagName(option, "input")[0];
};
