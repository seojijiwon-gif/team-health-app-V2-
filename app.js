// app.js - 팀 건강도 자가진단 워크시트

// ============================================
// 설문 데이터 정의
// ============================================
const SURVEY_AREAS = [
    {
        id: 'comm', name: '소통 & 협업',
        questions: ["1. 팀원들과 업무 관련 정보가 원활하게 공유된다", "2. 회의에서 다양한 의견이 충분히 논의된다", "3. 업무 요청이나 피드백이 명확하게 전달된다", "4. 팀원들이 서로의 업무를 이해하고 협력한다", "5. 갈등이 생겼을 때 건설적으로 해결된다"],
        dilemmas: [1, 2, 8, 11, 14]
    },
    {
        id: 'safety', name: '심리적 안전감',
        questions: ["6. 실수를 해도 비난받지 않을 것이라 느낀다", "7. 반대 의견이나 다른 시각을 자유롭게 말할 수 있다", "8. 모르는 것을 솔직하게 질문할 수 있는 분위기다", "9. 팀 내에서 나의 의견이 존중받는다고 느낀다", "10. 어려운 상황이나 문제를 팀 안에서 꺼낼 수 있다"],
        dilemmas: [4, 6, 13, 16, 19]
    },
    {
        id: 'align', name: '목표 & 방향 정렬',
        questions: ["11. 팀의 목표와 우선순위가 명확하게 공유되어 있다", "12. 내 업무가 팀 목표에 어떻게 기여하는지 알고 있다", "13. 팀 방향이 변경될 때 이유가 충분히 설명된다", "14. 업무의 중요도와 우선순위에 대해 팀원들과 공감대가 있다", "15. 팀의 성과 기준이 구성원 모두에게 공정하게 적용된다"],
        dilemmas: [3, 10, 15, 18, 20]
    },
    {
        id: 'leadership', name: '리더십 & 관계',
        questions: ["16. 리더가 팀원 개개인의 상황과 어려움에 관심을 기울인다", "17. 리더로부터 성장에 도움이 되는 피드백을 받는다", "18. 팀원들 간의 관계가 신뢰를 기반으로 하고 있다", "19. 팀 내에서 공로와 기여가 적절하게 인정받는다", "20. 나는 이 팀에서 일하는 것이 의미 있다고 느낀다"],
        dilemmas: [5, 7, 9, 12, 17]
    }
];

