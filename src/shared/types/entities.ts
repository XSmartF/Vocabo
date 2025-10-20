export type BaseEntity = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export type FlashCard = BaseEntity & {
    question: string;
    answer: string;
}

export type Library = BaseEntity & {
    name: string;
    description: string;
}

export type User = BaseEntity & {
    username: string;
    email: string;
}

