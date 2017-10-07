import truncate from 'lodash/truncate'
import {sdk} from './stellar'

const isPublicKey = keyStr => sdk.StrKey.isValidEd25519PublicKey(keyStr)
// stellar federated address (eg. "stellar*fed.network")
const isStellarAddress = addr => /^[^*,]*\*[a-z0-9-.]*$/i.test(addr)
const isTxHash = hashStr => /^[0-9a-f]{64}$/i.test(hashStr)
const shortHash = hash => truncate(hash, {length: 10})

const isDefInt = (obj, key) => {
  if (!obj || !key || obj.hasOwnProperty(key) === false) return false
  return Number.isInteger(Number(obj[key]))
}

const base64Decode = value => Buffer.from(value, 'base64').toString()

const handleFetchDataFailure = id => e => {
  let msg = `Failed to fetch data:`
  if (e.data && e.data.status) msg += `\n\tStatus: [${e.data.status}]`
  if (e.message) msg += `\n\tMessage: [${e.message}]`
  if (e.stack) msg += `\n\tStack: [${e.stack}]`
  console.error(msg)
  console.error(`Raw Error: ${e}`)

  if (e.data && e.data.status === 404) {
    let redirectURI = '/error/not-found'
    if (id) redirectURI += `/${id}`
    window.location.href = redirectURI
  }
}

const storageInit = () => {
  let storage
  if (typeof localStorage === 'undefined' || localStorage === null) {
    const tmpdir = require('os').tmpdir
    const join = require('path').join
    const storagePath = join(tmpdir(), 'steexp')
    const LocalStorage = require('node-localstorage').LocalStorage
    storage = new LocalStorage(storagePath)
  } else {
    storage = localStorage
  }
  return storage
}

export {
  base64Decode,
  handleFetchDataFailure,
  isDefInt,
  isPublicKey,
  isStellarAddress,
  isTxHash,
  shortHash,
  storageInit,
}
