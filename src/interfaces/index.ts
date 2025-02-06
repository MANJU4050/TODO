export interface TodoData {
    id?: string;
    assignedUser: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    title: string;
}

export interface User {
    id: string;
    name: string;
    email: string;

}

export interface TodoCardData extends TodoData {
    assignedUserName: string
}