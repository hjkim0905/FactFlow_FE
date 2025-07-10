"use client";
import { useNewsAnalysis } from "@/lib/hooks/LangChain/util";
import NewsAnalysisForm from "@/components/NewsAnalysisForm";
import NewsAnalysisResults from "@/components/NewsAnalysisResult";
import LoadingScreen from "@/components/LoadingScreen";
import { useState } from "react";

// 더미 데이터 정의
const dummyResult = {
	extracted_content: {
		publishDate: "2025.07.10 14:30",
		title: "국정감사 대상기관 선정 논란, 야당 반발 지속",
		content:
			"국정감사 대상기관 선정을 둘러싸고 여야 간 대립이 계속되고 있다...",
		author: "김현지 기자",
	},
	analysis: {
		title_rewrite: {
			rewritten_title: "국정감사 기관 선정 논란, 정치권 갈등 심화",
		},
		summary: {
			one_sentence:
				"국정감사 대상기관 선정을 둘러싸고 여야 간 치열한 공방이 벌어지고 있어 정치적 갈등이 심화되고 있다.",
			three_sentences: [
				"국정감사 대상기관 선정 과정에서 여야가 첨예하게 대립하고 있다.",
				"야당은 핵심 기관들이 감사 대상에서 제외되었다며 강력 반발하고 있다.",
				"이로 인해 국정감사 일정 자체가 지연될 가능성이 제기되고 있다.",
			],
			five_sentences: [
				"국정감사 대상기관 선정을 둘러싸고 여야 간 치열한 공방이 벌어지고 있다.",
				"야당은 핵심 기관들이 감사 대상에서 제외되었다며 강력 반발하고 있다.",
				"여당은 기존 관례에 따라 선정했다는 입장을 고수하고 있다.",
				"이로 인해 국정감사 일정 자체가 지연될 가능성이 제기되고 있다.",
				"정치권의 갈등이 국정 운영에 미치는 영향이 우려되는 상황이다.",
			],
		},
		difficulty: "중급",
		keywords: {
			high_importance: ["국정감사", "대상기관", "여야갈등"],
			medium_importance: ["정치권", "선정논란", "반발"],
			low_importance: ["일정지연", "관례", "운영"],
		},
		expression: {
			"percentage of objective statement": 65,
			"percentage of subjective statement": 35,
		},
		thinking_questions: {
			causal_questions: [
				"국정감사 대상기관 선정 논란이 발생한 근본적인 원인은 무엇인가?",
				"여야 간 이견이 이렇게 클 수밖에 없는 구조적 요인은 무엇인가?",
			],
			prediction_questions: [
				"이번 논란이 향후 국정감사 진행에 어떤 영향을 미칠 것인가?",
				"정치권 갈등이 국정 운영에 미치는 장기적 영향은 무엇인가?",
			],
			perspective_questions: [
				"국정감사 대상기관 선정 기준이 합리적인가?",
				"정치적 갈등 해결을 위한 대안은 무엇인가?",
			],
		},
		complementary_insight: {
			complementary_articles: [
				{
					title: "국정감사 제도의 역사와 변천사",
					source: "https://example.com/article1",
					summary: "국정감사 제도가 도입된 배경과 그간의 변화 과정을 살펴본다.",
					why_useful: "현재 논란의 역사적 맥락을 이해하는 데 도움이 된다.",
				},
				{
					title: "해외 의회 감사 제도 비교 분석",
					source: "https://example.com/article2",
					summary: "주요국의 의회 감사 제도와 우리나라의 차이점을 분석한다.",
					why_useful: "국정감사 제도 개선 방안 모색에 참고가 된다.",
				},
				{
					title: "정치권 갈등이 국정 운영에 미치는 영향",
					source: "https://example.com/article3",
					summary: "정치적 대립이 국정 전반에 미치는 부정적 영향을 분석한다.",
					why_useful: "현재 상황의 파급효과를 예측하는 데 도움이 된다.",
				},
			],
		},
	},
};

export default function Home() {
	const { analyzeNews, loading, error, progress, result, clearResult } =
		useNewsAnalysis();
	const [url, setUrl] = useState("");
	const [showDummy, setShowDummy] = useState(false); // 더미 데이터 표시 상태

	// URL 변경 처리
	const handleUrlChange = (value: string | ((prev: string) => string)) => {
		const newUrl = typeof value === "function" ? value(url) : value;
		setUrl(newUrl);
		if (newUrl?.startsWith("http") && !loading) {
			console.log("analyzeNews 호출:", newUrl);
			analyzeNews(newUrl);
		}
	};

	// URL 붙여넣으면 자동 분석
	const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData("Text");
		handleUrlChange(pasted);
	};

	// 더미 데이터 표시 토글
	const toggleDummyData = () => {
		setShowDummy(!showDummy);
		if (!showDummy) {
			clearResult(); // 실제 결과 초기화
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* 상단바 */}
			<main className="flex-1 flex flex-col items-center justify-start w-full">
				{/* 로딩 화면 */}
				{loading ? (
					<LoadingScreen clearResult={clearResult} progress={progress} />
				) : showDummy || result ? (
					<div className="w-full max-w-2xl mx-auto">
						<NewsAnalysisResults
							result={showDummy ? dummyResult : result}
							url={url}
							setUrl={handleUrlChange}
							analyzeNews={analyzeNews}
							handlePaste={handlePaste}
							loading={loading}
							clearResult={() => {
								clearResult();
								setShowDummy(false);
							}}
						/>
					</div>
				) : (
					<div className="w-full max-w-md mx-auto">
						<NewsAnalysisForm
							clearResult={clearResult}
							analyzeNews={analyzeNews}
							loading={loading}
							error={error}
							url={url}
							setUrl={handleUrlChange}
							handlePaste={handlePaste}
						/>
					</div>
				)}
			</main>
		</div>
	);
}
