import { useState, useEffect } from "react";
import vector from "@/public/Vector.svg";
import Image from "next/image";
export default function NewsAnalysisForm({
	analyzeNews,
	loading,
	error,
}: {
	analyzeNews: (url: string) => Promise<void>;
	loading: boolean;
	error: string | null;
}) {
	const [url, setUrl] = useState("");

	// URL이 들어오면 자동 분석
	useEffect(() => {
		if (url?.startsWith("http") && !loading) {
			analyzeNews(url);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [url]);

	// URL 붙여넣으면 자동 분석
	const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData("Text");
		setUrl(pasted);
	};

	return (
		<div className="flex flex-col items-center mt-16">
			<div className="flex flex-col items-center mb-8">
				<div className="relative flex items-center gap-2">
					<input
						type="url"
						className="w-[225px] text-[11.281px] font-bold text-black border-2 border-[#0073FF] rounded-full px-6 py-3 bg-white shadow"
						placeholder="원하는 기사 URL을 복사만 하세요!"
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						onPaste={handlePaste}
						disabled={loading}
					/>
					<div className="absolute top-1/8 right-[-20px] -translate-y-1/2 w-[41px] h-[36px] bg-[#0073FF] rounded-full flex items-center justify-center border-2 border-[#0073FF]">
						<Image src={vector} alt="분석 버튼" className="w-[22px] h-[24px]" />
					</div>
				</div>
			</div>

			{error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
		</div>
	);
}
