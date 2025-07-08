"use client";

import { useState, useCallback } from "react";
import type {
	NewsAnalysisResponse,
	SupportedAIModel,
} from "@/types/newAnalysis";

interface UseNewsAnalysisReturn {
	analyzeNews: (url: string, model?: SupportedAIModel) => Promise<void>;
	result: NewsAnalysisResponse | null;
	loading: boolean;
	error: string | null;
	progress: {
		current: number;
		total: number;
		currentStep: string;
	};
	clearResult: () => void;
	clearError: () => void;
}

export const useNewsAnalysis = (): UseNewsAnalysisReturn => {
	const [result, setResult] = useState<NewsAnalysisResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [progress, setProgress] = useState({
		current: 0,
		total: 7,
		currentStep: "",
	});

	const analyzeNews = useCallback(
		async (url: string, model?: SupportedAIModel) => {
			try {
				setLoading(true);
				setError(null);
				setResult(null);
				setProgress({ current: 0, total: 7, currentStep: "분석 준비 중..." });

				if (!url.trim()) {
					throw new Error("URL을 입력해주세요.");
				}

				try {
					new URL(url);
				} catch {
					throw new Error("올바른 URL 형식이 아닙니다.");
				}

				setProgress({
					current: 1,
					total: 7,
					currentStep: "웹페이지 내용 추출 중...",
				});

				const response = await fetch("/api/news/analyze", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ url, model }),
				});

				setProgress({
					current: 5,
					total: 7,
					currentStep: "분석 결과 처리 중...",
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(
						errorData.error ||
							`HTTP ${response.status}: 분석 요청이 실패했습니다.`,
					);
				}

				const data = await response.json();

				if (data.success) {
					setResult(data.data);
					setProgress({ current: 7, total: 7, currentStep: "분석 완료!" });
				} else {
					throw new Error(data.error || "분석 중 오류가 발생했습니다.");
				}
			} catch (err: any) {
				const errorMessage =
					err instanceof Error
						? err.message
						: "알 수 없는 오류가 발생했습니다.";
				setError(errorMessage);
				console.error("뉴스 분석 오류:", err);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const clearResult = useCallback(() => {
		setResult(null);
		setProgress({ current: 0, total: 7, currentStep: "" });
	}, []);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	return {
		analyzeNews,
		result,
		loading,
		error,
		progress,
		clearResult,
		clearError,
	};
};
