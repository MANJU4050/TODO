import { z } from "zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import { useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"

import Loader from "@/components/loader"
import { TodoDataPayload } from "@/interfaces"
import { Button } from "@/components/ui/button"
import useGetUsers from "@/hooks/useGetUsers"


const EditTask = () => {

  const { id } = useParams()
  const { editTask, isEditing, users, getTodo, isLoadingTodo } = useGetUsers()


  const todoSchema = z.object({
    title: z.string().min(3, "minimum 3 characters").max(12, 'maximum of 12 characters'),
    description: z.string().min(10, "minimum 10 characters").max(20, 'maximum of 20 characters'),
    dueDate: z.string(),
    assignedUser: z.string().nonempty("assigned user is required"),
    status: z.string(),
    priority: z.string()
  })

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignedUser: "",
      status: "",
      priority: ""
    }
  })


  const onSubmit = (data: TodoDataPayload) => {
    editTask(id, data)
  }

  const setInitialValues = async () => {
    const todo = await getTodo(id)
    reset({
      title: todo?.title,
      description: todo?.description,
      assignedUser: todo?.assignedUser,
      dueDate: todo?.dueDate,
      status: todo?.status,
      priority: todo?.priority
    })
  }

  useEffect(() => {
    setInitialValues()
  }, [])

  const userOptions = users?.map((user) => {
    return <option key={user?.id} value={user?.id}>{user?.email}</option>
  })

  if (isLoadingTodo) return <Loader />

  return (

    <div className=" h-full flex justify-center items-center ">
      <div className=" w-[600px] flex flex-col gap-8 p-4 bg-slate-700 rounded-md">
        <h1 className="text-4xl text-white text-center">EDIT TASK</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <input {...register("title")} className="min-h-[40px] px-2 rounded" type="text" placeholder="title" />
          {errors.title?.message && <p className="text-red-500">{errors.title.message}</p>}
          <input {...register("description")} className="min-h-[40px] px-2 rounded" type="text" placeholder="description" />
          {errors.description?.message && <p className="text-red-500">{errors.description.message}</p>}
          <input {...register("dueDate")} className="min-h-[40px] px-2 rounded" type="date" />
          {errors.dueDate?.message && <p className="text-red-500">{errors.dueDate.message}</p>}
          <select {...register("assignedUser")} className="min-h-[40px] px-2 rounded" >
            <option value=''>select user</option>
            {userOptions}
          </select>
          {errors.assignedUser?.message && <p className="text-red-500">{errors.assignedUser.message}</p>}
          <select {...register("status")} className="min-h-[40px] px-2 rounded" >
            <option value='todo'>todo</option>
            <option value='inProgress'>inProgress</option>
            <option value='done'>done</option>
          </select>
          {errors.status?.message && <p className="text-red-500">{errors.status.message}</p>}
          <select {...register("priority")} className="min-h-[40px] px-2 rounded" >
            <option value='high'>high</option>
            <option value='low'>low</option>
          </select>
          {errors.priority?.message && <p className="text-red-500">{errors.priority.message}</p>}
          <Button type='submit'>{isEditing ? "Updating" : "Update"}</Button>

        </form>


      </div>
    </div>
  )
}

export default EditTask
