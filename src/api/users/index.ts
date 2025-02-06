import api from "..";

export const getUsersApi = async () => {
    const { data } = await api.get('/users')
    return data
}