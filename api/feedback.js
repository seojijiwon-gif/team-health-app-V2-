export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { type, dilemma, question, stepLabel, answer, a1, a2, a3 } = req.body;
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: '서버 환경변수 오류: ANTHROPIC_API_KEY가 설정되지 않았습니다. (.env 파일 확인 필요)' });
  }

  let system = '';
  let user = '';

  try {
    if (type === 'suggestion') {
      system = `너는 기업교육 현장의 AI 전략 코치야.
팀원들이 워크숍 질문에 어떻게 답하면 좋을지 추천 답변 3가지를 제시해.
반드시 아래 JSON 만 응답해:
{
  "suggestions": [
    "첫 번째 답변 예시 (2~3문장)",
    "두 번째 답변 예시 (2~3문장)",
    "세 번째 답변 예시 (2~3문장)"
  ]
}
모든 필드는 한국어로 작성.`;
      user = `[딜레마]: ${dilemma}\n[질문 단계]: ${stepLabel}\n[질문]: ${question}`;

    } else if (type === 'workshop') {
      system = `너는 'AI 전략 코치' 컨설턴트야.
학습자 답변을 4가지 분석 영역으로 피드백해.
반드시 아래 JSON 만 응답해:
{
  "diagnosis": "진짜 고민 분석 (1~2문장)",
  "empathy": "따뜻한 공감 (1~2문장)",
  "reframe": "관점 전환 (1~2문장)",
  "action": "내일 할 수 있는 구체적인 행동 1가지"
}
모든 필드는 한국어로 작성.`;
      user = `[딜레마]: ${dilemma}\n[질문 단계]: ${stepLabel}\n[질문]: ${question}\n[팀 답변]: ${answer}`;

    } else if (type === 'final') {
      system = `너는 15년 차 조직문화 컨설턴트야.
세 가지 답변을 종합해 조직문화 리포트를 작성해.
반드시 아래 JSON 만 응답해:
{
  "summary": "핵심 내용 요약 (2문장)",
  "culture_diagnosis": "조직문화 특성과 원인 진단 (3문장)",
  "feedback_criteria": [
    {"label": "소통 구조", "comment": "평가 코멘트"},
    {"label": "심리적 안전감", "comment": "평가 코멘트"},
    {"label": "실행력", "comment": "평가 코멘트"}
  ],
  "solutions": [ "현실적 대안 1", "현실적 대안 2" ],
  "action": "내일 당장팀 실천 한 가지 액션",
  "cheer": "따뜻한 응원 메시지"
}
모든 필드는 한국어로 작성.`;
      user = `[딜레마]: ${dilemma}\n[Q1 마음 읽기]: ${a1}\n[Q2 관점 넓히기]: ${a2}\n[Q3 행동 약속]: ${a3}`;
    } else {
      return res.status(400).json({ error: `잘못된 요청 타입입니다: ${type}` });
    }

    // Model fallback logic to handle user's tier limitations
    const models = ['claude-3-5-sonnet-20240620', 'claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307'];
    let lastError = null;
    let data = null;
    let successfulModel = null;

    for (const model of models) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 1500,
          system,
          messages: [{ role: 'user', content: user }]
        })
      });

      data = await response.json();

      if (response.ok) {
        successfulModel = model;
        console.log(`Successfully completed with model: ${successfulModel}`);
        break; 
      }
      
      console.error(`Claude API Error with model [${model}]:`, JSON.stringify(data));
      lastError = data.error?.message || 'Unknown API Error';
      
      // Error other than 'not_found' breaks immediately (like auth error or invalid syntax)
      if (data.error?.type !== 'not_found_error') {
        throw new Error(`Anthropic 연결 오류: ${lastError} (설정을 확인해주세요)`);
      }
    }

    if (!successfulModel) {
      throw new Error(`입력하신 API KEY로 사용할 수 있는 Claude 모델을 찾지 못했습니다. 본인의 Anthropic 계정에 결제 정보가 정상 등록되어 있는지 확인해주세요! (최종 에러: ${lastError})`);
    }

    const raw = data.content?.[0]?.text || '{}';
    let parsed;
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
       console.error('Parse JSON Error! Raw text was:', raw);
       throw new Error('AI가 형식을 어긴 잘못된 응답을 반환했습니다. 다시 시도해주세요.');
    }

    return res.status(200).json({ feedback: parsed });

  } catch (err) {
    console.error('API Error Wrapper:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
