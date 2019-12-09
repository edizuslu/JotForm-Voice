/**
 * @return {object}
 */
const getRecognationObject = () => {
  var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
  const grammar = "#JSGF V1.0;";
  const recognition = new SpeechRecognition();
  const speechRecognitionList = new SpeechGrammarList();
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;
  return recognition;
};

/**
 * @param {object} question
 * @param {function} startRecord
 * @param {function} stopRecord
 */
const readDropdownOptions = (question, startRecord, stopRecord) => {
  stopRecord();
  const { questionFields } = question;
  const dropdownField = questionFields[0];
  const optionsText = getDropdownOptionsText(dropdownField);
  openDropdownNReadOptions(optionsText, dropdownField, startRecord);
};

/**
 * @param {HTMLElement} dropdownField
 * @returns {string}
 */
const getDropdownOptionsText = dropdownField => {
  let optionsText = "Possible options are: ";
  const options = dropdownField.getElementsByTagName("option");
  for (let option of options) {
    optionsText += option.innerHTML + " , ";
  }
  return optionsText;
};

/**
 * @param {string} optionsText
 * @param {HTMLElement} dropdownField
 * @param {function} startRecord
 */
const openDropdownNReadOptions = (optionsText, dropdownField, startRecord) => {
  setTimeout(function() {
    openDropdownMenu(dropdownField);
    const msg = new SpeechSynthesisUtterance(optionsText);
    window.speechSynthesis.speak(msg);
    msg.onend = function() {
      startRecord();
    };
  }, 1000);
};

/**
 * @param {HTMLElement} dropdownField
 */
const openDropdownMenu = dropdownField => {
  const dropDownToggle = getDropdownToggle(dropdownField);
  dropDownToggle.click();
};

/**
 * @param {HTMLElement} dropdownField
 * @returns {HTMLElement}
 */
const getDropdownToggle = dropdownField => {
  const parentField = dropdownField.parentElement;
  return parentField.getElementsByClassName("jfDropdown-toggle")[0];
};

/**
 * Read matrix question fields and answers options
 * @param {object} question
 */
const readMatrixOptions = question => {
  if (!answerOptionsReaded(question)) {
    readAnswerOptions(question);
  } else {
    readSubQuestionFields(question);
  }
};

/**
 * Controls if answer options are readed
 * @param {object} question
 * @returns {boolean}
 */
const answerOptionsReaded = question => {
  return question.matrixRows !== undefined;
};

/**
 * Read answer options
 * @param {object} question
 */
const readAnswerOptions = question => {
  const { questionFields } = question;
  const matrixField = questionFields[0];
  const questionDataType = matrixField.getAttribute("data-type");
  const answerOptions = getAnswerOptions(matrixField, questionDataType);
  const optionsText = getOptionsText(
    questionDataType,
    answerOptions,
    matrixField
  );
  speaknReadQuestionOption(optionsText);
};

/**
 * Read matrix sub question fields and answers options
 * @param {object} question
 */
const readSubQuestionFields = question => {
  const { questionFields } = question;
  const matrixFields = questionFields[0];
  const questionDataType = matrixFields.getAttribute("data-type");
  if (questionDataType === "Radio Button") {
    const { fieldNo, matrixRows } = question;
    const subQuestion = getSubQuestion(fieldNo, matrixRows);
    speakAndStartRecord(subQuestion);
  } else {
    // Emoji Slider has no sub question fields.
    startRecord();
  }
};

/**
 * Get question text
 * @param {string} questionDataType
 * @param {HTMLCollection} answerOptions
 * @param {HTMLElement} matrixField
 * @returns {string}
 */
const getOptionsText = (questionDataType, answerOptions, matrixField) => {
  let optionsText = "Possible answers are : ";
  if (questionDataType === "Radio Button") {
    setMatrixRows(matrixField, "radio");
    optionsText += options2Text(answerOptions);
  } else {
    setMatrixRows(matrixField, "emoji");
    optionsText += getScaleOptionsText(answerOptions);
  }
  return optionsText;
};

