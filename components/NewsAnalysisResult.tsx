"use client";

import type { NewsAnalysisResponse } from "@/types/newAnalysis";

interface Props {
	result: NewsAnalysisResponse;
}

export default function NewsAnalysisResults({ result }: Props) {
	const { metadata, extracted_content, analysis } = result;

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-8">
			{/* 메타데이터 */}
			<div className="bg-gray-50 p-4 rounded-lg">
				<h2 className="text-lg font-bold mb-2 text-black">📊 분석 정보</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
					<div>
						<strong className="text-black">분석 완료:</strong>{" "}
						<div className="text-base text-black">
							{new Date(metadata.analyzed_at).toLocaleString()}
						</div>
					</div>
					<div>
						<strong className="text-black">AI 모델:</strong>{" "}
						<span className="text-black">{metadata.ai_model}</span>
					</div>
					<div>
						<strong className="text-black">처리 시간:</strong>{" "}
						<span className="text-black">
							{metadata.processing_time_readable}
						</span>
					</div>
				</div>
			</div>

			{/* 원본 내용 */}
			<div className="bg-white border rounded-lg p-6">
				<h2 className="text-xl font-bold mb-4 text-black">📰 원본 기사</h2>
				<div className="space-y-3">
					<div>
						<strong className="text-black">제목:</strong>{" "}
						<span className="text-black">{extracted_content.title}</span>
					</div>
					{extracted_content.author && (
						<div>
							<strong className="text-black">작성자:</strong>{" "}
							<span className="text-black">{extracted_content.author}</span>
						</div>
					)}
					<div>
						<strong className="text-black">내용 길이:</strong>{" "}
						<span className="text-black">
							{metadata.content_length.toLocaleString()}자
						</span>
					</div>
				</div>
			</div>

			{/* 제목 재구성 */}
			{analysis.title_rewrite && (
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-bold mb-4 text-black">📝 제목 재구성</h2>
					<div className="space-y-3">
						<div>
							<span className="font-medium text-black">원본:</span>
							<p className="mt-1 p-3 bg-red-50 rounded text-black">
								{analysis.title_rewrite.original_title}
							</p>
						</div>
						<div>
							<span className="font-medium text-black">재구성:</span>
							<p className="mt-1 p-3 bg-green-50 rounded text-black">
								{analysis.title_rewrite.rewritten_title}
							</p>
						</div>
						{analysis.title_rewrite.change_reason && (
							<div>
								<span className="font-medium text-black">변경 이유:</span>
								<p className="mt-1 text-sm text-black">
									{analysis.title_rewrite.change_reason}
								</p>
							</div>
						)}
					</div>
				</div>
			)}

			{/* 요약 */}
			{analysis.summary && (
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-bold mb-4 text-black">📋 단계별 요약</h2>
					<div className="space-y-4">
						{analysis.summary.one_sentence && (
							<div>
								<h3 className="font-semibold mb-2 text-black">
									💡 한 문장 요약
								</h3>
								<p className="p-3 bg-blue-50 rounded text-black">
									{analysis.summary.one_sentence}
								</p>
							</div>
						)}
						{analysis.summary.three_sentences && (
							<div>
								<h3 className="font-semibold mb-2 text-black">
									📖 세 문장 요약
								</h3>
								<div className="space-y-2">
									{analysis.summary.three_sentences.map(
										(sentence: string, index: number) => (
											<p
												key={index}
												className="p-3 bg-green-50 rounded border-l-4 border-black text-black"
											>
												{sentence}
											</p>
										),
									)}
								</div>
							</div>
						)}

						{analysis.thinking_questions?.perspective_questions?.length > 0 && (
							<div>
								<h3 className="font-semibold mb-2 text-black">👁️ 관점 비교</h3>
								{analysis.thinking_questions.perspective_questions.map(
									(question: string, index: number) => (
										<p
											key={index}
											className="p-3 bg-purple-50 rounded border-l-4 border-black text-black"
										>
											{question}
										</p>
									),
								)}
							</div>
						)}
					</div>
				</div>
			)}

			{/* 과거 연관 분석 */}
			{analysis.historical_connection && (
				<div className="bg-white border rounded-lg p-6">
					<h2 className="text-xl font-bold mb-4 text-black">
						📚 과거 연관 분석
					</h2>
					<div className="space-y-4">
						{analysis.historical_connection.similar_events &&
							analysis.historical_connection.similar_events.length > 0 && (
								<div>
									<h3 className="font-semibold mb-3 text-black">
										유사한 과거 사건
									</h3>
									{analysis.historical_connection.similar_events.map(
										(event: any, index: number) => (
											<div
												key={index}
												className="p-4 bg-yellow-50 border border-yellow-200 rounded"
											>
												<div className="flex justify-between items-start mb-2">
													<h4 className="font-medium text-black">
														{event.title}
													</h4>
													<span className="text-sm text-black">
														{event.date}
													</span>
												</div>
												<p className="text-sm text-black mb-2">
													{event.similarity}
												</p>
												<p className="text-sm text-black">{event.outcome}</p>
											</div>
										),
									)}
								</div>
							)}

						{analysis.historical_connection.lessons &&
							analysis.historical_connection.lessons.length > 0 && (
								<div>
									<h3 className="font-semibold mb-3 text-black">
										과거에서 얻은 교훈
									</h3>
									<ul className="list-disc list-inside space-y-2">
										{analysis.historical_connection.lessons.map(
											(lesson: string, index: number) => (
												<li key={index} className="text-sm text-black">
													{lesson}
												</li>
											),
										)}
									</ul>
								</div>
							)}
					</div>
				</div>
			)}

			{/* 공유 기능 */}
			<div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
				<h2 className="text-xl font-bold mb-4 text-black">🔗 분석 결과 공유</h2>
				<div className="flex gap-4">
					<button
						type="button"
						onClick={() => {
							if (navigator.clipboard) {
								navigator.clipboard.writeText(window.location.href);
								alert("링크가 복사되었습니다!");
							}
						}}
						className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
					>
						📋 링크 복사
					</button>
				</div>
			</div>
		</div>
	);
}
