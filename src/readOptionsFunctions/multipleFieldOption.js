import { speakAndStartRecord } from "../Text2Speech/speaker";

/**
 * @param {object} question
 */
export const readMultipleFieldOptions = question => {
  const { questionFields, fieldNo } = question;
  const field = questionFields[fieldNo];
  const subQuestion = getSubQuestion(field);
  speakAndStartRecord(subQuestion);
};

const getSubQuestion = field => {
  let options = "";
  if (field.getAttribute("data-type") === "mixed-dropdown") {
    options = "Possible options are " + getDropdownOptions(field);
    openDropdownMenu(field);
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
