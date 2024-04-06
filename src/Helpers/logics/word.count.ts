import { prepositionList } from "../../stores/lists/prepositions";

function countWordFrequency(str: string): { [key: string]: number } {
    try {
        const words = str.toLowerCase().split(/\W+/);
        const frequencyMap: { [key: string]: number } = {};

        const prepositions = new Set(prepositionList);

        for (const word of words) {
            if (word.length > 0 && !prepositions.has(word)) {
                const count = frequencyMap[word] || 0;
                frequencyMap[word] = count + 1;
            }
        }

        const sortedFrequencyMap = Object.entries(frequencyMap)
            .sort((a, b) => b[1] - a[1])
            .reduce((obj: any, [word, count]) => {
                obj[word] = count;
                return obj;
            }, {});

        return sortedFrequencyMap;
    } catch (err: any) {
        console.log(`Error in counting word frequency: ${err}`.trim() + "\n");
        throw err;
    }
}

export default countWordFrequency;
