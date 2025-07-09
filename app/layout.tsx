import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientRoot from "@/components/ClientRoot";

export const metadata: Metadata = {
	title: "FactFlow - AI 뉴스 분석 도구",
	description:
		"뉴스 링크만 입력하면 AI가 자동으로 7가지 관점에서 종합 분석합니다",
	keywords: ["뉴스 분석", "AI", "팩트체크", "미디어 리터러시"],
	authors: [{ name: "FactFlow Team" }],
	openGraph: {
		title: "FactFlow - AI 뉴스 분석 도구",
		description:
			"뉴스 링크만 입력하면 AI가 자동으로 7가지 관점에서 종합 분석합니다",
		type: "website",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<ClientRoot>{children}</ClientRoot>
			</body>
		</html>
	);
}
