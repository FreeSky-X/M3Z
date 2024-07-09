import { ElectronAPI } from '@electron-toolkit/preload'
interface CustomAPI {
  OnMessageAlerts: (callback: (value: unknown) => void) => unknown
}
declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
