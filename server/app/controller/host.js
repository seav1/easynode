const { readHostList, writeHostList, RSADecryptSync, AESEncryptSync, AESDecryptSync } = require('../utils')

async function getHostList({ res }) {
  // console.log('get-host-list')
  let data = await readHostList()
  data?.sort((a, b) => Number(b.index || 0) - Number(a.index || 0))
  for (const item of data) {
    try {
      let { username, port, authType, _id: id, credential } = item
      // console.log('解密凭证title: ', credential)
      if (credential) credential = await AESDecryptSync(credential)
      const isConfig = Boolean(username && port && (item[authType]))
      Object.assign(item, { id, isConfig, password: '', privateKey: '', credential })
    } catch (error) {
      consola.error('getHostList error: ', error.message)
    }
  }
  res.success({ data })
}

async function addHost({
  res, request
}) {
  let {
    body: {
      name, host: newHost, index, expired, expiredNotify, group, consoleUrl, remark,
      port, username, authType, password, privateKey, credential, command, tempKey
    }
  } = request
  // console.log(request)
  if (!newHost || !name) return res.fail({ msg: 'missing params: name or host' })
  let hostList = await readHostList()
  if (hostList?.some(({ host }) => host === newHost)) return res.fail({ msg: `主机${ newHost }已存在` })
  let record = {
    name, host: newHost, index, expired, expiredNotify, group, consoleUrl, remark,
    port, username, authType, password, privateKey, credential, command
  }
  const clearTempKey = await RSADecryptSync(tempKey)
  console.log('clearTempKey:', clearTempKey)
  const clearSSHKey = await AESDecryptSync(record[authType], clearTempKey)
  console.log(`${ authType }原密文: `, clearSSHKey)
  record[authType] = await AESEncryptSync(clearSSHKey)
  console.log(`${ authType }__commonKey加密存储: `, record[authType])
  hostList.push(record)
  await writeHostList(hostList)
  res.success()
}

async function updateHost({ res, request }) {
  let {
    body: {
      hosts,
      host: newHost, name: newName, index, oldHost, expired, expiredNotify, group, consoleUrl, remark,
      port, username, authType, password, privateKey, credential, command, tempKey
    }
  } = request
  let isBatch = Array.isArray(hosts)
  if (isBatch) {
    if (!hosts.length) return res.fail({ msg: 'hosts为空' })
    let hostList = await readHostList()
    // console.log('批量修改实例')
    let newHostList = []
    for (let oldRecord of hostList) {
      let record = hosts.find(item => item.host === oldRecord.host)
      if (!record) {
        newHostList.push(oldRecord)
        continue
      }
      let { authType } = record
      // 如果存在原认证方式则保存下来
      if (!record[authType] && oldRecord[authType]) {
        record[authType] = oldRecord[authType]
      } else {
        const clearTempKey = await RSADecryptSync(record.tempKey)
        // console.log('批量解密tempKey:', clearTempKey)
        const clearSSHKey = await AESDecryptSync(record[authType], clearTempKey)
        // console.log(`${ authType }原密文: `, clearSSHKey)
        record[authType] = await AESEncryptSync(clearSSHKey)
        // console.log(`${ authType }__commonKey加密存储: `, record[authType])
      }
      newHostList.push(Object.assign(oldRecord, record))
    }
    await writeHostList(newHostList)
    return res.success({ msg: '批量修改成功' })
  }
  if (!newHost || !newName || !oldHost) return res.fail({ msg: '参数错误' })
  let hostList = await readHostList()
  let record = {
    name: newName, host: newHost, index, expired, expiredNotify, group, consoleUrl, remark,
    port, username, authType, password, privateKey, credential, command
  }
  if (!hostList.some(({ host }) => host === oldHost)) return res.fail({ msg: `原实例[${ oldHost }]不存在,请尝试添加实例` })

  let idx = hostList.findIndex(({ host }) => host === oldHost)
  const oldRecord = hostList[idx]
  // 如果存在原认证方式则保存下来
  if (!record[authType] && oldRecord[authType]) {
    record[authType] = oldRecord[authType]
  } else {
    const clearTempKey = await RSADecryptSync(tempKey)
    // console.log('clearTempKey:', clearTempKey)
    const clearSSHKey = await AESDecryptSync(record[authType], clearTempKey)
    // console.log(`${ authType }原密文: `, clearSSHKey)
    record[authType] = await AESEncryptSync(clearSSHKey)
    // console.log(`${ authType }__commonKey加密存储: `, record[authType])
  }
  hostList.splice(idx, 1, record)
  writeHostList(hostList)
  res.success()
}

async function removeHost({
  res, request
}) {
  let { body: { host } } = request
  let hostList = await readHostList()
  if (Array.isArray(host)) {
    hostList = hostList.filter(item => !host.includes(item.host))
    // if (hostList.length === 0) return res.fail({ msg: '没有可删除的实例' })
  } else {
    let hostIdx = hostList.findIndex(item => item.host === host)
    if (hostIdx === -1) return res.fail({ msg: `${ host }不存在` })
    hostList.splice(hostIdx, 1)
  }
  writeHostList(hostList)
  res.success({ data: '已移除' })
}

async function importHost({
  res, request
}) {
  let { body: { importHost, isEasyNodeJson = false } } = request
  if (!Array.isArray(importHost)) return res.fail({ msg: '参数错误' })
  let hostList = await readHostList()
  // 过滤已存在的host
  let hostListSet = new Set(hostList.map(item => item.host))
  let newHostList = importHost.filter(item => !hostListSet.has(item.host))
  let newHostListLen = newHostList.length
  if (newHostListLen === 0) return res.fail({ msg: '导入的实例已存在' })

  if (isEasyNodeJson) {
    newHostList = newHostList.map((item) => {
      item.credential = ''
      item.isConfig = false
      delete item.id
      delete item.isConfig
      return item
    })
  } else {
    let extraFiels = {
      expired: null, expiredNotify: false, group: 'default', consoleUrl: '', remark: '',
      authType: 'privateKey', password: '', privateKey: '', credential: '', command: ''
    }
    newHostList = newHostList.map((item, index) => {
      item.port = Number(item.port) || 0
      item.index = newHostListLen - index
      return Object.assign(item, { ...extraFiels })
    })

  }
  hostList.push(...newHostList)
  writeHostList(hostList)
  res.success({ data: { len: newHostList.length } })
}

module.exports = {
  getHostList,
  addHost,
  updateHost,
  removeHost,
  importHost
}
