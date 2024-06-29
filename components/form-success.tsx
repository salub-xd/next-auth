import { FaCheckCircle } from "react-icons/fa";

interface FormSuccessProps {
    message?: string;
}

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) return null;
    return (
        <div className="p-3 gap-x-2 text-sm rounded-md bg-emerald-200 w-full flex items-center text-emerald-900">
            <FaCheckCircle />
            {message}
        </div>

    );
} 