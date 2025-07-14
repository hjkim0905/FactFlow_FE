import { RunnableSequence } from '@langchain/core/runnables';
import { PromptTemplate } from '@langchain/core/prompts';
import { BaseAnalysisChain } from './baseAnalysisChain';

// 📌 기사 타입 정의
type ProcessedNews = {
    title: string;
    url: string;
    summary: string;
};

export class ComplementaryInsightChain extends BaseAnalysisChain {
    protected buildChain(): RunnableSequence {
        const prompt = PromptTemplate.fromTemplate(`
다음은 하나의 뉴스 주제와 관련된 여러 기사입니다. 
이 중에서 직접적으로 유사한 사건은 아니더라도,
- 이슈의 배경을 잘 설명하거나
- 대안적/반대적 관점을 제공하거나
- 사건을 더 깊이 이해하는 데 도움이 되는
보완적 기사들을 선별해 주세요.

각 기사는 아래 형식의 JSON 배열로 정리해 주세요.
각 항목에는 추천 이유, 간단한 요약, 기사 링크가 포함되어야 합니다.
추천 이유와 요약은 15자 이내여야합니다.

**중요한 JSON 작성 규칙:**
- 문자열 내부에는 쌍따옴표(")를 사용하지 마세요. 모든 인용부호는 작은따옴표(')를 사용하세요
- 마지막 객체나 배열 항목 뒤에 쉼표(,)를 붙이지 마세요
- 모든 문자열은 쌍따옴표로 감싸야 합니다
- JSON 코드 블록(\`\`\`json) 없이 순수 JSON만 출력하세요

출력 형식:
{{
  "complementary_articles": [
    {{
      "icon":"제목에 알맞는 아이콘",
      "title": "기사 제목 (작은따옴표만 사용)",
      "why_useful": "보완적 유용성 설명",
      "summary": "해당 기사 요약",
      "source": "기사 링크",
      "publisher": "발행자"
    }}
  ],
  "insight": "전체적인 이슈 이해를 위한 시사점"
}}

기사 목록:
{articles}

핵심 키워드:
{keywords}
    `);

        return RunnableSequence.from([prompt, this.model, this.outputParser]);
    }

