function escapeHtml(value: string) {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function applyInlineMarkdown(value: string) {
    return escapeHtml(value)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function flushParagraph(paragraphLines: string[], blocks: string[]) {
    if (paragraphLines.length === 0) {
        return;
    }

    blocks.push(`<p>${applyInlineMarkdown(paragraphLines.join(" "))}</p>`);
    paragraphLines.length = 0;
}

function flushList(
    listState: { ordered: boolean; items: string[] } | null,
    blocks: string[]
) {
    if (!listState || listState.items.length === 0) {
        return null;
    }

    const tag = listState.ordered ? "ol" : "ul";
    blocks.push(
        `<${tag}>${listState.items
            .map((item) => `<li>${applyInlineMarkdown(item)}</li>`)
            .join("")}</${tag}>`
    );

    return null;
}

export function renderRichText(content: string) {
    const normalizedContent = content.trim().replace(/\r\n/g, "\n");
    if (!normalizedContent) {
        return "";
    }

    // Existing calculator pages already store some sections as trusted HTML.
    if (/<\/?[a-z][\s\S]*>/i.test(normalizedContent)) {
        return normalizedContent;
    }

    const blocks: string[] = [];
    const paragraphLines: string[] = [];
    let listState: { ordered: boolean; items: string[] } | null = null;

    for (const rawLine of normalizedContent.split("\n")) {
        const line = rawLine.trim();

        if (!line) {
            flushParagraph(paragraphLines, blocks);
            listState = flushList(listState, blocks);
            continue;
        }

        if (line.startsWith("## ")) {
            flushParagraph(paragraphLines, blocks);
            listState = flushList(listState, blocks);
            blocks.push(`<h2>${applyInlineMarkdown(line.slice(3))}</h2>`);
            continue;
        }

        if (line.startsWith("### ")) {
            flushParagraph(paragraphLines, blocks);
            listState = flushList(listState, blocks);
            blocks.push(`<h3>${applyInlineMarkdown(line.slice(4))}</h3>`);
            continue;
        }

        const unorderedMatch = line.match(/^[-*]\s+(.+)$/);
        if (unorderedMatch) {
            flushParagraph(paragraphLines, blocks);
            if (!listState || listState.ordered) {
                listState = flushList(listState, blocks);
                listState = { ordered: false, items: [] };
            }
            listState.items.push(unorderedMatch[1]);
            continue;
        }

        const orderedMatch = line.match(/^\d+\.\s+(.+)$/);
        if (orderedMatch) {
            flushParagraph(paragraphLines, blocks);
            if (!listState || !listState.ordered) {
                listState = flushList(listState, blocks);
                listState = { ordered: true, items: [] };
            }
            listState.items.push(orderedMatch[1]);
            continue;
        }

        listState = flushList(listState, blocks);
        paragraphLines.push(line);
    }

    flushParagraph(paragraphLines, blocks);
    flushList(listState, blocks);

    return blocks.join("\n");
}
