import { removeSpaces } from "../SpeechRecognation/filterCommand";

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
 * @param {HTMLElement} jfField
 * @param {string} tagName
 * @return {HTMLCollection}
 */
export const getElementByTagName = (jfField, tagName) => {
  return jfField.getElementsByTagName(tagName);
};

/**
 * Get header text
 * @returns {string}
 */
const getHeaderText = () => {
  return document.getElementsByClassName("jfWelcome-header form-header")[0]
    .innerHTML;
};

/**
 * Get subheader text
 * @returns {string}
 */
const getSubHeaderText = () => {
  return document.getElementsByClassName(
    "jfWelcome-description form-subHeader"
  )[0].innerHTML;
};

/**
 * Get header message
 * @returns {string}
 */
export const getHeaderMessage = () => {
  const headerText = getHeaderText();
  const subHeader = getSubHeaderText();
  return headerText + " , " + subHeader;
};

/**
 * Controls is last header
 * @param {HTMLElement} {button}
 * @returns {boolean}
 */
export const isLastHeader = button => {
  return button.getAttribute("class").includes("forNext-heading");
};

/**
 * Controls if is last question or not
 * @returns {boolean}
 */
export const isLastQuestion = button => {
  return window.currentQuestion + 1 >= window.questions.length;
};

/**
 * Checks is end of the form or not
 * @param {object} {question}
 * @returns {boolean}
 */
export const isEndOfTheForm = question => {
  return (
    window.currentQuestion === window.questionCount - 1 &&
    question.fieldNo === question.questionFields.length - 1
  );
};
