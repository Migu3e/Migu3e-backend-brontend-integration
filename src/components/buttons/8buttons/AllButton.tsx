import React from "react";

interface ButtonProps {
    label: string;
    subLabel?: string;
    className?: string;
    children?: React.ReactNode;
}
const Button= (prop:ButtonProps) => (
    <button className={`w-16 h-16 bg-[#2d3748] text-[#fbbf24] rounded-full flex flex-col items-center justify-center text-xs font-bold border-none cursor-pointer relative overflow-hidden ${prop.className}`}>
        {prop.label}
        {prop.subLabel && (
            <>
                <span className="absolute left-2 right-2 bg-white bottom-[1.905rem] h-[0.1875rem]"></span>
                <span className="text-white text-xs absolute bottom-2">{prop.subLabel}</span>
            </>
        )}
        {prop.children}
    </button>
);
// can do all, but i want to keep it so it will do nothing for now
export default Button;
