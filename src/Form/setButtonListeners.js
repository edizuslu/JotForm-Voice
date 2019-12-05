import { readHeaderTexts, readQuestionHeader } from "../Text2Speech/speaker";
import { getQuestions, isLastHeader } from "./getFormData";

/**
 * Initialize voice form
 */
export const initializeVoiceForm = () => {
  getQuestions();
  setStartButtonListener();
  setNextnPreviousButtonsListener();
};

/**
 * Set start button listener
 */
export const setStartButtonListener = () => {
  const startButton = getStartButton();
  if (isLastHeader(startButton)) {
    /* Questions are active, read first question. */
    addEventListenerToButton(startButton, 0, readQuestionHeader);
    window.questionsActive = true;
  }
  readHeaderTexts();
};

/**
 * Get start button
 * @returns {HTMLElement}
 */
export const getStartButton = () => {
  return document.getElementById("jfCard-welcome-start");
};

/**
 * Set next and previous buttons listeners
 */
const setNextnPreviousButtonsListener = () => {
  for (let qNumber = 0; qNumber < window.questionCount; qNumber++) {
    setNextButtonsListener(qNumber);
    setPreviousButtonsListener(qNumber);
  }
};

/**
 * Set next button listener
 * Action type: 1
 * Increase current question
 * @param {number} questionNumber
 */
const setNextButtonsListener = questionNumber => {
  const nextButton = getActionButton(1, questionNumber);
  addEventListenerToButton(nextButton, 1, readQuestionHeader);
};

/**
 * Set previous button listener
 * Action type: 0
 * Decrease current question
 * @param {number} questionNumber
 */
const setPreviousButtonsListener = questionNumber => {
  const previousButton = getActionButton(0, questionNumber);
  addEventListenerToButton(previousButton, -1, readQuestionHeader);
};

/**
 * Get action button
 * Action type
 * 0: Previous
 * 1: Next
 * 2: Submit
 * @param {number} actionType
 * @param {number} currentQuestion
 * @returns {HTMLElement}
 */
export const getActionButton = (actionType, currentQuestion) => {
  const currentCard = document.getElementsByClassName("jfCard-actions");
  const cardActionDiv = currentCard[currentQuestion];
  return cardActionDiv.getElementsByTagName("button")[actionType];
};

/**
 * Add event listener to button
 * @param {HTMLElement} button
 * @param {number} addCurrentQuestion
 * @param {function} eventFunction
 */
const addEventListenerToButton = (
  button,
  addCurrentQuestion,
  eventFunction
) => {
  button.addEventListener("click", function() {
    window.currentQuestion += addCurrentQuestion;
    eventFunction(window.currentQuestion);
  });
};
