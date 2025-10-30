// types/global.d.ts

declare global {
  interface Window {
    __visua11yAgent__onScrollReadableGuide?: (event: Event) => void;
    Visua11yAgentPlugin?: ReturnType<typeof import("../src/visua11yAgent").default>;
  }
}

export {};
