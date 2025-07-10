import React from "react";
import magnifier from "@/public/magnifier.svg"; // 돋보기 아이콘(이미지 경로에 맞게 수정)

interface ThinkingQuestionsProps {
	questions: string[];
}

export default function ThinkingQuestions({
	questions,
}: ThinkingQuestionsProps) {
	return (
		<div className="bg-white shadow rounded-lg p-6 text-black">
			<div className="text-xl font-bold mb-4 flex items-center gap-2">
				<span className="text-3xl">👩🏻‍🏫</span>
				<p className="text-[12px]">사고력을 길러주는 추천 질문이에요!</p>
			</div>
			<div className="flex flex-col gap-2">
				{questions.slice(0, 4).map((q, i) => (
					<div
						key={i}
						className="flex items-center border border-[#0073FF] rounded-full px-3 py-1 bg-[#F7FAFF] text-[11px] font-[400] border-[1px] "
					>
						{/* 왼쪽: 파란 원+숫자+돋보기 */}
						<div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0073FF] text-white mr-2 text-[15px] font-bold border-[1px] border-[#0073FF]">
							<img src="/magnifier.svg" alt="돋보기" className="w-3 h-3 mr-1" />
							{i + 1}
						</div>
						{/* 오른쪽: 질문 */}
						<span className="ml-2">{q}</span>
					</div>
				))}
			</div>
		</div>
	);
}
