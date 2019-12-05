import { startRecord, stopRecord } from "../Text2Speech/speaker";

export const readMultipleOptionalFields = question => {
  stopRecord();
  const questions = window.questions;
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
