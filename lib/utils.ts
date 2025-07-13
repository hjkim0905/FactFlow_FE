export function cleanAuthorName(author: string): string {
	if (!author) return "";
	// 줄바꿈, 쉼표, 슬래시, 이메일 등에서 자르기
	let first = author.split(/[\n,\\/]|[\w.-]+@[\w.-]+/)[0].trim();
	// '기자'로 끝나지 않으면 붙이기
	if (!first.endsWith("기자")) {
		first += " 기자";
	}
	return first;
}
