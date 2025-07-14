import React from 'react';

interface EmotionMixProps {
    objectivePercent: number;
    subjectivePercent: number;
    objectiveWords?: string[];
    subjectiveWords?: string[];
}

export default function EmotionMix({
    objectivePercent,
    subjectivePercent,
    objectiveWords,
    subjectiveWords,
}: EmotionMixProps) {
    // Dynamic size calculation
    const minWidth = 60;
    const maxWidth = 140;
    const minHeight = 30;
    const maxHeight = 70;
    const minFont = 12;
    const maxFont = 28;
    // Clamp percent between 0~100
    const clamp = (v: number) => Math.max(0, Math.min(100, v));
    const leftWidth = minWidth + (maxWidth - minWidth) * (clamp(objectivePercent) / 100);
    const leftHeight = minHeight + (maxHeight - minHeight) * (clamp(objectivePercent) / 100);
    const rightWidth = minWidth + (maxWidth - minWidth) * (clamp(subjectivePercent) / 100);
    const rightHeight = minHeight + (maxHeight - minHeight) * (clamp(subjectivePercent) / 100);
    const leftFont = minFont + (maxFont - minFont) * (clamp(objectivePercent) / 100);
    const rightFont = minFont + (maxFont - minFont) * (clamp(subjectivePercent) / 100);
    const gap = 8;
    const totalWidth = leftWidth + rightWidth + gap;
    const dividerExtra = 32;
    const maxHalfHeight = Math.max(leftHeight, rightHeight);

    function formatWordList(words: string[] = [], maxLines = 2, maxWordsPerLine = 3) {
        if (!words || words.length === 0) return '';
        const lines: string[] = [];
        let i = 0;
        for (let line = 0; line < maxLines && i < words.length; line++) {
            const lineWords = [];
            for (let w = 0; w < maxWordsPerLine && i < words.length; w++, i++) {
                lineWords.push(`<span style=\"white-space:nowrap\">${words[i]}</span>`);
            }
            lines.push(lineWords.join(', '));
        }
        // 남은 단어가 있으면 마지막 줄 끝에 ' 등' 추가 (줄이 꽉 차면 마지막 단어를 빼고 ' 등'을 붙임)
        if (i < words.length) {
            const lastLine = lines[lines.length - 1].split(', ');
            if (lastLine.length > 1) {
                lastLine.pop();
                lines[lines.length - 1] = lastLine.join(', ') + ' 등';
            } else {
                lines[lines.length - 1] = lastLine[0] + ' 등';
            }
        }
        return lines.join('<br />');
    }

    return (
        <div className="p-6 text-black flex flex-col items-center -mt-5">
            <div className="flex items-center mb-4 w-full">
                <span className="text-[2rem] leading-[1.9375rem] mr-3">⚖️</span>
                <h2 className="font-pretendard font-bold text-[0.75rem] leading-[0.875rem] text-[#4C4C4C]">
                    감정 표현, 얼마나 섞였을까요?
                </h2>
            </div>
            {/* 반원형+divider */}
            <div
                className="relative flex items-end justify-center w-full"
                style={{ minHeight: maxHalfHeight, width: totalWidth }}
            >
                {/* Left: Objective Half-circle */}
                <div
                    className="flex flex-col items-center"
                    style={{ width: leftWidth, height: leftHeight, alignSelf: 'flex-end' }}
                >
                    <div
                        style={{
                            width: leftWidth,
                            height: leftHeight,
                            background: 'linear-gradient(180deg, #0073FF 0%, #B3D4FF 100%)',
                            borderTopLeftRadius: leftWidth,
                            borderTopRightRadius: leftWidth,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        className="relative flex items-center justify-center"
                    >
                        <span
                            className="absolute left-1/2 top-2 -translate-x-1/2 font-pretendard font-bold"
                            style={{
                                color: '#F7F7F7',
                                fontSize: leftFont,
                                lineHeight: `${leftFont * 1.2}px`,
                            }}
                        >
                            {objectivePercent}%
                        </span>
                    </div>
                </div>
                {/* Right: Subjective Half-circle */}
                <div
                    className="flex flex-col items-center"
                    style={{ width: rightWidth, height: rightHeight, marginLeft: gap, alignSelf: 'flex-end' }}
                >
                    <div
                        style={{
                            width: rightWidth,
                            height: rightHeight,
                            background: 'linear-gradient(180deg, #D2D2D2 0%, #565656 100%)',
                            borderTopLeftRadius: rightWidth,
                            borderTopRightRadius: rightWidth,
                            borderBottomLeftRadius: 0,
                            borderBottomRightRadius: 0,
                        }}
                        className="relative flex items-center justify-center"
                    >
                        <span
                            className="absolute left-1/2 top-2 -translate-x-1/2 font-pretendard font-bold"
                            style={{
                                color: '#4C4C4C',
                                fontSize: rightFont,
                                lineHeight: `${rightFont * 1.2}px`,
                            }}
                        >
                            {subjectivePercent}%
                        </span>
                    </div>
                </div>
                {/* Divider: absolutely positioned at the bottom of the half-circles */}
                <div
                    style={{
                        position: 'absolute',
                        left: -dividerExtra / 2,
                        width: totalWidth + dividerExtra,
                        height: 1,
                        background: '#C9C9C9',
                        bottom: 0,
                    }}
                />
            </div>
            {/* Labels and descriptions below divider */}
            <div className="flex justify-center w-full mt-3" style={{ width: totalWidth }}>
                <div className="flex flex-col items-center" style={{ width: leftWidth }}>
                    <div
                        className="font-pretendard font-bold text-center"
                        style={{ fontSize: 11.28, lineHeight: '13px', color: '#4C4C4C', width: '100%' }}
                    >
                        객관적 진술
                    </div>
                    <div
                        className="font-pretendard font-medium mt-1 text-center"
                        style={{
                            fontSize: 8.25,
                            lineHeight: '10px',
                            color: '#AFAFAF',
                            width: '100%',
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                objectiveWords && objectiveWords.length > 0
                                    ? formatWordList(objectiveWords)
                                    : '수사 진행 사실, 양 당 입장 등',
                        }}
                    />
                </div>
                <div className="flex flex-col items-center" style={{ width: rightWidth, marginLeft: gap }}>
                    <div
                        className="font-pretendard font-bold text-center"
                        style={{ fontSize: 11.28, lineHeight: '13px', color: '#4C4C4C', width: '100%' }}
                    >
                        주관적/감정 표현
                    </div>
                    <div
                        className="font-pretendard font-medium mt-1 text-center"
                        style={{
                            fontSize: 8.25,
                            lineHeight: '10px',
                            color: '#AFAFAF',
                            width: '100%',
                            whiteSpace: 'normal',
                            overflow: 'hidden',
                        }}
                        dangerouslySetInnerHTML={{
                            __html:
                                subjectiveWords && subjectiveWords.length > 0
                                    ? formatWordList(subjectiveWords)
                                    : '보복, 탄압, 격렬한 대립 등',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
