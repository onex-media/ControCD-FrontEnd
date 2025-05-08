// validators.js
import { required } from '@vuelidate/validators'

const lineHnadler = () => {
  // 
}

export const requiredMessage = (message) => {
  return required.withMessage(message)
}
