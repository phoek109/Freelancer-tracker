let currentCurrency = '$';
let isLiveTrackingMode = true;

window.subCategoriesCache = {
    income: ['Active Invoice', 'Client Retainers'],
    expense: ['Software/Tools', 'Marketing/Ads', 'Hardware/Office'],
    tax: ['Income Tax Reserve', 'Withholding Vault']
};

window.localHistoryTotals = {
    gross: 0,
    expenses: 0,
    taxWithheld: 0,
    breakdownValues: {}
};

const inputRevenue = document.getElementById('inputRevenue');
const inputRatio = document.getElementById('inputRatio');
const inputTaxRate = document.getElementById('inputTaxRate');
const canvas = document.getElementById('flowChart');
const btnToggle = document.getElementById('btnToggleMode');

function toggleDatabaseMode() {
    isLiveTrackingMode = !isLiveTrackingMode;
    if (isLiveTrackingMode) {
        btnToggle.innerText = "MODE: LIVE TRACKING";
        btnToggle.style.backgroundColor = "#1e293b";
        btnToggle.style.color = "#38bdf8";
        btnToggle.style.borderColor = "#334155";
    } else {
        btnToggle.innerText = "MODE: LIVE + PREDICTIVE MARGINS";
        btnToggle.style.backgroundColor = "rgba(168, 85, 247, 0.15)";
        btnToggle.style.color = "#a855f7";
        btnToggle.style.borderColor = "#a855f7";
    }
    updateMatrixData();
}

