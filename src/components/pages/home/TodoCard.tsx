import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CircleUser, Pencil, Trash2 } from 'lucide-react'

interface TodoCardProps {
    assignedUserName: string,
    description: string;
    dueDate: string,
    priority: string,
    status: string,
    title: string
}

const TodoCard: React.FC<TodoCardProps> = ({ assignedUserName, description, dueDate, priority, status, title }) => {
    return (
        <div className="flex flex-col bg-slate-700 w-full max-w-md p-4 gap-4 rounded text-white">
            <div className="flex flex-col gap-2 items-start">
                <div className="flex justify-between items-center w-full">
                    <div className="text-2xl">{title}</div>
                    <Badge className={`${priority === "high" ? 'bg-red-400 hover:bg-red-400' : 'bg-green-600 hover:bg-green-600'}`}>{priority}</Badge>
                </div>

                <div>{description}</div>
                <div className="flex gap-2"> <CircleUser />{assignedUserName}</div>
                <div className="flex gap-2"><Calendar />{dueDate}</div>
                <Badge className="text-white" variant='outline'>{status}</Badge>
            </div>
            <div className="flex justify-between">
                <Button> <Pencil />Edit</Button>
                <Button className="bg-red-500 hover:bg-red-400"> <Trash2 />Delete</Button>

            </div>

        </div>
    )
}

export default TodoCard
