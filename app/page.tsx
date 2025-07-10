"use client";

import { useNewsAnalysis } from "@/lib/hooks/LangChain/util";
import NewsAnalysisForm from "@/components/NewsAnalysisForm";
import NewsAnalysisResults from "@/components/NewsAnalysisResult";
import LoadingScreen from "@/components/LoadingScreen";
import { useState } from "react";

export default function Home() {
	const { analyzeNews, loading, error, progress, result, clearResult } =
		useNewsAnalysis();

	const [url, setUrl] = useState("");

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

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* 상단바 */}

			<main className="flex-1 flex flex-col items-center justify-start w-full">
				{/* 로딩 화면 */}
				{loading ? (
					<LoadingScreen clearResult={clearResult} progress={progress} />
				) : result ? (
					<div className="w-full max-w-2xl mx-auto">
						<NewsAnalysisResults
							result={result}
							url={url}
							setUrl={handleUrlChange}
							analyzeNews={analyzeNews}
							handlePaste={handlePaste}
							loading={loading}
							clearResult={clearResult}
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
