const formatUpdateTime = (dateString) => {
    if (!dateString) return "-"
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-GB', { month: 'short' })
    const year = date.getFullYear().toString().slice(-2)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    return `${day} ${month} ${year} at ${hours}:${minutes}:${seconds}`
}

export default formatUpdateTime;