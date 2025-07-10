import React from "react";
import Image from "next/image";
interface ReconsiderationPointProps {
	points: string[];
}
import alert from "@/public/Alert.svg";
export default function ReconsiderationPoint({
	points,
}: ReconsiderationPointProps) {
	// points가 undefined일 수 있으므로 안전하게 처리
	const safePoints = points || [];

	return (
		<div className="bg-white shadow rounded-lg p-6 text-black">
			<div className=" flex mb-4">
				<Image
					src={alert}
					alt="alert"
					className=" mt-[-10px] w-[40px] h-[40px]"
				/>
				<p className="ml-0.5 text-[12px] font-bold">
					다시 생각해볼 지점이 있어요!
				</p>
			</div>
			<div className="grid grid-cols-2 gap-2 ml-[-10px]">
				{safePoints.slice(0, 4).map((point, i) => (
					<div
						key={`point-${i}-${point.substring(0, 10)}`}
						className="rounded-[50px] bg-[#696969] text-white flex items-center justify-center mb-2 text-[9px] font-[400] shadow-[inset_-7px_-26px_4px_0px_rgba(0,0,0,0.25)] px-5 py-5 min-h-[40px] min-w-[150px]"
					>
						{i + 1}. {point}
					</div>
				))}
			</div>
		</div>
	);
}
