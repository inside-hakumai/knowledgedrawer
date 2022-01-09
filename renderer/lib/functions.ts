import React from 'react'

export const mapKeyToAction = (event: React.KeyboardEvent): 'ArrowUp' | 'ArrowDown' | null => {
  if (event.key === 'ArrowUp' || (event.ctrlKey && event.key === 'p')) {
    return 'ArrowUp'
  } else if (event.key === 'ArrowDown' || (event.ctrlKey && event.key === 'n')) {
    return 'ArrowDown'
  } else {
    return null
  }
}
