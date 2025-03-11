/**
 * 格式化时间
 * @param {string|number|Date} time 时间
 * @param {string} format 格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
export function formatTime(time, format = 'YYYY-MM-DD HH:mm:ss') {
  if (!time) return ''
  
  const date = new Date(time)
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * 格式化数字
 * @param {number} num 数字
 * @param {number} decimals 小数位数，默认 2
 * @returns {string} 格式化后的数字字符串
 */
export function formatNumber(num, decimals = 2) {
  if (typeof num !== 'number') return '0'
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

/**
 * 格式化金额
 * @param {number} amount 金额
 * @param {string} currency 货币符号，默认 '¥'
 * @returns {string} 格式化后的金额字符串
 */
export function formatMoney(amount, currency = '¥') {
  if (typeof amount !== 'number') return `${currency}0.00`
  return `${currency}${formatNumber(amount, 2)}`
}

/**
 * 格式化文件大小
 * @param {number} bytes 字节数
 * @returns {string} 格式化后的文件大小
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

/**
 * 格式化距离现在的时间
 * @param {string|number|Date} time 时间
 * @returns {string} 相对时间
 */
export function formatTimeAgo(time) {
  if (!time) return ''
  
  const now = new Date()
  const past = new Date(time)
  const diff = now - past
  
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}天前`
  }
  if (hours > 0) {
    return `${hours}小时前`
  }
  if (minutes > 0) {
    return `${minutes}分钟前`
  }
  return '刚刚'
} 