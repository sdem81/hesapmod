import { calculators } from '../lib/calculator-source';

const missingSeo = calculators.filter(calc => {
  const hasFaq = calc.seo.faq && calc.seo.faq.length > 0;
  const content = calc.seo.content;
  const contentLen = content
    ? (typeof content === 'string' ? (content as string).length : (content as { tr: string; en: string }).tr.length)
    : 0;
  return !hasFaq || contentLen < 500;
}).map(c => {
  const content = c.seo.content;
  const contentLen = content
    ? (typeof content === 'string' ? (content as string).length : (content as { tr: string; en: string }).tr.length)
    : 0;
  return { slug: c.slug, title: c.name, contentLen, hasFaq: !!(c.seo.faq && c.seo.faq.length > 0) };
});

console.log(`Bulunan eksik SEO'lu ${missingSeo.length} hesaplayici:`);
missingSeo.slice(0, 15).forEach(c => {
  console.log(`- ${JSON.stringify(c.title)} (${c.slug}): Content Len: ${c.contentLen}, FAQ: ${c.hasFaq}`);
});
