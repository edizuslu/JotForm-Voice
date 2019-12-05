import { removeSpaces } from "../SpeechRecognation/filterCommand";
import { speakAndStartRecord, stopRecord } from "../Text2Speech/speaker";

/**
 * Set questions array to window
 */
export const getQuestions = () => {
  window.questionCount = getQuestionCount();
  const questions = [];
  for (let index = 0; index < window.questionCount; index++) {
    const questionNumber = index;
    const questionHeader = getQuestionHeader(questionNumber);
    const questionFields = getQuestionFields(questionNumber);
    const dataType = getQuestionDataType(questionFields);
    const fieldNo = 0;
    questions.push({ questionFields, dataType, questionHeader, fieldNo });
  }
  window.questions = questions;
};

/**
 * Checks if form submitted.
 */
export const formSubmitted = () => {
  return document.getElementById("cardProgress-questionCount") === null;
};

/**
 * @return {number}
 */
const getQuestionCount = () => {
  let questionCount = document.getElementById("cardProgress-questionCount");
  questionCount = questionCount.innerHTML;
  questionCount = removeSpaces(questionCount);
  return questionCount;
};

/**
 * @param {number} questionNumber
 * @return {string}
 */
const getQuestionHeader = questionNumber => {
  const questionContainer = document.getElementsByClassName(
    "jsQuestionLabelContainer"
  );
  return questionContainer[questionNumber].innerHTML;
};

/**
 * @param {array} inputFields
 * @return {string}
 */
const getQuestionDataType = inputFields => {
  let element = inputFields[0];
  while (!element.className.includes("form-line")) {
    element = element.parentElement;
  }
  return element.getAttribute("data-type");
};

/**
 * @param {number} questionNumber
 * @return {HTMLCollection}
 */
const getQuestionFields = questionNumber => {
  const questions = document.getElementsByClassName("jfCard-question");
  const question = questions[questionNumber];
  const questionFields = question.getElementsByClassName("jfField");
  return questionFields;
};

/**
 * Get header text
 */
const getHeaderText = () => {
  return document.getElementsByClassName("jfWelcome-header form-header")[0]
    .innerHTML;
};

/**
 * Get subheader text
 */
const getSubHeaderText = () => {
  return document.getElementsByClassName(
    "jfWelcome-description form-subHeader"
  )[0].innerHTML;
};

/**
 * Get header message
 */
export const getHeaderMessage = () => {
  const headerText = getHeaderText();
  const subHeader = getSubHeaderText();
  return headerText + " , " + subHeader;
};

/**
 * @param {HTMLElement} {button}
 * @returns {boolean}
 */
export const isLastHeader = button => {
  return button.getAttribute("class").includes("forNext-heading");
};
