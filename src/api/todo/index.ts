import { TodoData } from "@/interfaces";
import api from "..";

export const getTodosApi = async () => {
    const { data } = await api.get('/todo')
    return data
}

export const addTodoApi = async (payload: TodoData) => {
    const { data } = await api.post('/todo', payload)
    return data
}

export const deleteTodoApi = async (id: string) => {
    const { data } = await api.delete(`/todo/${id}`)
    return data
}