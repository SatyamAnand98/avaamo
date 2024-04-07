interface WordDefinition {
    text: string;
    pos: string;
    tr: {
        text: string;
        pos: string;
        syn?: { text: string; pos: string; fr?: number; ts?: string }[];
    }[];
}

export function getSynonyms(response: WordDefinition[]): string[] {
    const synonyms: string[] = [];

    response.forEach((wordDef) => {
        wordDef.tr.forEach((translation) => {
            if (translation.syn) {
                translation.syn.forEach((synonym) => {
                    synonyms.push(synonym.text);
                });
            }
        });
    });

    return synonyms;
}
