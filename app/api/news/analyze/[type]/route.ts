import { type NextRequest, NextResponse } from 'next/server';
import { NewsAnalysisService } from '@/lib/langchains/service/newsAnalysisService';

export async function POST(request: NextRequest, { params }: { params: { type: string } }) {
    try {
        const { type } = params;
        const { content, title, model } = await request.json();

        if (!content) {
            return NextResponse.json(
                {
                    success: false,
                    error: '뉴스 내용이 필요합니다.',
                    code: 'NO_CONTENT',
                },
                { status: 400 }
            );
        }

        const supportedTypes = ['title', 'summary', 'keywords', 'difficulty', 'expression', 'questions', 'historical'];
        if (!supportedTypes.includes(type)) {
            return NextResponse.json(
                {
                    success: false,
                    error: `지원하지 않는 분석 타입: ${type}`,
                    code: 'INVALID_TYPE',
                    supported_types: supportedTypes,
                },
                { status: 400 }
            );
        }

        const analysisService = new NewsAnalysisService(model);
        const result = await analysisService.runSingleAnalysis(type, content, title);

        return NextResponse.json({
            success: true,
            analysis_type: type,
            data: result,
        });
    } catch (error: unknown) {
        console.error(`❌ ${params.type} 분석 오류:`, error);

        return NextResponse.json(
            {
                success: false,
                analysis_type: params.type,
                error: error instanceof Error ? error.message : '분석 중 오류가 발생했습니다.',
                code: 'ANALYSIS_ERROR',
            },
            { status: 500 }
        );
    }
}
