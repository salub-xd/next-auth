import { BsExclamationTriangle } from "react-icons/bs";

interface FormErrorProps {
    message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="p-3 gap-x-2 text-sm rounded-md bg-destructive/25 w-full flex items-center text-destructive">
            <BsExclamationTriangle />
            {message}
        </div>

    );
} 