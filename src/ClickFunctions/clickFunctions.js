import {
  setStartButtonListener,
  getActionButton,
  getStartButton
} from "../Form/setButtonListeners";

/**
 * Click start
 */
export const clickStart = () => {
  const startButton = getStartButton();
  startButton.click();
  updateQuestionsActive();
};

/**
 * Click previous
 * Action Type: 0 (Previous)
 */
export const clickPrevious = () => {
  const currentQuestion = window.currentQuestion;
  const nextButton = getActionButton(0, currentQuestion);
  nextButton.click();
};

/**
 * Click next
 * Action Type: 1 (Next)
 */
export const clickNext = () => {
  const currentQuestion = window.currentQuestion;
  const nextButton = getActionButton(1, currentQuestion);
  nextButton.click();
};

/**
 * Click submit
 * Action Type: 2 (Submit)
 */
export const clickSubmit = () => {
  const currentQuestion = window.currentQuestion;
  const submitButton = getActionButton(2, currentQuestion);
  submitButton.click();
};

const updateQuestionsActive = () => {
  if (window.questionsActive) {
    window.questionsActive = false;
  } else {
    setStartButtonListener();
  }
};
