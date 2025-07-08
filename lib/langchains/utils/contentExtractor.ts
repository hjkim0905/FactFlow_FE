import * as cheerio from "cheerio";

export async function extractFromUrl(url: string): Promise<{
	title: string;
	content: string;
	author?: string;
	publishDate?: string;
}> {
	try {
		console.log("🔍 웹페이지 내용 추출 시작:", url);

		const response = await fetch(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}: ${response.statusText}`);
		}

		const html = await response.text();
		const $ = cheerio.load(html);

		const title = extractTitle($);
		const author = extractAuthor($);
		const publishDate = extractPublishDate($);
		const content = extractMainContent($);

		if (!content || content.trim().length < 100) {
			throw new Error("추출된 내용이 너무 짧습니다");
		}

		console.log("✅ 웹페이지 내용 추출 완료");

		return {
			title: title || "제목 없음",
			content,
			author,
			publishDate,
		};
	} catch (error: unknown) {
		console.error("❌ 웹 내용 추출 실패:", error);
		if (error instanceof Error) {
			throw new Error(`웹 내용 추출 실패: ${error.message}`);
		} else {
			throw new Error("웹 내용 추출 실패: 알 수 없는 오류");
		}
	}
}

function extractTitle($: cheerio.CheerioAPI): string {
	const selectors = [
		"h1",
		".title",
		".headline",
		"title",
		'[property="og:title"]',
	];

	for (const selector of selectors) {
		const title = $(selector).first().text().trim();
		if (title && title.length > 5) {
			return title;
		}
	}
	return "";
}

function extractAuthor($: cheerio.CheerioAPI): string {
	const selectors = [".author", ".byline", ".writer", '[rel="author"]'];

	for (const selector of selectors) {
		const author = $(selector).first().text().trim();
		if (author) {
			return author;
		}
	}
	return "";
}

function extractPublishDate($: cheerio.CheerioAPI): string {
	const selectors = [".date", ".publish-date", "time[datetime]"];

	for (const selector of selectors) {
		const dateElement = $(selector).first();
		const date = dateElement.attr("datetime") || dateElement.text().trim();
		if (date) {
			return date;
		}
	}
	return "";
}

function extractMainContent($: cheerio.CheerioAPI): string {
	// 불필요한 요소 제거
	$("script, style, nav, header, footer, aside, .ad").remove();

	const selectors = [
		"article",
		".content",
		".article-content",
		".post-content",
		".entry-content",
		"main",
	];

	let content = "";

	for (const selector of selectors) {
		const element = $(selector).first();
		if (element.length > 0) {
			content = element.text().trim();
			if (content.length > 500) {
				break;
			}
		}
	}

	if (!content || content.length < 500) {
		content = $("body").text().trim();
	}

	return content.replace(/\s+/g, " ").trim();
}

export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch {
		return false;
	}
}
