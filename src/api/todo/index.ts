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

export const editTaskApi = async (id: string, payload: TodoData) => {
    const { data } = await api.patch(`/todo/${id}`, payload)
    return data
}

export const getTodoById = async (id: string) => {
    const { data } = await api.get(`/todo/${id}`)
    return data
}