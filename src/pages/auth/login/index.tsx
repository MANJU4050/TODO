import { z } from 'zod'
import { toast } from "react-toastify"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAuthContext } from "@/context/authcontext"
import { Label } from '@/components/ui/label'

const Login = () => {

  const { login } = useAuthContext()
  const navigate = useNavigate()

  const loginSchema = z.object({
    username: z.string().min(5, 'minimum 5 characters').max(10, "maximum 10 characters"),
    password: z.string().min(3, "minimum 3 characters").max(10, 'maximum 15 characters')
  })

  type LoginFormValues = z.infer<typeof loginSchema>

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  const loginUser = async (data: { username: string, password: string }) => {
    try {
      const response = await login(data.username, data.password)

      if (response.statusCode === 200) {
        toast.success(response.message)
        navigate('/')

      } else {
        toast.dismiss()
        toast.error(response.message)
      }

    } catch (error) {
      console.error(error)
    }

  }

  const onSubmit = (data: { username: string, password: string }) => {
    loginUser(data)
  }
  return (
    <div className="flex justify-center items-center w-['100%'] h-screen bg-gray-800">
      <div className="w-[350px] min-h-[500px] rounded-md flex flex-col justify-center gap-5 items-center p-5 bg-slate-700">
        <h1 className='text-2xl text-white'>TO DO</h1>
        <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <Label className='text-white'>Username</Label>
            <input className='h-[40px] pl-2 w-[250px] rounded-md' type="text" placeholder="username" {...register("username")} />
            {errors.username?.message && <p className='text-red-500'>{errors.username.message}</p>}
          </div>
          <div className='flex flex-col gap-2'>
            <Label className='text-white'>Password</Label>
            <input className='h-[40px] pl-2 w-[250px] rounded-md' type="password" placeholder="password" {...register("password")} />
            {errors.password?.message && <p className='text-red-500'>{errors.password.message}</p>}
          </div>
          <Button type="submit">Login</Button>
        </form>


      </div>
    </div>
  )
}

export default Login
