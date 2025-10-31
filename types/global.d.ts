// types/global.d.ts

declare global {
  interface Window {
    __visua11yAgent__onScrollReadableGuide?: (event: Event) => void;
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
    Visua11yAgentPlugin?: ReturnType<typeof import('../src/core').default>;
  }
}

export {};
