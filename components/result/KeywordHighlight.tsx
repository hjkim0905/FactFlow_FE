import React from "react";

interface Keyword {
	keyword: string;
	description: string;
	color: string;
}

interface KeywordHighlightProps {
	keywords: Keyword[];
}

export default function KeywordHighlight({ keywords }: KeywordHighlightProps) {
	// keywords가 undefined일 수 있으므로 안전하게 처리
	const safeKeywords = keywords || [];
	const pillStyles = [
		{
			fontSize: 15.5891,
			lineHeight: 19,
			borderRadius: 22.2702,
			borderWidth: 1.67026,
			rotation: 4.47,
			padding: "0 1rem",
			minHeight: 19,
		},
		{
			fontSize: 15.6639,
			lineHeight: 19,
			borderRadius: 22.377,
			borderWidth: 1.67827,
			rotation: 0,
			padding: "0 1.1rem",
			minHeight: 19,
		},
		{
			fontSize: 10.6173,
			lineHeight: 13,
			borderRadius: 15.1676,
			borderWidth: 1.53909,
			rotation: -12.99,
			padding: "0 0.7rem",
			minHeight: 13,
		},
		{
			fontSize: 12.8175,
			lineHeight: 15,
			borderRadius: 18.3107,
			borderWidth: 1.61161,
			rotation: -11.52,
			padding: "0 0.8rem",
			minHeight: 15,
		},
		{
			fontSize: 14.0687,
			lineHeight: 17,
			borderRadius: 20.0981,
			borderWidth: 1.50736,
			rotation: -10.47,
			padding: "0 0.9rem",
			minHeight: 17,
		},
		{
			fontSize: 9.81279,
			lineHeight: 12,
			borderRadius: 14.0183,
			borderWidth: 1.45448,
			rotation: 10.74,
			padding: "0 0.6rem",
			minHeight: 12,
		},
		{
			fontSize: 9.81279,
			lineHeight: 12,
			borderRadius: 14.0183,
			borderWidth: 1.45448,
			rotation: -11.35,
			padding: "0 0.6rem",
			minHeight: 12,
		},
		{
			fontSize: 19.6256,
			lineHeight: 23,
			borderRadius: 28.0366,
			borderWidth: 2.10274,
			rotation: 12.81,
			padding: "0 1.2rem",
			minHeight: 23,
		},
	];

	return (
		<div className="p-6 text-black -mt-5">
			<div className="flex items-center mb-4">
				<span className="text-[2rem] leading-[1.9375rem] mr-3">👩🏻‍🏫</span>
				<h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
					중요한 키워드만 뽑았어요!
				</h2>
			</div>
			<div className="w-[19.5rem] h-[6.5rem] bg-transparent flex flex-wrap gap-2 items-start content-start relative overflow-visible">
				{safeKeywords.slice(0, 8).map((item, idx) => {
					const style = pillStyles[idx % pillStyles.length];
					return (
						<div
							key={`keyword-${idx}-${item.keyword}`}
							style={{
								transform: `rotate(${style.rotation}deg)`,
								border: `${style.borderWidth}px solid #0073FF`,
								borderRadius: `${style.borderRadius}px`,
								filter:
									"drop-shadow(0px 1.61161px 1.61161px rgba(0, 0, 0, 0.25))",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								backgroundColor: "white",
								fontFamily: "Pretendard",
								fontWeight: 700,
								color: "#4C4C4C",
								fontSize: `${style.fontSize}px`,
								lineHeight: `${style.lineHeight}px`,
								padding: style.padding,
								minHeight: style.minHeight,
								whiteSpace: "normal",
								overflow: "visible",
							}}
						>
							{item.keyword}
						</div>
					);
				})}
			</div>
			{/* Divider */}
			<div
				className="mx-auto mt-7"
				style={{
					width: "312px",
					height: "0px",
					borderTop: "0.805806px solid #C9C9C9",
				}}
			/>
		</div>
	);
}
