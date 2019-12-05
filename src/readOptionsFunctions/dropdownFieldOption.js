import { startRecord, stopRecord } from "../Text2Speech/speaker";

export const readDropdownOptions = question => {
  stopRecord();
  const questions = window.questions;
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
