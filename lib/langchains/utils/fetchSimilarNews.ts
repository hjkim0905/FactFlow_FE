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
        //console.log("items", items);
        return items.map((item) => ({
            title: item.title.replace(/<[^>]+>/g, ''),
            url: item.originallink,
            summary: item.description.replace(/<[^>]+>/g, ''),
            //similarityScore: Math.random(), // 추후 LLM 기반 개선 예정
        }));
    } catch (error: unknown) {
        console.error('❌ 네이버 뉴스 fetch 실패:', (error as Error).message);
        throw new Error(`뉴스 검색 중 오류 발생: ${(error as Error).message}`);
    }
}