/**
 * Get answer options
 * @param {HTMLElement} matrixField
 * @returns {HTMLCollection}
 */
const getAnswerOptions = (matrixField, questionDataType) => {
  if (questionDataType === "Radio Button") {
    return matrixField.getElementsByClassName("jfMatrixHeader-item");
  } else {
    const answerOptions = matrixField.getElementsByClassName(
      "jfMatrixScale-sep"
    )[0];
    return answerOptions.getElementsByClassName("scaleSep");
  }
};

/**
 * Set matrix rows
 * @param {HTMLElement} matrixField
 * @param {string} type
 */
const setMatrixRows = (matrixField, type) => {
  switch (type) {
    case "radio":
      setRowsAttribute(getMatrixRowsOfField(matrixField));
      break;
    default:
      // Emoji Slider
      setRowsAttribute("emoji slider");
  }
};

/**
 * @param {HTMLElement} matrixField
 * @returns {HTMLCollection}
 */
const getMatrixRowsOfField = matrixField => {
  return matrixField.getElementsByClassName("jfMatrixTable-row");
};

/**
 * @param {HTMLElement,string} rowValue
 */
const setRowsAttribute = rowValue => {
  window.questions[currentQuestion].matrixRows = rowValue;
};

/**
 * @param {string} text
 */
const speaknReadQuestionOption = text => {
  setTimeout(function() {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
    msg.onend = function() {
      readQuestionOptions();
    };
  }, 1000);
};

/**
 * @returns {boolean}
 */
const getSubQuestion = (currentRow, rows) => {
  return rows[currentRow]
    .getElementsByClassName("jfMatrixTable-cell")[0]
    .getElementsByTagName("div")[0].innerHTML;
};

/**
 * @param {HTMLElement} scale
 * @returns {string}
 */
const getScaleValue = scale => {
  const scaleValue = scale.getAttribute("data-scale");
  return scaleValue.replace(".00", "") + "%";
};

/**
 * @param {HTMLCollection} answerOptions
 * @returns {string}
 */
const getScaleOptionsText = scaleOptions => {
  let scaleOptionsText = "";
  for (let scaleOption of scaleOptions) {
    scaleOptionsText += getScaleValue(scaleOption) + " , ";
  }
  return scaleOptionsText;
};

/**
 * Options text
 * @param {array} option
 * @returns {string}
 */
const getOptionText = option => {
  return option.getElementsByTagName("div")[0].innerHTML;
};

/**
 * Options text
 * @param {array} options
 * @returns {string}
 */
const options2Text = options => {
  let optionsText = "";
  for (let option of options) {
    optionsText += getOptionText(option) + " , ";
  }
  return optionsText.trim();
};

/**
 * @param {object} question
 */
const readMultipleFieldOptions = question => {
  const { questionFields, fieldNo } = question;
  const field = questionFields[fieldNo];
  const subQuestion = getSubQuestion$1(field);
  speakAndStartRecord(subQuestion);
};

const getSubQuestion$1 = field => {
  let options = "";
  if (field.getAttribute("data-type") === "mixed-dropdown") {
    options = "Possible options are " + getDropdownOptions(field);
    openDropdownMenu$1(field);
  }
  return field.getElementsByTagName("label")[0].innerHTML + options;
};

/**
 * @param {HTMLElement} field
 * @returns {string}
 */
const getDropdownOptions = field => {
  const dropdownOptions = field.getElementsByTagName("option");
  let optionsText = "";
  for (let option of dropdownOptions) {
    optionsText += option.getAttribute("value") + " , ";
  }
  return optionsText;
};

/**
 * @param {HTMLElement} dropdownField
 */
const openDropdownMenu$1 = dropdownField => {
  const dropDownToggle = getDropdownToggle$1(dropdownField);
  dropDownToggle.click();
};