const DILEMMAS = {
    1: "동료의 업무 실수를 발견했지만, 팀의 분위기를 망치고 싶지 않아 모른 척해야 할지 고민됩니다.",
    2: "당장 오늘까지 끝내야 하는 내 업무가 산더미인데, 도움을 요청하는 옆자리 동료를 도와줘야 할지 갈등이 생깁니다.",
    3: "고객사가 무리한 요구를 하는데, 회사 규정을 지켜 거절해야 할지 아니면 성과를 위해 편법을 써서라도 들어줘야 할지 어렵습니다.",
    4: "더 효율적이고 빠른 방법이 생각났지만, 괜히 나섰다가 기존 방식을 고수하는 선배들에게 '튀는 사람'으로 찍힐까 봐 망설여집니다.",
    5: "팀 프로젝트의 성공을 위해 나의 휴가를 취소하고 기여해야 할지, 아니면 약속된 나의 개인적인 권리를 지켜야 할지 선택하기 힘듭니다.",
    6: "상사의 의견이 명백히 틀렸다고 생각되지만, 솔직하게 말씀드렸다가 올 피드백이나 인사고과가 두려워 입을 닫게 됩니다.",
    7: "새로운 기술이나 툴(AI 등)을 배워서 적용해보고 싶지만, 당장 눈앞의 루틴한 업무를 처리하느라 배울 시간을 내기가 불가능합니다.",
    8: "우리 팀에 유리하지만 타 부서에는 손해인 정보를 알게 되었을 때, 이를 공유해야 할지 우리 팀의 이익을 위해 숨겨야 할지 고민입니다.",
    9: "개인적인 성장을 위해 다른 팀으로 직무 전환을 하고 싶지만, 나를 믿고 의지해온 현재 팀원들에 대한 미안함 때문에 주저하게 됩니다.",
    10: "보고서의 퀄리티를 완벽하게 높이고 싶지만, 정해진 마감 기한을 맞추기 위해 적당한 선에서 타협해야 하는 상황이 괴롭습니다.",
    11: "친한 동료가 사내 규정을 살짝 어기는 것을 보았을 때, 원칙대로 신고해야 할지 동료 간의 의리를 지켜야 할지 머리가 복잡합니다.",
    12: "회사의 비전과 핵심가치는 공감하지만, 당장 나에게 주어지는 보상이나 처우가 만족스럽지 않아 몰입하기가 어렵습니다.",
    13: "회의 시간에 좋은 아이디어가 떠올랐지만, \"그거 예전에 해봤는데 안 됐어\"라는 비난을 들을까 봐 안전하게 침묵을 선택합니다.",
    14: "내가 낸 성과를 팀 전체의 공으로 돌려야 할지, 아니면 나의 확실한 고과를 위해 내 지분을 명확히 주장해야 할지 갈등됩니다.",
    15: "업무 효율을 높이기 위해 메신저로 빠르게 소통하고 싶지만, 대면 보고와 격식을 중요시하는 조직 문화 때문에 불필요한 시간을 씁니다.",
    16: "도전적인 목표를 세워 혁신하고 싶지만, 실패했을 때 돌아올 책임 추궁이 무서워 안전하고 달성 가능한 목표만 세우게 됩니다.",
    17: "퇴근 후나 주말에 업무 연락이 왔을 때, 책임감 있게 응답해야 할지 나의 사생활을 보호하기 위해 무시해야 할지 고민스럽습니다.",
    18: "회사의 오래된 관행이 비효율적이라고 느껴지지만, \"원래 우리 회사는 그래\"라는 분위기에 순응하며 변화를 포기하게 됩니다.",
    19: "나보다 성과가 낮은 동료가 좋은 평가를 받는 불공정한 상황을 보았을 때, 문제를 제기해야 할지 아니면 참는 것이 미덕인지 갈등합니다.",
    20: "회사가 강조하는 '자율성'을 믿고 스스로 판단해 일을 처리하고 싶지만, 결국 모든 것을 확인받아야 하는 마이크로 매니징 시스템 사이에서 혼란을 느낍니다."
};

const WORKSHOP_Q = [
    { id: 'q1', targetProgress: 60, title: "Q1. 마음읽기", text: "이 상황에서 가장 크게 느껴지는 부담이나 걱정되는 부분은 무엇인가요?" },
    { id: 'q2', targetProgress: 75, title: "Q2. 관점넓히기", text: "만약 이 갈등을 해결하지 않고 지금처럼 유지한다면, 나중에는 어떤 결과가 생길까요?" },
    { id: 'q3', targetProgress: 90, title: "Q3. 행동약속", text: "상황을 조금이라도 낫게 만들기 위해, 내일 바로 실천해볼 수 있는 아주 작은 행동은 무엇일까요?" }
];

// ============================================
// 전역 상태 변수
// ============================================
let teamCode = '';       // 팀 코드
let userName = '';       // 사용자 이름
let surveyIndex = 0;
let surveyAnswers = { comm: [], safety: [], align: [], leadership: [] };
let vulnerableAreaId = null;
let selectedDilemmaId = null;
let workshopIndex = 0;
let workshopResponses = { q1: "", q2: "", q3: "" };
let areaAverages = {};
let comparisonChart = null;

// ============================================
// 유틸리티 함수
// ============================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

function showGlobalLoading(msg) {
    document.getElementById('loading-msg').innerText = msg;
    document.getElementById('global-loading').style.display = 'flex';
}

function hideGlobalLoading() {
    document.getElementById('global-loading').style.display = 'none';
}

function updateProgress(percent) {
    document.getElementById('progress-bar').style.width = percent + '%';
}

