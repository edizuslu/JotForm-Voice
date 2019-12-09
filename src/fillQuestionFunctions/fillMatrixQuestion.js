import { readQuestionOptions } from "../Text2Speech/speaker";
import { clickNext } from "../ClickFunctions/clickFunctions";

/**
 * Fill matrix question
 * @param {object} question
 * @param {string} answer
 */
export const fillMatrixQuestion = (question, answer) => {
  const { matrixRows } = question;
  if (matrixRows === "emoji slider") {
    fillEmojiSlider(question, answer);
  } else {
    //Matrix
    fillMatrix(question, answer);
  }
};

/**
 * Fill emoji slider
 * @param {object} question
 * @param {string} answer
 */
const fillEmojiSlider = (question, answer) => {
  answer = answer.replace("%", "");
  const scales = getScales(question);
  for (let scale of scales) {
    const scaleValue = getScaleValue(scale);
    if (scaleValue === answer) {
      fillSlider(scale, scaleValue);
      question.answer = answer;
    } else if (isValidPercentageType(answer)) {
      //Do nothing
      scale.className = scale.className.replace(" isVisible", "");
    }
  }
};

/**
 * Fill mamtrix
 * @param {HTMLElement} emojiField
 * @param {HTMLCollection} fieldNo
 */
const fillMatrix = (question, answer) => {
  if (answer === "skip") {
    skipField(question);
  } else {
    fillField(question, answer);
  }
};

/**
 * Fill field
 * @param {object} question
 * @param {string} answer
 */
const fillField = (question, answer) => {
  const { matrixRows, fieldNo } = question;
  const answerInputs = matrixRows[fieldNo].getElementsByTagName("input");
  for (let input of answerInputs) {
    const inputValue = input.value.toLowerCase();
    if (inputValue === answer) {
      input.click();
      question.answer = answer;
      if (!isLastField(fieldNo, matrixRows)) {
        question.fieldNo += 1;
        readQuestionOptions();
      }
    }
  }
};

/**
 * Skip field
 * @param {object} question
 */
const skipField = question => {
  const { fieldNo, matrixRows } = question;
  if (isLastField(fieldNo, matrixRows)) {
    question.fieldNo = 0;
    question.matrixRows = undefined;
    clickNext();
  } else {
    question.fieldNo += 1;
    readQuestionOptions();
  }
};

/**
 * Controls if field is last
 * @param {number} fieldNo
 * @param {HTMLCollection} matrixRows
 * @returns {boolean}
 */
const isLastField = (fieldNo, matrixRows) => {
  return fieldNo === matrixRows.length - 1;
};

/**
 * Get slider field value
 * @param {HTMLElement} scale
 * @returns {string}
 */
const getScaleValue = scale => {
  return scale.getAttribute("data-scale").replace(".00", "");
};

/**
 * Get scales
 * @param {object} question
 * @returns {HTMLCollection}
 */
const getScales = question => {
  const { questionFields } = question;
  const emojiField = questionFields[0];
  return getAllElementHasAttribute(
    emojiField.getElementsByTagName("button")[0],
    "div",
    "data-scale"
  );
};

/**
 * Get all html elements which has specified attribute
 * @param {string} jField
 * @param {string} tagName
 * @param {string} attribute
 * @return {HTMLCollection}
 */
const getAllElementHasAttribute = (jField, tagName, attribute) => {
  const matchingElements = [];
  const allElements = jField.getElementsByTagName(tagName);
  for (let element of allElements) {
    if (element.getAttribute(attribute) !== null) {
      matchingElements.push(element);
    }
  }
  return matchingElements;
};

/**
 * Fill slider
 * @param {HTMLElement} scale
 * @param {string} dataScale
 */
const fillSlider = (scale, dataScale) => {
  scale.className = scale.className + " isVisible";
  scale.parentElement.parentElement.setAttribute(
    "style",
    "width : " + dataScale + "%"
  );
};

/**
 * Controls if answer has valid percentage value
 * @param {string} answer
 * @returns {boolean}
 */
const isValidPercentageType = answer => {
  return answer.indexOf("%") >= 0;
};
