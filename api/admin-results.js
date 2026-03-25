// api/admin-results.js
// 관리자용 전체 데이터 조회 API (관리자 코드 검증 포함)

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { admin_code, team_code } = req.body;
    const ADMIN_CODE = '0000'; // 관리자 코드

    // 관리자 코드 검증
    if (admin_code !== ADMIN_CODE) {
        return res.status(403).json({ error: '관리자 코드가 올바르지 않습니다.' });
    }

    if (!team_code) {
        return res.status(400).json({ error: '팀 코드를 입력해주세요.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
    }

    try {
        // 해당 팀의 모든 응답 조회 (전체 데이터)
        const fetchRes = await fetch(
            `${supabaseUrl}/rest/v1/responses?team_code=eq.${encodeURIComponent(team_code)}&order=created_at.desc`,
            {
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`
                }
            }
        );

        if (!fetchRes.ok) {
            throw new Error('데이터 조회 실패');
        }

        const responses = await fetchRes.json();

        // 팀 평균 계산
        const areas = ['comm', 'safety', 'align', 'leadership'];
        const team_averages = {};

        areas.forEach(areaId => {
            const values = responses
                .map(r => r.area_averages?.[areaId])
                .filter(v => v !== undefined && v !== null);

            if (values.length > 0) {
                const sum = values.reduce((a, b) => a + b, 0);
                team_averages[areaId] = +(sum / values.length).toFixed(1);
            }
        });

        return res.status(200).json({
            count: responses.length,
            responses: responses,      // 개별 결과 목록
            team_averages: team_averages  // 팀 전체 평균
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