function switchStep(stepId) {
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active', 'fade-in'));
    const target = document.getElementById(stepId);
    target.style.display = 'block';
    
    // 랜딩 페이지에서는 헤더(진행률 바) 숨기기
    const header = document.getElementById('main-header');
    if (stepId === 'step-0') {
        header.style.display = 'none';
    } else {
        header.style.display = 'block';
    }

    setTimeout(() => {
        document.querySelectorAll('.step').forEach(s => {
            if (s.id !== stepId) s.style.display = 'none';
        });
        target.classList.add('active', 'fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
}

// ============================================
// STEP 0: 랜딩 페이지
// ============================================
document.getElementById('btn-start').addEventListener('click', () => {
    switchStep('step-code');
    updateProgress(5);
});

// ============================================
// STEP CODE: 팀 코드 + 이름 입력
// ============================================
const teamCodeInput = document.getElementById('team-code-input');
const userNameInput = document.getElementById('user-name-input');
const btnCodeNext = document.getElementById('btn-code-next');
const btnCodeBack = document.getElementById('btn-code-back');

// 입력값 검증 (둘 다 입력해야 다음 버튼 활성화)
function checkCodeInputs() {
    const codeVal = teamCodeInput.value.trim();
    const nameVal = userNameInput.value.trim();
    btnCodeNext.disabled = !(codeVal.length >= 1 && nameVal.length >= 1);
}

teamCodeInput.addEventListener('input', checkCodeInputs);
userNameInput.addEventListener('input', checkCodeInputs);

// "이전" 버튼: 랜딩 페이지로 돌아가기
btnCodeBack.addEventListener('click', () => {
    switchStep('step-0');
});

// "다음" 버튼: 설문 시작
btnCodeNext.addEventListener('click', () => {
    teamCode = teamCodeInput.value.trim();
    userName = userNameInput.value.trim();
    switchStep('step-1');
    updateProgress(10);
    renderSurvey();
});

// ============================================
// STEP 1: 설문 로직
// ============================================
const btnNext1 = document.getElementById('btn-survey-next');
const btnPrev1 = document.getElementById('btn-survey-prev');

function renderSurvey() {
    const area = SURVEY_AREAS[surveyIndex];
    document.getElementById('survey-area-title').innerText = `${surveyIndex+1}/4. ${area.name}`;
    
    const container = document.getElementById('survey-questions');
    container.innerHTML = '';
    
    area.questions.forEach((q, qIndex) => {
        const value = surveyAnswers[area.id][qIndex];
        let html = `<div class="q-block"><div class="q-text">${q}</div><div class="scale-wrap">`;
        for(let i=1; i<=5; i++) {
            const active = value === i ? 'active' : '';
            html += `<div class="scale-btn ${active}" onclick="answerSurvey('${area.id}', ${qIndex}, ${i})">${i}</div>`;
        }
        html += `</div></div>`;
        container.innerHTML += html;
    });

    btnPrev1.style.visibility = surveyIndex > 0 ? 'visible' : 'hidden';
    btnNext1.innerText = surveyIndex === 3 ? '진단 결과 확인하기' : '다음 단계';
    
    checkSurveyCompletion();
    updateProgress(10 + (surveyIndex) * 8);
}

window.answerSurvey = function(areaId, qIndex, val) {
    surveyAnswers[areaId][qIndex] = val;
    renderSurvey();
}

function checkSurveyCompletion() {
    const currentAns = surveyAnswers[SURVEY_AREAS[surveyIndex].id];
    let count = 0;
    for (let i = 0; i < 5; i++) { if (currentAns[i]) count++; }
    btnNext1.disabled = count < 5;
}

btnNext1.addEventListener('click', () => {
    if (surveyIndex < 3) {
        surveyIndex++;
        renderSurvey();
    } else {
        processResults();
    }
});

btnPrev1.addEventListener('click', () => {
    if (surveyIndex > 0) {
        surveyIndex--;
        renderSurvey();
    } else {
        // 첫 번째 설문에서 이전 누르면 팀 코드 입력으로 돌아가기
        switchStep('step-code');
    }
});

// ============================================
// STEP 2: 결과 분석 로직
// ============================================
let radarChart = null;

function processResults() {
    let minScore = 99;
    
    SURVEY_AREAS.forEach(area => {
        const sum = surveyAnswers[area.id].reduce((a, b) => a + b, 0);
        const avg = +(sum / 5).toFixed(1);
        areaAverages[area.id] = avg;
        if (avg < minScore) { minScore = avg; vulnerableAreaId = area.id; }
    });

    // 레이더 차트 그리기
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SURVEY_AREAS.map(a => a.name),
            datasets: [{
                label: '나의 점수',
                data: SURVEY_AREAS.map(a => areaAverages[a.id]),
                backgroundColor: 'rgba(99, 102, 241, 0.3)',
                borderColor: '#6366f1',
                pointBackgroundColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            scales: {
                r: { angleLines: { color: 'rgba(255,255,255,0.1)' }, grid: { color: 'rgba(255,255,255,0.1)' }, 
                     pointLabels: { color: '#cbd5e1', font: { size: 13 } }, ticks: { min: 0, max: 5, stepSize: 1, backdropColor: 'transparent', color: '#64748b' } }
            },
            plugins: { legend: { display: false } }
        }
    });

    // 점수 카드 생성
    const cardsContainer = document.getElementById('score-cards');
    cardsContainer.innerHTML = '';
    
    SURVEY_AREAS.forEach(area => {
        const isVuln = area.id === vulnerableAreaId;
        cardsContainer.innerHTML += `
            <div class="score-card ${isVuln ? 'danger' : ''}">
                <h4>${area.name}</h4>
                <div class="val">${areaAverages[area.id]}</div>
                ${isVuln ? '<div class="mt-2 text-sm" style="color:var(--danger)">우선 개선 필요</div>' : ''}
            </div>
        `;
    });

    updateProgress(42);
    switchStep('step-2');

    // 결과를 서버에 저장하고 팀 비교 데이터 불러오기
    saveAndCompare();
}

// 결과 저장 + 팀 비교
async function saveAndCompare() {
    const compSection = document.getElementById('team-comparison-section');
    const compLoading = document.getElementById('comparison-loading');
    const compEmpty = document.getElementById('comparison-empty');
    const compCards = document.getElementById('comparison-cards');
    
    compSection.style.display = 'block';
    compLoading.style.display = 'block';
    compEmpty.style.display = 'none';
    compCards.innerHTML = '';

    try {
        // 1. 결과 저장
        await fetch('/api/save-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                team_code: teamCode,
                user_name: userName,
                survey_answers: surveyAnswers,
                area_averages: areaAverages
            })
        });

        // 2. 팀 결과 조회
        const res = await fetch('/api/get-team-results', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ team_code: teamCode })
        });
        const data = await res.json();
        
        compLoading.style.display = 'none';

        if (data.count <= 1) {
            // 나만 진단한 경우
            compEmpty.style.display = 'block';
            return;
        }

        // 3. 비교 차트 그리기
        renderComparisonChart(data.team_averages);
        renderComparisonCards(data.team_averages, data.count);

    } catch (err) {
        compLoading.style.display = 'none';
        compEmpty.style.display = 'block';
        console.error('팀 비교 데이터 오류:', err);
    }
}

