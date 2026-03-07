import {
    BadgeDollarSign,
    Banknote,
    BriefcaseBusiness,
    Calculator,
    Car,
    Clock,
    GraduationCap,
    HeartPulse,
    LucideIcon,
    Sparkles,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
    Banknote,
    Car,
    BadgeDollarSign,
    GraduationCap,
    Calculator,
    Clock,
    HeartPulse,
    Sparkles,
    BriefcaseBusiness,
};

interface CategoryIconProps {
    icon: string;
    className?: string;
    size?: number;
    strokeWidth?: number;
}

export function CategoryIcon({
    icon,
    className,
    size = 24,
    strokeWidth = 2,
}: CategoryIconProps) {
    const IconComponent = iconMap[icon] ?? Calculator;

    return (
        <IconComponent
            size={size}
            strokeWidth={strokeWidth}
            aria-hidden="true"
            className={className}
        />
    );
}
