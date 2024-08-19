const Datastore = require('@seald-io/nedb')
const {
  credentialsDBPath,
  hostListDBPath,
  keyDBPath,
  notifyDBPath,
  notifyConfigDBPath,
  groupConfDBPath,
  scriptsDBPath,
  onekeyDBPath
} = require('../config')

module.exports.KeyDB = class KeyDB {
  constructor() {
    if (!KeyDB.instance) {
      KeyDB.instance = new Datastore({ filename: keyDBPath, autoload: true })
    }
  }
  getInstance() {
    return KeyDB.instance
  }
}

module.exports.HostListDB = class HostListDB {
  constructor() {
    if (!HostListDB.instance) {
      HostListDB.instance = new Datastore({ filename: hostListDBPath, autoload: true })
    }
  }
  getInstance() {
    return HostListDB.instance
  }
}

module.exports.SshRecordDB = class SshRecordDB {
  constructor() {
    if (!SshRecordDB.instance) {
      SshRecordDB.instance = new Datastore({ filename: credentialsDBPath, autoload: true })
    }
  }
  getInstance() {
    return SshRecordDB.instance
  }
}

module.exports.NotifyDB = class NotifyDB {
  constructor() {
    if (!NotifyDB.instance) {
      NotifyDB.instance = new Datastore({ filename: notifyDBPath, autoload: true })
    }
  }
  getInstance() {
    return NotifyDB.instance
  }
}

module.exports.NotifyConfigDB = class NotifyConfigDB {
  constructor() {
    if (!NotifyConfigDB.instance) {
      NotifyConfigDB.instance = new Datastore({ filename: notifyConfigDBPath, autoload: true })
    }
  }
  getInstance() {
    return NotifyConfigDB.instance
  }
}

module.exports.GroupDB = class GroupDB {
  constructor() {
    if (!GroupDB.instance) {
      GroupDB.instance = new Datastore({ filename: groupConfDBPath, autoload: true })
    }
  }
  getInstance() {
    return GroupDB.instance
  }
}

module.exports.ScriptsDB = class ScriptsDB {
  constructor() {
    if (!ScriptsDB.instance) {
      ScriptsDB.instance = new Datastore({ filename: scriptsDBPath, autoload: true })
    }
  }
  getInstance() {
    return ScriptsDB.instance
  }
}

module.exports.OnekeyDB = class OnekeyDB {
  constructor() {
    if (!OnekeyDB.instance) {
      OnekeyDB.instance = new Datastore({ filename: onekeyDBPath, autoload: true })
    }
  }
  getInstance() {
    return OnekeyDB.instance
  }
}
