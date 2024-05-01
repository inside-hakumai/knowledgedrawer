import { app } from 'electron'

type ExecMode = 'development-unpackaged' | 'development' | 'production'

export const getExecMode = (): ExecMode => {
  if (process.env.NODE_ENV === 'development' && !app.isPackaged) {
    return 'development-unpackaged'
  } else if (process.env.NODE_ENV === 'development') {
    return 'development'
  } else if (process.env.NODE_ENV === 'production') {
    return 'production'
  } else {
    throw new Error(`Failed to identify the execution mode. NODE_ENV: ${process.env.NODE_ENV}`)
  }
}
