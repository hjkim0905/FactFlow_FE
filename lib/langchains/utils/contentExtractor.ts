import * as cheerio from "cheerio";
import axios from "axios";

export async function extractFromUrl(url: string): Promise<{
	title: string;
	content: string;
	author?: string;
	publishDate?: string;
}> {
	try {
		console.log("🚀 웹 내용 추출 시작:", url);

		// Vercel 환경에서는 단순한 HTTP 요청 사용
		const response = await axios.get(url, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				Accept:
					"text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
				"Accept-Language": "ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3",
				"Accept-Encoding": "gzip, deflate, br",
				Connection: "keep-alive",
				"Upgrade-Insecure-Requests": "1",
			},
			timeout: 10000,
			maxRedirects: 5,
		});

		const html = response.data;
		const $ = cheerio.load(html);

		const title = extractTitle($);
		const author = extractAuthor($);
		const publishDate = extractPublishDate($);
		const content = extractMainContent($);

		if (!content || content.length < 100) {
			console.warn("📉 추출된 본문 내용이 너무 짧습니다.");
			return {
				title: title || "제목 없음",
				content: "",
				author,
				publishDate,
			};
		}

		console.log("✅ 웹 내용 추출 완료");

		return {
			title: title || "제목 없음",
			content,
			author,
			publishDate,
		};
	} catch (error: unknown) {
		console.error("❌ 웹 내용 추출 실패:", error);

		// Vercel 환경에서는 더 간단한 에러 처리
		if (typeof error === "object" && error !== null) {
			const err = error as {
				code?: string;
				response?: { status?: number };
				message?: string;
			};
			if (err.code === "ECONNABORTED") {
				throw new Error("웹사이트 연결 시간 초과");
			}
			if (err.response?.status === 403) {
				throw new Error("웹사이트에서 접근을 차단했습니다");
			}
			if (err.response?.status === 404) {
				throw new Error("웹페이지를 찾을 수 없습니다");
			}
			throw new Error(`웹 내용 추출 실패: ${err.message || "알 수 없는 오류"}`);
		}

		throw new Error("웹 내용 추출 실패: 알 수 없는 오류");
	}
}

function extractTitle($: cheerio.CheerioAPI): string {
	const selectors = [
		'meta[property="og:title"]',
		'meta[name="twitter:title"]',
		"h1",
		".title",
		".headline",
		".article-title",
		"title",
	];

	for (const selector of selectors) {
		let title = "";

		if (selector.includes("meta")) {
			title = $(selector).attr("content")?.trim() || "";
		} else {
			title = $(selector).first().text().trim();
		}

		if (title && title.length > 3) {
			return title;
		}
	}
	return "";
}

function extractAuthor($: cheerio.CheerioAPI): string {
	// 메타 태그 우선 확인
	const metaAuthor = $('meta[name="author"]').attr("content")?.trim();
	if (metaAuthor) return metaAuthor;

	const ogAuthor = $('meta[property="article:author"]').attr("content")?.trim();
	if (ogAuthor) return ogAuthor;

	// 네이버 뉴스 특별 처리
	const naverAuthor = $("em.media_end_head_journalist_name")
		.first()
		.text()
		.trim();
	if (naverAuthor) return naverAuthor;

	// 일반 셀렉터들
	const selectors = [
		".author",
		".byline",
		".writer",
		".reporter",
		'[rel="author"]',
		".article-author",
	];

	for (const selector of selectors) {
		const author = $(selector).first().text().trim();
		if (author && author.length < 50) {
			// 너무 긴 텍스트 제외
			return author;
		}
	}

	return "";
}

function extractPublishDate($: cheerio.CheerioAPI): string {
	const normalizeDate = (input: string): string => {
		// ISO 8601 형식 처리
		const isoMatch = input.match(/\b(\d{4})-(\d{1,2})-(\d{1,2})/);
		if (isoMatch) {
			const [, year, month, day] = isoMatch;
			return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
		}

		// 한국식 날짜 형식 처리
		const krMatch = input.match(/\b(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})\b/);
		if (krMatch) {
			const [, year, month, day] = krMatch;
			return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
		}

		return "";
	};

	// 메타 태그 우선 확인
	const metaDate = $('meta[property="article:published_time"]').attr("content");
	if (metaDate) {
		const normalized = normalizeDate(metaDate);
		if (normalized) return normalized;
	}

	// 네이버 뉴스 특별 처리
	const naverDate = $(
		"span.media_end_head_info_datestamp_time._ARTICLE_DATE_TIME",
	).attr("data-date-time");
	if (naverDate) {
		const normalized = normalizeDate(naverDate);
		if (normalized) return normalized;
	}

	// 일반 셀렉터들
	const selectors = [
		"time[datetime]",
		".date",
		".publish-date",
		".published",
		".article-date",
	];

	for (const selector of selectors) {
		const el = $(selector).first();
		const attrDate = el.attr("datetime") || el.attr("data-date");
		const textDate = el.text().trim();

		if (attrDate) {
			const normalized = normalizeDate(attrDate);
			if (normalized) return normalized;
		}

		if (textDate) {
			const normalized = normalizeDate(textDate);
			if (normalized) return normalized;
		}
	}

	return "";
}

function extractMainContent($: cheerio.CheerioAPI): string {
	// 불필요한 요소 제거
	$(
		"script, style, nav, header, footer, aside, .ad, .advertisement, .sidebar, .comments, .social-share",
	).remove();

	const selectors = [
		"article",
		'[role="main"]',
		".article-content",
		".post-content",
		".entry-content",
		".content",
		".article-body",
		"main",
		".news-content",
	];

	let content = "";

	for (const selector of selectors) {
		const element = $(selector).first();
		if (element.length > 0) {
			content = element.text().trim();
			if (content.length > 300) {
				break;
			}
		}
	}

	// 백업: body에서 추출
	if (!content || content.length < 300) {
		// 더 많은 불필요한 요소 제거
		$("button, input, select, textarea, .menu, .navigation").remove();
		content = $("body").text().trim();
	}

	// 텍스트 정리
	return content
		.replace(/\s+/g, " ") // 연속 공백을 하나로
		.replace(/\n+/g, " ") // 연속 줄바꿈을 공백으로
		.trim()
		.substring(0, 5000); // 너무 긴 텍스트 제한
}

export function isValidUrl(url: string): boolean {
	try {
		const urlObj = new URL(url);
		return ["http:", "https:"].includes(urlObj.protocol);
	} catch {
		return false;
	}
}
