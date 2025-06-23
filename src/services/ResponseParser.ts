interface ParsedResponse {
  text: string;
  snippets: Array<{
    language: string;
    code: string;
  }>;
}

export class ResponseParser {
  parseResponse(response: string): ParsedResponse {
    const snippets: Array<{ language: string; code: string }> = [];
    let text = response;

    // Ищем блоки кода jsx/tsx
    const codeBlockPattern = /```(?:jsx|tsx)\n([\s\S]*?)```/g;
    let match;

    while ((match = codeBlockPattern.exec(response)) !== null) {
      const code = match[1];
      snippets.push({
        language: 'jsx',
        code: code.trim()
      });
    }

    // Удаляем блоки кода из текста
    text = text.replace(codeBlockPattern, '').trim();

    return { text, snippets };
  }
}
