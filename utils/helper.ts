export const validate = (text: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    return false
  } else {
    return true
  }
}

export function convertString(name: string): string {
  let seq = ''
  let newString = ''
  if (name === null || name === undefined || name.trim().length === 0) {
    return ''
  }
  const words = name.split(' ')
  for (const word of words) {
    if (word.length !== 0) {
      const ch = word[0]
      if (word.length > 1) {
        newString += word.substring(1)
        newString += ' '
      }
      const value = ch.charCodeAt(0)
      if ((value > 64 && value < 91) || (value > 96 && value < 123)) {
        seq += ch
      }
    }
  }
  return seq + convertString(newString)
}

export function getInitials(name: string) {
  const converted = convertString(name)
  switch (converted.length) {
    case 0:
      return 'NB'
    case 1:
      return converted
    case 2:
      return converted.substring(0, 2)
    default:
      return converted.substring(0, 2)
  }
}
