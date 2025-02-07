import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import Loader from "@/components/loader"
import { TodoDataPayload } from "@/interfaces"
import { Button } from "@/components/ui/button"
import useTaskManage from "@/hooks/useTaskManage"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

const AddTask = () => {

  const { isLoading, users, addTask, isAdding } = useTaskManage()
  const navigate = useNavigate()

  const todoSchema = z.object({
    title: z.string().min(3, "minimum 3 characters").max(12, 'maximum of 12 characters'),
    description: z.string().min(10, "minimum 10 characters").max(20, 'maximum of 20 characters'),
    dueDate: z.string().nonempty("duedate is required"),
    assignedUser: z.string().nonempty("assigned user is required"),
    status: z.string(),
    priority: z.string()
  })

  type AddTaskFormValues = z.infer<typeof todoSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<AddTaskFormValues>({
    resolver: zodResolver(todoSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
      assignedUser: "",
      status: "todo",
      priority: "low"
    }
  })

  const onSubmit = (data: TodoDataPayload) => {
    addTask(data)
  }

  const userOptions = users?.map((user) => {
    return <option key={user?.id} value={user?.id}>{user?.email}</option>
  })

  if (isLoading) return <Loader />

  return (

    <div className=" h-full flex justify-center items-center relative">
      <Button className="absolute top-0 left-0" onClick={() => navigate('/')}> <ArrowLeft />back</Button>
      <div className=" w-[400px] flex flex-col gap-8 px-4 bg-slate-700 rounded-md py-10">
        <h1 className="text-4xl text-white text-center">ADD NEW TASK</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <input {...register("title")} className="min-h-[40px] px-2 rounded" type="text" placeholder="title" />
          {errors.title?.message && <p className="text-red-500">{errors.title.message}</p>}
          <textarea {...register("description")} className="min-h-[40px] p-2 rounded" rows={3} placeholder="description" />
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
          <Button type='submit'>{isAdding ? "adding" : "Add task"}</Button>

        </form>


      </div>
    </div>
  )
}

export default AddTask
