export const validate = (text: string) => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/
  if (reg.test(text) === false) {
    return false
  } else {
    return true
  }
}
