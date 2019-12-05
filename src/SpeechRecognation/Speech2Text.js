import { getRecognationObject } from "./getRecognationObject";
import {
  clickStart,
  clickNext,
  clickPrevious,
  clickSubmit
} from "../ClickFunctions/clickFunctions";
import { getCommand } from "./filterCommand";
import { readAllAnswers } from "../Text2Speech/speaker";
import { fillQuestion } from "../FillQuestion/fillQuestion";

class Speech2Text {
  constructor() {
    this.recognition = getRecognationObject();

    /**
     * On Result
     */
    this.recognition.onresult = function(event) {
      const command = getCommand(event);
      switch (command) {
        case "start":
          clickStart();
          break;
        case "next":
          clickNext();
          break;
        case "previous":
          clickPrevious();
          break;
        case "submit":
          clickSubmit();
          break;
        case "check answers":
          readAllAnswers();
          break;
        default:
          fillQuestion(command);
      }
    };

    /**
     * On Speech End
     */
    this.recognition.onspeechend = function() {
      if (window.speechStopped === false) {
        window.speechEnd = true;
      }
    };

    /**
     * On Error
     */
    this.recognition.onerror = function(event) {
      window.noSpeechError = true;
    };

    /**
     * On End
     */
    this.recognition.onend = () => {
      if (window.noSpeechError || window.speechEnd) {
        this.recognition.start();
        window.noSpeechError = false;
        window.speechEnd = false;
      }
    };

    window.recognition = this.recognition;
  }
}

export default Speech2Text;
