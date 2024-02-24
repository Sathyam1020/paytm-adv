import React, {ChangeEvent} from "react";

interface InputBoxProps {
    label: string;
    placeholder: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const InputBox: React.FC<InputBoxProps> = ({
    label,
    placeholder,
    onChange
}) => {
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input placeholder={placeholder} className="w-full px-2 py-1 border rounded border-slate-200" onChange={onChange}/>
    </div>
}