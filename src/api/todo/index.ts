import {  TodoDataPayload } from "@/interfaces";
import api from "..";

export const getTodosApi = async (searchTerm: string, status: string, userId: string, sortBy: string, page: number, itemPerPage: number) => {
    const { data } = await api.get(`/todo?title=${searchTerm}&status=${status}&assignedUser=${userId}&_sort=${sortBy}&_page=${page}&_per_page=${itemPerPage}`)
    return data
}

export const addTodoApi = async (payload: TodoDataPayload) => {
    const { data } = await api.post('/todo', payload)
    return data
}

export const deleteTodoApi = async (id: string) => {
    const { data } = await api.delete(`/todo/${id}`)
    return data
}

export const editTaskApi = async (id: string, payload: TodoDataPayload) => {
    const { data } = await api.patch(`/todo/${id}`, payload)
    return data
}

export const getTodoById = async (id: string) => {
    const { data } = await api.get(`/todo/${id}`)
    return data
}