import * as maa from '@nekosu/maa-node'
import { dialog } from 'electron'

export const testMaa = async (msgFun: (msg: string) => void) => {
  console.log(maa.version())
  //设置日志文件
  msgFun('设置日志目录: log')
  maa.set_global_option('LogDir', './log')
  // 查询所有Adb设备
  msgFun('查询所有Adb设备')
  const devices = await maa.AdbController.find()
  if (!devices || devices.length < 1) {
    console.log('not find adb')
    msgFun('未找到adb设备,请先启动模拟器')
    return undefined
  }
  console.log(devices)
  // 使用第一个设备创建控制器
  msgFun('创建MaaFW控制器')
  const ctrl = new maa.AdbController(devices[0])
  ctrl.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  // 连接设备
  msgFun('连接设备...')
  await ctrl.post_connection()

  // 创建资源
  msgFun('创建资源...')
  const res = new maa.Resource()
  res.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  // 加载资源
  msgFun('加载资源...')
  await res.post_path('./resource')

  // 创建实例
  msgFun('创建实例...')
  const inst: maa.Instance = new maa.Instance()
  inst.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  // 绑定控制器和资源
  inst.bind(ctrl)
  inst.bind(res)

  // 检查是否正确创建
  msgFun(inst.inited ? '创建实例成功...' : '创建实例失败')
  // console.log(inst.inited ? 'successful create maafw' : 'fail !!!!!!')
  // dialog.showErrorBox('FW inst', inst.inited ? 'successful create maafw' : 'fail !!!!!!')
  // createInst = inst.inited
  // 执行任务, Task1来自pipeline/Task.json
  //await inst.post_task('Task1').wait()
  // await inst.post_task('StartUp_MYS').wait()
  // await inst.post_task('Get_ZZZ1_MYS').wait()
  // await inst.post_task('StopApp_MYS').wait()
  return inst
}
