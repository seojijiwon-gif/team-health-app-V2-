// api/get-team-results.js
// 팀 코드별 결과를 조회하고 평균을 계산하는 API

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { team_code } = req.body;

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
    }

    try {
        // 해당 팀 코드의 모든 응답 조회
        const fetchRes = await fetch(
            `${supabaseUrl}/rest/v1/responses?team_code=eq.${encodeURIComponent(team_code)}&select=area_averages,user_name,created_at`,
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

        if (!responses || responses.length === 0) {
            return res.status(200).json({ count: 0, team_averages: {} });
        }

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
            team_averages
        });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
