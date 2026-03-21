// app.js

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
        questions: ["16. 리더가 팀원 개개인의 상황과 어려움에 관심을 기울인다", "17. 리더로부터 성장에 도움이 되는 피드백을 받는다", "18. 팀원들 간의 관계가 신뢰를 기반으로 하고 있다", "19. 팀 내에서 공로와 기여가 적절하게 인정받는다", "20. 나는 이 팀에서 일하는 거시 의미 있다고 느낀다"],
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

let surveyIndex = 0;
let surveyAnswers = { comm: [], safety: [], align: [], leadership: [] };
let vulnerableAreaId = null;
let selectedDilemmaId = null;
let workshopIndex = 0;
let workshopResponses = { q1: "", q2: "", q3: "" };
let areaAverages = {};

// Utility
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerText = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
}

// ----------------------------------------------------
// Image Export Logic
// ----------------------------------------------------
document.getElementById('btn-download-img').addEventListener('click', async () => {
    const targetArea = document.getElementById('report-capture-area');
    showToast("이미지를 생성 중입니다. 잠시만 기다려주세요...");
    
    try {
        const canvas = await html2canvas(targetArea, {
            scale: 2, // 고해상도 리포트
            backgroundColor: '#0d0f17', // 다크모드 배경색 매칭
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
    
    setTimeout(() => {
        document.querySelectorAll('.step').forEach(s => {
            if (s.id !== stepId) s.style.display = 'none';
        });
        target.classList.add('active', 'fade-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
}

// STEP 1: Survey Logic
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
    updateProgress((surveyIndex) * 10 + 10);
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
    }
});

// STEP 2: Results Logic
let radarChart = null;

function processResults() {
    let minScore = 99;
    
    SURVEY_AREAS.forEach(area => {
        const sum = surveyAnswers[area.id].reduce((a, b) => a + b, 0);
        const avg = +(sum / 5).toFixed(1);
        areaAverages[area.id] = avg;
        if (avg < minScore) { minScore = avg; vulnerableAreaId = area.id; }
    });

    // Draw Chart
    const ctx = document.getElementById('radarChart').getContext('2d');
    if (radarChart) radarChart.destroy();
    radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: SURVEY_AREAS.map(a => a.name),
            datasets: [{
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

    updateProgress(45);
    switchStep('step-2');
}

// STEP 3: Dilemma Logic
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

// STEP 4: AI Workshop Logic
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
    
    // Reset Hint tab
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

// AI API Call wrapper
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

// Load Recommendations
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

// Submit Answer
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

// STEP 5: Final Report Logic
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
        
        updateProgress(100);
        switchStep('step-5');

    } catch(err) {
        hideGlobalLoading();
        showToast("오류: " + err.message);
    }
}

// Init
renderSurvey();