/**
 * @param {HTMLElement} dropdownField
 * @returns {HTMLElement}
 */
const getDropdownToggle$1 = dropdownField => {
  const parentField = dropdownField.parentElement;
  return parentField.getElementsByClassName("jfDropdown-toggle")[0];
};

/**
 * Read multiple optional fields
 * @param {object} question
 */
const readMultipleOptionalFields = question => {
  const { questionFields } = question;
  const options = getOptions(questionFields);
  const optionsText = getOptionsText$1(options);
  speakAndStartRecord(optionsText);
};

/**
 * Get options
 * @param {HTMLElement} questionFields
 * @returns {array}
 */
const getOptions = questionFields => {
  const options = [];
  for (let f of questionFields) {
    options.push(f.getElementsByTagName("input")[0]);
  }
  return options;
};

/**
 * Get options text
 * @param {array} options
 * @returns {string}
 */
const getOptionsText$1 = options => {
  let optionsText = "";
  for (let option of options) {
    const tempValue = option.value.toLowerCase();
    const indexOfImage = tempValue.indexOf("|");
    const optionValue =
      indexOfImage > 0 ? tempValue.substring(0, indexOfImage) : tempValue;
    optionsText += optionValue + " , ";
  }
  return "Possible options are : " + optionsText;
};

/**
 * @param {Object} event
 * @return {string}
 */
const getCommand = event => {
  const lastCommand = getLastCommand(event);
  const command = filterCommand(lastCommand);
  console.log("Command : ");
  console.log(command);
  return command;
};

/**
 * @param {Object} event
 * @returns {string}
 */
const getLastCommand = event => {
  const last = event.results.length - 1;
  const lastCommand = event.results[last][0].transcript;
  return lastCommand;
};

/**
 * @param {string} command
 * @returns {string}
 */
