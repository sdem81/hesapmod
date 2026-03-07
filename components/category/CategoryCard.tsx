import { Category } from "@/lib/categories";
import { CategoryIcon } from "./CategoryIcon";
import Link from "next/link";
import { memo } from "react";

interface CategoryCardProps {
    category: Category;
    index: number;
}

const CategoryCard = ({ category, index }: CategoryCardProps) => {
    return (
        <Link
            href={`/kategori/${category.slug}`}
            style={{ animationDelay: `${(index % 4) * 100}ms` }}
            // Explicitly pass aria-label for accessibility to ensure text is prioritized over the icon itself
            aria-label={`Kategori: ${category.name.tr}`}
            className="group p-8 rounded-3xl bg-card border hover:border-primary/50 hover-glow hover-lift transition-all text-left animate-fade-in-up"
        >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <CategoryIcon icon={category.icon} size={28} className="shrink-0" />
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
