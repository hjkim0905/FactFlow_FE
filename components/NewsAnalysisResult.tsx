"use client";

import type { NewsAnalysisResponse } from "@/types/newAnalysis";
import type { Dispatch, SetStateAction } from "react";
import vector from "@/public/Vector.svg";
import Image from "next/image";
import vectorimage from "@/public/resultvector.svg";

interface Props {
	result: NewsAnalysisResponse;
	url: string;
	analyzeNews: (url: string) => Promise<void>;
	setUrl: Dispatch<SetStateAction<string>>;
	handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => Promise<void>;
	loading: boolean;
	clearResult: () => void;
}

export default function NewsAnalysisResults({
	result,
	url,
	setUrl,
	handlePaste,
	analyzeNews,
	loading,
	clearResult,
}: Props) {
	const { metadata, extracted_content, analysis, share_info } = result;

	return (
		<div className="bg-[#F7F7F7] flex flex-col gap-8 py-8">
			{/* 헤더와 새로운 URL 입력 */}
			<div>
				<div className="flex flex-col items-center mb-4">
					<div className="relative flex items-center gap-2">
						<input
							type="url"
							className="w-[275px] text-center h-[31px] text-[11.281px] font-bold text-black border-2 border-[#0073FF] rounded-full px-6 py-3 bg-white shadow pr-12"
							placeholder="기사의 URL 링크를 이곳에 붙여주세요!"
							onChange={(e) => setUrl(e.target.value)}
							onPaste={handlePaste}
							disabled={loading}
						/>
						<div className="absolute right-3 top-1/2 transform -translate-y-1/2">
							<Image
								src={vectorimage}
								alt="분석 버튼"
								className="w-[22px] h-[24px]"
							/>
						</div>
					</div>
				</div>
				<header
					className="bg-blue-600 w-full text-white py-2 text-center font-bold flex flex-col items-center cursor-pointer select-none rounded mb-6"
					onClick={clearResult}
				>
					<p className="text-[10px] font-bold tracking-wide">NEWSEE</p>
				</header>
			</div>

			{/* 기사 제목 및 메타 정보 */}
			<div className=" p-6 text-black h-40">
				<h2 className="text-2xl font-bold mb-2">{extracted_content.title}</h2>

				<div className="text-xs text-black/70">
					원본 URL:{" "}
					<a
						href={metadata.original_url}
						target="_blank"
						rel="noopener noreferrer"
						className="underline text-blue-600"
					>
						{metadata.original_url}
					</a>
				</div>
			</div>

			{/* 요약 카드 */}
			{analysis.summary && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">📝 요약</h2>
					<div className="mb-2">
						<strong>한 문장 요약:</strong> {analysis.summary.one_sentence}
					</div>
					<div className="mb-2">
						<strong>세 문장 요약:</strong>
						<ul className="list-disc list-inside ml-4 mt-1">
							{analysis.summary.three_sentences?.map((s: string, i: number) => (
								<li key={i}>{s}</li>
							))}
						</ul>
					</div>
					{analysis.summary.five_sentences && (
						<div>
							<strong>다섯 문장 요약:</strong>
							<ul className="list-disc list-inside ml-4 mt-1">
								{analysis.summary.five_sentences.map((s: string, i: number) => (
									<li key={i}>{s}</li>
								))}
							</ul>
						</div>
					)}
				</div>
			)}

			{/* 키워드 분석 카드 */}
			{analysis.keywords && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">🔑 키워드 분석</h2>
					{["high_importance", "medium_importance", "low_importance"].map(
						(level) => {
							const levelTitle =
								level === "high_importance"
									? "매우 중요"
									: level === "medium_importance"
										? "중간 중요도"
										: "낮은 중요도";
							const keywords = analysis.keywords[level];
							return keywords && keywords.length > 0 ? (
								<div key={level} className="mb-4">
									<h3 className="text-lg font-semibold mb-2">{levelTitle}</h3>
									<ul className="flex flex-wrap gap-3">
										{keywords.map(
											(
												item: {
													keyword: string;
													description: string;
													color: string;
												},
												idx: number,
											) => (
												<li
													key={idx}
													className="p-4 rounded-lg border min-w-[180px] flex-1"
													style={{
														borderColor: item.color,
														backgroundColor: `${item.color}20`,
													}}
												>
													<div className="font-bold text-black mb-1">
														{item.keyword}
													</div>
													<div className="text-sm text-black">
														{item.description}
													</div>
												</li>
											),
										)}
									</ul>
								</div>
							) : null;
						},
					)}
				</div>
			)}

			{/* 제목 재구성 카드 */}
			{analysis.title_rewrite && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">📝 제목 재구성</h2>
					<div className="mb-2">
						<strong>원본:</strong> {analysis.title_rewrite.original_title}
					</div>
					<div className="mb-2">
						<strong>재구성:</strong> {analysis.title_rewrite.rewritten_title}
					</div>
					{analysis.title_rewrite.change_reason && (
						<div className="mb-2">
							<strong>변경 이유:</strong> {analysis.title_rewrite.change_reason}
						</div>
					)}
				</div>
			)}

			{/* 난이도 분석 카드 */}
			{analysis.difficulty && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">📚 난이도 분석</h2>
					<div className="mb-2">
						<strong>난이도:</strong> {analysis.difficulty.level}{" "}
						{analysis.difficulty.icon}
					</div>
					<div className="mb-2">
						<strong>점수:</strong> {analysis.difficulty.score}/5
					</div>
					{analysis.difficulty.reading_tips && (
						<div>
							<strong>읽기 팁:</strong>
							<ul className="list-disc list-inside ml-4 mt-1">
								{analysis.difficulty.reading_tips.map(
									(tip: string, i: number) => (
										<li key={i}>{tip}</li>
									),
								)}
							</ul>
						</div>
					)}
				</div>
			)}

			{/* 표현 방식 분석 카드 */}
			{analysis.expression && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">🧠 표현 방식 분석</h2>
					<div className="mb-4">
						<h3 className="font-semibold mb-2">감성 비율 (%)</h3>
						<ul className="space-y-1">
							<li>
								😊 긍정: {analysis.expression.emotional_analysis.positive_ratio}
								%
							</li>
							<li>
								😠 부정: {analysis.expression.emotional_analysis.negative_ratio}
								%
							</li>
							<li>
								😐 중립: {analysis.expression.emotional_analysis.neutral_ratio}%
							</li>
						</ul>
					</div>
					<div className="mb-4">
						<h3 className="font-semibold mb-2">표현 점수</h3>
						<ul className="space-y-1">
							<li>
								📏 객관성 점수 (1~5): {analysis.expression.objectivity_score}
							</li>
							<li>
								🧭 객관적 진술 비율:{" "}
								{analysis.expression["percentage of objective statement"]}%
							</li>
							<li>
								💬 주관적 진술 비율:{" "}
								{analysis.expression["percentage of subjective statement"]}%
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-semibold mb-2">기타 지표</h3>
						<ul className="space-y-1">
							<li>
								📣 선정성 점수 (1~5): {analysis.expression.sensationalism_score}
							</li>
							<li>⚖️ 편향 점수 (1~5): {analysis.expression.bias_score}</li>
						</ul>
					</div>
				</div>
			)}

			{/* 사고 질문 카드 */}
			{analysis.thinking_questions && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">💡 사고 질문</h2>
					{analysis.thinking_questions.causal_questions && (
						<div className="mb-2">
							<strong>원인/결과:</strong>
							<ul className="list-disc list-inside ml-4 mt-1">
								{analysis.thinking_questions.causal_questions.map(
									(q: string, i: number) => (
										<li key={i}>{q}</li>
									),
								)}
							</ul>
						</div>
					)}
					{analysis.thinking_questions.prediction_questions && (
						<div className="mb-2">
							<strong>예측:</strong>
							<ul className="list-disc list-inside ml-4 mt-1">
								{analysis.thinking_questions.prediction_questions.map(
									(q: string, i: number) => (
										<li key={i}>{q}</li>
									),
								)}
							</ul>
						</div>
					)}
					{analysis.thinking_questions.perspective_questions && (
						<div className="mb-2">
							<strong>관점 비교:</strong>
							<ul className="list-disc list-inside ml-4 mt-1">
								{analysis.thinking_questions.perspective_questions.map(
									(q: string, i: number) => (
										<li key={i}>{q}</li>
									),
								)}
							</ul>
						</div>
					)}
				</div>
			)}

			{/* 과거 연관 분석 카드 */}
			{analysis.historical_connection && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">📚 과거 연관 분석</h2>
					{analysis.historical_connection.similar_events &&
						analysis.historical_connection.similar_events.length > 0 && (
							<div className="mb-4">
								<h3 className="font-semibold mb-2">유사한 과거 사건</h3>
								<ul className="space-y-2">
									{analysis.historical_connection.similar_events.map(
										(event: any, i: number) => (
											<li
												key={i}
												className="p-4 bg-yellow-50 border border-yellow-200 rounded"
											>
												<div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-2">
													<span className="font-medium text-black">
														{event.title}
													</span>
													<span className="text-sm text-black">
														{event.date}
													</span>
												</div>
												{event.link && (
													<div className="mb-1">
														<a
															href={event.link}
															target="_blank"
															rel="noopener noreferrer"
															className="text-blue-600 underline text-sm"
														>
															관련 기사
														</a>
													</div>
												)}
												<p className="text-sm text-black mb-2">
													{event.similarity}
												</p>
												<p className="text-sm text-black">{event.outcome}</p>
											</li>
										),
									)}
								</ul>
							</div>
						)}
					{analysis.historical_connection.lessons &&
						analysis.historical_connection.lessons.length > 0 && (
							<div>
								<h3 className="font-semibold mb-2">과거에서 얻은 교훈</h3>
								<ul className="list-disc list-inside ml-4 mt-1">
									{analysis.historical_connection.lessons.map(
										(lesson: string, i: number) => (
											<li key={i}>{lesson}</li>
										),
									)}
								</ul>
							</div>
						)}
				</div>
			)}

			{/* 보완적 인사이트 카드 */}
			{analysis.complementary_insight && (
				<div className="bg-white shadow rounded-lg p-6 text-black">
					<h2 className="text-xl font-bold mb-4">🧩 보완적 인사이트</h2>
					{analysis.complementary_insight.complementary_articles &&
						analysis.complementary_insight.complementary_articles.length >
							0 && (
							<div className="mb-4">
								<h3 className="font-semibold mb-2">추천 기사 목록</h3>
								<ul className="space-y-2">
									{analysis.complementary_insight.complementary_articles.map(
										(article: any, i: number) => (
											<li
												key={i}
												className="p-4 bg-blue-50 border border-blue-200 rounded"
											>
												<h4 className="font-medium text-black">
													{article.title}
												</h4>
												<a
													href={article.source}
													target="_blank"
													rel="noopener noreferrer"
													className="text-sm text-blue-600 underline"
												>
													{article.source}
												</a>
												<p className="text-sm text-black mt-2">
													{article.summary}
												</p>
												<p className="text-xs text-black/70 mt-1">
													{article.why_useful}
												</p>
											</li>
										),
									)}
								</ul>
							</div>
						)}
					{analysis.complementary_insight.insight && (
						<div>
							<h3 className="font-semibold mb-2">AI 인사이트</h3>
							<p className="text-black">
								{analysis.complementary_insight.insight}
							</p>
						</div>
					)}
				</div>
			)}

			{/* 공유 기능 */}
			<div className="bg-white shadow rounded-lg p-6 text-black flex flex-col items-center">
				<h2 className="text-xl font-bold mb-4">🔗 분석 결과 공유</h2>
				<button
					type="button"
					onClick={() => {
						if (navigator.clipboard) {
							navigator.clipboard.writeText(window.location.href);
							alert("링크가 복사되었습니다!");
						}
					}}
					className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold"
				>
					📋 링크 복사
				</button>
				<div className="mt-2 text-xs text-black/70">
					공유 링크: <span className="underline">{share_info.share_url}</span>
				</div>
			</div>
		</div>
	);
}
