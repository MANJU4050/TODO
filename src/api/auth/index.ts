import api from ".."

export const loginApi = async () => {
    const { data } = await api.get('/auth')
    return data
}