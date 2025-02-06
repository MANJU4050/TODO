import { useCallback, useEffect, useState } from "react"
import {
  AlertDialog,
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
import { debounce } from 'lodash'


const Home = () => {

  const [todoList, setTodoList] = useState<TodoCardData[]>([])
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [status, setStatus] = useState('')
  const [userId, setUserId] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [sortBy, setSortBy] = useState('title')

  const getTodoList = async (search = '', status = '', userId = '', sortBy = 'title') => {
    try {

      const todos = await getTodosApi(search, status, userId, sortBy)
      const users = await getUsersApi()

      const updateTodos = todos?.map((todo: TodoData) => {
        const user = users?.find((user: User) => {
          return user?.id === todo.assignedUser.toString()
        })

        return { ...todo, assignedUserName: user?.name }
      })

      setTodoList(updateTodos)
      setUsers(users)

    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteTodoApi(deleteId)

      setTodoList((prev) => {
        return prev?.filter((todo) => {
          return todo.id !== deleteId
        })
      })

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
    getTodoList(searchTerm, status, userId, sortBy)
  }, [status, userId, sortBy])

  const debounceSearch = useCallback(debounce((search: string) => {
    getTodoList(search, status, userId, sortBy)
  }, 500), [])




  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    debounceSearch(e.target.value)
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value)
  }

  const handleAssignedUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserId(e.target.value)
  }

  const handlesortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value)
  }

  const todos = todoList?.map((todo) => {
    return <TodoCard key={todo.id} {...todo} setIsOpen={setIsOpen} setDeleteId={setDeleteId} />
  })

  return (
    <>
      <div className="flex flex-col  gap-10">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input className=" h-[40px] rounded-md pl-4" placeholder="search by title..." type="text" onChange={handleSearchChange} value={searchTerm} />
            <select className="rounded-md" onChange={handleStatusChange} value={status}>
              <option value=''>all status</option>
              <option value='todo'>todo</option>
              <option value='inProgress'>inProgress</option>
              <option value='done'>done</option>

            </select>
            <select className="rounded-md" value={userId} onChange={handleAssignedUserChange}>
              <option value=''>all users</option>
              {
                users?.map((user) => {
                  return <option value={user?.id}>{user?.email}</option>
                })
              }
            </select>
            <select className="rounded-md" value={sortBy} onChange={handlesortByChange}>
              <option value='title'>title asc</option>
              <option value='-title'>title desc</option>
              <option value='dueDate'>dueDate asc</option>
              <option value='-dueDate'>dueDate desc</option>
            </select>
          </div>
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
