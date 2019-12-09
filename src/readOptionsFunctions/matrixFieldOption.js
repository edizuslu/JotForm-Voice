import {
  startRecord,
  readQuestionOptions,
  speakAndStartRecord
} from "../Text2Speech/speaker";

/**
 * Read matrix question fields and answers options
 * @param {object} question
 */
export const readMatrixOptions = question => {
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
