import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/context/authcontext"
import useOnline from "@/hooks/useOnline"
import { useNavigate } from "react-router-dom"

const Header = () => {

  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const isOnline = useOnline()

  const logoutUser = () => {
    logout()
    navigate('/login')

  }
  return (
    <div className="w-[100%] bg-slate-600 flex justify-between px-4 h-[70px] items-center">
      <h1 className="text-4xl text-white">TO DO</h1>
      <div className="flex gap-4 justify-center items-center">
        <div className="bg-gray-700 text-white p-2 rounded flex justify-center items-center gap-1">
          {user}
          {isOnline ? <div className="w-[10px] h-[10px] bg-green-400 rounded-full"></div> : null}
        </div>


        <Button onClick={logoutUser}>logout</Button>
      </div>
    </div>
  )
}

export default Header
