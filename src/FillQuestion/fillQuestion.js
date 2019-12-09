import {
  readEndOfTheFormMessage,
  getCurrentQuestion
} from "../Text2Speech/speaker";

import { wordMap } from "../SpeechRecognation/wordMap";

import { isEndOfTheForm } from "../Form/getFormData";

/**
 * @param {string} answer
 */
export const fillQuestion = answer => {
  const question = getCurrentQuestion();
  const { dataType } = question;
  const fillQuestionFunction = getFillQuestionFunction(dataType);
  fillQuestionFunction(question, answer);

  if (isEndOfTheForm(question)) {
    readEndOfTheFormMessage();
  }
};

getFillQuestionFunction = dataType => {
  console.log("dataType");
  console.log(dataType);

  return wordMap.formElementFunctions[dataType].fillQuestion;
};
