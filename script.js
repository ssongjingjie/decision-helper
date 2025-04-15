// 数据管理
let simpleOptions = [];
let complexOptions = [];
let factors = [];
let scores = {};

// 导航切换
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // 更新按钮状态
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // 更新内容显示
        document.querySelectorAll('.decision-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

// 简单决策功能
function addSimpleOption() {
    const input = document.getElementById('simple-option');
    const value = input.value.trim();
    
    if (value) {
        simpleOptions.push(value);
        input.value = '';
        updateSimpleOptionsList();
    } else {
        alert('请输入有效的选项');
    }
}

function updateSimpleOptionsList() {
    const list = document.getElementById('simple-options-list');
    list.innerHTML = '';
    
    simpleOptions.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.innerHTML = `
            <span>${option}</span>
            <button class="delete-btn" onclick="deleteSimpleOption(${index})">删除</button>
        `;
        list.appendChild(item);
    });
}

function deleteSimpleOption(index) {
    simpleOptions.splice(index, 1);
    updateSimpleOptionsList();
}

function makeSimpleDecision() {
    if (simpleOptions.length < 2) {
        alert('请至少添加两个选项');
        return;
    }
    
    const result = document.getElementById('simple-result');
    const randomIndex = Math.floor(Math.random() * simpleOptions.length);
    const selectedOption = simpleOptions[randomIndex];
    
    result.innerHTML = `
        <h3>决策结果：</h3>
        <p>${selectedOption}</p>
    `;
    result.classList.add('active');
}

// 复杂决策功能
function addComplexOption() {
    const input = document.getElementById('complex-option');
    const value = input.value.trim();
    
    if (value) {
        complexOptions.push(value);
        input.value = '';
        updateComplexOptionsList();
        updateScoreTable();
    } else {
        alert('请输入有效的选项');
    }
}

function updateComplexOptionsList() {
    const list = document.getElementById('complex-options-list');
    list.innerHTML = '';
    
    complexOptions.forEach((option, index) => {
        const item = document.createElement('div');
        item.className = 'option-item';
        item.innerHTML = `
            <span>${option}</span>
            <button class="delete-btn" onclick="deleteComplexOption(${index})">删除</button>
        `;
        list.appendChild(item);
    });
}

function deleteComplexOption(index) {
    complexOptions.splice(index, 1);
    updateComplexOptionsList();
    updateScoreTable();
}

function addFactor() {
    const nameInput = document.getElementById('factor-name');
    const weightInput = document.getElementById('factor-weight');
    const name = nameInput.value.trim();
    const weight = parseInt(weightInput.value);
    
    if (name && weight >= 1 && weight <= 10) {
        factors.push({ name, weight });
        nameInput.value = '';
        weightInput.value = '5';
        updateFactorsList();
        updateScoreTable();
    } else {
        alert('请输入有效的因素名称和权重（1-10）');
    }
}

function updateFactorsList() {
    const list = document.getElementById('factors-list');
    list.innerHTML = '';
    
    factors.forEach((factor, index) => {
        const item = document.createElement('div');
        item.className = 'factor-item';
        item.innerHTML = `
            <span>${factor.name} (权重: ${factor.weight})</span>
            <button class="delete-btn" onclick="deleteFactor(${index})">删除</button>
        `;
        list.appendChild(item);
    });
}

function deleteFactor(index) {
    factors.splice(index, 1);
    updateFactorsList();
    updateScoreTable();
}

function updateScoreTable() {
    const table = document.getElementById('score-table');
    if (complexOptions.length === 0 || factors.length === 0) {
        table.innerHTML = '';
        return;
    }
    
    let html = `
        <table>
            <tr>
                <th>选项</th>
                ${factors.map(factor => `<th>${factor.name}</th>`).join('')}
            </tr>
    `;
    
    complexOptions.forEach(option => {
        if (!scores[option]) {
            scores[option] = {};
        }
        
        html += `
            <tr>
                <td>${option}</td>
                ${factors.map(factor => `
                    <td>
                        <input type="number" 
                               min="1" 
                               max="10" 
                               value="${scores[option][factor.name] || ''}"
                               onchange="updateScore('${option}', '${factor.name}', this.value)"
                        >
                    </td>
                `).join('')}
            </tr>
        `;
    });
    
    html += '</table>';
    table.innerHTML = html;
}

function updateScore(option, factor, value) {
    if (!scores[option]) {
        scores[option] = {};
    }
    scores[option][factor] = parseInt(value) || 0;
}

function makeComplexDecision() {
    if (complexOptions.length < 2 || factors.length < 1) {
        alert('请至少添加两个选项和一个因素');
        return;
    }
    
    // 检查是否所有选项都已评分
    const isComplete = complexOptions.every(option => 
        factors.every(factor => 
            scores[option] && typeof scores[option][factor.name] === 'number'
        )
    );
    
    if (!isComplete) {
        alert('请完成所有选项的评分');
        return;
    }
    
    // 计算总分
    const results = complexOptions.map(option => {
        const totalScore = factors.reduce((sum, factor) => {
            return sum + (scores[option][factor.name] * factor.weight);
        }, 0);
        return { option, score: totalScore };
    });
    
    // 按分数排序
    results.sort((a, b) => b.score - a.score);
    
    // 显示结果
    const result = document.getElementById('complex-result');
    result.innerHTML = `
        <h3>决策结果：</h3>
        <p>${results[0].option}</p>
        <div class="score-details">
            <h4>得分详情：</h4>
            <table>
                <tr>
                    <th>选项</th>
                    <th>总分</th>
                </tr>
                ${results.map(r => `
                    <tr>
                        <td>${r.option}</td>
                        <td>${r.score}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
    result.classList.add('active');
} 