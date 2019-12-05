import {
  answer2Email,
  formatAnswerCaseRule,
  answer2Date,
  answer2AmPm
} from "../SpeechRecognation/filterCommand";

import {
  readQuestionOptions,
  readQuestionHeader,
  readEndOfTheFormMessage
} from "../Text2Speech/speaker";
import { clickNext } from "../ClickFunctions/clickFunctions";

/**
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 * @param {string} answer
 * @param {string} prevValue
 */
const fillInput = (input, jfField, answer, prevValue) => {
  input.value = prevValue !== undefined ? prevValue + answer : answer;
  jfField.className += " isFilled";
  jfField.answer = input.value;
};

/**
 * @param {HTMLElement} textBoxInput
 */
const clearTextBox = textBoxInput => {
  textBoxInput.value = "";
  textBoxInput.parentElement.className = textBoxInput.parentElement.className.replace(
    " isFilled",
    ""
  );
};

/**
 * @param {HTMLElement} jfField
 * @param {string} tagName
 * @return {HTMLCollection}
 */
const getElementByTagName = (jfField, tagName) => {
  return jfField.getElementsByTagName(tagName);
};

/**
 * @param {string} tagName
 * @param {string} attribute
 * @param {string} attributeValue
 * @return {HTMLCollection}
 */
