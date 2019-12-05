import { readDropdownOptions } from "../readOptionsFunctions/dropdownFieldOption";
import { readMatrixOptions } from "../readOptionsFunctions/matrixFieldOption";
import { readMultipleFieldOptions } from "../readOptionsFunctions/multipleFieldOption";
import { readMultipleOptionalFields } from "../readOptionsFunctions/optionalFieldOption";

export const wordMap = {
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
