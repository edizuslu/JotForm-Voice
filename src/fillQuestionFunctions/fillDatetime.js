import { answer2Date } from "../SpeechRecognation/filterCommand";

/**
 * Fill datetime
 * @param {object} question
 * @param {object} answer
 */
export const fillDatetime = (question, answer) => {
  const dateAnswer = answer2Date(answer);
  const datetimeField = getDateTimeField(question);
  datetimeField.value = dateAnswer;
  question.answer = dateAnswer;
};

/**
 * Get datetime field
 * @param {object} question
 * @returns {HTMLElement}
 */
export const getDateTimeField = question => {
  const { questionFields } = question;
  const datetimeField = questionFields[0];
  return datetimeField.getElementsByTagName("input")[0];
};
