export declare class CreateSubtaskDto {
    title: string;
    assigneeId?: string;
}
export declare class UpdateSubtaskDto {
    title?: string;
    completed?: boolean;
    assigneeId?: string;
}
export declare class CreateMultipleSubtasksDto {
    subtasks: CreateSubtaskDto[];
}
