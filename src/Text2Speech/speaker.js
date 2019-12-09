import { wordMap } from "../SpeechRecognation/wordMap";
import { getHeaderMessage } from "../Form/getFormData";

/**
 * Start record
 */
export const startRecord = () => {
  window.recognition.start();
  window.speechStopped = false;
};

/**
 * Stop record
 */
export const stopRecord = () => {
  recognition.stop();
  speechStopped = true;
};

/**
 * Speak and start record
 * @param {string} speakText
 */
export const speakAndStartRecord = speakText => {
  stopRecord();
  setTimeout(function() {
    const message = new SpeechSynthesisUtterance(speakText);
    window.speechSynthesis.speak(message);
    message.onend = function() {
      startRecord();
    };
  }, 1000);
};

/**
 * Read question header and read question options if it is optional.
 */
export const readQuestionHeader = () => {
  const question = getCurrentQuestion();
  const { questionHeader, dataType } = question;
  if (isMultipleFieldWidget(dataType)) {
    stopRecord();
    setTimeout(function() {
      const message = new SpeechSynthesisUtterance(questionHeader);
      window.speechSynthesis.speak(message);
      message.onend = function() {
        question.fieldNo = 0;
        readQuestionOptions(dataType);
      };
    }, 1000);
  } else {
    speakAndStartRecord(questionHeader);
  }
};

/**
 * Read question options
 */
export const readQuestionOptions = () => {
  const currentQuestion = getCurrentQuestion();
  const { dataType } = currentQuestion;
  const readOptionsFunction = getReadOptionsFunction(dataType);
  readOptionsFunction(currentQuestion);
};

/**
 * Ger read options function
 * @param {string} dataType
 * @return {function}
 */
export const getReadOptionsFunction = dataType => {
  console.log("Heyo : ");
  console.log(dataType);
  return wordMap.formElementFunctions[dataType].readOptions;
};

/**
 * Get Current Question
 * @returns {object}
 */
export const getCurrentQuestion = () => {
  const currentQuestion = window.currentQuestion;
  return window.questions[currentQuestion];
};

/**
 * Multiple field widget filter
 * @param {string} {dataType}
 * @returns {boolean}
 */
const isMultipleFieldWidget = dataType => {
  const { multipleFieldWidgets } = wordMap;
  return multipleFieldWidgets.includes(dataType);
};

/**
 * Read end of the form message
 */
export const readEndOfTheFormMessage = () => {
  const { endFormMessage } = wordMap;
  speakAndStartRecord(endFormMessage);
};

/**
 * Get multiple field answers
 * ex: Question 5 <Question Header> : <Question Answer 1> <Question Answer 2> ...
 * @param {string} answer
 * @returns {string}
 */
const getMultipleFieldAnswer = (question, qid, qHeader) => {
  const fields = question.questionFields;
  let fieldAnswers = "";
  for (let field of fields) {
    const fieldAnswer = field.answer;
    if (fieldAnswer !== undefined) {
      fieldAnswers += fieldAnswer + " , ";
    }
  }
  return fieldAnswers;
};

/**
 * Format answer
 * ex: Question 5 <Question Header> : <Question Answer>
 * @param {string} answer
 * @returns {string}
 */
const formatAnswer = (answer, qid, qHeader) => {
  if (answer !== "") {
    return (
      "Question " +
      qid +
      " , " +
      qHeader +
      " , " +
      "Answer is , " +
      answer +
      " . "
    );
  } else {
    return "";
  }
};

/**
 * @param {string} answer
 * @returns {boolean}
 */
const hasMultipleAnswers = answer => {
  return answer === undefined;
};

/**
 * Get all answers
 * @returns {string}
 */
const getAllAnswers = () => {
  const questions = window.questions;
  let answersText = "";
  let qid = 1;
  for (let question of questions) {
    const qAnswer = question.answer;
    const qHeader = question.questionHeader;
    answersText += hasMultipleAnswers(qAnswer)
      ? formatAnswer(getMultipleFieldAnswer(question), qid, qHeader)
      : formatAnswer(qAnswer, qid, qHeader);
    qid += 1;
  }
  return answersText;
};

/**
 * Read all answers of form.
 */
export const readAllAnswers = () => {
  const { optionalEndFormMessage } = wordMap;
  const answers = getAllAnswers() + optionalEndFormMessage;
  speakAndStartRecord(answers);
};

/**
 * Read Form Header
 */
export const readHeaderTexts = () => {
  const headerMessage = getHeaderMessage();
  speakAndStartRecord(headerMessage);
};
