import React from "react";
import Image from "next/image";
import circle from "@/public/Ellipse 15.svg";

interface ThinkingQuestionsProps {
	questions: string[];
}

export default function ThinkingQuestions({
	questions,
}: ThinkingQuestionsProps) {
	// questions가 undefined일 수 있으므로 안전하게 처리
	const safeQuestions = questions || [];
	const numImgs = ["/num1.png", "/num2.png", "/num3.png", "/num4.png"];
	return (
		<div className="bg-white shadow rounded-lg p-6 text-black">
			<div className="text-xl font-bold mb-4 flex items-center gap-2">
				<span className="text-3xl">👩🏻‍🏫</span>
				<p className="text-[12px]">사고력을 길러주는 추천 질문이에요!</p>
			</div>
			<div className="flex flex-col gap-2">
				{safeQuestions.slice(0, 4).map((q, i) => (
					<div
						key={`question-${i}-${q.substring(0, 10)}`}
						className="flex items-center border border-[#0073FF] rounded-full px-1 py-1 bg-[#EAEAEA] text-[11px] font-[400] border-[1px]"
					>
						{" "}
						{/* 왼쪽: 파란 원 + 돋보기 + 숫자 */}
						<div className="relative flex items-center justify-center w-8 h-8 mr-2">
							{/* 파란 원 */}
							<Image
								src={circle}
								alt="파란 원"
								width={32}
								height={32}
								className="absolute left-0 top-0 w-8 h-8"
								draggable={false}
								aria-hidden
							/>
							<Image
								src={numImgs[i]}
								alt={`숫자${i + 1}`}
								width={20}
								height={20}
								className="absolute left-1/3 top-7/12  -translate-x-1/2 -translate-y-1/2 z-10"
								draggable={false}
								aria-hidden
							/>
						</div>
						<span className="ml-2">{q}</span>
					</div>
				))}
			</div>
		</div>
	);
}
