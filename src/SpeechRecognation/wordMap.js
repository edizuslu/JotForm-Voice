import { readDropdownOptions } from "../readOptionsFunctions/dropdownFieldOption";
import { readMatrixOptions } from "../readOptionsFunctions/matrixFieldOption";
import { readMultipleFieldOptions } from "../readOptionsFunctions/multipleFieldOption";
import { readMultipleOptionalFields } from "../readOptionsFunctions/optionalFieldOption";

import { fillMultipleFieldQuestion } from "../fillQuestionFunctions/fillMultipleFieldQuestion";
import { fillRadio } from "../fillQuestionFunctions/fillRadio";
import { fillCheckBox } from "../fillQuestionFunctions/fillCheckBox";
import { fillImageChoice } from "../fillQuestionFunctions/fillImageChoice";
import { fillDropdown } from "../fillQuestionFunctions/fillDropdown";
import { fillMatrixQuestion } from "../fillQuestionFunctions/fillMatrixQuestion";
import { fillRating } from "../fillQuestionFunctions/fillRating";
import { fillTextarea } from "../fillQuestionFunctions/fillTextarea";
import { fillEmail } from "../fillQuestionFunctions/fillEmail";
import { fillTextbox } from "../fillQuestionFunctions/fillTextbox";
import { fillYesno } from "../fillQuestionFunctions/fillYesno";
import { fillNumber } from "../fillQuestionFunctions/fillNumber";
import { fillDatetime } from "../fillQuestionFunctions/fillDatetime";
import { fillTimeQuestion } from "../fillQuestionFunctions/fillTimeQuestion";

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
  formElementFunctions: {
    control_fullname: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_mixed: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_phone: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_address: {
      readOptions: readMultipleFieldOptions,
      fillQuestion: fillMultipleFieldQuestion
    },
    control_radio: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillRadio
    },
    control_checkbox: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillCheckBox
    },
    control_imagechoice: {
      readOptions: readMultipleOptionalFields,
      fillQuestion: fillImageChoice
    },
    control_dropdown: {
      readOptions: readDropdownOptions,
      fillQuestion: fillDropdown
    },
    control_matrix: {
      readOptions: readMatrixOptions,
      fillQuestion: fillMatrixQuestion
    },
    control_rating: {
      readOptions: undefined,
      fillQuestion: fillRating
    },
    control_textarea: {
      readOptions: undefined,
      fillQuestion: fillTextarea
    },
    control_email: {
      readOptions: undefined,
      fillQuestion: fillEmail
    },
    control_textbox: {
      readOptions: undefined,
      fillQuestion: fillTextbox
    },
    control_yesno: {
      readOptions: undefined,
      fillQuestion: fillYesno
    },
    control_number: {
      readOptions: undefined,
      fillQuestion: fillNumber
    },
    control_datetime: {
      readOptions: undefined,
      fillQuestion: fillDatetime
    },
    control_time: {
      readOptions: undefined,
      fillQuestion: fillTimeQuestion
    }
  },
  endFormMessage:
    "This is end of the form. If you want to check your answers,  please give 'Check Answers' command. Or you can submit,  with 'Submit' command .",
  optionalEndFormMessage:
    ". If you want to listen again, please give 'Check Answers' command. Or you can submit with 'Submit' command.' "
};
