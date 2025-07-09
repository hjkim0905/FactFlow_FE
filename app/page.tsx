"use client";

import NewsAnalysisForm from "@/components/NewsAnalysisForm";
import NewsAnalysisResults from "@/components/NewsAnalysisResult";
import { useNewsAnalysis } from "@/lib/hooks/LangChain/util";

export default function Home() {
	const { analyzeNews, loading, error, progress, clearError, result } =
		useNewsAnalysis();
	console.log(result);

	return (
		<main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
			<div className="container mx-auto py-8 px-4">
				<NewsAnalysisForm
					analyzeNews={analyzeNews}
					loading={loading}
					error={error}
					progress={progress}
					clearError={clearError}
				/>

				{result && (
					<div className="mt-16">
						<NewsAnalysisResults result={result} />
					</div>
				)}
			</div>
		</main>
	);
}