function renderComparisonChart(teamAvgs) {
    const ctx = document.getElementById('comparisonChart').getContext('2d');
    if (comparisonChart) comparisonChart.destroy();
    
    comparisonChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SURVEY_AREAS.map(a => a.name),
            datasets: [
                {
                    label: '나의 점수',
                    data: SURVEY_AREAS.map(a => areaAverages[a.id]),
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    borderColor: '#818cf8',
                    pointBackgroundColor: '#818cf8',
                    borderWidth: 2
                },
                {
                    label: '팀 평균',
                    data: SURVEY_AREAS.map(a => teamAvgs[a.id] || 0),
                    backgroundColor: 'rgba(16, 185, 129, 0.2)',
                    borderColor: '#10b981',
                    pointBackgroundColor: '#10b981',
                    borderWidth: 2
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#cbd5e1', font: { size: 12 } },
                    ticks: { min: 0, max: 5, stepSize: 1, backdropColor: 'transparent', color: '#64748b' }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#94a3b8', font: { size: 12 } }
                }
            }
        }
    });
}

function renderComparisonCards(teamAvgs, count) {
    const container = document.getElementById('comparison-cards');
    container.innerHTML = `<div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">총 ${count}명의 팀원이 진단에 참여했습니다</div>`;
    
    SURVEY_AREAS.forEach(area => {
        const my = areaAverages[area.id];
        const team = +(teamAvgs[area.id] || 0).toFixed(1);
        const diff = +(my - team).toFixed(1);
        let diffClass = 'diff-equal';
        let diffText = '동일';
        if (diff > 0) { diffClass = 'diff-positive'; diffText = `+${diff} 높음`; }
        else if (diff < 0) { diffClass = 'diff-negative'; diffText = `${diff} 낮음`; }

        container.innerHTML += `
            <div class="score-card comparison-card">
                <h4>${area.name}</h4>
                <div class="my-score">${my}</div>
                <div class="team-score">팀 평균 ${team}</div>
                <div class="diff-indicator ${diffClass}">${diffText}</div>
            </div>
        `;
    });
}

