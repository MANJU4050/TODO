import { Outlet } from 'react-router-dom'

import Header from './header'

const Layout = () => {
    return (
        <div className='h-screen flex flex-col'>
            <Header />
            <div className="flex-1 overflow-auto bg-slate-500 px-8 py-4">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout
