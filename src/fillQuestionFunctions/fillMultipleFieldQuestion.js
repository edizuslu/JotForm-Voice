import { readQuestionOptions } from "../Text2Speech/speaker";
import { clickNext } from "../ClickFunctions/clickFunctions";
import {
  answer2Email,
  formatAnswerCaseRule
} from "../SpeechRecognation/filterCommand";
import { getElementByTagName } from "../Form/getFormData";
import { getAllElementsWithAttributeValue } from "./fillDropdown";

/**
 * Fill multiple field questions (ex: fullname, phone, address, mixed)
 * @param {object} question
 * @param {string} answer
 */
export const fillMultipleFieldQuestion = (question, answer) => {
  if (answer === "delete") {
    deleteField(question);
  } else if (answer === "skip") {
    skipField(question);
  } else {
    fillField(question, answer);
    navigateNextField(question);
  }
};

/**
 * Delete field
 * @param {object} question
 */
const deleteField = question => {
  const { questionFields } = question;
  for (let f of questionFields) {
    const fieldDataType = f.getAttribute("data-type");
    if (isDropDownField(fieldDataType)) {
      clearDropdown(fieldDataType);
    } else {
      clearInput(f);
    }
  }
  question.fieldNo = 0;
  focusField(questionFields, 0);
};

/**
 * Skip field
 * @param {object} question
 */
const skipField = question => {
  const { questionFields, fieldNo } = question;
  if (isLastField(fieldNo, questionFields)) {
    question.fieldNo = 0;
    clickNext();
  } else {
    question.fieldNo += 1;
    focusField(questionFields, fieldNo + 1);
  }
};

/**
 * Fill field
 * @param {object} questions
 */
const fillField = (question, answer) => {
  const { field, input, dataType } = getCurrentFieldData(question);
  if (isDropDownField(dataType)) {
    field.answer = fillDropdown(answer, dataType);
  } else if (dataType === "email") {
    answer = answer2Email(answer);
    fillInput(input, field, answer);
  } else {
    answer = formatAnswerCaseRule(answer);
    fillInput(input, field, answer);
  }
};

/**
 * Next question field
 * @param {object} questions
 */
const navigateNextField = question => {
  const { questionFields, fieldNo } = question;
  if (!isLastField(fieldNo, questionFields)) {
    question.fieldNo += 1;
    focusField(questionFields, fieldNo + 1);
  }
};

/**
 * Get current field data
 * @param {object} question
 * @returns {object}
 */
const getCurrentFieldData = question => {
  const { questionFields, fieldNo } = question;
  const field = questionFields[fieldNo];
  const input = getElementByTagName(field, "input")[0];
  const dataType = field.getAttribute("data-type");
  return { field, input, dataType };
};

/**
 * Controls if field is dropdown
 * @param {string} currentDataType
 * @returns {boolean}
 */
const isDropDownField = currentDataType => {
  return currentDataType === "country" || currentDataType === "mixed-dropdown";
};

/**
 * @param {string} answer
 * @param {string} currentDataType
 * @return {string}
 */
const fillDropdown = (answer, currentDataType) => {
  const options = getOptions(currentDataType);
  for (let option of options) {
    const optionValue = option.getAttribute("data-value").toLowerCase();
    if (answer.toLowerCase() === optionValue) {
      option.click();
      return answer;
    }
  }
};

/**
 * Clear input
 * @param {HTMLElement} field
 */
const clearInput = field => {
  const input = getElementByTagName(field, "input")[0];
  input.value = "";
  field.className = field.className.replace(" isFilled", "");
};

/**
 * Fill input
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 * @param {string} answer
 */
const fillInput = (input, jfField, answer) => {
  input.value = answer;
  jfField.className += " isFilled";
  jfField.answer = answer;
};

/**
 * Clear dropdown by clicking default option
 * @param {string} currentDataType
 */
const clearDropdown = currentDataType => {
  const options = getOptions(currentDataType);
  options[0].click();
};

/**
 * Controls if field is last
 * @param {number} fieldNo
 * @param {HTMLCollection} field
 * @returns {boolean}
 */
const isLastField = (fieldNo, field) => {
  return fieldNo === field.length - 1;
};

/**
 * Focus field
 * @param {HTMLCollection} questionFields
 * @param {number} fieldNo
 */
const focusField = (questionFields, fieldNo) => {
  const nextField = questionFields[fieldNo];
  const nextInput = nextField.querySelectorAll("input,select")[0];
  nextInput.focus();
  readQuestionOptions();
};

/**
 * Get options
 * @param {string} currentDataType
 */
const getOptions = currentDataType => {
  return getAllElementsWithAttributeValue(
    "ul",
    "data-component",
    currentDataType
  )[0].getElementsByTagName("li");
};