    private decodeHtmlEntities(str: string): string {
        return str
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&amp;/g, '&');
    }

    protected parseResult(result: string): unknown {
        try {
            // 1. HTML 엔티티(&quot;) 디코딩 처리
            const decodedResult = this.decodeHtmlEntities(result);

            // 2. 디버깅 로그
            console.log('🔍 [ComplementaryInsight] 원본 결과:', result.substring(0, 200) + '...');
            console.log('✅ [ComplementaryInsight] 디코딩된 결과:', decodedResult.substring(0, 200) + '...');

            // 3. ComplementaryInsight 특화 전처리
            const preprocessed = this.preprocessForComplementaryInsight(decodedResult);

            // 4. BaseAnalysisChain의 기본 JSON 파싱 사용
            const parsed = this.parseJsonSafely(preprocessed);

            // 5. ComplementaryInsight 특화 검증
            if (this.isValidComplementaryInsight(parsed)) {
                console.log('✅ [ComplementaryInsight] JSON 파싱 및 검증 성공');
                return parsed;
            } else {
                console.warn('⚠️ [ComplementaryInsight] 파싱된 JSON이 유효하지 않음, 수동 파싱 시도');
                throw new Error('ComplementaryInsight 구조가 올바르지 않습니다');
            }
        } catch (error) {
            console.error('❌ [ComplementaryInsight] 기본 파싱 실패:', error);

            // 6. 수동 파싱 시도
            const manualParsed = this.tryManualParsing(result);
            if (manualParsed) {
                console.log('✅ [ComplementaryInsight] 수동 파싱 성공');
                return manualParsed;
            }

            // 7. 최종 실패 시 오류 던지기 (재시도를 위해)
            console.error('❌ [ComplementaryInsight] 모든 파싱 시도 실패');
            throw new Error(`ComplementaryInsight JSON 파싱 최종 실패: ${(error as Error).message}`);
        }
    }

    private preprocessForComplementaryInsight(jsonStr: string): string {
        try {
            let processed = jsonStr;

            // ComplementaryInsight 특화 따옴표 처리
            processed = this.fixQuotesForComplementary(processed);

            return processed;
        } catch (error) {
            console.warn('⚠️ [ComplementaryInsight] 전처리 실패:', error);
            return jsonStr;
        }
    }

    private isValidComplementaryInsight(result: unknown): boolean {
        if (!result || typeof result !== 'object') {
            console.warn('⚠️ [ComplementaryInsight] 결과가 객체가 아님:', typeof result);
            return false;
        }

        const insight = result as Record<string, unknown>;

        // 필수 필드 검증
        if (!insight.hasOwnProperty('complementary_articles') || !insight.hasOwnProperty('insight')) {
            console.warn('⚠️ [ComplementaryInsight] 필수 필드 누락:', Object.keys(insight));
            return false;
        }

        // complementary_articles가 배열인지 확인
        if (!Array.isArray(insight.complementary_articles)) {
            console.warn(
                '⚠️ [ComplementaryInsight] complementary_articles가 배열이 아님:',
                typeof insight.complementary_articles
            );
            return false;
        }

        // insight가 문자열인지 확인
        if (typeof insight.insight !== 'string') {
            console.warn('⚠️ [ComplementaryInsight] insight가 문자열이 아님:', typeof insight.insight);
            return false;
        }

        // 배열 내부 구조 검증 (기본적인 검증만)
        const articles = insight.complementary_articles as unknown[];
        for (let i = 0; i < Math.min(articles.length, 3); i++) {
            const article = articles[i];
            if (!this.isValidComplementaryArticle(article)) {
                console.warn(`⚠️ [ComplementaryInsight] 유효하지 않은 기사 구조 [${i}]:`, article);
                return false;
            }
        }

        console.log('✅ [ComplementaryInsight] 구조 검증 통과');
        return true;
    }

    private isValidComplementaryArticle(article: unknown): boolean {
        if (!article || typeof article !== 'object') {
            return false;
        }

        const art = article as Record<string, unknown>;

        // 필수 필드들 검증 (일부만 체크)
        const requiredFields = ['title', 'summary', 'why_useful'];
        for (const field of requiredFields) {
            if (!art.hasOwnProperty(field) || typeof art[field] !== 'string') {
                return false;
            }
        }

        return true;
    }

    private tryManualParsing(result: string): unknown | null {
        try {
            console.log('🔧 [ComplementaryInsight] 수동 파싱 시도 중...');

            // 1. HTML 디코딩
            let cleaned = this.decodeHtmlEntities(result);

            // 2. 기본 정리
            cleaned = cleaned
                .trim()
                .replace(/^```json\s*/i, '')
                .replace(/```$/i, '')
                .replace(/\\(\r?\n|\n)/g, '');

            // 3. JSON 구조 찾기
            const jsonStart = cleaned.indexOf('{');
            const jsonEnd = cleaned.lastIndexOf('}');

            if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
                console.warn('⚠️ [ComplementaryInsight] JSON 구조를 찾을 수 없음');
                return null;
            }

            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);

            // 4. ComplementaryInsight 특화 따옴표 처리
            cleaned = this.fixQuotesForComplementary(cleaned);

            // 5. JSON 구조 수정 (BaseAnalysisChain의 메서드 활용)
            // validateAndFixJsonStructure는 BaseAnalysisChain에서 처리됨

            console.log('🔧 [ComplementaryInsight] 수동 정리된 JSON:', cleaned.substring(0, 300) + '...');

            // 6. 파싱 시도
            const parsed = JSON.parse(cleaned);

            if (this.isValidComplementaryInsight(parsed)) {
                console.log('✅ [ComplementaryInsight] 수동 파싱 성공');
                return parsed;
            }

            console.warn('⚠️ [ComplementaryInsight] 수동 파싱 후 검증 실패');
            return null;
        } catch (error) {
            console.warn('⚠️ [ComplementaryInsight] 수동 파싱 실패:', error);
            return null;
        }
    }

    private fixQuotesForComplementary(jsonStr: string): string {
        try {
            let fixed = jsonStr;

            // ComplementaryInsight 특화 패턴들
            const patterns = [
                // 주요 필드들에 대한 패턴
                /("(?:title|summary|why_useful|insight|icon|source|publisher)"\s*:\s*")([^"]*(?:\\"[^"]*)*?)("(?:\s*[,}]\s*))/g,
            ];

            for (const pattern of patterns) {
                fixed = fixed.replace(pattern, (match, prefix, content, suffix) => {
                    // 이미 올바르게 이스케이프된 경우 건너뛰기
                    if (content.includes('\\"') && !content.includes('"')) {
                        return match;
                    }

                    const escapedContent = content
                        // 먼저 이미 이스케이프된 따옴표를 보호
                        .replace(/\\"/g, '___ESCAPED_QUOTE___')
                        // 이스케이프되지 않은 따옴표를 이스케이프
                        .replace(/"/g, '\\"')
                        // 보호된 이스케이프 따옴표를 복원
                        .replace(/___ESCAPED_QUOTE___/g, '\\"');

                    return prefix + escapedContent + suffix;
                });
            }

            return fixed;
        } catch (error) {
            console.warn('⚠️ [ComplementaryInsight] fixQuotesForComplementary 실패:', error);
            return jsonStr;
        }
    }

    // ✅ 실행 함수: ProcessedNews[]를 받아 article 목록 텍스트 구성 (기존 인터페이스 유지)
    async run(input: { articles: ProcessedNews[]; keywords: string[] }): Promise<unknown> {
        console.log('🔍 ComplementaryInsightChain 입력 확인:');
        console.log('📊 articles 길이:', input.articles.length);
        console.log('📊 keywords 길이:', input.keywords.length);

        if (input.articles.length === 0 || input.keywords.length === 0) {
            console.log('⚠️ articles 또는 keywords가 비어있어 기본값 반환');
            return {
                complementary_articles: [],
                insight: '관련 기사나 키워드가 없어 보완 분석을 제공할 수 없습니다.',
            };
        }

        const articleList =
            input.articles && input.articles.length > 0
                ? input.articles.map((a, i) => `${i + 1}. ${a.title}\n요약: ${a.summary}\n링크: ${a.url}`).join('\n\n')
                : '없음';

        console.log('📝 articleList 길이:', articleList.length);
        console.log('📝 keywords 문자열:', input.keywords.join(', '));

        try {
            const result = await this.chain.invoke({
                articles: articleList || '없음',
                keywords: input.keywords && input.keywords.length > 0 ? input.keywords.join(', ') : '없음',
            });

            console.log('🔍 [ComplementaryInsight] Chain 실행 완료, parseResult 호출');
            return this.parseResult(result);
        } catch (error: unknown) {
            console.error(`❌ [ComplementaryInsight] 실행 오류:`, error);

            // 오류를 다시 던져서 상위의 executeWithRetry에서 재시도할 수 있도록 함
            throw error;
        }
    }
}
