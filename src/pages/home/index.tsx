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

import { getTodosApi } from "@/api/todo"
import { getUsersApi } from "@/api/users"
import TodoCard from "@/components/pages/home/TodoCard"
import { TodoData, User } from "@/interfaces"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { debounce } from 'lodash'
import ReactPaginate from 'react-paginate';
import useTaskManage from "@/hooks/useTaskManage"
import { toast } from "react-toastify"
import Loader from "@/components/loader"


const Home = () => {

  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [userId, setUserId] = useState<string>('')
  const [users, setUsers] = useState<User[]>([])
  const [sortBy, setSortBy] = useState<string>('title')
  const [page, setPage] = useState<number>(1)
  const [itemPerPage] = useState<number>(8)
  const [pageCount, setPageCount] = useState<number>(1)
  const [refetch, setRefetch] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(false)

  const { setTodoList, todoList, setIsOpen, setDeleteId, isOpen, isDeleting, handleDelete } = useTaskManage()

  const getTodoList = async (search = '', status = '', userId = '', sortBy = 'title', page = 1, itemPerPage = 8) => {
    try {
      setIsLoading(true)
      const todos = await getTodosApi(search, status, userId, sortBy, page, itemPerPage)
      const users = await getUsersApi()

      const updateTodos = todos?.data?.map((todo: TodoData) => {
        const user = users?.find((user: User) => {
          return user?.id === todo.assignedUser.toString()
        })

        return { ...todo, assignedUserName: user?.name }
      })

      const totalPages = Math.ceil(todos?.items / itemPerPage);
      setPageCount(totalPages);
      setTodoList(updateTodos)
      setUsers(users)

    } catch (error) {
      console.error(error)
      toast.error("error fetching tasks")
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    getTodoList(searchTerm, status, userId, sortBy, page, itemPerPage)
  }, [status, userId, sortBy, page, refetch])

  const debounceSearch = useCallback(debounce((search: string) => {
    getTodoList(search, status, userId, sortBy, page, itemPerPage)
  }, 500), [status, userId, sortBy, page, itemPerPage])

  useEffect(() => {
    return () => debounceSearch.cancel();
  }, []);





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

  const handlePageClick = (event: any) => {
    setPage(event.selected + 1)

  }

  const todos = todoList?.map((todo) => {
    return <TodoCard key={todo.id} {...todo} setIsOpen={setIsOpen} setDeleteId={setDeleteId} />
  })

  return (
    <>
      <div className="flex flex-col  gap-10 h-full">
        <div className="flex justify-between items-center gap-2">
          <div className="flex-1 flex gap-2">
            <input className=" h-[40px] w-full rounded-md pl-4" placeholder="search by title..." type="text" onChange={handleSearchChange} value={searchTerm} />
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
                  return <option key={user?.id} value={user?.id}>{user?.email}</option>
                })
              }
            </select>
            <select className="rounded-md px-1" value={sortBy} onChange={handlesortByChange}>
              <option value='title'>sort by title - asc</option>
              <option value='-title'>sort by title - desc</option>
              <option value='dueDate'>sort by due date - asc</option>
              <option value='-dueDate'>sort by due date - desc</option>
            </select>
          </div>
          <div className="flex-1 flex justify-end"><Button className="w-[200px] h-[40px]" onClick={() => navigate('/add')}> <Plus />New Task</Button></div>
        </div>

        {isLoading ? <Loader /> : 

          <div className="flex gap-4 flex-wrap  flex-1">
            {todoList?.length !== 0 ? todos : <div className=" w-full flex justify-center items-center">
              <div className="bg-slate-400 p-3">
                <p className="text-slate-800 text-2xl">No Tasks Found</p></div>
            </div>
            }
          </div>
        }


        {
          todoList?.length !== 0 && <div className="flex justify-center items-center ">

            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< Previous"
              renderOnZeroPageCount={null}
              forcePage={page - 1}
              containerClassName="flex items-center space-x-2 justify-center mt-4"
              pageClassName="border rounded-lg w-10 h-10 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
              pageLinkClassName="w-full h-full flex items-center justify-center"
              activeClassName="bg-blue-500 text-white"
              previousClassName="border rounded-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
              nextClassName="border rounded-lg px-4 py-2 hover:bg-gray-200 cursor-pointer"
              disabledClassName="opacity-50"
            />
          </div>
        }

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
            <Button disabled={isDeleting} className="bg-red-500" onClick={() => {
              handleDelete().then(() => {
                setRefetch(!refetch)
              })

            }}>{isDeleting ? "Deleting.." : "Delete"}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Home
