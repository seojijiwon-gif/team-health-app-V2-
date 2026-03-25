// api/delete-response.js
// 개별 진단 결과 삭제 API (관리자 코드 검증 포함)

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { admin_code, response_id } = req.body;
    const ADMIN_CODE = '0000'; // 관리자 코드

    // 관리자 코드 검증
    if (admin_code !== ADMIN_CODE) {
        return res.status(403).json({ error: '관리자 코드가 올바르지 않습니다.' });
    }

    if (!response_id) {
        return res.status(400).json({ error: '삭제할 응답 ID가 필요합니다.' });
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        return res.status(500).json({ error: 'Supabase 환경변수가 설정되지 않았습니다.' });
    }

    try {
        // Supabase REST API를 통해 해당 레코드 삭제
        const deleteRes = await fetch(
            `${supabaseUrl}/rest/v1/responses?id=eq.${response_id}`,
            {
                method: 'DELETE',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                }
            }
        );

        if (!deleteRes.ok) {
            throw new Error('데이터 삭제 실패');
        }

        return res.status(200).json({ success: true, message: '삭제되었습니다.' });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
