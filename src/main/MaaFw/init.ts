import * as maa from '@nekosu/maa-node'

export const testMaa = async () => {
  console.log(maa.version())
  maa.set_global_option('LogDir', './log')
  // 查询所有Adb设备
  const devices = await maa.AdbController.find()
  if (!devices || devices.length < 1) {
    console.log('not find adb')
    return
  }
  // if (devices.length === 0) {
  //   devices[0] = {
  //     name: 'C:/Users/luoji/AppData/Local/Android/Sdk/platform-tools/adb.exe',
  //     adb_path: 'C:/Users/luoji/AppData/Local/Android/Sdk/platform-tools/adb.exe',
  //     adb_serial: '127.0.0.1:16384',
  //     adb_controller_type: 16645886,
  //     adb_config: '{}'
  //   }
  // }
  console.log(devices)
  // 使用第一个设备创建控制器
  const ctrl = new maa.AdbController(devices[0])
  ctrl.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  // 连接设备
  await ctrl.post_connection()

  // 创建资源
  const res = new maa.Resource()
  res.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  // 加载资源
  await res.post_path('./resource')

  // 创建实例
  const inst = new maa.Instance()
  inst.notify = (msg, detail) => {
    console.log(msg, detail)
  }
  //设置日志文件
  // 绑定控制器和资源
  inst.bind(ctrl)
  inst.bind(res)

  // 检查是否正确创建
  console.log(inst.inited ? 'successful create maafw' : 'fail !!!!!!')

  // 执行任务, Task1来自pipeline/Task.json
  // await inst.post_task('Task1').wait()
  // await inst.post_task('StartUp').wait()
  // await inst.post_task('Get_ZZZ1').wait()
  await inst.post_task('StopApp').wait()
}
