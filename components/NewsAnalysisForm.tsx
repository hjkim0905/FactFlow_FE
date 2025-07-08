"use client";

import { useState } from "react";
import type { SupportedAIModel } from "@/types/newAnalysis";

export default function NewsAnalysisForm({
	analyzeNews,
	loading,
	error,
	progress,
	clearError,
}: {
	analyzeNews: (url: string, model?: SupportedAIModel) => Promise<void>;
	loading: boolean;
	error: string | null;
	progress: { current: number; total: number; currentStep: string };
	clearError: () => void;
}) {
	const [url, setUrl] = useState("");
	const [selectedModel, setSelectedModel] =
		useState<SupportedAIModel>("gemini");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!url.trim()) {
			alert("뉴스 기사 URL을 입력해주세요.");
			return;
		}

		clearError();
		await analyzeNews(url.trim(), selectedModel);
	};

	const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(e.target.value);
		if (error) clearError();
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="text-center mb-8">
				<h1 className="text-4xl font-bold mb-4 text-black">
					📰 AI 뉴스 분석 도구
				</h1>
				<p className="text-lg text-black">
					뉴스 링크만 입력하면 AI가 자동으로 7가지 관점에서 종합 분석합니다
				</p>
			</div>

			<form onSubmit={handleSubmit} className="space-y-6">
				<div>
					<label
						htmlFor="url"
						className="block text-sm font-medium mb-2 text-black"
					>
						📎 뉴스 기사 URL
					</label>
					<input
						type="url"
						id="url"
						value={url}
						onChange={handleUrlChange}
						className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
						placeholder="https://news.example.com/article"
						required
						disabled={loading}
					/>
				</div>

				<div>
					<label className="block text-sm font-medium mb-3 text-black">
						🤖 사용할 AI 모델
					</label>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{(["gemini", "gpt", "claude"] as SupportedAIModel[]).map(
							(model) => (
								<label key={model} className="relative">
									<input
										type="radio"
										name="model"
										value={model}
										checked={selectedModel === model}
										onChange={(e) =>
											setSelectedModel(e.target.value as SupportedAIModel)
										}
										className="sr-only"
										disabled={loading}
									/>
									<div
										className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
											selectedModel === model
												? "border-blue-500 bg-blue-50"
												: "border-gray-300 hover:border-blue-300"
										}`}
									>
										<div className="text-center text-black">
											<div className="text-2xl mb-2 text-black">
												{model === "gemini"
													? "🟢"
													: model === "gpt"
														? "🔵"
														: "🟣"}
											</div>
											<div className="font-semibold capitalize text-black">
												{model}
											</div>
											<div className="text-sm text-black">
												{model === "gemini"
													? "무료/저렴"
													: model === "gpt"
														? "고성능/비쌈"
														: "균형잡힌 성능"}
											</div>
										</div>
									</div>
								</label>
							),
						)}
					</div>
				</div>

				<button
					type="submit"
					disabled={loading || !url.trim()}
					className="w-full bg-blue-600 text-black py-4 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
				>
					{loading ? (
						<div className="flex items-center justify-center gap-2 text-black">
							<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
							분석 중...
						</div>
					) : (
						"🚀 뉴스 분석 시작"
					)}
				</button>
			</form>

			{error && (
				<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
					<div className="flex items-start gap-3">
						<div className="text-red-500">❌</div>
						<div>
							<h3 className="font-semibold text-black">분석 오류</h3>
							<p className="text-black">{error}</p>
							<button
								type="button"
								onClick={clearError}
								className="mt-2 text-sm text-black hover:text-black underline"
							>
								오류 메시지 닫기
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
