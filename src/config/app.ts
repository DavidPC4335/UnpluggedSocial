export interface AppConfig {
  enableWebConsole: boolean;
  consoleMaxEntries: number;
  accelerometerUpdateIntervalMs: number;
  shakeDebounceMs: number;
  shakeThresholdG: number;
  toolbarModalMaxWidth: number;
  toolbarModalPadding: number;
}

export const appConfig: AppConfig = {
  enableWebConsole: true, // Enable or disable the debugging web console
  consoleMaxEntries: 300, // Maximum number of entries to keep in the web console log
  accelerometerUpdateIntervalMs: 150, // How often to poll the accelerometer (in ms)
  shakeDebounceMs: 1000, // Minimum ms between shake gesture detections (prevents double triggers)
  shakeThresholdG: 3.0, // Minimum shake force (in Gs) required to trigger the toolbar
  toolbarModalMaxWidth: 520, // Maximum width of the browser toolbar modal (in px)
  toolbarModalPadding: 12, // Padding of the toolbar modal (in px)
};

