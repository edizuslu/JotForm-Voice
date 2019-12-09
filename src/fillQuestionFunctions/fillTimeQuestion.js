import { answer2AmPm } from "../SpeechRecognation/filterCommand";

/**
 * Fill time
 * @param {object} question
 * @param {string} answer
 */
export const fillTimeQuestion = (question, answer) => {
  const timeDataArray = getTimeData(question);
  if (answer === "delete") {
    clearTime(timeDataArray);
  } else {
    fillTimeFields(timeDataArray, answer);
    question.answer = answer;
  }
};

/**
 * Time data array
 * 0: Hour
 * 1: Minute
 * 2: Pm or Am
 * @param {object} question
 * @param {array}
 */
const getTimeData = question => {
  let timeDataArray = [];
  const { questionFields } = question;
  for (let field of questionFields) {
    const fieldOptions = field.getElementsByTagName("option");
    const fieldSpan = field.getElementsByTagName("span")[0];
    timeDataArray.push({ fieldOptions, fieldSpan });
  }
  return timeDataArray;
};

/**
 * Clear time fields
 * @param {HTMLElement} options
 * @param {HTMLElement} span
 */
const clearTime = timeDataArray => {
  for (let field of timeDataArray) {
    clearTimeInput(field.fieldOptions, field.fieldSpan);
  }
};

/**
 * Clear time input
 * @param {HTMLElement} options
 * @param {HTMLElement} span
 */
const clearTimeInput = (options, span) => {
  for (let option of options) {
    option.removeAttribute("selected");
    span.innerHTML = "";
  }
};

/**
 * Fill time fields
 * @param {array} timeDataArray
 * @param {string} answer
 */
const fillTimeFields = (timeDataArray, answer) => {
  const answerArray = getTimeAnswers(answer);
  let index = 0;
  for (let field of timeDataArray) {
    fillTimeInput(field.fieldOptions, answerArray[index], field.fieldSpan);
    index += 1;
  }
};

/**
 * Fill time input
 * @param {HTMLCollection} options
 * @param {string} value
 * @param {HTMLElement} span
 */
const fillTimeInput = (options, value, span) => {
  for (let option of options) {
    if (value === option.value) {
      option.setAttribute("selected", "true");
      span.innerHTML = option.innerHTML;
    } else {
      option.removeAttribute("selected");
    }
  }
};

/**
 * Get all time answers
 * @param {string} answer
 * @returns {array}
 */
const getTimeAnswers = answer => {
  const splittedAnswer = answer.split(" ").filter(ans => ans.includes(":"));
  const hourMinute = splittedAnswer[0];
  const hourMinuteArr = hourMinute.split(":");
  const hourValue = hourMinuteArr[0];
  const minuteValue = hourMinuteArr[1];
  const pmamValue = answer2AmPm(answer);
  return [hourValue, minuteValue, pmamValue];
};
