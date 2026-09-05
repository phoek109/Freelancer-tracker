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

// SEARCH AND REPLACE THIS CORRECTED DATA ENGINES MODULE IN MATRIX-ENGINE.JS

// =========================================================================
// 🚀 FIXED: RESTORED CORRECT EXCHANGE RATE API ROUTE PATH & SYNTAX
// =========================================================================
async function fetchLiveExchangeRates(baseCurrency) {
    if (!baseCurrency) return;
    try {
        const cleanBase = String(baseCurrency).toUpperCase().trim();
        const response = await fetch(`https://er-api.com{cleanBase}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates) {
                exchangeRatesCache = data.rates;
                console.log(`✔ Forex Engine Sync Successful for Base: ${cleanBase}`);
                
                if (typeof calculateActiveConversionRate === 'function') {
                    calculateActiveConversionRate();
                }
                if (typeof updateMatrixData === 'function') {
                    updateMatrixData();
                }
            }
        }
    } catch (e) {
        console.warn("Forex Cloud Matrix Offline. Dropping into local recovery variables cache.", e);
    }
}

// Bind change tracking event listeners to both components natively
document.addEventListener('DOMContentLoaded', () => {
    const receivedEl = document.getElementById('formCurrency');
    const homeEl = document.getElementById('baseCurrencyConfig');
    
    if (receivedEl) receivedEl.addEventListener('change', calculateActiveConversionRate);
    if (homeEl) homeEl.addEventListener('change', () => {
        updateBaseCurrencyConfigSymbols();
        calculateActiveConversionRate();
    });
});

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

// =========================================================================
// 🚀 FIXED: STRIPPED HARDCODED TEXT CODES FROM CANVAS BEZIER TEXT GENERATION
// =========================================================================
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

    // FIXED: Dynamic Currency Symbol Assignment applied inside layout drawing routine loops
    function drawCurve(endY, color, baseText, percentValue, numericValue) {
        ctx.beginPath(); ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.stroke(); ctx.shadowBlur = 0;

        // FIXED: Stripped static strings out and linked labels directly to window.currentCurrency
        const labelText = `${baseText} (${percentValue}%) - ${window.currentCurrency || '$'}${Math.round(numericValue).toLocaleString()}`;
        const pillW = ctx.measureText(labelText).width + 24;
        
        ctx.beginPath(); ctx.roundRect(endX, endY - 11, pillW, 22, 11);
        ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText(labelText, endX + 12, endY + 4);
    }

    // Pass the calculated numeric value downstream to display on the graph curves directly
    const totalExpenses = gross * expRatio;
    const taxReserve = (gross - totalExpenses) * taxRate;
    const takeHome = gross - totalExpenses - taxReserve;

    drawCurve(endY_Expenses, '#f87171', 'Expenses', expPercent, totalExpenses);
    drawCurve(endY_Tax, '#facc15', 'Tax Reserve', taxPercent, taxReserve);
    drawCurve(endY_TakeHome, '#4ade80', 'Take-Home', homePercent, takeHome);

    // Dynamic central node currency tracker badge anchor rendering
    ctx.beginPath(); ctx.arc(startX, startY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    
    // FIXED: Node character glyph locks perfectly onto window.currentCurrency values
    ctx.fillText((window.currentCurrency || '$').trim(), startX, startY + 4); 
    ctx.textAlign = 'left';
}

// Aligned Breakdown Proportions Sliders
const inputIncomeSplit = document.getElementById('inputIncomeSplit');
const inputExpenseSplit = document.getElementById('inputExpenseSplit');
const inputTaxSplit = document.getElementById('inputTaxSplit');

function updateMatrixData() {
    let gross, expRatio, taxRate;
    let incomePct, expensePct, taxPct;
    
    const totals = window.localHistoryTotals;
    const sheetMetrics = window.liveSheetMetrics || {
        activeRatio: 0.65, bizExpRatio: 0.60, incomeTaxRatio: 0.80,
        totals: { gross: 0, expenses: 0, taxWithheld: 0 }
    };

    if (isLiveTrackingMode) {
        // 1. LIVE MODE: Read true metric parameters from historical totals
        gross = totals.gross;
        expRatio = gross > 0 ? (totals.expenses / gross) : 0;
        taxRate = parseFloat(inputTaxRate.value) / 100;

        incomePct = sheetMetrics.activeRatio || 0.65;
        expensePct = sheetMetrics.bizExpRatio || 0.60;
        taxPct = sheetMetrics.incomeTaxRatio || 0.80;

        //  FIXES INPUT OVERWRITE LOGIC:
        // Only mirror data down to your PREDICTIVE range sliders, NEVER touch the sidebar form inputs!
        if (inputRevenue) inputRevenue.value = gross;
        if (inputRatio) inputRatio.value = Math.round(expRatio * 100);
        if (inputIncomeSplit) inputIncomeSplit.value = Math.round(incomePct * 100);
        if (inputExpenseSplit) inputExpenseSplit.value = Math.round(expensePct * 100);
        if (inputTaxSplit) inputTaxSplit.value = Math.round(taxPct * 100);
    } else {
        // 2. PREDICTIVE MODE: Shape variables directly using the slider positions
        gross = parseFloat(inputRevenue.value) || 0;
        expRatio = (parseFloat(inputRatio.value) || 0) / 100;
        taxRate = (parseFloat(inputTaxRate.value) || 0) / 100;

        incomePct = (parseFloat(inputIncomeSplit.value) || 0) / 100;
        expensePct = (parseFloat(inputExpenseSplit.value) || 0) / 100;
        taxPct = (parseFloat(inputTaxSplit.value) || 0) / 100;
    }

    // Top-Level Matrix Totals
    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = (netProfit > 0 ? netProfit * taxRate : 0) + (isLiveTrackingMode ? totals.taxWithheld : 0);
    const takeHome = gross - totalExpenses - taxReserve;


    // Aligned Breakdown Calculations matching Sheet Blueprint
    const incActive = gross * incomePct;
    const incOthers = gross * (1 - incomePct);
    
    const BusinessExpenses = totalExpenses * expensePct;
    const PlatformFees = totalExpenses * (1 - expensePct);
    
    const taxIncome = taxReserve * taxPct;
    const taxWithholding = taxReserve * (1 - taxPct);


// =========================================================================
// 🚀 FIXED: STRIPPED ALL HARDCODED SYMBOL DECLARATIONS FROM METRICS DRIVERS
// =========================================================================

// Find this exact segment inside your matrix-engine.js updateMatrixData() function:
// Replace the hardcoded indicator strings block with this dynamic loop:

    // 1. Update Slider Text Readout Nodes Up Above Form Handles
    if (document.getElementById('valRevenue')) {
        document.getElementById('valRevenue').innerText = `${window.currentCurrency || '$'}${gross.toLocaleString()}`;
    }
    if (document.getElementById('valRatio')) {
        const rVal = parseFloat(inputRatio.value) || 0;
        document.getElementById('valRatio').innerText = `${rVal.toFixed(1)}%`;
    }
    if (document.getElementById('valTaxRate')) {
        const tVal = parseFloat(inputTaxRate.value) || 0;
        document.getElementById('valTaxRate').innerText = `${tVal.toFixed(1)}%`;
    }
        
    if (document.getElementById('valIncomeSplitText')) {
        const val = parseFloat(inputIncomeSplit.value) || 0;
        document.getElementById('valIncomeSplitText').innerText = `${val.toFixed(1)}% / ${(100 - val).toFixed(1)}%`;
    }
    if (document.getElementById('valExpenseSplitText')) {
        const val = parseFloat(inputExpenseSplit.value) || 0;
        document.getElementById('valExpenseSplitText').innerText = `${val.toFixed(1)}% / ${(100 - val).toFixed(1)}%`;
    }
    if (document.getElementById('valTaxSplitText')) {
        const val = parseFloat(inputTaxSplit.value) || 0;
        document.getElementById('valTaxSplitText').innerText = `${val.toFixed(1)}% / ${(100 - val).toFixed(1)}%`;
    }

    // 2. Render Macro Metrics Display Panel Cards Dynamically
    // FIXED: Using window.currentCurrency directly instead of hardcoded symbol formatting structures
    const activeSymbol = window.currentCurrency || '$';

    if (document.getElementById('grossDisplay')) {
        document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('expensesDisplay')) {
        document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('taxDisplay')) {
        document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('takeHomeDisplay')) {
        document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }

    // 3. Update Breakdown Label Item Details Text Indicators
    if (document.getElementById('incActive')) {
        document.getElementById('incActive').innerText = `${activeSymbol}${incActive.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('incOthers')) {
        document.getElementById('incOthers').innerText = `${activeSymbol}${incOthers.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('expBusinessExpenses')) {
        document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${BusinessExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('expPlatformFees')) {
        document.getElementById('expPlatformFees').innerText = `${activeSymbol}${PlatformFees.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('taxIncome')) {
        document.getElementById('taxIncome').innerText = `${activeSymbol}${taxIncome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }
    if (document.getElementById('taxWithholding')) {
        document.getElementById('taxWithholding').innerText = `${activeSymbol}${taxWithholding.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }

    // 4. Paint Proportional Distribution Interface Trays
    if (gross > 0) {
        if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    } else {
        if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `0%`;
        if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `0%`;
        if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `0%`;
    }

    // 5. Fire Unified Canvas Layout Render Refresh Loops
    if (typeof drawFlowLines === 'function') {
        drawFlowLines(expRatio, taxRate, netProfit, gross);
    }

}

// UPDATED: Completely open to floating intervals for infinite sequential clicks!
function adjustSliderStep(sliderId, changeAmount, isMacro = false) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    // 1. Fetch current position value as a pure floating point decimal
    let currentValue = parseFloat(slider.value) || 0;
    let newValue = currentValue + changeAmount;

    // 2. Map strict safety boundary caps matching individual parameters
    const maxLimit = sliderId === 'inputTaxRate' ? 50 : (sliderId === 'inputRatio' ? 90 : 100);
    if (newValue < 0) newValue = 0;
    if (newValue > maxLimit) newValue = maxLimit;

    // 3. Force the physical slider element handle location tracking to update
    slider.value = newValue.toFixed(1);
    
    // 4. Trigger UI metrics matrix calculation block cleanly
    if (typeof updateMatrixData === 'function') updateMatrixData();

    // 5. Cloud Database Synchronization Pipelines Execution
    if (isMacro) {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') updateBaseCurrencySettingsInSheet();
    } else {
        if (typeof streamBreakdownProportionsToSheet === 'function') streamBreakdownProportionsToSheet();
    }
}

// UPDATED: Explicitly updates both the range value and handles multi-million math accurately
function adjustRevenueViaMultiplier(direction) {
    const slider = document.getElementById('inputRevenue');
    const select = document.getElementById('revenueStepSelect');
    if (!slider || !select) return;

    let currentValue = parseFloat(slider.value) || 0;
    const stepMultiplier = parseFloat(select.value) || 1000;

    let newValue = currentValue + (direction * stepMultiplier);

    if (newValue < 0) newValue = 0;
    if (newValue > 1000000000) newValue = 1000000000;

    // Force values and visually move browser engine tracking handle
    slider.value = newValue;
    
    // Recalculate main display dashboard panels instantly
    if (typeof updateMatrixData === 'function') updateMatrixData();
}


// Add Event Listeners across all controls to keep calculations interactive
if (inputRevenue) inputRevenue.addEventListener('input', updateMatrixData);

// Add or append the sync call directly to your drag input event handlers:
if (inputRatio) inputRatio.addEventListener('input', () => { updateMatrixData(); updateBaseCurrencySettingsInSheet(); });
if (inputTaxRate) inputTaxRate.addEventListener('input', () => { updateMatrixData(); updateBaseCurrencySettingsInSheet(); });
if (inputIncomeSplit) inputIncomeSplit.addEventListener('input', () => { updateMatrixData(); streamBreakdownProportionsToSheet(); });
if (inputExpenseSplit) inputExpenseSplit.addEventListener('input', () => { updateMatrixData(); streamBreakdownProportionsToSheet(); });
if (inputTaxSplit) inputTaxSplit.addEventListener('input', () => { updateMatrixData(); streamBreakdownProportionsToSheet(); });

// New Step Weight Selector Contextual Listener to clear interface lag:
const revenueStepSelect = document.getElementById('revenueStepSelect');
if (revenueStepSelect) revenueStepSelect.addEventListener('change', updateMatrixData);

document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCurrency = e.target.getAttribute('data-symbol');
        updateMatrixData();
    });
});
window.onresize = () => { resizeCanvas(); updateMatrixData(); };

// =========================================================================
// 🚀 CLEANED: ADAPTIVE DOM INITIALIZATION WITHOUT LIVE FEED CALLS
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const homeEl = document.getElementById('baseCurrencyConfig');
    
    if (homeEl) {
        homeEl.addEventListener('change', () => {
            if (typeof updateBaseCurrencyConfigSymbols === 'function') {
                updateBaseCurrencyConfigSymbols();
            }
        });
    }
});
