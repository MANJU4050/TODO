import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { deleteTodoApi, getTodosApi } from "@/api/todo"
import { getUsersApi } from "@/api/users"
import TodoCard from "@/components/pages/home/TodoCard"
import { TodoCardData, TodoData, User } from "@/interfaces"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"


const Home = () => {

  const [todoList, setTodoList] = useState<TodoCardData[]>([])
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const getTodoList = async () => {
    try {

      const todos = await getTodosApi()
      const users = await getUsersApi()

      const updateTodos = todos?.map((todo: TodoData) => {
        const user = users?.find((user: User) => {
          return user?.id === todo.assignedUser.toString()
        })

        return { ...todo, assignedUserName: user?.name }
      })

      setTodoList(updateTodos)

    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await deleteTodoApi(deleteId)

      setTodoList((prev) => {
        return prev?.filter((todo) => {
          return todo.id !== deleteId
        })
      })

      console.log(response, "response")
      console.log(deleteId, "delete id")
      setDeleteId("")
      setIsOpen(false)

    } catch (error) {
      setIsDeleting(false)
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    getTodoList()
  }, [])

  const todos = todoList?.map((todo) => {
    return <TodoCard key={todo.id} {...todo} setIsOpen={setIsOpen} setDeleteId={setDeleteId} />
  })

  return (
    <>
      <div className="flex flex-col  gap-10">
        <div className="flex justify-between items-center">
          <div><input /></div>
          <div><Button onClick={() => navigate('/add')}> <Plus />New Task</Button></div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {todos}
        </div>
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              task
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-red-500" onClick={handleDelete}>{isDeleting ? "Deleting.." : "Delete"}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Home
