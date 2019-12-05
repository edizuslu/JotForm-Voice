import { wordMap } from "./wordMap";

/**
 * @param {Object} event
 * @return {string}
 */
export const getCommand = event => {
  const lastCommand = getLastCommand(event);
  const command = filterCommand(lastCommand);
  console.log("Command : ");
  console.log(command);
  return command;
};

/**
 * @param {Object} event
 * @returns {string}
 */
const getLastCommand = event => {
  const last = event.results.length - 1;
  const lastCommand = event.results[last][0].transcript;
  return lastCommand;
};

/**
 * @param {string} command
 * @returns {string}
 */
const filterCommand = command => {
  command = command.trim();
  command = command.toLowerCase();
  command = wordToNumber(command);
  command = wordToSpecialName(command);
  command = areQuestionsActive(command);
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const wordToNumber = command => {
  command = command2WordMap(command, "number");
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const wordToSpecialName = command => {
  const map = wordMap["specialNames"];
  console.log("Bak 1 : ");
  console.log(command);
  Object.keys(map).forEach(key => {
    const failSpecialWords = map[key];
    for (let word of failSpecialWords) {
      if (command.includes(word)) {
        console.log("Bak 2 : ");
        console.log(word);
        command = command.replace(word, key);
      }
    }
  });
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const command2WordMap = (command, mapType) => {
  const map = wordMap[mapType];
  Object.keys(map).forEach(key => {
    if (command.includes(key)) {
      command = command.replace(key, map[key]);
    }
  });
  return command;
};

/**
 * Changes command next to start if questions are not active.
 * @param {string} command
 * @returns {string}
 */
const areQuestionsActive = command => {
  return command === "next" && window.questionsActive ? "start" : command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const answer2Email = command => {
  command = wordToEmail(command);
  command = removeSpaces(command);
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
const wordToEmail = command => {
  command = command2WordMap(command, "punctuation");
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const removeSpaces = command => {
  return command.replace(/\s/g, "");
};

/**
 * @param {string} command
 * @returns {string}
 */
const firstCharToUpperCase = command => {
  return command.charAt(0).toUpperCase() + command.substring(1) + " ";
};

/**
 * @param {string} command
 * @returns {string}
 */
export const formatAnswerCaseRule = command => {
  const words = command.split(" ");
  command = "";
  for (let word of words) {
    command += firstCharToUpperCase(word);
  }
  command = command.trim();
  return command;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const answer2Date = answer => {
  const month = getMonth(answer);
  const { day, year } = getDaynYear(answer);
  return year + "-" + month + "-" + day;
};

/**
 * @param {string} command
 * @returns {string}
 */
export const getMonth = command => {
  const map = wordMap.month;
  let monthValue = "";
  Object.keys(map).forEach(key => {
    if (command.includes(key)) {
      monthValue = map[key];
    }
  });
  return monthValue;
};

/**
 * @param {string} command
 * @returns {object}
 */
const getDaynYear = answer => {
  const date = [];
  const r = /\d+/g;
  let m;
  while ((m = r.exec(answer)) != null) {
    date.push(m[0]);
  }
  const day = toZeroFormatDay(date[0]);
  const year = date[1];
  return { day, year };
};

/**
 * @param {string} command
 * @returns {string}
 */
const toZeroFormatDay = day => {
  day = day.length === 1 ? "0" + day : day;
  return day;
};

/**
 * @param {string} command
 * @returns {string}
 */
export function answer2AmPm(answer) {
  return answer.includes("a.m.") ? "AM" : "PM";
}