// ============================================
// STEP 3: 딜레마 선택 로직
// ============================================
document.getElementById('btn-to-dilemma').addEventListener('click', () => {
    const area = SURVEY_AREAS.find(a => a.id === vulnerableAreaId);
    document.getElementById('vuln-area-display').innerText = `[ ${area.name} ] 영역의 핵심 딜레마`;
    
    const list = document.getElementById('dilemma-list');
    list.innerHTML = '';
    
    area.dilemmas.forEach(dNum => {
        list.innerHTML += `<div class="dl-card" onclick="selectDilemma(${dNum}, this)">
            <span style="color:var(--primary); font-weight:bold; margin-right:8px">#${dNum}</span> ${DILEMMAS[dNum]}
        </div>`;
    });

    updateProgress(50);
    switchStep('step-3');
});

window.selectDilemma = function(id, el) {
    document.querySelectorAll('.dl-card').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    selectedDilemmaId = id;
    document.getElementById('btn-start-workshop').disabled = false;
}

document.getElementById('btn-start-workshop').addEventListener('click', () => {
    document.getElementById('active-dilemma-text').innerText = DILEMMAS[selectedDilemmaId];
    renderWorkshopQ();
    switchStep('step-4');
});

// ============================================
// STEP 4: AI 워크숍 로직
// ============================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => {
        if(b.getAttribute('data-tab') === tabId) b.classList.add('active');
        else b.classList.remove('active');
    });
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if(!this.disabled) switchTab(this.getAttribute('data-tab'));
    });
});

const answerInput = document.getElementById('answer-input');
const btnSubmitAnswer = document.getElementById('btn-submit-answer');
const btnNextQuestion = document.getElementById('btn-next-question');

answerInput.addEventListener('input', () => {
    btnSubmitAnswer.disabled = answerInput.value.trim().length < 5;
});

function renderWorkshopQ() {
    const q = WORKSHOP_Q[workshopIndex];
    document.getElementById('workshop-q-title').innerText = q.title;
    document.getElementById('workshop-q-desc').innerText = q.text;
    
    answerInput.value = '';
    answerInput.disabled = false;
    btnSubmitAnswer.disabled = true;
    btnSubmitAnswer.style.display = 'inline-flex';
    
    document.getElementById('tab-feedback-btn').disabled = true;
    
    // 힌트 탭 초기화
    document.getElementById('hint-empty-state').style.display = 'block';
    document.getElementById('hint-loading').style.display = 'none';
    document.getElementById('hint-results').style.display = 'none';

    switchTab('tab-write');
    updateProgress(q.targetProgress);
    
    if (workshopIndex === 2) {
        btnNextQuestion.innerText = "조직문화 솔루션 리포트 생성하기";
    } else {
        btnNextQuestion.innerText = "다음 단계로 이동";
    }
}

