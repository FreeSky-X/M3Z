<template>
  <NLayout has-sider>
    <NLayoutSider bordered width="150">
      <!--左侧 放几个大类-->
      <NFlex vertical>
        <NButton @click="ipcMessage">米友社ZZZ签到</NButton>
        <NButton>ZZZ日常</NButton>
        <NButton>初始化资源</NButton>
      </NFlex>
    </NLayoutSider>
    <NLayout has-sider sider-placement="right">
      <NLayout>
        <NLayoutHeader>
          <!--中间标题-->
          <NH5>
            <NText type="primary"> 米友社签到 </NText>
          </NH5>
        </NLayoutHeader>

        <NLayoutContent>
          <!--中间任务勾选+执行-->
          <!--#region 签到-->
          <NCard>
            <NFlex vertical>
              <NCheckbox v-model:checked="startUpMYS" label="启动米游社app"></NCheckbox>
              <NCheckbox v-model:checked="register3zMYS" label="绝区零签到福利"></NCheckbox>
              <NCheckbox v-model:checked="stopAppMYS" label="退出米游社app"></NCheckbox>
              <NButton :disabled="!(startUpMYS || register3zMYS || stopAppMYS)" @click="dutyMYS"
                >bbc</NButton
              >
            </NFlex>
          </NCard>
          <!--#regionend-->
          <!--#region 日常-->
          <NCard>
            <NFlex vertical>
              <NCheckbox v-model:checked="startUpMYS" label="启动ZZZ"></NCheckbox>
              <NCheckbox v-model:checked="register3zMYS" label="喝咖啡"></NCheckbox>
              <NCheckbox v-model:checked="register3zMYS" label="刮刮券"></NCheckbox>
              <NCheckbox v-model:checked="stopAppMYS" label="退出ZZZ"></NCheckbox>
              <NButton @click="zzzStart">zzz启动</NButton>
            </NFlex>
          </NCard>
          <!--#regionend-->
        </NLayoutContent>
        <NLayoutFooter>
          <NButton>开始</NButton>
        </NLayoutFooter>
      </NLayout>
      <NLayoutSider bordered width="300">
        <!--右侧操作记录-->

        <NH5>
          <NText type="primary"> Log </NText>
        </NH5>

        <NLog :log="MsgTip" />
      </NLayoutSider>
    </NLayout>
  </NLayout>
</template>
<script setup lang="ts">
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NLayoutHeader,
  NLayoutFooter,
  NFlex,
  NButton,
  NInput,
  NCard,
  NH5,
  NText,
  NLog,
  NCheckbox
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useMiYouShe } from './useMainPageHook'
const MsgTip = ref<string>('')
const ipcMessage = () =>
  window.electron.ipcRenderer.invoke('test', JSON.stringify({ type: 'test1' })).then((result) => {
    console.log(result)
  })
const task = () =>
  window.electron.ipcRenderer
    .invoke('test', JSON.stringify({ type: 'test2' }))
    .then((res) => console.log(res))
window.api.OnMessageAlerts((value) => {
  MsgTip.value += (value as string) + '\n'
})
// const zzz兑换码 = ['ZZZFREE100', 'EANL2Q5ATYDA', 'ZZZ888', 'zzz20240704']
const initMaaFw = () => window.electron.ipcRenderer.send('initMaaFw')
const zzzStart = () =>
  window.electron.ipcRenderer
    .invoke('test', JSON.stringify({ type: 'startzzz' }))
    .then((res) => console.log(res))
const { startUpMYS, register3zMYS, stopAppMYS, executeMYS, dutyMYS } = useMiYouShe()
onMounted(() => {
  initMaaFw()
})
</script>
<style scoped>
.n-layout-header,
.n-layout-footer {
  padding: 12px;
}
.n-layout-sider {
  padding: 10px;
}
</style>
