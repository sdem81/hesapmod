import { Category } from "@/lib/categories";
import {
    Banknote,
    Car,
    BadgeDollarSign,
    GraduationCap,
    Calculator,
    Clock,
    HeartPulse,
    LucideIcon
} from "lucide-react";
import Link from "next/link";
import { memo } from "react";

// Map string icon names to actual Lucide components
// This ensures only the used icons are bundled via static imports, preventing bundle bloat.
const iconMap: Record<string, LucideIcon> = {
    Banknote,
    Car,
    BadgeDollarSign,
    GraduationCap,
    Calculator,
    Clock,
    HeartPulse
};

interface CategoryCardProps {
    category: Category;
    index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
    // Fallback to Banknote if icon string doesn't exist, preventing crashes
    const IconComponent = iconMap[category.icon] || Banknote;

    return (
        <Link
            href={`/kategori/${category.slug}`}
            style={{ animationDelay: `${(index % 4) * 100}ms` }}
            // Explicitly pass aria-label for accessibility to ensure text is prioritized over the icon itself
            aria-label={`Kategori: ${category.name.tr}`}
            className="group p-8 rounded-3xl bg-card border hover:border-primary/50 hover-glow hover-lift transition-all text-left animate-fade-in-up"
        >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                {/* 
                  - strokeWidth={2} for consistent modern weight
                  - Explicit width/height to prevent layout shift (CLS)
                  - aria-hidden="true" because the surrounding link text is what screen readers need
                */}
                <IconComponent
                    size={28}
                    strokeWidth={2}
                    aria-hidden="true"
                    className="shrink-0"
                />
            </div>

            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                {category.name.tr}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                {category.description.tr}
            </p>
        </Link>
    );
};

// Use React.memo as these cards are largely static unless the locale changes.
export default memo(CategoryCard);
