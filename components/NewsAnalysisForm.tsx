import { useState } from "react";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export default function NewsAnalysisForm({
	analyzeNews,
	loading,
	error,
	progress,
	clearError,
}: {
	analyzeNews: (url: string) => Promise<void>;
	loading: boolean;
	error: string | null;
	progress: { current: number; total: number; currentStep: string };
	clearError: () => void;
}) {
	const [url, setUrl] = useState("");

	// URL 붙여넣으면 자동 분석
	const handlePaste = async (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasted = e.clipboardData.getData("Text");
		setUrl(pasted);
		if (pasted.startsWith("http")) {
			await analyzeNews(pasted);
		}
	};

	// 복사 버튼 클릭 시 안내
	const handleCopyClick = () => {
		navigator.clipboard.writeText(url);
		alert("URL이 복사되었습니다!");
	};

	return (
		<div className="flex flex-col items-center mt-16">
			<div className="flex flex-col items-center mb-8">
				<div className="flex items-center gap-2">
					<span className="text-lg font-bold text-black border-2 border-blue-400 rounded-full px-6 py-3 bg-white shadow">
						원하는 기사 URL을 복사만 하세요!
					</span>
					<button
						type="button"
						className="ml-2 p-2 rounded-full border-2 border-blue-400 bg-white hover:bg-blue-50"
						onClick={handleCopyClick}
						aria-label="URL 복사"
					>
						<ClipboardDocumentIcon className="w-7 h-7 text-blue-500" />
					</button>
				</div>
			</div>
			<input
				type="url"
				className="w-full max-w-md p-4 border-2 border-blue-400 rounded-lg text-black text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
				placeholder="https://news.example.com/article"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				onPaste={handlePaste}
				disabled={loading}
			/>
			<button
				className="w-full max-w-md bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
				onClick={() => analyzeNews(url)}
				disabled={loading || !url.trim()}
			>
				🚀 뉴스 분석 시작
			</button>
			{error && <div className="mt-4 text-red-600 font-semibold">{error}</div>}
		</div>
	);
}
