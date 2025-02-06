import api from "..";

export const getTodosApi = async () => {
    const { data } = await api.get('/todo')
    return data
}