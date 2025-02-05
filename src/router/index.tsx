import { lazy, Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Loader from "../components/loader"
const Home = lazy(() => import("../pages/home"))
const Login = lazy(() => import("../pages/auth/login"))
const Layout = lazy(() => import("../components/layout"))
const AddTask = lazy(() => import("../pages/home/addtask"))
const EditTask = lazy(() => import("../pages/home/edittask"))
const PageNotFound = lazy(() => import("../components/pagenotfound"))


const RootRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />} >
                        <Route index element={<Home />} />
                        <Route path="/add" element={<AddTask />} />
                        <Route path="/edit/:id" element={<EditTask />} />
                    </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<PageNotFound />} />
                </Routes>
            </Router>
        </Suspense>

    )
}

export default RootRouter
