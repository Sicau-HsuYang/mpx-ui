export function initLogin (option = {}) {
  return new Promise((resolve, reject) => {
    K.isLogin(res => {
      resolve(res)
    }, (err) => {
      if (!option.needLogin) {
        reject(err)
      } else {
        K.login(res => {
          resolve({
            ...res,
            didLogin: true
          })
        }, err => {
          reject(err)
        })
      }
    })
  })
}

export function initLocation (option = {}) {
  return new Promise((resolve, reject) => {
    K.getLocation(option, (res) => {
      if (res.lat && res.lng) {
        resolve({
          cityId: res.cityId,
          lat: res.lat,
          lng: res.lng
        })
      } else {
        reject(res)
      }
    })
  })
}

const initFn = {
  login: initLogin,
  location: initLocation
}

export function initPlatform (options) {
  let resultObject = {}
  let count = 0
  let hasError = false

  function checkResult (status, type, option, data, resolve, reject) {
    resultObject[type] = {
      status,
      data
    }

    if (status === 'fail' && !option.tolerateFailure) {
      hasError = true
    }

    if (Object.keys(resultObject).length === count) {
      hasError ? reject(resultObject) : resolve(resultObject)
    }
  }

  return new Promise((resolve, reject) => {
    for (let i in options) {
      if (options[i] && initFn[i]) {
        count++

        initFn[i](options[i])
          .then(result => {
            checkResult('success', i, options[i], result, resolve, reject)
          })
          .catch(err => {
            checkResult('fail', i, options[i], err, resolve, reject)
          })
      }
    }
  })
}