// AI API 호출 래퍼
async function callAI(payload) {
    try {
        const res = await fetch('/api/feedback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || '서버 응답 오류입니다.');
        if (!data.feedback) throw new Error('AI 응답 파싱에 실패했습니다.');
        return data.feedback;
    } catch (e) {
        throw e;
    }
}

// AI 추천 답변 불러오기
document.getElementById('btn-load-hints').addEventListener('click', async () => {
    document.getElementById('hint-empty-state').style.display = 'none';
    document.getElementById('hint-loading').style.display = 'block';
    
    try {
        const q = WORKSHOP_Q[workshopIndex];
        const fb = await callAI({
            type: 'suggestion',
            stepLabel: q.title,
            dilemma: DILEMMAS[selectedDilemmaId],
            question: q.text
        });

        document.getElementById('hint-loading').style.display = 'none';
        
        if (fb.suggestions && fb.suggestions.length > 0) {
            const list = document.getElementById('hint-results');
            list.innerHTML = '<p class="text-muted mb-3">가장 비슷한 고민을 골라보세요. 클릭시 입력창으로 복사됩니다.</p>';
            fb.suggestions.forEach(rec => {
                const div = document.createElement('div');
                div.className = 'hint-item';
                div.innerText = rec;
                div.onclick = () => {
                    answerInput.value = rec;
                    btnSubmitAnswer.disabled = false;
                    switchTab('tab-write');
                };
                list.appendChild(div);
            });
            list.style.display = 'flex';
        } else {
            throw new Error('추천 데이터를 불러오지 못했습니다.');
        }
    } catch(err) {
        document.getElementById('hint-loading').style.display = 'none';
        document.getElementById('hint-empty-state').style.display = 'block';
        showToast("오류: " + err.message);
    }
});

// 답변 제출
btnSubmitAnswer.addEventListener('click', async () => {
    const text = answerInput.value.trim();
    if (!text) return;
    
    const q = WORKSHOP_Q[workshopIndex];
    workshopResponses[q.id] = text;
    
    document.getElementById(`final-a${workshopIndex+1}`).innerText = text;

    showGlobalLoading('학습자의 고민을 심층 분석하고 있습니다...');
    
    try {
        const fb = await callAI({
            type: 'workshop',
            stepLabel: q.title,
            dilemma: DILEMMAS[selectedDilemmaId],
            question: q.text,
            answer: text
        });

        hideGlobalLoading();
        
        answerInput.disabled = true;
        btnSubmitAnswer.style.display = 'none';
        
        let html = `
            <p><strong>[핵심 진단]</strong><br>${fb.diagnosis}</p>
            <p><strong>[공감과 이해]</strong><br>${fb.empathy}</p>
            <p><strong>[관점 전환]</strong><br>${fb.reframe}</p>
            <p><strong>[추천 행동]</strong><br><span style="color:var(--text-main)">${fb.action}</span></p>
        `;
        document.getElementById('feedback-content').innerHTML = html;
        
        document.getElementById('tab-feedback-btn').disabled = false;
        switchTab('tab-feedback');

    } catch(err) {
        hideGlobalLoading();
        showToast("오류: " + err.message);
    }
});

btnNextQuestion.addEventListener('click', () => {
    if (workshopIndex < 2) {
        workshopIndex++;
        renderWorkshopQ();
    } else {
        generateFinalReport();
    }
});

// ============================================
// STEP 5: 최종 리포트 로직
// ============================================
async function generateFinalReport() {
    showGlobalLoading('관점을 종합하여 솔루션 리포트를 작성 중입니다...');
    document.getElementById('final-dilemma-block').innerText = `"${DILEMMAS[selectedDilemmaId]}"`;
    
    const scoresContainer = document.getElementById('final-scores');
    scoresContainer.innerHTML = '';
    SURVEY_AREAS.forEach(area => {
        scoresContainer.innerHTML += `<div class="score-card mini-card">
            <h4>${area.name}</h4>
            <div class="val">${areaAverages[area.id]}</div>
        </div>`;
    });

    // 팀 평균 비교 데이터 로드 (병렬 실행)
    loadTeamComparison();

    try {
        const fb = await callAI({
            type: 'final',
            dilemma: DILEMMAS[selectedDilemmaId],
            a1: workshopResponses.q1,
            a2: workshopResponses.q2,
            a3: workshopResponses.q3
        });

        hideGlobalLoading();
        
        let reportHtml = `<h4>■ 진단 요약</h4><p>${fb.summary}</p>`;
        reportHtml += `<h4>■ 조직문화 심층 분석</h4><p>${fb.culture_diagnosis}</p>`;
        
        if (fb.feedback_criteria) {
            reportHtml += `<h4>■ 항목별 평가</h4><ul>`;
            fb.feedback_criteria.forEach(fc => {
                reportHtml += `<li><strong>${fc.label}:</strong> ${fc.comment}</li>`;
            });
            reportHtml += `</ul>`;
        }

        if (fb.solutions) {
            reportHtml += `<h4>■ 대안 솔루션</h4><ul>`;
            fb.solutions.forEach(s => { reportHtml += `<li>${s}</li>`; });
            reportHtml += `</ul>`;
        }

        reportHtml += `<h4 style="color:var(--primary-hover)">■ 즉시 실행 전략</h4><p style="font-size:1.1rem; font-weight:500;">${fb.action}</p>`;
        reportHtml += `<p style="margin-top:2rem; font-style:italic; color:var(--success)">"${fb.cheer}"</p>`;

        document.getElementById('final-report-content').innerHTML = reportHtml;
        
        // 워크숍 응답까지 포함하여 최종 결과 업데이트
        updateFinalResponse();

        updateProgress(100);
        switchStep('step-5');

    } catch(err) {
        hideGlobalLoading();
        showToast("오류: " + err.message);
    }
}

// ============================================
// 팀 평균 vs 나의 점수 비교 로직
// ============================================
async function loadTeamComparison() {
    try {
        // admin-results API로 같은 팀 코드의 데이터 조회
        const res = await fetch(`/api/admin-results?team_code=${encodeURIComponent(teamCode)}&admin_code=0000`);
        const data = await res.json();

        if (!res.ok || !data.results || data.results.length < 2) {
            // 팀원 데이터가 본인 포함 2명 미만이면 비교 불가
            document.getElementById('final-team-comparison').style.display = 'none';
            document.getElementById('final-team-comparison-empty').style.display = 'block';
            return;
        }

        // 팀 전체 평균 계산 (본인 포함)
        const teamAvg = { comm: 0, safety: 0, align: 0, leadership: 0 };
        let count = 0;
        data.results.forEach(r => {
            if (r.area_averages) {
                teamAvg.comm += Number(r.area_averages.comm || 0);
                teamAvg.safety += Number(r.area_averages.safety || 0);
                teamAvg.align += Number(r.area_averages.align || 0);
                teamAvg.leadership += Number(r.area_averages.leadership || 0);
                count++;
            }
        });

        if (count < 2) {
            document.getElementById('final-team-comparison').style.display = 'none';
            document.getElementById('final-team-comparison-empty').style.display = 'block';
            return;
        }

        // 평균 계산
        Object.keys(teamAvg).forEach(k => {
            teamAvg[k] = Number((teamAvg[k] / count).toFixed(1));
        });

        // 비교 섹션 표시
        document.getElementById('final-team-comparison').style.display = 'block';
        document.getElementById('final-team-comparison-empty').style.display = 'none';

        // 레이더 차트 렌더링
        renderComparisonChart(teamAvg);

        // 영역별 비교 카드 렌더링
        renderComparisonCards(teamAvg);

        // 인사이트 텍스트 생성
        renderComparisonInsight(teamAvg, count);

    } catch (err) {
        console.error('팀 비교 데이터 로드 오류:', err);
        document.getElementById('final-team-comparison').style.display = 'none';
        document.getElementById('final-team-comparison-empty').style.display = 'block';
    }
}

// 비교 레이더 차트 렌더링
function renderComparisonChart(teamAvg) {
    const ctx = document.getElementById('finalComparisonChart').getContext('2d');
    const labels = SURVEY_AREAS.map(a => a.name);
    const myScores = SURVEY_AREAS.map(a => areaAverages[a.id]);
    const teamScores = SURVEY_AREAS.map(a => teamAvg[a.id]);

    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: '나의 점수',
                    data: myScores,
                    backgroundColor: 'rgba(251, 146, 60, 0.15)',
                    borderColor: 'rgba(251, 146, 60, 0.9)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(251, 146, 60, 1)',
                    pointRadius: 4
                },
                {
                    label: '팀 평균',
                    data: teamScores,
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    borderColor: 'rgba(99, 102, 241, 0.9)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(99, 102, 241, 1)',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { stepSize: 1, color: '#94a3b8', font: { size: 10 } },
                    grid: { color: 'rgba(148,163,184,0.15)' },
                    pointLabels: { color: '#e2e8f0', font: { size: 11 } }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#e2e8f0', font: { size: 12 }, usePointStyle: true }
                }
            }
        }
    });
}

