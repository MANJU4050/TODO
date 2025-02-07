import { addTodoApi, deleteTodoApi, editTaskApi, getTodoById } from "@/api/todo"
import { getUsersApi } from "@/api/users"
import { TodoCardData, TodoDataPayload, User } from "@/interfaces"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const useTaskManage = () => {

    const navigate = useNavigate()
    const [users, setUsers] = useState<User[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isAdding, setIsAdding] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const [deleteId, setDeleteId] = useState<string>('')
    const [todoList, setTodoList] = useState<TodoCardData[]>([])
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [isLoadingTodo, setIsLoadingTodo] = useState<boolean>(false)



    const getUsers = async () => {
        try {
            setIsLoading(true)
            const users = await getUsersApi()
            setUsers(users)
        } catch (error) {
            console.error(error)
            toast.error('error fetching users')
        } finally {
            setIsLoading(false)
        }
    }

    const addTask = async (data: TodoDataPayload) => {
        try {
            setIsAdding(true)
             await addTodoApi(data)

            navigate('/')

        } catch (error) {
            console.error(error)
            toast.error('erroring adding task')
        } finally {
            setIsAdding(false)
        }
    }

    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            await deleteTodoApi(deleteId)
            setDeleteId("")
            setIsOpen(false)
            toast.success("task deleted successfully")

        } catch (error) {
            console.error(error)
            toast.error('error deleting task')
        } finally {
            setIsDeleting(false)
        }
    }

    const editTask = async (id: string | undefined, data: TodoDataPayload) => {
        try {
            setIsEditing(true)
            if (id) {
                await editTaskApi(id, data)
                toast.success("task updated successfully")
                navigate('/')
            }

        } catch (error) {
            console.error(error)
            toast.error("error updating task")
        } finally {
            setIsEditing(false)
        }
    }

    const getTodo = async (id: string | undefined) => {
        try {
            setIsLoadingTodo(true)
            if (id) {
                const todo = await getTodoById(id)
                return todo

            }

        } catch (error) {
            console.error(error)
            toast.error('error fetching task')
        } finally {
            setIsLoadingTodo(false)
        }
    }

    useEffect(() => {
        getUsers()
    }, [])


    return {
        users, isLoading,
        addTask, isAdding,
        handleDelete, isDeleting,
        todoList, isOpen,
        setTodoList, setIsOpen, setDeleteId,
        editTask, isEditing,
        getTodo,isLoadingTodo
    }
}

export default useTaskManage