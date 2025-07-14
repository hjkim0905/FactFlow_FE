// /lib/langchains/utils/fetchSimilarNews.ts
import axios from 'axios';
import type { NewsItem, ProcessedNews } from '@/types/newsAnalysisResponse';

export async function fetchSimilarNews(summary: string, keywords: string[], count = 50): Promise<ProcessedNews[]> {
    const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
    const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;

    if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
        console.warn('⚠️ NAVER API 인증 정보가 설정되지 않았습니다. 빈 배열을 반환합니다.');
        return [];
    }

    const query = (keywords.length > 0 ? keywords.join(' ') : summary).trim();

    if (!query) {
        throw new Error('검색어(query)가 비어있습니다.');
    }

    const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(
        query
    )}&display=${count}&sort=sim`;

    console.log('📡 네이버 뉴스 검색 요청:', query);

    try {
        const response = await axios.get(url, {
            headers: {
                'X-Naver-Client-Id': NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
            },
        });

        if (response.status !== 200) {
            console.error('❌ 응답 오류:', response.status, response.statusText);
            throw new Error(`네이버 API 응답 실패: ${response.statusText}`);
        }

        const items: NewsItem[] = response.data?.items;
        if (!items || !Array.isArray(items)) {
            console.warn('⚠️ 유효하지 않은 응답 형식:', response.data);
            return [];
        }

        console.log('✅ 네이버 응답 수신:', items.length, '건');

        return items.map((item) => ({
            title: cleanTextForJson(item.title),
            url: item.originallink , // originallink가 없으면 link 사용
            summary: cleanTextForJson(item.description),
        }));
    } catch (error: unknown) {
        console.error('❌ 네이버 뉴스 fetch 실패:', (error as Error).message);
        throw new Error(`뉴스 검색 중 오류 발생: ${(error as Error).message}`);
    }
}

/**
 * JSON 파싱 문제를 방지하기 위해 텍스트를 정리하는 함수
 * @param text 정리할 텍스트
 * @returns 정리된 텍스트
 */
function cleanTextForJson(text: string): string {
    if (!text) return '';

    return text
        // 1. HTML 태그 제거
        .replace(/<[^>]+>/g, '')
        // 2. HTML 엔티티 디코딩
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ')
        // 3. 쌍따옴표를 작은따옴표로 변환
        .replace(/"/g, "'")
        // 4. 연속된 공백 정리
        .replace(/\s+/g, ' ')
        // 5. 앞뒤 공백 제거
        .trim()
        // 6. 특수 문자 추가 정리 (JSON 파싱에 문제가 될 수 있는 것들)
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // 제어 문자 제거
        // 7. 백슬래시 처리 (JSON에서 문제가 될 수 있음)
        .replace(/\\/g, '\\\\');
}

/**
 * 추가 안전장치: ProcessedNews 배열을 검증하고 문제가 있는 항목을 필터링
 * @param newsArray 검증할 뉴스 배열
 * @returns 검증된 뉴스 배열
 */
export function validateProcessedNews(newsArray: ProcessedNews[]): ProcessedNews[] {
    return newsArray.filter((news, index) => {
        // 필수 필드 검증
        if (!news.title || !news.url || !news.summary) {
            console.warn(`⚠️ 유효하지 않은 뉴스 항목 [${index}]:`, news);
            return false;
        }

        // 텍스트 길이 검증 (너무 짧거나 긴 경우 필터링)
        if (news.title.length < 5 || news.title.length > 200) {
            console.warn(`⚠️ 제목 길이가 부적절한 뉴스 항목 [${index}]:`, news.title.length);
            return false;
        }

        if (news.summary.length < 10 || news.summary.length > 500) {
            console.warn(`⚠️ 요약 길이가 부적절한 뉴스 항목 [${index}]:`, news.summary.length);
            return false;
        }

        // URL 유효성 검증
        try {
            new URL(news.url);
        } catch {
            console.warn(`⚠️ 유효하지 않은 URL [${index}]:`, news.url);
            return false;
        }

        return true;
    });
}

/**
 * 개선된 fetchSimilarNews - 검증 로직 포함
 */
export async function fetchSimilarNewsWithValidation(
    summary: string,
    keywords: string[],
    count = 50
): Promise<ProcessedNews[]> {
    try {
        const rawNews = await fetchSimilarNews(summary, keywords, count);
        const validatedNews = validateProcessedNews(rawNews);

        console.log(`✅ 검증 완료: ${rawNews.length}건 중 ${validatedNews.length}건 유효`);

        return validatedNews;
    } catch (error) {
        console.error('❌ fetchSimilarNewsWithValidation 실패:', error);
        return [];
    }
}