// 비교 카드 렌더링
function renderComparisonCards(teamAvg) {
    const container = document.getElementById('final-comparison-cards');
    container.innerHTML = '';
    SURVEY_AREAS.forEach(area => {
        const my = areaAverages[area.id];
        const team = teamAvg[area.id];
        const diff = (my - team).toFixed(1);
        const diffNum = Number(diff);
        let diffLabel, diffColor;
        if (diffNum > 0.3) { diffLabel = `+${diff} ↑`; diffColor = 'var(--success)'; }
        else if (diffNum < -0.3) { diffLabel = `${diff} ↓`; diffColor = 'var(--danger)'; }
        else { diffLabel = '≈ 동일'; diffColor = '#94a3b8'; }
        
        container.innerHTML += `<div class="score-card mini-card">
            <h4>${area.name}</h4>
            <div style="display:flex; justify-content:center; gap:0.8rem; align-items:baseline;">
                <span style="color:rgba(251,146,60,0.9); font-weight:600;">${my}</span>
                <span style="color:#64748b; font-size:0.8rem;">vs</span>
                <span style="color:rgba(99,102,241,0.9); font-weight:600;">${team}</span>
            </div>
            <div style="font-size:0.85rem; font-weight:600; color:${diffColor}; margin-top:0.3rem;">${diffLabel}</div>
        </div>`;
    });
}

