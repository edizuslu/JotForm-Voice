import { startRecord, stopRecord } from "../Text2Speech/speaker";

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

export const readMultipleFieldOptions = question => {
  stopRecord();
  const questions = window.questions;
  const { questionFields, fieldNo } = question;
  const field = questionFields[fieldNo];
  setTimeout(function() {
    let options = "";
    if (field.getAttribute("data-type") === "mixed-dropdown") {
      options = ", Possible options are,  " + readDropdown(field);
      openDropdownMenu(field);
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
