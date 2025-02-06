import { lazy, Suspense } from "react"
import { useAuthContext } from "@/context/authcontext"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"


import Loader from "../components/loader"
import ProtectedRoute from "@/components/protectedroute"

const Home = lazy(() => import("../pages/home"))
const Login = lazy(() => import("../pages/auth/login"))
const Layout = lazy(() => import("../components/layout"))
const AddTask = lazy(() => import("../pages/home/addtask"))
const EditTask = lazy(() => import("../pages/home/edittask"))
const PageNotFound = lazy(() => import("../components/pagenotfound"))

const RootRouter = () => {

    const {isAuthenticated} = useAuthContext()

    return (
        <Suspense fallback={<Loader />}>
            <Router>
                <Routes>
                    <Route path="/login" element={ !isAuthenticated ? <Login /> : <Navigate to='/' />} />

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<Layout />} >
                            <Route index element={<Home />} />
                            <Route path="/add" element={<AddTask />} />
                            <Route path="/edit/:id" element={<EditTask />} />
                        </Route>
                    </Route>

                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        </Suspense>
    )
}

export default RootRouter
