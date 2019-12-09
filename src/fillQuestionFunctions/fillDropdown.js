import { getElementByTagName } from "../Form/getFormData";

/**
 * Fill dropdown
 * @param {object} question
 */
export const fillDropdown = (question, answer) => {
  answer = answer === "delete" ? "" : answer;
  const options = getDropdownOptions(question);
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
const getDropdownOptions = question => {
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
export const getAllElementsWithAttributeValue = (
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
