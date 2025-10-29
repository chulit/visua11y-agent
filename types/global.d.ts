// types/global.d.ts

declare global {
  interface Window {
    __nextbility__onScrollReadableGuide?: (event: Event) => void;
    NextBilityPlugin?: ReturnType<typeof import("../src/nextBility").default>;
  }
}

export {};
