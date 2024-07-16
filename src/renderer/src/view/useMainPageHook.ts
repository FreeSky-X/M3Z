import { ref } from 'vue'
export const useMiYouShe = () => {
  const startUpMYS = ref<boolean>(false)
  const register3zMYS = ref<boolean>(false)
  const stopAppMYS = ref<boolean>(false)

  const executeMYS = ref<boolean>(startUpMYS.value || register3zMYS.value || stopAppMYS.value)
  const dutyMYS = () => {
    if (startUpMYS.value) {
      console.log('startUpMYS')
    }
    if (register3zMYS.value) {
      console.log('register3zMYS')
    }
    if (stopAppMYS.value) {
      console.log('stopAppMYS')
    }
  }

  return { startUpMYS, register3zMYS, stopAppMYS, executeMYS, dutyMYS }
}
