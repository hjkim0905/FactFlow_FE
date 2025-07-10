import character from "@/public/도우미 캐릭터.svg";
import Image from "next/image";
export default function LoadingScreen({
	progress,
}: { progress: { current: number; total: number; currentStep: string } }) {
	return (
		<div className="flex flex-col items-center  h-[60vh] w-full">
			<div className="text-base text-[#727272] mt-[92px] ">
				뉴스를 재빠르게 다시 보여줄게요!
			</div>
			<div className="text-base text-[#727272]">뉴기가 뉴씨중!</div>
			<Image src={character} alt="character" className="w-[170px] h-[170px]" />
			<div className="w-[170px] h-[10px] bg-[#D9D9D9] rounded-full">
				<div
					className="bg-[#0073FF] h-[10px] rounded-full transition-all duration-500"
					style={{ width: `${(progress.current / progress.total) * 100}%` }}
				/>
			</div>
		</div>
	);
}
