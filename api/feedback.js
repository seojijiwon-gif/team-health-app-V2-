module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, dilemma, question, stepLabel, answer, a1, a2, a3 } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: '서버 환경변수 오류: GEMINI_API_KEY가 등록되지 않았습니다.' });
  }

  let systemPrompt = '';
  let userPrompt = '';

  try {
    if (type === 'suggestion') {
      systemPrompt = `너는 기업교육 현장의 AI 전략 코치야.
팀원들이 워크숍 질문에 어떻게 답하면 좋을지 추천 답변 3가지를 제시해.
반드시 아래 JSON 형식으로만 답해라.
{
  "suggestions": [
    "첫 번째 답변 예시 (2~3문장)",
    "두 번째 답변 예시 (2~3문장)",
    "세 번째 답변 예시 (2~3문장)"
  ]
}`;
      userPrompt = `[딜레마]: ${dilemma}\n[질문 단계]: ${stepLabel}\n[질문]: ${question}`;

    } else if (type === 'workshop') {
      systemPrompt = `너는 'AI 전략 코치' 컨설턴트야.
학습자 답변을 4가지 분석 영역으로 피드백해.
반드시 아래 JSON 형식으로만 답해라.
{
  "diagnosis": "고민 분석 (1~2문장)",
  "empathy": "공감 (1~2문장)",
  "reframe": "관점 전환 (1~2문장)",
  "action": "내일 할 수 있는 구체적인 행동 1가지"
}`;
      userPrompt = `[딜레마]: ${dilemma}\n[질문 단계]: ${stepLabel}\n[질문]: ${question}\n[팀 답변]: ${answer}`;

    } else if (type === 'final') {
      systemPrompt = `너는 조직문화 컨설턴트야. 세 답변을 종합해 조직문화 리포트를 작성해.
반드시 아래 JSON 형식으로만 답해라.
{
  "summary": "핵심 요약 (2문장)",
  "culture_diagnosis": "조직문화 특성과 원인 진단 (3문장)",
  "feedback_criteria": [
    {"label": "항목1", "comment": "평가 코멘트"}
  ],
  "solutions": [ "현실적 대안 1", "현실적 대안 2" ],
  "action": "내일 당장팀 실천 액션",
  "cheer": "따뜻한 응원 메시지"
}`;
      userPrompt = `[딜레마]: ${dilemma}\n[Q1 마음읽기]: ${a1}\n[Q2 관점넓히기]: ${a2}\n[Q3 약속]: ${a3}`;
    }

    const payload = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: { response_mime_type: "application/json" }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Gemini 서버 오류');
    }

    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return res.status(200).json({ feedback: JSON.parse(raw) });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
