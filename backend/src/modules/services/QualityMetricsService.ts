import { QualityMetrics, LLMResponse } from '../../types';

export class QualityMetricsService {
    /**
     * Calculate comprehensive quality metrics for an LLM response
     */
    static calculateMetrics(response: LLMResponse): QualityMetrics {
        const text = response.text;

        // Basic text analysis
        const sentences = this.splitIntoSentences(text);
        const words = this.splitIntoWords(text);
        const wordCount = words.length;
        const sentenceCount = sentences.length;

        // Calculate individual scores
        const coherenceScore = this.calculateCoherenceScore(text, sentences);
        const completenessScore = this.calculateCompletenessScore(text, sentences);
        const lengthScore = this.calculateLengthScore(wordCount, sentenceCount);
        const structureScore = this.calculateStructureScore(text, sentences);

        // Calculate overall score (weighted average)
        const overallScore = (
            coherenceScore * 0.3 +
            completenessScore * 0.3 +
            lengthScore * 0.2 +
            structureScore * 0.2
        );

        return {
            coherence_score: Math.round(coherenceScore * 100) / 100,
            completeness_score: Math.round(completenessScore * 100) / 100,
            length_score: Math.round(lengthScore * 100) / 100,
            structure_score: Math.round(structureScore * 100) / 100,
            overall_score: Math.round(overallScore * 100) / 100,
            details: {
                sentence_count: sentenceCount,
                word_count: wordCount,
                avg_sentence_length: sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 100) / 100 : 0,
                readability_score: this.calculateReadabilityScore(text),
                repetition_score: this.calculateRepetitionScore(words),
                question_count: this.countQuestions(text),
                exclamation_count: this.countExclamations(text),
            }
        };
    }

    /**
     * Calculate coherence score based on sentence flow and logical structure
     */
    private static calculateCoherenceScore(text: string, sentences: string[]): number {
        if (sentences.length === 0) return 0;

        let score = 0.5; // Base score

        // Check for transition words and phrases
        const transitionWords = [
            'however', 'therefore', 'furthermore', 'moreover', 'additionally',
            'consequently', 'meanwhile', 'nevertheless', 'similarly', 'likewise',
            'first', 'second', 'third', 'finally', 'in conclusion', 'to summarize'
        ];

        const transitionCount = transitionWords.reduce((count, word) => {
            return count + (text.toLowerCase().includes(word) ? 1 : 0);
        }, 0);

        // Bonus for good transitions
        score += Math.min(transitionCount * 0.1, 0.3);

        // Check for logical connectors
        const connectors = ['because', 'since', 'as', 'due to', 'as a result', 'thus'];
        const connectorCount = connectors.reduce((count, connector) => {
            return count + (text.toLowerCase().includes(connector) ? 1 : 0);
        }, 0);

        score += Math.min(connectorCount * 0.05, 0.2);

        return Math.min(score, 1.0);
    }

    /**
     * Calculate completeness score based on response structure and content depth
     */
    private static calculateCompletenessScore(text: string, sentences: string[]): number {
        if (sentences.length === 0) return 0;

        let score = 0.3; // Base score

        // Check for introduction/opening
        const hasIntroduction = sentences[0].length > 20 &&
            (sentences[0].includes('introduction') ||
                sentences[0].includes('overview') ||
                sentences[0].includes('let me') ||
                sentences[0].includes('i will'));

        if (hasIntroduction) score += 0.2;

        // Check for conclusion/summary
        const lastSentence = sentences[sentences.length - 1];
        const hasConclusion = lastSentence.length > 15 &&
            (lastSentence.includes('conclusion') ||
                lastSentence.includes('summary') ||
                lastSentence.includes('in summary') ||
                lastSentence.includes('to conclude'));

        if (hasConclusion) score += 0.2;

        // Check for detailed explanations (multiple sentences)
        if (sentences.length >= 3) score += 0.2;
        if (sentences.length >= 5) score += 0.1;

        // Check for examples or specific details
        const hasExamples = text.includes('example') ||
            text.includes('for instance') ||
            text.includes('such as') ||
            text.includes('specifically');

        if (hasExamples) score += 0.1;

        return Math.min(score, 1.0);
    }

    /**
     * Calculate length appropriateness score
     */
    private static calculateLengthScore(wordCount: number, sentenceCount: number): number {
        // Optimal range: 50-500 words, 3-20 sentences
        const optimalWordMin = 50;
        const optimalWordMax = 500;
        const optimalSentenceMin = 3;
        const optimalSentenceMax = 20;

        let wordScore = 1.0;
        let sentenceScore = 1.0;

        // Word count scoring
        if (wordCount < optimalWordMin) {
            wordScore = wordCount / optimalWordMin;
        } else if (wordCount > optimalWordMax) {
            wordScore = Math.max(0.3, optimalWordMax / wordCount);
        }

        // Sentence count scoring
        if (sentenceCount < optimalSentenceMin) {
            sentenceScore = sentenceCount / optimalSentenceMin;
        } else if (sentenceCount > optimalSentenceMax) {
            sentenceScore = Math.max(0.3, optimalSentenceMax / sentenceCount);
        }

        return (wordScore + sentenceScore) / 2;
    }

    /**
     * Calculate structure score based on formatting and organization
     */
    private static calculateStructureScore(text: string, sentences: string[]): number {
        let score = 0.4; // Base score

        // Check for paragraph breaks (double newlines)
        const paragraphCount = (text.match(/\n\s*\n/g) || []).length;
        if (paragraphCount > 0) score += 0.2;

        // Check for lists or bullet points
        const hasLists = text.includes('•') ||
            text.includes('- ') ||
            text.includes('1.') ||
            text.includes('* ');
        if (hasLists) score += 0.2;

        // Check for proper capitalization
        const properCapitalization = sentences.filter(sentence =>
            sentence.length > 0 && sentence[0] === sentence[0].toUpperCase()
        ).length / sentences.length;

        score += properCapitalization * 0.2;

        return Math.min(score, 1.0);
    }

    /**
     * Calculate readability score using simplified Flesch Reading Ease
     */
    private static calculateReadabilityScore(text: string): number {
        const sentences = this.splitIntoSentences(text);
        const words = this.splitIntoWords(text);

        if (sentences.length === 0 || words.length === 0) return 0;

        const avgWordsPerSentence = words.length / sentences.length;
        const syllables = words.reduce((total, word) => total + this.countSyllables(word), 0);
        const avgSyllablesPerWord = syllables / words.length;

        // Simplified Flesch Reading Ease formula
        const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);

        // Normalize to 0-100 scale
        return Math.max(0, Math.min(100, score));
    }

    /**
     * Calculate repetition score (lower is better)
     */
    private static calculateRepetitionScore(words: string[]): number {
        if (words.length === 0) return 0;

        const wordFreq: { [key: string]: number } = {};
        words.forEach(word => {
            const normalized = word.toLowerCase();
            wordFreq[normalized] = (wordFreq[normalized] || 0) + 1;
        });

        const uniqueWords = Object.keys(wordFreq).length;
        const repetitionRatio = uniqueWords / words.length;

        // Convert to score where higher is better
        return repetitionRatio;
    }

    /**
     * Count question marks in text
     */
    private static countQuestions(text: string): number {
        return (text.match(/\?/g) || []).length;
    }

    /**
     * Count exclamation marks in text
     */
    private static countExclamations(text: string): number {
        return (text.match(/!/g) || []).length;
    }

    /**
     * Split text into sentences
     */
    private static splitIntoSentences(text: string): string[] {
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }

    /**
     * Split text into words
     */
    private static splitIntoWords(text: string): string[] {
        return text
            .toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 0);
    }

    /**
     * Count syllables in a word (approximation)
     */
    private static countSyllables(word: string): number {
        const vowels = 'aeiouy';
        let count = 0;
        let previousWasVowel = false;

        for (let i = 0; i < word.length; i++) {
            const isVowel = vowels.includes(word[i]);
            if (isVowel && !previousWasVowel) {
                count++;
            }
            previousWasVowel = isVowel;
        }

        // Handle silent 'e'
        if (word.endsWith('e') && count > 1) {
            count--;
        }

        return Math.max(1, count);
    }
}
