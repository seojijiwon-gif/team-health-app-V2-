// api/save-response.js
// 진단 결과를 Supabase에 저장하는 API

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { team_code, user_name, survey_answers, area_averages, dilemma_id, workshop_responses, is_update } = req.body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
    }

    try {
        if (is_update) {
            // 기존 응답 업데이트 (딜레마 + 워크숍 응답 추가)
            // 같은 팀코드+이름의 가장 최근 응답을 업데이트
            const findRes = await fetch(
                `${supabaseUrl}/rest/v1/responses?team_code=eq.${encodeURIComponent(team_code)}&user_name=eq.${encodeURIComponent(user_name)}&order=created_at.desc&limit=1`,
                {
                    headers: {
                        'apikey': supabaseKey,
                        'Authorization': `Bearer ${supabaseKey}`
                    }
                }
            );
            const existing = await findRes.json();

            if (existing && existing.length > 0) {
                const updateRes = await fetch(
                    `${supabaseUrl}/rest/v1/responses?id=eq.${existing[0].id}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'apikey': supabaseKey,
                            'Authorization': `Bearer ${supabaseKey}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal'
                        },
                        body: JSON.stringify({
                            dilemma_id: dilemma_id,
                            workshop_responses: workshop_responses
                        })
                    }
                );
                if (!updateRes.ok) {
                    const errData = await updateRes.text();
                    throw new Error('업데이트 실패: ' + errData);
                }
                return res.status(200).json({ success: true, action: 'updated' });
            }
        }

        // 새 응답 저장
        const insertRes = await fetch(
            `${supabaseUrl}/rest/v1/responses`,
            {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    team_code,
                    user_name,
                    survey_answers,
                    area_averages,
                    dilemma_id: dilemma_id || null,
                    workshop_responses: workshop_responses || null
                })
            }
        );

        if (!insertRes.ok) {
            const errData = await insertRes.text();
            throw new Error('저장 실패: ' + errData);
        }

        return res.status(200).json({ success: true, action: 'created' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
