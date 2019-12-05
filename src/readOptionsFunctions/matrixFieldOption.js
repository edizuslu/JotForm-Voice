import {
  startRecord,
  stopRecord,
  readQuestionOptions
} from "../Text2Speech/speaker";

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

export const readMatrixOptions = question => {
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
