import { getRecognationObject } from "./getRecognationObject";
import { getCommand, getCommandFunction } from "./filterCommand";

class Speech2Text {
  constructor() {
    this.recognition = getRecognationObject();

    /**
     * On Result
     */
    this.recognition.onresult = function(event) {
      const command = getCommand(event);
      const commandFunction = getCommandFunction(command);
      commandFunction(command);
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