const getAllElementsWithAttributeValue = (
  tagName,
  attribute,
  attributeValue
) => {
  const matchingElements = [];
  const allElements = document.getElementsByTagName(tagName);
  for (let i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute(attribute) === attributeValue) {
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
};

/**
 * @param {string} jField
 * @param {string} tagName
 * @param {string} attribute
 * @return {HTMLCollection}
 */
const getAllElementHasAttribute = (jField, tagName, attribute) => {
  const matchingElements = [];
  const allElements = jField.getElementsByTagName(tagName);
  for (let i = 0, n = allElements.length; i < n; i++) {
    if (allElements[i].getAttribute(attribute) !== null) {
      matchingElements.push(allElements[i]);
    }
  }
  return matchingElements;
};

/**
 * @param {HTMLElement} textBoxInput
 * @param {string} answer
 * @param {string} prevValue
 * @return {string}
 */
const fillTextBox = (textBoxInput, answer, prevValue) => {
  const firstLetter = answer.substring(0, 1).toUpperCase();
  textBoxInput.value =
    prevValue !== ""
      ? prevValue + firstLetter + answer.substring(1) + ". "
      : firstLetter + answer.substring(1) + ". ";
  textBoxInput.parentElement.className += " isFilled";
  return textBoxInput.value;
};

/**
 * @param {string} answer
 * @param {string} currentDataType
 * @return {string}
 */
const fillDropdown = (answer, currentDataType) => {
  const options = getAllElementsWithAttributeValue(
    "ul",
    "data-component",
    currentDataType
  )[0].getElementsByTagName("li");
  for (let option of options) {
    if (
      answer.toLowerCase() === option.getAttribute("data-value").toLowerCase()
    ) {
      option.click();
      return option.getAttribute("data-value");
    }
  }
};

/**
 * @param {HTMLElement} inputArea
 * @param {string} answer
 */
const fillTextArea = (inputArea, answer) => {
  const prevValue = inputArea.innerHTML;
  const firstLetter = answer.substring(0, 1).toUpperCase();
  inputArea.innerHTML =
    prevValue !== ""
      ? prevValue + firstLetter + answer.substring(1) + ". "
      : firstLetter + answer.substring(1) + ". ";
};

/**
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 */
const clearInput = (input, jfField) => {
  input.value = "";
  jfField.className = jfField.className.replace(" isFilled", "");
};

/**
 * @param {string} currentDataType
 */
const clearDropdown = currentDataType => {
  const options = getAllElementsWithAttributeValue(
    "ul",
    "data-component",
    currentDataType
  )[0].getElementsByTagName("li");
  options[0].click();
};

/**
 * @param {number} fieldNo
 * @param {HTMLCollection} field
 * @returns {boolean}
 */
const isLastField = (fieldNo, field) => {
  return fieldNo === field.length - 1;
};

/**
 * @param {HTMLCollection} fields
 * @param {number} fieldNo
 */
const focusField = (fields, fieldNo) => {
  nextField = fields[fieldNo];
  nextInput = nextField.querySelectorAll("input,select")[0];
  nextInput.focus();
  readQuestionOptions();
};

/**
 * @param {HTMLElement} emojiField
 * @param {HTMLCollection} fieldNo
 */
const getScales = emojiField => {
  return getAllElementHasAttribute(
    emojiField.getElementsByTagName("button")[0],
    "div",
    "data-scale"
  );
};

/**
 * @param {HTMLElement} scale
 * @param {string} dataScale
 */
const fillScale = (scale, dataScale) => {
  scale.className = scale.className + " isVisible";
  scale.parentElement.parentElement.setAttribute(
    "style",
    "width : " + dataScale + "%"
  );
};

/**
 * @param {HTMLElement} field
 */
const getDropdownOptions = field => {
  const dropDownName = field.name;
  const dropDownOptions = getAllElementsWithAttributeValue(
    "ul",
    "name",
    dropDownName
  )[0].getElementsByTagName("li");
  return dropDownOptions;
};

/**
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
 * @param {string} answer
 * @returns {JSONObject}
 */
const getHourMinuteAmPmValues = answer => {
  const splittedAnswer = answer.split(" ").filter(ans => ans.includes(":"));
  const hourMinute = splittedAnswer[0];
  const hourMinuteArr = hourMinute.split(":");
  const hourValue = hourMinuteArr[0];
  const minuteValue = hourMinuteArr[1];
  const pmamValue = answer2AmPm(answer);
  return { hourValue, minuteValue, pmamValue };
};

/**
 * @param {string} answer
 * @param {HTMLElement} currentField
 * @param {HTMLElement} currentInput
 */
const fillField = (answer, currentField, currentInput) => {
  currentDataType = currentField.getAttribute("data-type");
  if (currentDataType === "country" || currentDataType === "mixed-dropdown") {
    currentField.answer = fillDropdown(answer, currentDataType);
  } else if (currentDataType === "email") {
    answer = answer2Email(answer);
    fillInput(currentInput, currentField, answer, "");
  } else {
    answer = formatAnswerCaseRule(answer);
    fillInput(currentInput, currentField, answer, "");
  }
};

/**
 * @param {string} answer
 */
export const fillQuestion = answer => {
  const currentQuestion = window.currentQuestion;
  const questions = window.questions;
  const { questionFields, dataType } = questions[currentQuestion];
  let field = questionFields;
  const inputType = dataType;
  if (inputType === "control_rating") {
    field = field[0];
    const ratingOptions = getElementByTagName(field, "li");
    for (let option of ratingOptions) {
      if (option.getAttribute("data-value") === answer) {
        questions[currentQuestion].answer = answer;
        getElementByTagName(option, "input")[0].click();
        window.currentQuestion += 1;
        readQuestionHeader();
        break;
      }
    }
  } else if (inputType === "control_radio") {
    const radioFields = field;
    for (let field of radioFields) {
      const radioOption = getElementByTagName(field, "input")[0];
      const optionValue = radioOption.defaultValue;
      if (answer === optionValue.toLowerCase()) {
        questions[currentQuestion].answer = optionValue;
        radioOption.click();
        if (window.currentQuestion + 1 >= window.questions.length) {
        } else {
          window.currentQuestion += 1;
          readQuestionHeader();
          break;
        }
      }
    }
  } else if (inputType === "control_textarea") {
    const textField = field[0];
    let inputArea = textField.getElementsByClassName("jfTextarea-editor")[0];
    inputArea =
      inputArea === undefined
        ? getElementByTagName(textField, "textarea")[0]
        : inputArea;
    if (answer === "delete") {
      inputArea.innerHTML = "";
    } else {
      fillTextArea(inputArea, answer);
      questions[currentQuestion].answer = inputArea.innerHTML;
    }
  } else if (inputType === "control_email") {
    const emailField = field[0];
    const emailInput = getElementByTagName(emailField, "input")[0];
    const prevValue = emailInput.value;
    if (answer === "delete") {
      clearInput(emailInput, emailField);
    } else {
      answer = answer2Email(answer, prevValue);
      fillInput(emailInput, emailField, answer, prevValue);
      questions[currentQuestion].answer = emailInput.value;
    }
  } else if (
    inputType === "control_fullname" ||
    inputType === "control_phone" ||
    inputType === "control_address" ||
    inputType === "control_mixed"
  ) {
    const fields = field;
    const { fieldNo } = questions[currentQuestion];
    console.log("questions");
    console.log(questions);
    console.log(fieldNo);
    const currentField = fields[fieldNo];
    const currentInput = getElementByTagName(currentField, "input")[0];
    if (answer === "delete") {
      for (let f of fields) {
        const fieldDataType = f.getAttribute("data-type");
        if (fieldDataType === "mixed-dropdown" || fieldDataType === "country") {
          clearDropdown(fieldDataType);
        } else {
          const fieldInput = getElementByTagName(f, "input")[0];
          clearInput(fieldInput, f);
        }
      }
      questions[currentQuestion].fieldNo = 0;
      focusField(fields, 0);
    } else if (answer === "skip") {
      if (isLastField(fieldNo, field)) {
        questions[currentQuestion].fieldNo = 0;
        clickNext();
      } else {
        questions[currentQuestion].fieldNo += 1;
        focusField(fields, fieldNo + 1);
      }
    } else {
      fillField(answer, currentField, currentInput);
      if (!isLastField(fieldNo, field)) {
        questions[currentQuestion].fieldNo += 1;
        focusField(fields, fieldNo + 1);
      }
    }
  } else if (inputType === "control_textbox") {
    const textBoxField = field[0];
    const textBoxInput = getElementByTagName(textBoxField, "input")[0];
    if (answer === "delete") {
      clearTextBox(textBoxInput);
    } else {
      const prevValue = textBoxInput.value;
      questions[currentQuestion].answer = fillTextBox(
        textBoxInput,
        answer,
        prevValue
      );
    }
  } else if (inputType === "control_dropdown") {
    const dropdownField = field[0];
    const dropDownInput = getElementByTagName(dropdownField, "select")[0];
    const options = getDropdownOptions(dropDownInput);
    answer = answer === "delete" ? "" : answer;
    for (let option of options) {
      if (answer === option.innerHTML.toLowerCase()) {
        questions[currentQuestion].answer = option.innerHTML;
        option.click();
      }
    }
  } else if (inputType === "control_yesno") {
    const yesnoField = field[0];
    const yesNoOptions = getElementByTagName(yesnoField, "input");
    for (let option of yesNoOptions) {
      const optionValue = option.value;
      if (answer === optionValue.toLowerCase()) {
        questions[currentQuestion].answer = optionValue;
        option.click();
        window.currentQuestion += 1;
        readQuestionHeader(window.currentQuestion);
        break;
      }
    }
  } else if (inputType === "control_imagechoice") {
    const radioFields = field;
    for (let field of radioFields) {
      const radioOption = getElementByTagName(field, "input")[0];
      const radioValue = radioOption.value;
      const indexOfImage = radioValue.indexOf("|");
      const optionValue =
        indexOfImage > 0 ? radioValue.substring(0, indexOfImage) : radioValue;
      if (answer === optionValue.toLowerCase()) {
        questions[currentQuestion].answer = optionValue;
        radioOption.click();
        window.currentQuestion += 1;
        readQuestionHeader(window.currentQuestion);
        break;
      }
    }
  } else if (inputType === "control_checkbox") {
    const options = [];
    for (let f of field) {
      options.push(f.getElementsByTagName("input")[0]);
    }
    for (let option of options) {
      if (answer === option.value.toLowerCase()) {
        option.click();
        questions[currentQuestion].answer = option.value;
        break;
      }
    }
  } else if (inputType === "control_number") {
    const numberField = field[0];
    const numberInput = getElementByTagName(numberField, "input")[0];
    try {
      answer = parseInt(answer, 10);
      numberInput.value = answer;
      questions[currentQuestion].answer = answer;
    } catch (err) {
      console.log("Answer is not valid for the question.");
    }
  } else if (inputType === "control_datetime") {
    const datetimeField = field[0];
    const dateAnswer = answer2Date(answer);
    datetimeField.getElementsByTagName("input")[0].value = dateAnswer;
    questions[currentQuestion].answer = dateAnswer;
  } else if (inputType === "control_matrix") {
    const { fieldNo, matrixRows } = questions[currentQuestion];
    const rows = matrixRows;
    if (matrixRows === "emoji slider") {
      const emojiField = field[0];
      const validPercentage = answer.indexOf("%") >= 0;
      answer = answer.replace("%", "");
      const scales = getScales(emojiField);
      for (let scale of scales) {
        const dataScale = scale.getAttribute("data-scale").replace(".00", "");
        if (dataScale === answer) {
          fillScale(scale, dataScale);
          questions[currentQuestion].answer = dataScale + "%";
        } else if (validPercentage) {
          scale.className = scale.className.replace(" isVisible", "");
        }
      }
    } else {
      if (answer === "skip") {
        if (fieldNo === rows.length - 1) {
          questions[currentQuestion].fieldNo = 0;
          questions[currentQuestion].matrixRows = undefined;
          clickNext();
        } else {
          questions[currentQuestion].fieldNo += 1;
          readQuestionOptions();
        }
      } else {
        const answerInputs = rows[fieldNo].getElementsByTagName("input");
        for (let input of answerInputs) {
          if (input.value.toLowerCase() === answer) {
            input.click();
            questions[currentQuestion].answer = input.value;
            if (fieldNo !== rows.length - 1) {
              questions[currentQuestion].fieldNo += 1;
              readQuestionOptions();
            }
            break;
          }
        }
      }
    }
  } else if (inputType === "control_time") {
    const { questionFields } = questions[currentQuestion];
    const hour = questionFields[0];
    const hourOptions = hour.getElementsByTagName("option");
    const hourSpan = hour.getElementsByTagName("span")[0];

    const minute = questionFields[1];
    const minuteOptions = minute.getElementsByTagName("option");
    const minuteSpan = minute.getElementsByTagName("span")[0];

    const pmOrAm = questionFields[2];
    const pmOrAmOptions = pmOrAm.getElementsByTagName("option");
    const pmOrAmSpan = pmOrAm.getElementsByTagName("span")[0];

    if (answer === "delete") {
      clearTimeInput(hourOptions, hourSpan);
      clearTimeInput(minuteOptions, minuteSpan);
      clearTimeInput(pmOrAmOptions, pmOrAmSpan);
    } else {
      const { hourValue, minuteValue, pmamValue } = getHourMinuteAmPmValues(
        answer
      );
      fillTimeInput(hourOptions, hourValue, hourSpan);
      fillTimeInput(minuteOptions, minuteValue, minuteSpan);
      fillTimeInput(pmOrAmOptions, pmamValue, pmOrAmSpan);
      questions[currentQuestion].answer =
        hourValue + " " + minuteValue + " " + pmamValue;
    }
  }
  if (
    currentQuestion === window.questionCount - 1 &&
    questions[currentQuestion].fieldNo ===
      questions[currentQuestion].questionFields.length - 1
  ) {
    readEndOfTheFormMessage();
  }
};