// 인사이트 텍스트 생성
function renderComparisonInsight(teamAvg, memberCount) {
    const container = document.getElementById('final-comparison-insight');
    let html = `<h4 style="margin-bottom: 0.8rem;">💡 나의 포지션 인사이트 <span style="font-size:0.8rem; font-weight:400; color:#94a3b8;">(팀원 ${memberCount}명 기준)</span></h4>`;
    
    const strengths = [];
    const gaps = [];
    const similars = [];
    
    SURVEY_AREAS.forEach(area => {
        const diff = areaAverages[area.id] - teamAvg[area.id];
        if (diff > 0.3) strengths.push(area.name);
        else if (diff < -0.3) gaps.push(area.name);
        else similars.push(area.name);
    });

    if (strengths.length > 0) {
        html += `<p style="margin-bottom:0.5rem;">🟢 <strong>${strengths.join(', ')}</strong> 영역에서 팀 평균보다 높은 점수를 주셨습니다. 이 영역에서 <strong>팀의 강점 역할</strong>을 하고 계십니다.</p>`;
    }
    if (gaps.length > 0) {
        html += `<p style="margin-bottom:0.5rem;">🔴 <strong>${gaps.join(', ')}</strong> 영역에서 팀 평균보다 낮게 인식하고 계십니다. 이 부분에서 <strong>팀과의 인식 차이</strong>가 있으며, 소통이 필요할 수 있습니다.</p>`;
    }
    if (similars.length > 0) {
        html += `<p style="margin-bottom:0;">🟡 <strong>${similars.join(', ')}</strong> 영역은 팀과 <strong>유사한 시각</strong>을 가지고 있습니다.</p>`;
    }

    container.innerHTML = html;
}

// 최종 결과를 서버에 업데이트 (딜레마 + 워크숍 응답 포함)
async function updateFinalResponse() {
    try {
        await fetch('/api/save-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                team_code: teamCode,
                user_name: userName,
                survey_answers: surveyAnswers,
                area_averages: areaAverages,
                dilemma_id: selectedDilemmaId,
                workshop_responses: workshopResponses,
                is_update: true
            })
        });
    } catch (err) {
        console.error('최종 결과 저장 오류:', err);
    }
}

// ============================================
// 이미지 내보내기
// ============================================
document.getElementById('btn-download-img').addEventListener('click', async () => {
    const targetArea = document.getElementById('report-capture-area');
    showToast("이미지를 생성 중입니다. 잠시만 기다려주세요...");
    
    try {
        const canvas = await html2canvas(targetArea, {
            scale: 2,
            backgroundColor: '#0d0f17',
            logging: false,
            useCORS: true
        });
        
        const link = document.createElement('a');
        link.download = '팀_건강도_솔루션_리포트.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showToast("이미지 저장이 완료되었습니다! 🎉");
    } catch (err) {
        console.error("html2canvas err:", err);
        showToast("이미지 저장 중 오류가 발생했습니다.");
    }
});

// ============================================
// 초기화 - 랜딩 페이지에서는 헤더 숨기기
// ============================================
document.getElementById('main-header').style.display = 'none';

// ============================================
// 관리자 대시보드 진입 모달
// ============================================
const adminModal = document.getElementById('admin-modal-overlay');
const adminModalCode = document.getElementById('admin-modal-code');
const adminModalError = document.getElementById('admin-modal-error');

document.getElementById('btn-admin-entry').addEventListener('click', () => {
    adminModal.style.display = 'flex';
    adminModalCode.value = '';
    adminModalError.style.display = 'none';
    adminModalCode.focus();
});

document.getElementById('admin-modal-cancel').addEventListener('click', () => {
    adminModal.style.display = 'none';
});

// 모달 외부 클릭 시 닫기
adminModal.addEventListener('click', (e) => {
    if (e.target === adminModal) adminModal.style.display = 'none';
});

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && adminModal.style.display === 'flex') {
        adminModal.style.display = 'none';
    }
});

// Enter 키로 확인
adminModalCode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') document.getElementById('admin-modal-confirm').click();
});

document.getElementById('admin-modal-confirm').addEventListener('click', () => {
    const code = adminModalCode.value.trim();
    if (code === '0000') {
        window.location.href = '/admin.html';
    } else {
        adminModalError.style.display = 'block';
        adminModalCode.value = '';
        adminModalCode.focus();
    }
});
