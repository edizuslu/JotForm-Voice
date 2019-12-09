import { speakAndStartRecord } from "../Text2Speech/speaker";

/**
 * Read multiple optional fields
 * @param {object} question
 */
export const readMultipleOptionalFields = question => {
  const { questionFields } = question;
  const options = getOptions(questionFields);
  const optionsText = getOptionsText(options);
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
const getOptionsText = options => {
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
