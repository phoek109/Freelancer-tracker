let currentCurrency = '$';
let isLiveTrackingMode = true;
let exchangeRatesCache = { "USD": 1, "EUR": 0.92, "GBP": 0.79, "UGX": 3850, "KES": 130, "NGN": 1400 };

window.subCategoriesCache = {
    income: ['USD', 'EUR', 'GBP', 'UGX', 'KES'],
    expense: ['Software/Tools', 'Marketing/Ads', 'Hardware/Office'],
    tax: ['Income Tax Reserve', 'Withholding Vault']
};

window.localHistoryTotals = {
    gross: 0, expenses: 0, taxWithheld: 0,
    breakdownValues: {}
};

const inputRevenue = document.getElementById('inputRevenue');
const inputRatio = document.getElementById('inputRatio');
const inputTaxRate = document.getElementById('inputTaxRate');
const canvas = document.getElementById('flowChart');
const btnToggle = document.getElementById('btnToggleMode');

async function fetchLiveExchangeRates(baseCurrency) {
    try {
        const response = await fetch(`https://er-api.com{baseCurrency}`);
        if (response.ok) {
            const data = await response.json();
            exchangeRatesCache = data.rates;
            if (typeof updateMatrixData === 'function') updateMatrixData();
        }
    } catch (e) {
        console.log("Forex API offline. Falling back to local tracking variables cache.");
    }
}

// Automatically balances currency signs and passes metrics down to target tax variables
function updateBaseCurrencyConfigSymbols() {
    const base = document.getElementById('baseCurrencyConfig').value;
    if (base === 'USD') currentCurrency = '$';
    else if (base === 'EUR') currentCurrency = '€';
    else if (base === 'GBP') currentCurrency = '£';
    else if (base === 'UGX') currentCurrency = 'USh ';
    else if (base === 'KES') currentCurrency = 'KSh ';
    else if (base === 'NGN') currentCurrency = '₦';
    
    const baseTaxInput = document.getElementById('baseTaxRateConfig').value;
    inputTaxRate.value = baseTaxInput || 15;
    
    fetchLiveExchangeRates(base);
}

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
    ctx.fillStyle = '#38bdf8'; 
    ctx.fillText("GROSS INPUT", 20, startY - 14);

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

// References to your new dynamic ratio sliders
const inputActiveRatio = document.getElementById('inputActiveRatio');
const inputBusinessExpRatio = document.getElementById('inputBusinessExpRatio');
const inputIncomeTaxRatio = document.getElementById('inputIncomeTaxRatio');

function updateMatrixData() {
    let gross, expRatio, taxRate;
    let activeSplit, bizExpSplit, incomeTaxSplit;
    const totals = window.localHistoryTotals;
    
    // Fallback configurations if sheet metrics aren't populated yet
    const sheetMetrics = window.liveSheetMetrics || { activeRatio: 0.65, bizExpRatio: 0.50, incomeTaxRatio: 0.80 };

    if (isLiveTrackingMode) {
        gross = totals.gross;
        const totalExpenses = totals.expenses;
        expRatio = gross > 0 ? (totalExpenses / gross) : 0;
        taxRate = parseFloat(inputTaxRate.value) / 100;
        
        inputRevenue.value = gross || 0;
        inputRatio.value = Math.round(expRatio * 100) || 0;

        // DERIVED DIRECTLY FROM USER DATA: Pulling live ratios sent from Google Sheets
        activeSplit = sheetMetrics.activeRatio;
        bizExpSplit = sheetMetrics.bizExpRatio;
        incomeTaxSplit = sheetMetrics.incomeTaxRatio;

        // Auto-update slider visual values to echo real life state
        inputActiveRatio.value = Math.round(activeSplit * 100);
        inputBusinessExpRatio.value = Math.round(bizExpSplit * 100);
        inputIncomeTaxRatio.value = Math.round(incomeTaxSplit * 100);
    } else {
        // SIMULATION MODE: Math responds 100% dynamically to the user's slider adjustments!
        const sliderGrossVal = parseFloat(inputRevenue.value) || 0;
        gross = sliderGrossVal < totals.gross ? totals.gross : sliderGrossVal;
        inputRevenue.value = gross;

        const simulatedGrossFuture = gross - totals.gross;
        const sliderExpRatio = (parseFloat(inputRatio.value) || 0) / 100;
        const calculatedTotalExpenses = totals.expenses + (simulatedGrossFuture * sliderExpRatio);
        expRatio = gross > 0 ? (calculatedTotalExpenses / gross) : 0;
        taxRate = (parseFloat(inputTaxRate.value) || 0) / 100;

        // Pulling mathematical weight from interactive sliders
        activeSplit = (parseFloat(inputActiveRatio.value) || 0) / 100;
        bizExpSplit = (parseFloat(inputBusinessExpRatio.value) || 0) / 100;
        incomeTaxSplit = (parseFloat(inputIncomeTaxRatio.value) || 0) / 100;
    }

    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = (netProfit > 0 ? netProfit * taxRate : 0) + totals.taxWithheld;
    const takeHome = netProfit - (netProfit > 0 ? netProfit * taxRate : 0);

    // DYNAMIC SPLITTING: Calculated purely based on global proportions or user settings
    const incActive = gross * activeSplit;
    const incOthers = gross * (1 - activeSplit);
    
    const BusinessExpenses = totalExpenses * bizExpSplit;
    const PlatformFees = totalExpenses * (1 - bizExpSplit);
    
    const taxIncome = taxReserve * incomeTaxSplit;
    const taxWithholding = taxReserve * (1 - incomeTaxSplit);

    // Update textual indicators
    document.getElementById('valRevenue').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('valRatio').innerText = `${Math.round(expRatio * 100)}%`;
    document.getElementById('valTaxRate').innerText = `${inputTaxRate.value}%`;
    document.getElementById('valActiveRatio').innerText = `${Math.round(activeSplit * 100)}%`;
    document.getElementById('valBusinessExpRatio').innerText = `${Math.round(bizExpSplit * 100)}%`;
    document.getElementById('valIncomeTaxRatio').innerText = `${Math.round(incomeTaxSplit * 100)}%`;

    // Render metrics cleanly onto UI display columns
    document.getElementById('grossDisplay').innerText = `${currentCurrency}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expensesDisplay').innerText = `${currentCurrency}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxDisplay').innerText = `${currentCurrency}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('takeHomeDisplay').innerText = `${currentCurrency}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    document.getElementById('incActive').innerText = `${currentCurrency}${incActive.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('incOthers').innerText = `${currentCurrency}${incOthers.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expBusinessExpenses').innerText = `${currentCurrency}${BusinessExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expPlatformFees').innerText = `${currentCurrency}${PlatformFees.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxIncome').innerText = `${currentCurrency}${taxIncome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxWithholding').innerText = `${currentCurrency}${taxWithholding.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    if (gross > 0) {
        document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }
    drawFlowLines(expRatio, taxRate, netProfit, gross);
}

// Bind event listeners to new inputs so adjustment forces layout updates instantly
inputActiveRatio.addEventListener('input', updateMatrixData);
inputBusinessExpRatio.addEventListener('input', updateMatrixData);
inputIncomeTaxRatio.addEventListener('input', updateMatrixData);

document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCurrency = e.target.getAttribute('data-symbol');
        updateMatrixData();
    });
});
window.onresize = () => { resizeCanvas(); updateMatrixData(); };
