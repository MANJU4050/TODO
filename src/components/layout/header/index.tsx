import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/authcontext"
import { useNavigate } from "react-router-dom"

const Header = () => {

  const { user, logout } = useAuthContext()
  const navigate = useNavigate()

  const logoutUser = () => {
    logout()
    navigate('/login')

  }
  return (
    <div className="w-[100%] bg-slate-600 flex justify-between px-4 min-h-[60px] items-center">
      <h1 className="text-4xl text-white">TO DO</h1>
      <div className="flex gap-4 justify-center items-center">
        <div className="bg-gray-700 text-white p-2 rounded">{user}</div>

        <Button onClick={logoutUser}>logout</Button>
      </div>
    </div>
  )
}

export default Header
