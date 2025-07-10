import React from "react";
import Image from "next/image";

interface CoreSummaryProps {
	summary: string;
	three_sentences?: string[];
	difficulty?: {
		level: string;
		score: number;
	};
}

export default function CoreSummary({
	summary,
	three_sentences,
	difficulty,
}: CoreSummaryProps) {
	// three_sentences가 undefined일 수 있으므로 안전하게 처리
	const safeThreeSentences = three_sentences || [];
	const renderStars = (score: number) => {
		return Array.from({ length: 5 }, (_, index) => (
			<svg
				key={index}
				className={`w-[0.781rem] h-[0.781rem] ${index < score ? "text-[#0073FF]" : "text-[#D9D9D9]"}`}
				fill="currentColor"
				viewBox="0 0 24 24"
			>
				<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
			</svg>
		));
	};

	return (
		<div className="p-6 text-black">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center">
					<Image
						src="/CreateFile.svg"
						alt="Create File"
						width={49}
						height={49}
						className="drop-shadow-[1px_4px_4px_rgba(0,0,0,0.25)] relative z-10"
					/>
					<h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
						핵심만 간단하게 정리했어요!
					</h2>
				</div>
				<div className="flex items-center gap-2">
					<span className="font-pretendard font-medium text-[0.403rem] leading-[0.5rem] text-[#727272]">
						뉴스 난이도
					</span>
					<div className="flex">{renderStars(difficulty?.score || 0)}</div>
				</div>
			</div>
			<div className="relative">
				<div className="bg-[#0073FF] shadow-[0px_1.61161px_1.61161px_rgba(0,0,0,0.25)] rounded-[0.403rem] w-[19.5rem] h-[50%] p-4 text-white -mt-7.5">
					{safeThreeSentences.length > 0 ? (
						<ul className="space-y-1">
							{safeThreeSentences.map((sentence, index) => (
								<li
									key={`sentence-${index}-${sentence.substring(0, 10)}`}
									className="font-pretendard font-semibold text-[0.755rem] leading-[1rem] text-white flex items-start"
								>
									<span className="mr-2">•</span>
									<span>{sentence}</span>
								</li>
							))}
						</ul>
					) : (
						<p className="font-pretendard font-semibold text-[0.755rem] leading-[1rem] text-white">
							{summary}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
