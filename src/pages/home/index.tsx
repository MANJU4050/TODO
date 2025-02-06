import { useEffect, useState } from "react"

import { getTodosApi } from "@/api/todo"
import { getUsersApi } from "@/api/users"
import TodoCard from "@/components/pages/home/TodoCard"
import { TodoCardData, TodoData, User } from "@/interfaces"


const Home = () => {

  const [todoList, setTodoList] = useState<TodoCardData[]>([])
  const getTodoList = async () => {
    try {

      const todos = await getTodosApi()
      const users = await getUsersApi()

      const updateTodos = todos?.map((todo: TodoData) => {
        const user = users?.find((user: User) => {
          return user?.id === todo.id.toString()
        })

        return { ...todo, assignedUserName: user?.name }
      })

      setTodoList(updateTodos)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getTodoList()
  }, [])

  const todos = todoList?.map((todo) => {
    return <TodoCard key={todo.id} {...todo} />
  })

  return (
    <div className="flex gap-4 flex-wrap">
      {todos}
    </div>
  )
}

export default Home