function resizeCanvas() {
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

function drawBackgroundGrid(ctx, w, h) {
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}

function drawFlowLines(expRatio, taxRate, netProfit, gross) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width; const h = canvas.height;
    drawBackgroundGrid(ctx, w, h);

    const startX = 140; const startY = h / 2; const endX = w - 160;

    const taxFactor = netProfit > 0 ? (netProfit * taxRate / gross) : 0;
    const endY_Expenses = startY - (expRatio * (h * 0.35));
    const endY_Tax = startY;
    const endY_TakeHome = startY + ((1 - expRatio - taxFactor) * (h * 0.35));

    const expPercent = Math.round(expRatio * 100) || 0;
    const taxPercent = Math.round(taxRate * 100) || 0;
    const homePercent = Math.round((1 - expRatio - taxFactor) * 100) || 0;

    ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(startX, startY);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8'; ctx.fillText("GROSS INPUT", 20, startY - 14);

    function drawCurve(endY, color, baseText, percentValue) {
        ctx.beginPath(); ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.stroke(); ctx.shadowBlur = 0;

        const labelText = `${baseText} (${percentValue}%)`;
        const pillW = ctx.measureText(labelText).width + 24;
        ctx.beginPath(); ctx.roundRect(endX, endY - 11, pillW, 22, 11);
        ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText(labelText, endX + 12, endY + 4);
    }

    drawCurve(endY_Expenses, '#f87171', 'Expenses', expPercent);
    drawCurve(endY_Tax, '#facc15', 'Tax Reserve', taxPercent);
    drawCurve(endY_TakeHome, '#4ade80', 'Take-Home', homePercent);

    ctx.beginPath(); ctx.arc(startX, startY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText(currentCurrency, startX, startY + 4); ctx.textAlign = 'left';
}

function renderDynamicLegendBars(gross, totalExpenses, taxReserve) {
    const container = document.getElementById('dynamicBreakdownContainer');
    container.innerHTML = '';
    
    const bValues = window.localHistoryTotals.breakdownValues;
    const caches = window.subCategoriesCache;

    function buildBarRow(name, amount, parentMaxAmount, colorClass) {
        if (amount === 0) return;
        const percentage = parentMaxAmount > 0 ? Math.round((amount / parentMaxAmount) * 100) : 0;
        
        const row = document.createElement('div');
        row.className = 'dynamic-bar-row';
        row.innerHTML = `
            <span class="dynamic-bar-label">${name.toUpperCase()}</span>
            <div class="dynamic-bar-track">
                <div class="dynamic-bar-fill ${colorClass}" style="width: ${percentage}%"></div>
            </div>
            <span class="dynamic-bar-value">${currentCurrency}${Math.round(amount).toLocaleString()} (${percentage}%)</span>
        `;
        container.appendChild(row);
    }

    caches.income.forEach(name => buildBarRow(name, bValues[name] || 0, gross, 'fill-income'));
    caches.expense.forEach(name => buildBarRow(name, bValues[name] || 0, totalExpenses, 'fill-expense'));
    caches.tax.forEach(name => buildBarRow(name, bValues[name] || 0, taxReserve, 'fill-tax'));
    
    if(container.innerHTML === '') {
        container.innerHTML = `<span style="font-size:11px; color:#475569; text-align:center; display:block; width:100%;">No active breakdown values to plot. Fill entries in the sidebar form to generate bars.</span>`;
    }
}

function updateMatrixData() {
    let gross, expRatio, taxRate;
    const totals = window.localHistoryTotals;

    if (isLiveTrackingMode) {
        gross = totals.gross;
        const totalExpenses = totals.expenses;
        expRatio = gross > 0 ? (totalExpenses / gross) : 0;
        taxRate = parseFloat(inputTaxRate.value) / 100;
        
        inputRevenue.value = gross || 0;
        inputRatio.value = Math.round(expRatio * 100) || 0;
    } else {
        const sliderGrossVal = parseFloat(inputRevenue.value) || 0;
        if (sliderGrossVal < totals.gross) {
            gross = totals.gross;
            inputRevenue.value = gross;
        } else {
            gross = sliderGrossVal;
        }
        const simulatedGrossFuture = gross - totals.gross;
        const sliderExpRatio = (parseFloat(inputRatio.value) || 0) / 100;
        const calculatedTotalExpenses = totals.expenses + (simulatedGrossFuture * sliderExpRatio);
        expRatio = gross > 0 ? (calculatedTotalExpenses / gross) : 0;
        taxRate = (parseFloat(inputTaxRate.value) || 0) / 100;
    }

    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = (netProfit > 0 ? netProfit * taxRate : 0) + totals.taxWithheld;
    const takeHome = netProfit - (netProfit > 0 ? netProfit * taxRate : 0);

    // Injects default sandbox mock values ONLY if user hasn't logged real data entries yet
    if(gross > 0 && Object.keys(totals.breakdownValues).length === 0) {
        totals.breakdownValues['Active Invoice'] = gross * 0.65;
        totals.breakdownValues['Client Retainers'] = gross * 0.35;
        totals.breakdownValues['Software/Tools'] = totalExpenses * 0.4;
        totals.breakdownValues['Marketing/Ads'] = totalExpenses * 0.35;
        totals.breakdownValues['Hardware/Office'] = totalExpenses * 0.25;
        totals.breakdownValues['Income Tax Reserve'] = taxReserve * 0.8;
        totals.breakdownValues['Withholding Vault'] = taxReserve * 0.2;
    }

    document.getElementById('valRevenue').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('valRatio').innerText = `${inputRatio.value}%`;
    document.getElementById('valTaxRate').innerText = `${inputTaxRate.value}%`;

    document.getElementById('grossDisplay').innerText = `${currentCurrency}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expensesDisplay').innerText = `${currentCurrency}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxDisplay').innerText = `${currentCurrency}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('takeHomeDisplay').innerText = `${currentCurrency}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    if (gross > 0) {
        document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }
    
    drawFlowLines(expRatio, taxRate, netProfit, gross);
    renderDynamicLegendBars(gross, totalExpenses, taxReserve);
}

inputRevenue.addEventListener('input', updateMatrixData);
inputRatio.addEventListener('input', updateMatrixData);
inputTaxRate.addEventListener('input', updateMatrixData);

document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCurrency = e.target.getAttribute('data-symbol');
        updateMatrixData();
    });
});
