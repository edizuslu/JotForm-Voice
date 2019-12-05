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

const readDropdownOptions = question => {
  stopRecord();
  const { questionFields } = question;
  const dropdownField = questionFields[0];
  let optionsText = "Possible options are: ";
  const options = dropdownField.getElementsByTagName("option");
  for (let option of options) {
    optionsText += option.innerHTML + " , ";
  }
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
 * @returns {HTMLElement}
 */
const getDropdownToggle = dropdownField => {
  const parentField = dropdownField.parentElement;
  return parentField.getElementsByClassName("jfDropdown-toggle")[0];
};

/**
 * @param {HTMLElement} dropdownField
 */
const openDropdownMenu = dropdownField => {
  const dropDownToggle = getDropdownToggle(dropdownField);
  dropDownToggle.click();
};

/**
 * @returns {boolean}
 */
const answerOptionsReaded = () => {
  return questions[currentQuestion].matrixRows === undefined;
};

/**
 * @param {number} currentRow
 * @param {HTMLCollection} rows
 */
const readMatrixRow = (currentRow, rows) => {
  setTimeout(function() {
    const subQuestion = rows[currentRow]
      .getElementsByClassName("jfMatrixTable-cell")[0]
      .getElementsByTagName("div")[0].innerHTML;
    const msg = new SpeechSynthesisUtterance(subQuestion);
    window.speechSynthesis.speak(msg);
    msg.onend = function(event) {
      startRecord();
    };
  }, 1000);
};

const readMatrixOptions = question => {
  stopRecord();
  const questions = window.questions;
  const { questionFields } = question;
  const matrixFields = questionFields[0];
  if (answerOptionsReaded()) {
    readAnswerOptions(matrixFields);
  } else {
    const questionDataType = matrixFields.getAttribute("data-type");
    if (questionDataType === "Radio Button") {
      const currentRow = questions[currentQuestion].fieldNo;
      const rows = questions[currentQuestion].matrixRows;
      readMatrixRow(currentRow, rows);
    } else if (questionDataType === "Emoji Slider") {
      startRecord();
    }
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
 * @param {HTMLElement} matrixField
 * @param {string} type
 */
const setMatrixRows = (matrixField, type) => {
  switch (type) {
    case "radio":
      setRowsAttribute(getMatrixRowsOfField(matrixField));
      break;
    default:
      setRowsAttribute("emoji slider");
  }
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
const speakText = text => {
  setTimeout(function() {
    const msg = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(msg);
    msg.onend = function() {
      readQuestionOptions();
    };
  }, 1000);
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
 * @param {HTMLCollection} questionFields
 */
const readAnswerOptions = questionFields => {
  const matrixField = questionFields;
  const questionDataType = questionFields.getAttribute("data-type");
  let optionsText = "Possible answers are : ";
  if (questionDataType === "Radio Button") {
    const answerOptions = matrixField.getElementsByClassName(
      "jfMatrixHeader-item"
    );
    setMatrixRows(matrixField, "radio");
    optionsText += options2Text(answerOptions);
    speakText(optionsText);
  } else if (questionDataType === "Emoji Slider") {
    let answerOptions = questionFields.getElementsByClassName(
      "jfMatrixScale-sep"
    )[0];
    setMatrixRows(matrixField, "emoji");
    answerOptions = answerOptions.getElementsByClassName("scaleSep");
    answerOptions = getScaleOptionsText(answerOptions);
    optionsText += answerOptions;
    speakText(optionsText);
  }
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
 * @param {HTMLElement} dropdownField
 */
const openDropdownMenu$1 = dropdownField => {
  const dropDownToggle = getDropdownToggle$1(dropdownField);
  dropDownToggle.click();
};

/**
 * @param {HTMLElement} field
 */
const readDropdown = field => {
  const dropdownOptions = field.getElementsByTagName("option");
  let optionsText = "";
  for (let option of dropdownOptions) {
    const optionValue = option.getAttribute("value");
    optionsText += optionValue + " , ";
  }
  return optionsText.substring(0, optionsText.length - 3);
};

const readMultipleFieldOptions = question => {
  stopRecord();
  const { questionFields, fieldNo } = question;
  const field = questionFields[fieldNo];
  setTimeout(function() {
    let options = "";
    if (field.getAttribute("data-type") === "mixed-dropdown") {
      options = ", Possible options are,  " + readDropdown(field);
      openDropdownMenu$1(field);
    }
    const subQuestion =
      field.getElementsByTagName("label")[0].innerHTML + options;
    const msg = new SpeechSynthesisUtterance(subQuestion);
    window.speechSynthesis.speak(msg);
    msg.onend = function() {
      startRecord();
    };
  }, 1000);
};

const readMultipleOptionalFields = question => {
  stopRecord();
  const { questionFields } = question;
  const options = [];
  for (let f of questionFields) {
    options.push(f.getElementsByTagName("input")[0]);
  }
  let optionsText = "Possible options are : ";
  for (let option of options) {
    const tempValue = option.value.toLowerCase();
    const indexOfImage = tempValue.indexOf("|");
    const optionValue =
      indexOfImage > 0 ? tempValue.substring(0, indexOfImage) : tempValue;
    optionsText += optionValue + " , ";
  }
  const optionsMessage = new SpeechSynthesisUtterance(optionsText);
  window.speechSynthesis.speak(optionsMessage);
  optionsMessage.onend = function() {
    startRecord();
  };
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
  readOptionsFunctions: {
    control_fullname: readMultipleFieldOptions,
    control_mixed: readMultipleFieldOptions,
    control_phone: readMultipleFieldOptions,
    control_address: readMultipleFieldOptions,
    control_radio: readMultipleOptionalFields,
    control_checkbox: readMultipleOptionalFields,
    control_imagechoice: readMultipleOptionalFields,
    control_dropdown: readDropdownOptions,
    control_matrix: readMatrixOptions
  },
  endFormMessage:
    "This is end of the form. If you want to check your answers,  please give 'Check Answers' command. Or you can submit,  with 'Submit' command .",
  optionalEndFormMessage:
    ". If you want to listen again, please give 'Check Answers' command. Or you can submit with 'Submit' command.' ",
  specialNames: { JotForm: ["john form", "job form", "job farm", "job forum"] }
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
  command = wordToSpecialName(command);
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
const wordToSpecialName = command => {
  const map = wordMap["specialNames"];
  console.log("Bak 1 : ");
  console.log(command);
  Object.keys(map).forEach(key => {
    const failSpecialWords = map[key];
    for (let word of failSpecialWords) {
      if (command.includes(word)) {
        console.log("Bak 2 : ");
        console.log(word);
        command = command.replace(word, key);
      }
    }
  });
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
 * Changes command next to start if questions are not active.
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
const getHeaderMessage = () => {
  const headerText = getHeaderText();
  const subHeader = getSubHeaderText();
  return headerText + " , " + subHeader;
};

/**
 * @param {HTMLElement} {button}
 * @returns {boolean}
 */
const isLastHeader = button => {
  return button.getAttribute("class").includes("forNext-heading");
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
    // speakAndStartRecord(questionHeader);
  } else {
    speakAndStartRecord(questionHeader);
  }
};

/**
 * Read question options
 */
const readQuestionOptions = () => {
  const currentQuestion = getCurrentQuestion();
  const readFunction = wordMap.readOptionsFunctions[currentQuestion.dataType];
  readFunction(currentQuestion);
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
 * @param {string} answer
 * @returns {string}
 */
const replaceUndefinedWithEmpty = answer => {
  return answer.replace("undefined", "empty");
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
  return replaceUndefinedWithEmpty(answersText);
};

/**
 * Read all answers of form.
 */
const readAllAnswers = () => {
  const { optionalEndFormMessage } = wordMap;
  const answers = getAllAnswers() + optionalEndFormMessage;
  console.log("Answers : ");
  console.log(answers);
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

const updateQuestionsActive = () => {
  if (window.questionsActive) {
    window.questionsActive = false;
  } else {
    setStartButtonListener();
  }
};

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
const fillQuestion = answer => {
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
        if (window.currentQuestion + 1 >= window.questions.length) ; else {
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
      answer = answer2Email(answer);
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
        readQuestionHeader();
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
        readQuestionHeader();
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