const filterCommand = command => {
  command = command.trim();
  command = command.toLowerCase();
  command = wordToNumber(command);
  command = areQuestionsActive(command);
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const wordToNumber = command => {
  command = command2WordMap(command, "number");
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const command2WordMap = (command, mapType) => {
  const map = wordMap[mapType];
  Object.keys(map).forEach(key => {
    if (command.includes(key)) {
      command = command.replace(key, map[key]);
    }
  });
  return command;
};

/**
 * Changes command with start if questions are not active and command is next.
 * @param {string} command
 * @returns {string}
 */
const areQuestionsActive = command => {
  return command === "next" && window.questionsActive ? "start" : command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const answer2Email = command => {
  command = wordToEmail(command);
  command = removeSpaces(command);
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const wordToEmail = command => {
  command = command2WordMap(command, "punctuation");
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const removeSpaces = command => {
  return command.replace(/\s/g, "");
};

/**
 * @param {string} command
 * @returns {string}
 */
const firstCharToUpperCase = command => {
  return command.charAt(0).toUpperCase() + command.substring(1) + " ";
};

/**
 * @param {string} command
 * @returns {string}
 */
const formatAnswerCaseRule = command => {
  const words = command.split(" ");
  command = "";
  for (let word of words) {
    command += firstCharToUpperCase(word);
  }
  command = command.trim();
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const answer2Date = answer => {
  const month = getMonth(answer);
  const { day, year } = getDaynYear(answer);
  return year + "-" + month + "-" + day;
};

/**
 * @param {string} command
 * @returns {string}
 */
const getMonth = command => {
  const map = wordMap.month;
  let monthValue = "";
  Object.keys(map).forEach(key => {
    if (command.includes(key)) {
      monthValue = map[key];
    }
  });
  return monthValue;
};

/**
 * @param {string} command
 * @returns {object}
 */
const getDaynYear = answer => {
  const date = [];
  const r = /\d+/g;
  let m;
  while ((m = r.exec(answer)) != null) {
    date.push(m[0]);
  }
  const day = toZeroFormatDay(date[0]);
  const year = date[1];
  return { day, year };
};

/**
 * @param {string} command
 * @returns {string}
 */
const toZeroFormatDay = day => {
  day = day.length === 1 ? "0" + day : day;
  return day;
};

/**
 * @param {string} command
 * @returns {string}
 */
function answer2AmPm(answer) {
  return answer.includes("a.m.") ? "AM" : "PM";
}

/**
 * Set questions array to window
 */
const getQuestions = () => {
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
const getElementByTagName = (jfField, tagName) => {
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
const getHeaderMessage = () => {
  const headerText = getHeaderText();
  const subHeader = getSubHeaderText();
  return headerText + " , " + subHeader;
};

/**
 * Controls is last header
 * @param {HTMLElement} {button}
 * @returns {boolean}
 */
const isLastHeader = button => {
  return button.getAttribute("class").includes("forNext-heading");
};

/**
 * Controls if is last question or not
 * @returns {boolean}
 */
const isLastQuestion = button => {
  return window.currentQuestion + 1 >= window.questions.length;
};

/**
 * Checks is end of the form or not
 * @param {object} {question}
 * @returns {boolean}
 */
const isEndOfTheForm = question => {
  return (
    window.currentQuestion === window.questionCount - 1 &&
    question.fieldNo === question.questionFields.length - 1
  );
};

/**
 * Fill dropdown
 * @param {object} question
 */
const fillDropdown = (question, answer) => {
  answer = answer === "delete" ? "" : answer;
  const options = getDropdownOptions$1(question);
  for (let option of options) {
    const optionValue = option.innerHTML.toLowerCase();
    if (answer === optionValue) {
      question.answer = answer;
      option.click();
    }
  }
};

/**
 * Get dropdown options
 * @param {object} question
 * @returns {HTMLCollection}
 */
const getDropdownOptions$1 = question => {
  const { questionFields } = question;
  const field = questionFields[0];
  const input = getElementByTagName(field, "select")[0];
  const dropDownName = input.name;
  const dropDownOptions = getAllElementsWithAttributeValue(
    "ul",
    "name",
    dropDownName
  )[0].getElementsByTagName("li");
  return dropDownOptions;
};

/**
 * Get elements which equals specified attribute value
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
  for (let element of allElements) {
    const elementValue = element.getAttribute(attribute);
    if (elementValue === attributeValue) {
      matchingElements.push(element);
    }
  }
  return matchingElements;
};

/**
 * Fill multiple field questions (ex: fullname, phone, address, mixed)
 * @param {object} question
 * @param {string} answer
 */
const fillMultipleFieldQuestion = (question, answer) => {
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
    field.answer = fillDropdown$1(answer, dataType);
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
const fillDropdown$1 = (answer, currentDataType) => {
  const options = getOptions$1(currentDataType);
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
  const options = getOptions$1(currentDataType);
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
const getOptions$1 = currentDataType => {
  return getAllElementsWithAttributeValue(
    "ul",
    "data-component",
    currentDataType
  )[0].getElementsByTagName("li");
};

/**
 * Fill radio
 * @param {object} question
 * @param {string} answer
 */
const fillRadio = (question, answer) => {
  const { questionFields } = question;
  const radioFields = questionFields;
  for (let field of radioFields) {
    const radioOption = getElementByTagName(field, "input")[0];
    const optionValue = radioOption.defaultValue.toLowerCase();
    if (answer === optionValue) {
      question.answer = answer;
      radioOption.click();
      if (isLastQuestion()) {
        readEndOfTheFormMessage();
      } else {
        window.currentQuestion += 1;
        readQuestionHeader();
      }
    }
  }
};

/**
 * Fill checkbox
 * @param {object} question
 */
const fillCheckBox = (question, answer) => {
  const options = getOptions$2(question);
  for (let option of options) {
    const optionValue = option.value.toLowerCase();
    if (answer === optionValue) {
      option.click();
      question.answer = answer;
    }
  }
};

/**
 * Get checkbox options
 * @param {object} question
 * @returns {HTMLElement}
 */
const getOptions$2 = question => {
  const { questionFields } = question;
  const options = [];
  for (let field of questionFields) {
    const fieldInput = getFieldInput(field);
    options.push(fieldInput);
  }
  return options;
};

/**
 * Get field input
 * @param {HTMLElement} field
 * @returns {HTMLElement}
 */
const getFieldInput = field => {
  return field.getElementsByTagName("input")[0];
};

/**
 * Fill image choice
 * @param {object} question
 * @param {string} answer
 */
const fillImageChoice = (question, answer) => {
  const { questionFields } = question;
  const radioFields = questionFields;
  for (let field of radioFields) {
    const radioOption = getElementByTagName(field, "input")[0];
    const optionValue = getOptionValue(radioOption);
    if (answer === optionValue) {
      selectOption(radioOption, answer, question);
    }
  }
};

/**
 * Get option value
 * @param {HTMLElement} radioOption
 * @returns {string}
 */
const getOptionValue = radioOption => {
  const radioValue = radioOption.value;
  const indexOfImage = radioValue.indexOf("|");
  return indexOfImage > 0
    ? radioValue.substring(0, indexOfImage).toLowerCase()
    : radioValue.toLowerCase();
};

/**
 * Select option
 * @param {HTMLElement} radioOption
 * @param {string} answer
 * @param {object} question
 */
const selectOption = (radioOption, answer, question) => {
  question.answer = answer;
  radioOption.click();
  window.currentQuestion += 1;
  readQuestionHeader();
};

/**
 * Fill matrix question
 * @param {object} question
 * @param {string} answer
 */
const fillMatrixQuestion = (question, answer) => {
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
    const scaleValue = getScaleValue$1(scale);
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
    skipField$1(question);
  } else {
    fillField$1(question, answer);
  }
};

/**
 * Fill field
 * @param {object} question
 * @param {string} answer
 */
const fillField$1 = (question, answer) => {
  const { matrixRows, fieldNo } = question;
  const answerInputs = matrixRows[fieldNo].getElementsByTagName("input");
  for (let input of answerInputs) {
    const inputValue = input.value.toLowerCase();
    if (inputValue === answer) {
      input.click();
      question.answer = answer;
      if (!isLastField$1(fieldNo, matrixRows)) {
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
const skipField$1 = question => {
  const { fieldNo, matrixRows } = question;
  if (isLastField$1(fieldNo, matrixRows)) {
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
const isLastField$1 = (fieldNo, matrixRows) => {
  return fieldNo === matrixRows.length - 1;
};

/**
 * Get slider field value
 * @param {HTMLElement} scale
 * @returns {string}
 */
const getScaleValue$1 = scale => {
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

/**
 * Fill rating
 * @param {object} question
 * @param {string} answer
 */
const fillRating = (question, answer) => {
  const { questionFields } = question;
  const field = questionFields[0];
  const ratingOptions = getElementByTagName(field, "li");
  for (let option of ratingOptions) {
    const optionValue = option.getAttribute("data-value");
    if (optionValue === answer) {
      question.answer = answer;
      const ratingButton = getRatingOptionButton(option);
      ratingButton.click();
      if (isLastQuestion()) {
        readEndOfTheFormMessage();
      } else {
        window.currentQuestion += 1;
        readQuestionHeader();
      }
    }
  }
};

/**
 * Get rating option button
 * @param {HTMLElement} option
 * @returns {HTMLElement}
 */
const getRatingOptionButton = option => {
  return getElementByTagName(option, "input")[0];
};

/**
 * Fill text area
 * @param {object} question
 * @param {string} answer
 */
const fillTextarea = (question, answer) => {
  const inputArea = getInputArea(question);
  answer = answer === "delete" ? "" : answer;
  inputArea.innerHTML = answer;
};

/**
 * Get input area
 * @param {object} question
 * @returns {HTMLElement}
 */
const getInputArea = question => {
  const { questionFields } = question;
  const textField = questionFields[0];
  const inputArea = textField.getElementsByClassName("jfTextarea-editor")[0];
  return inputArea === undefined
    ? getElementByTagName(textField, "textarea")[0]
    : inputArea;
};

/**
 * Fill email
 * @param {object} question
 * @param {string} answer
 */
const fillEmail = (question, answer) => {
  const { questionFields } = question;
  const emailElement = questionFields[0];
  const emailInput = getElementByTagName(emailElement, "input")[0];
  if (answer === "delete") {
    clearInput$1(emailInput, emailElement);
  } else {
    const prevValue = emailInput.value;
    answer = answer2Email(answer);
    fillInput$1(emailInput, emailElement, answer, prevValue);
    question.answer = emailInput.value;
  }
};

/**
 * Clear email input
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 */
const clearInput$1 = (input, jfField) => {
  input.value = "";
  jfField.className = jfField.className.replace(" isFilled", "");
};

/**
 * Fill email input
 * @param {HTMLElement} input
 * @param {HTMLElement} jfField
 * @param {string} answer
 * @param {string} prevValue
 */
const fillInput$1 = (input, jfField, answer, prevValue) => {
  input.value = prevValue !== undefined ? prevValue + answer : answer;
  jfField.className += " isFilled";
  jfField.answer = answer;
};

/**
 * Fill textbox
 * @param {object} question
 */
const fillTextbox = (question, answer) => {
  const textBoxInput = getTextboxInput(question);
  if (answer === "delete") {
    clearTextBox(textBoxInput);
  } else {
    const prevValue = textBoxInput.value;
    question.answer = fillText(textBoxInput, answer, prevValue);
  }
};

/**
 * Get textbox input
 * @param {object} question
 * @returns {HTMLElement}
 */
const getTextboxInput = question => {
  const { questionFields } = question;
  const textBoxField = questionFields[0];
  return getElementByTagName(textBoxField, "input")[0];
};

/**
 * Clear textbox.
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
 * @param {HTMLElement} textBoxInput
 * @param {string} answer
 * @param {string} prevValue
 * @returns {string}
 */
const fillText = (textBoxInput, answer, prevValue) => {
  answer = formatAnswerCaseRule$1(answer, prevValue);
  textBoxInput.value = answer;
  textBoxInput.parentElement.className += " isFilled";
  return answer;
};

/**
 * Format answer according to case rule
 * @param {string} answer
 * @param {string} prevValue
 * @returns {string}
 */
const formatAnswerCaseRule$1 = (answer, prevValue) => {
  const firstLetter = answer.substring(0, 1).toUpperCase();
  return prevValue !== ""
    ? prevValue + firstLetter + answer.substring(1) + ". "
    : firstLetter + answer.substring(1) + ". ";
};

/**
 * Read multiple optional fields
 * @param {object} question
 */
const fillYesno = (question, answer) => {
  const yesNoOptions = getYesnoOptions(question);
  for (let option of yesNoOptions) {
    const optionValue = option.value.toLowerCase();
    if (answer === optionValue) {
      question.answer = answer;
      option.click();
      window.currentQuestion += 1;
      readQuestionHeader();
    }
  }
};

/**
 * Get yes no question options
 * @param {object} question
 * @returns {HTMLAllCollection}
 */
const getYesnoOptions = question => {
  const { questionFields } = question;
  const yesnoField = questionFields[0];
  return getElementByTagName(yesnoField, "input");
};

/**
 * Fill number
 * @param {object} question
 * @param {string} answer
 */
const fillNumber = (question, answer) => {
  const numberInput = getNumberInput(question);
  answer = parseAnswerToNumber(answer);
  numberInput.value = answer;
  question.answer = answer;
};

/**
 * Get number input area
 * @param {object} question
 * @returns {HTMLElement}
 */
const getNumberInput = question => {
  const { questionFields } = question;
  const numberField = questionFields[0];
  return getElementByTagName(numberField, "input")[0];
};

/**
 * Parse answer to number
 * @param {string} answer
 * @returns {number}
 */
const parseAnswerToNumber = answer => {
  try {
    answer = parseInt(answer, 10);
    return answer;
  } catch (err) {
    console.log("Answer is not valid for number type question.");
    return 0;
  }
};

/**
 * Fill datetime
 * @param {object} question
 * @param {object} answer
 */
const fillDatetime = (question, answer) => {
  const dateAnswer = answer2Date(answer);
  const datetimeField = getDateTimeField(question);
  datetimeField.value = dateAnswer;
  question.answer = dateAnswer;
};

/**
 * Get datetime field
 * @param {object} question
 * @returns {HTMLElement}
 */
const getDateTimeField = question => {
  const { questionFields } = question;
  const datetimeField = questionFields[0];
  return datetimeField.getElementsByTagName("input")[0];
};

/**
 * Fill time
 * @param {object} question
 * @param {string} answer
 */
const fillTimeQuestion = (question, answer) => {
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

const wordMap = {
  number: {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9"
  },
  month: {
    january: "01",
    february: "02",
    march: "03",
    april: "04",
    may: "05",
    june: "06",
    july: "07",
    august: "08",
    september: "09",
    october: "10",
    november: "11",
    december: "12"
  },
  punctuation: {
    dot: ".",
    point: ".",
    comma: ",",
    dash: "-",
    at: "@",
    colon: ":",
    semicolon: ";",
    slash: "/"
  },
  multipleFieldWidgets: [
    "control_dropdown",
    "control_matrix",
    "control_imagechoice",
    "control_checkbox",
    "control_radio",
    "control_fullname",
    "control_phone",
    "control_address",
    "control_mixed"
  ],
  formElementFunctions: {
    control_fullname: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_mixed: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_phone: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_address: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_radio: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillRadio
    },
    control_checkbox: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillCheckBox
    },
    control_imagechoice: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillImageChoice
    },
    control_dropdown: {
      readOptions: readDropdownOptions,
      fillQuestion: fillDropdown
    },
    control_matrix: {
      readOptions: readMatrixOptions,
      fillQuestion: fillMatrixQuestion
    },
    control_rating: {
      readOptions: undefined,
      fillQuestion: fillRating
    },
    control_textarea: {
      readOptions: undefined,
      fillQuestion: fillTextarea
    },
    control_email: {
      readOptions: undefined,
      fillQuestion: fillEmail
    },
    control_textbox: {
      readOptions: undefined,
      fillQuestion: fillTextbox
    },
    control_yesno: {
      readOptions: undefined,
      fillQuestion: fillYesno
    },
    control_number: {
      readOptions: undefined,
      fillQuestion: fillNumber
    },
    control_datetime: {
      readOptions: undefined,
      fillQuestion: fillDatetime
    },
    control_time: {
      readOptions: undefined,
      fillQuestion: fillTimeQuestion
    }
  },
  endFormMessage:
    "This is end of the form. If you want to check your answers,  please give 'Check Answers' command. Or you can submit,  with 'Submit' command .",
  optionalEndFormMessage:
    ". If you want to listen again, please give 'Check Answers' command. Or you can submit with 'Submit' command.' "
};

/**
 * Start record
 */
const startRecord = () => {
  window.recognition.start();
  window.speechStopped = false;
};

/**
 * Stop record
 */
const stopRecord = () => {
  recognition.stop();
  speechStopped = true;
};

/**
 * Speak and start record
 * @param {string} speakText
 */
const speakAndStartRecord = speakText => {
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
const readQuestionHeader = () => {
  const question = getCurrentQuestion();
  const { questionHeader, dataType } = question;
  if (isMultipleFieldWidget(dataType)) {
    stopRecord();
    setTimeout(function() {
      const message = new SpeechSynthesisUtterance(questionHeader);
      window.speechSynthesis.speak(message);
      message.onend = function() {
        question.fieldNo = 0;
        readQuestionOptions();
      };
    }, 1000);
  } else {
    speakAndStartRecord(questionHeader);
  }
};

/**
 * Read question options
 */
const readQuestionOptions = () => {
  const currentQuestion = getCurrentQuestion();
  const { dataType } = currentQuestion;
  const readOptionsFunction = getReadOptionsFunction(dataType);
  readOptionsFunction(currentQuestion, startRecord, stopRecord);
};

/**
 * Ger read options function
 * @param {string} dataType
 * @return {function}
 */
const getReadOptionsFunction = dataType => {
  return wordMap.formElementFunctions[dataType].readOptions;
};

/**
 * Get Current Question
 * @returns {object}
 */
const getCurrentQuestion = () => {
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
const readEndOfTheFormMessage = () => {
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
const readAllAnswers = () => {
  const { optionalEndFormMessage } = wordMap;
  const answers = getAllAnswers() + optionalEndFormMessage;
  speakAndStartRecord(answers);
};

/**
 * Read Form Header
 */
const readHeaderTexts = () => {
  const headerMessage = getHeaderMessage();
  speakAndStartRecord(headerMessage);
};

/**
 * Initialize voice form
 */
const initializeVoiceForm = () => {
  getQuestions();
  setStartButtonListener();
  setNextnPreviousButtonsListener();
};

/**
 * Set start button listener
 */
const setStartButtonListener = () => {
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
const getStartButton = () => {
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
const getActionButton = (actionType, currentQuestion) => {
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

/**
 * Click start
 */
const clickStart = () => {
  const startButton = getStartButton();
  startButton.click();
  updateQuestionsActive();
};

/**
 * Click previous
 * Action Type: 0 (Previous)
 */
const clickPrevious = () => {
  const currentQuestion = window.currentQuestion;
  const nextButton = getActionButton(0, currentQuestion);
  nextButton.click();
};

/**
 * Click next
 * Action Type: 1 (Next)
 */
const clickNext = () => {
  const currentQuestion = window.currentQuestion;
  const nextButton = getActionButton(1, currentQuestion);
  nextButton.click();
};

/**
 * Click submit
 * Action Type: 2 (Submit)
 */
const clickSubmit = () => {
  const currentQuestion = window.currentQuestion;
  const submitButton = getActionButton(2, currentQuestion);
  submitButton.click();
};

/**
 * Update questions active
 */
const updateQuestionsActive = () => {
  if (window.questionsActive) {
    window.questionsActive = false;
  } else {
    setStartButtonListener();
  }
};

/**
 * @param {string} answer
 */
const fillQuestion = answer => {
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

class Speech2Text {
  constructor() {
    this.recognition = getRecognationObject();

    /**
     * On Result
     */
    this.recognition.onresult = function(event) {
      const command = getCommand(event);
      switch (command) {
        case "start":
          clickStart();
          break;
        case "next":
          clickNext();
          break;
        case "previous":
          clickPrevious();
          break;
        case "submit":
          clickSubmit();
          break;
        case "check answers":
          readAllAnswers();
          break;
        default:
          fillQuestion(command);
      }
    };

    /**
     * On Speech End
     */
    this.recognition.onspeechend = function() {
      if (window.speechStopped === false) {
        window.speechEnd = true;
      }
    };

    /**
     * On Error
     */
    this.recognition.onerror = function(event) {
      window.noSpeechError = true;
    };

    /**
     * On End
     */
    this.recognition.onend = () => {
      if (window.noSpeechError || window.speechEnd) {
        this.recognition.start();
        window.noSpeechError = false;
        window.speechEnd = false;
      }
    };

    window.recognition = this.recognition;
  }
}

window.questionsActive = false;
window.noSpeechError = false;
window.speechEnd = false;
window.speechStopped = false;

new Speech2Text();

window.currentQuestion = 0;
initializeVoiceForm();
