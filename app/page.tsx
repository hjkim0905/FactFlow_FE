"use client";

import { useNewsAnalysis } from "@/lib/hooks/LangChain/util";
import NewsAnalysisForm from "@/components/NewsAnalysisForm";
import NewsAnalysisResults from "@/components/NewsAnalysisResult";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
	const {
		analyzeNews,
		loading,
		error,
		progress,
		clearError,
		result,
		clearResult,
	} = useNewsAnalysis();

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			{/* 상단바 */}
			<header
				className="bg-blue-600 text-white py-4 flex flex-col items-center cursor-pointer select-none"
				onClick={clearResult}
			>
				<h1 className="text-2xl font-bold tracking-wide">NEWSEE</h1>
				<span className="text-xs mt-1">뉴스를 빠르게, 쉽고, 다채롭게</span>
			</header>

			<main className="flex-1 flex flex-col items-center justify-start w-full">
				{/* 로딩 화면 */}
				{loading ? (
					<LoadingScreen progress={progress} />
				) : result ? (
					<div className="w-full max-w-2xl mx-auto">
						<NewsAnalysisResults result={result} />
					</div>
				) : (
					<div className="w-full max-w-md mx-auto">
						<NewsAnalysisForm
							analyzeNews={analyzeNews}
							loading={loading}
							error={error}
							progress={progress}
							clearError={clearError}
						/>
					</div>
				)}
			</main>
		</div>
	);
}
