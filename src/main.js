import Speech2Text from "./SpeechRecognation/Speech2Text";
import { initializeVoiceForm } from "./Form/setButtonListeners";

window.questionsActive = false;
window.noSpeechError = false;
window.speechEnd = false;
window.speechStopped = false;

new Speech2Text();

window.currentQuestion = 0;
initializeVoiceForm();
