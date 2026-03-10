import { calculators } from '../lib/calculator-source';

const missingSeo = calculators.filter(calc => {
  const hasFaq = calc.seo.faq && calc.seo.faq.length > 0;
  const contentLen = calc.seo.content ? calc.seo.content.length : 0;
  
  return !hasFaq || contentLen < 500;
}).map(c => ({slug: c.slug, title: c.name, contentLen: c.seo.content ? c.seo.content.length : 0, hasFaq: !!(c.seo.faq && c.seo.faq.length > 0)}));

console.log(`Bulunan eksik SEO'lu ${missingSeo.length} hesaplayici:`);
missingSeo.slice(0, 15).forEach(c => {
  console.log(`- ${c.title} (${c.slug}): Content Len: ${c.contentLen}, FAQ: ${c.hasFaq}`);
});
