export default function LoadingScreen({
	progress,
}: { progress: { current: number; total: number; currentStep: string } }) {
	return (
		<div className="flex flex-col items-center justify-center h-[60vh] w-full">
			{/* AI 캐릭터/로딩 이모지 */}
			<div className="mb-6">
				<span className="text-7xl animate-bounce">🤖</span>
			</div>
			<div className="text-xl font-bold text-blue-700 mb-2">
				AI가 뉴스를 분석 중입니다...
			</div>
			<div className="text-base text-black mb-4">
				{progress.currentStep || "잠시만 기다려주세요!"}
			</div>
			<div className="w-64 bg-gray-200 rounded-full h-4">
				<div
					className="bg-blue-600 h-4 rounded-full transition-all duration-500"
					style={{ width: `${(progress.current / progress.total) * 100}%` }}
				/>
			</div>
			<div className="mt-2 text-sm text-black">
				{progress.current}/{progress.total}
			</div>
		</div>
	);
}
