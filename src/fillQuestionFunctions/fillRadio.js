import {
  readQuestionHeader,
  readEndOfTheFormMessage
} from "../Text2Speech/speaker";
import { isLastQuestion, getElementByTagName } from "../Form/getFormData";

/**
 * Fill radio
 * @param {object} question
 * @param {string} answer
 */
export const fillRadio = (question, answer) => {
  const { questionFields } = question;
  const radioFields = questionFields;
  for (let field of radioFields) {
    const radioOption = getElementByTagName(field, "input")[0];
    const optionValue = radioOption.defaultValue.toLowerCase();
    if (answer === optionValue) {
      question.answer = answer;
      radioOption.click();
      if (isLastQuestion()) {
        readEndOfTheFormMessage();
      } else {
        window.currentQuestion += 1;
        readQuestionHeader();
      }
    }
  }
};
