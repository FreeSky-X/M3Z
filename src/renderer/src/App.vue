<script setup lang="ts">
import { ref } from 'vue'
import Versions from './components/Versions.vue'

import MainPage from '@renderer/view/MainPage.vue'
import { NConfigProvider } from 'naive-ui'
import hljs from 'highlight.js'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')
const ipcB = () => window.electron.ipcRenderer.send('start')
const ipcMessage = () =>
  window.electron.ipcRenderer.invoke('test', JSON.stringify({ type: 'test1' })).then((result) => {
    console.log(result)
  })
const MsgTip = ref<string>('')
window.api.OnMessageAlerts((value) => {
  MsgTip.value = value as string
})
</script>

<template>
  <NConfigProvider :hljs="hljs">
    <MainPage class="home" />
  </NConfigProvider>

  <!-- <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <p class="tip">{{ MsgTip }}</p>
  <div class="actions">
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcMessage">Send IPC Message</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcB">Test</a>
    </div>
  </div>
  <Versions /> -->
</template>
<style lang="css">
.home {
  height: 100vh;
  width: 100vw;
}
</style>
