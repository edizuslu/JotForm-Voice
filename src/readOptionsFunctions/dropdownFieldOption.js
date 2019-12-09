import { startRecord, stopRecord } from "../Text2Speech/speaker";

/**
 * @param {object}question
 */
export const readDropdownOptions = question => {
  stopRecord();
  const { questionFields } = question;
  const dropdownField = questionFields[0];
  const optionsText = getDropdownOptionsText(dropdownField);
  openDropdownNReadOptions(optionsText, dropdownField);
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
 */
const openDropdownNReadOptions = (optionsText, dropdownField) => {
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
