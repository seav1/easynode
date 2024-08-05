const { getSSHList, addSSH, updateSSH, removeSSH, getCommand } = require('../controller/ssh')
const { getHostList, addHost, updateHost, removeHost, importHost } = require('../controller/host')
const { login, getpublicKey, updatePwd, getLoginRecord, getEasynodeVersion } = require('../controller/user')
const { getSupportEmailList, getUserEmailList, updateUserEmailList, removeUserEmail, pushEmail, getNotifyList, updateNotifyList } = require('../controller/notify')
const { getGroupList, addGroupList, updateGroupList, removeGroup } = require('../controller/group')
const { getScriptList, getLocalScriptList, addScript, updateScriptList, removeScript } = require('../controller/scripts')
const { getOnekeyRecord, removeOnekeyRecord } = require('../controller/onekey')

const ssh = [
  {
    method: 'get',
    path: '/get-ssh-list',
    controller: getSSHList
  },
  {
    method: 'post',
    path: '/add-ssh',
    controller: addSSH
  },
  {
    method: 'post',
    path: '/update-ssh',
    controller: updateSSH
  },
  {
    method: 'delete',
    path: '/remove-ssh/:id',
    controller: removeSSH
  },
  {
    method: 'get',
    path: '/command',
    controller: getCommand
  }
]
const host = [
  {
    method: 'get',
    path: '/host-list',
    controller: getHostList
  },
  {
    method: 'post',
    path: '/host-save',
    controller: addHost
  },
  {
    method: 'put',
    path: '/host-save',
    controller: updateHost
  },
  {
    method: 'post',
    path: '/host-remove',
    controller: removeHost
  },
  {
    method: 'post',
    path: '/import-host',
    controller: importHost
  }
]
const user = [
  {
    method: 'get',
    path: '/get-pub-pem',
    controller: getpublicKey
  },
  {
    method: 'post',
    path: '/login',
    controller: login
  },
  {
    method: 'put',
    path: '/pwd',
    controller: updatePwd
  },
  {
    method: 'get',
    path: '/get-login-record',
    controller: getLoginRecord
  },
  {
    method: 'get',
    path: '/version',
    controller: getEasynodeVersion
  }
]
const notify = [
  {
    method: 'get',
    path: '/support-email',
    controller: getSupportEmailList
  },
  {
    method: 'get',
    path: '/user-email',
    controller: getUserEmailList
  },
  {
    method: 'post',
    path: '/user-email',
    controller: updateUserEmailList
  },
  {
    method: 'post',
    path: '/push-email',
    controller: pushEmail
  },
  {
    method: 'delete',
    path: '/user-email/:email',
    controller: removeUserEmail
  },
  {
    method: 'get',
    path: '/notify',
    controller: getNotifyList
  },
  {
    method: 'put',
    path: '/notify',
    controller: updateNotifyList
  }
]

const group = [
  {
    method: 'get',
    path: '/group',
    controller: getGroupList
  },
  {
    method: 'post',
    path: '/group',
    controller: addGroupList
  },
  {
    method: 'delete',
    path: '/group/:id',
    controller: removeGroup
  },
  {
    method: 'put',
    path: '/group/:id',
    controller: updateGroupList
  }
]

const scripts = [
  {
    method: 'get',
    path: '/script',
    controller: getScriptList
  },
  {
    method: 'get',
    path: '/local-script',
    controller: getLocalScriptList
  },
  {
    method: 'post',
    path: '/script',
    controller: addScript
  },
  {
    method: 'delete',
    path: '/script/:id',
    controller: removeScript
  },
  {
    method: 'put',
    path: '/script/:id',
    controller: updateScriptList
  }
]

const onekey = [
  {
    method: 'get',
    path: '/onekey',
    controller: getOnekeyRecord
  },
  {
    method: 'post',
    path: '/onekey',
    controller: removeOnekeyRecord
  }
]
module.exports = [].concat(ssh, host, user, notify, group, scripts, onekey)
