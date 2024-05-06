import { app } from 'electron'

type ExecMode = 'development-devserver' | 'development-unpackaged' | 'production'

export const getExecMode = (): ExecMode => {
  if (process.env.NODE_ENV === 'development' && process.env.RUNNING_ON_DEVSERVER) {
    return 'development-devserver'
  } else if (process.env.NODE_ENV === 'development') {
    return 'development-unpackaged'
  } else if (app.isPackaged) {
    return 'production'
  } else {
    throw new Error(`Failed to identify the execution mode. NODE_ENV: ${process.env.NODE_ENV}`)
  }
}
