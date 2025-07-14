import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { RunnableSequence } from '@langchain/core/runnables';

export abstract class BaseAnalysisChain {
    protected model: BaseChatModel;
    protected outputParser: StringOutputParser;
    protected chain: RunnableSequence;

    constructor(model: BaseChatModel) {
        this.model = model;
        this.outputParser = new StringOutputParser();
        this.chain = this.buildChain();
    }

    protected abstract buildChain(): RunnableSequence;

    protected parseJsonSafely(jsonString: string): unknown {
        try {
            // 1. 기본 정리
            let cleaned = jsonString.trim();

            // 원본 문자열 로깅 (디버깅용)
            console.log(`🔍 [${this.constructor.name}] 원본 JSON:`, jsonString.substring(0, 200) + '...');

            // 2. 코드 블록 제거
            cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/i, '');

            // 3. 개행 문자 정리
            cleaned = cleaned.replace(/\\(\r?\n|\n)/g, '');

            // 4. 중첩된 따옴표 처리 (개선된 버전)
            cleaned = this.fixNestedQuotes(cleaned);

            // 5. JSON 구조 검증 및 수정
            cleaned = this.validateAndFixJsonStructure(cleaned);

            console.log(`🔧 [${this.constructor.name}] 정리된 JSON:`, cleaned.substring(0, 200) + '...');

            // 6. JSON 파싱
            const parsed = JSON.parse(cleaned);

            // 7. 유효성 검사
            if (this.isValidJsonResult(parsed)) {
                console.log(`✅ [${this.constructor.name}] JSON 파싱 성공`);
                return parsed;
            } else {
                console.warn(`⚠️ [${this.constructor.name}] 파싱된 JSON이 유효하지 않음:`, parsed);
                throw new Error('Invalid JSON structure');
            }
        } catch (error) {
            console.error(`❌ [${this.constructor.name}] JSON 파싱 실패:`, error);
            console.error('원본 문자열:', jsonString);
            console.error('정리된 문자열:', jsonString.replace(/^```json\s*/i, '').replace(/```$/i, ''));

            // 오류 발생 시 예외를 던져서 재시도 로직이 작동하도록 함
            throw new Error(`JSON 파싱 실패: ${(error as Error).message}`);
        }
    }

    private validateAndFixJsonStructure(jsonStr: string): string {
        try {
            // 1. 기본 구조 검증
            if (!jsonStr.includes('{') || !jsonStr.includes('}')) {
                throw new Error('JSON 구조가 올바르지 않습니다');
            }

            // 2. 닫히지 않은 괄호 처리
            const openBraces = (jsonStr.match(/\{/g) || []).length;
            const closeBraces = (jsonStr.match(/\}/g) || []).length;

            if (openBraces > closeBraces) {
                // 부족한 만큼 닫는 괄호 추가
                jsonStr += '}'.repeat(openBraces - closeBraces);
            }

            // 3. 마지막 콤마 제거
            jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

            // 4. 잘못된 JSON 구조 수정
            jsonStr = jsonStr.replace(/}\s*{/g, '},{');

            return jsonStr;
        } catch (error) {
            console.warn('⚠️ validateAndFixJsonStructure 실패:', error);
            return jsonStr;
        }
    }

    private fixNestedQuotes(jsonStr: string): string {
        try {
            let fixed = jsonStr;

            // 더 포괄적인 필드 패턴 매칭
            const fieldPattern =
                /("(?:title|why_useful|summary|source|publisher|insight|icon|change_reason|original_title|category|authors|rewritten_title|text|keyword|expression|question|analysis|description|content)"\s*:\s*")([^"]*(?:\\"[^"]*)*?)("(?:\s*[,}]\s*))/g;

            fixed = fixed.replace(fieldPattern, (match, prefix, content, suffix) => {
                const escapedContent = content
                    // 먼저 이미 이스케이프된 따옴표를 임시로 보호
                    .replace(/\\"/g, '___ESCAPED_QUOTE___')
                    // 이스케이프되지 않은 따옴표를 이스케이프
                    .replace(/"/g, '\\"')
                    // 보호된 이스케이프 따옴표를 복원
                    .replace(/___ESCAPED_QUOTE___/g, '\\"');

                return prefix + escapedContent + suffix;
            });

            // 배열 내부의 문자열 처리
            const arrayStringPattern = /(\[\s*")([^"]*(?:\\"[^"]*)*?)("(?:\s*[,\]]))/g;
            fixed = fixed.replace(arrayStringPattern, (match, prefix, content, suffix) => {
                const escapedContent = content
                    .replace(/\\"/g, '___ESCAPED_QUOTE___')
                    .replace(/"/g, '\\"')
                    .replace(/___ESCAPED_QUOTE___/g, '\\"');
                return prefix + escapedContent + suffix;
            });

            return fixed;
        } catch (error) {
            console.warn('⚠️ fixNestedQuotes 실패:', error);
            return jsonStr;
        }
    }

    private isValidJsonResult(result: unknown): boolean {
        if (result === null || result === undefined) {
            return false;
        }

        if (typeof result === 'object') {
            // 빈 객체 체크
            if (Object.keys(result as object).length === 0) {
                return false;
            }
        }

        return true;
    }

    async invoke(input: { content: string; title?: string }): Promise<unknown> {
        try {
            const result = await this.chain.invoke(input);
            return this.parseResult(result);
        } catch (error: unknown) {
            console.error(`${this.constructor.name} 실행 오류:`, error);
            throw error; // 오류를 다시 던져서 재시도가 가능하도록 함
        }
    }

    protected parseResult(result: string): unknown {
        return this.parseJsonSafely(result);
    }
}
