export const getKeyHistory = () => {
    const result = localStorage.getItem('cloak_key_history')
    return result ? JSON.parse(result) : []
}