import { calculators, findCalculatorByRoute, normalizeCalculatorSlug } from "@/lib/calculators";
import { notFound, redirect } from "next/navigation";

export async function generateStaticParams() {
    return calculators.map((calculator) => ({
        slug: calculator.slug,
    }));
}

export default function CalculatorAliasPage({
    params,
}: {
    params: { slug: string };
}) {
    const normalizedSlug = normalizeCalculatorSlug(params.slug);
    const calculator = findCalculatorByRoute(normalizedSlug);

    if (!calculator) notFound();

    redirect(`/${calculator.category}/${calculator.slug}`);
}
