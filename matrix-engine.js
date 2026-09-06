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

// REPAIRED: Cleaned up URL parameters to eliminate er-api routing failures
async function fetchLiveExchangeRates(baseCurrency) {
    if (!baseCurrency) return;
    try {
        const cleanBase = String(baseCurrency).toUpperCase().trim();
        
        // FIXED FORMAT: Replaced raw string concatenation with a valid template string
        const response = await fetch(`https://er-api.com{cleanBase}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates) {
                exchangeRatesCache = data.rates;
                console.log(`✔ Forex Engine Sync Successful for Base: ${cleanBase}`);
                // Safely update all active calculated metrics cards and layouts
                if (typeof window.updateMatrixData === 'function') {
                    window.updateMatrixData();
                }
            }
        }
    } catch (e) {
        console.warn("Forex Cloud Matrix Offline. Dropping into local recovery variables cache.", e);
        // Direct layout redraw to ensure the UI updates even using cached metrics
        if (typeof window.updateMatrixData === 'function') {
            window.updateMatrixData();
        }
    }
}


// Bind change tracking event listeners to both components natively
// Bind change tracking event listeners to both components natively
document.addEventListener('DOMContentLoaded', () => {
    const receivedEl = document.getElementById('formCurrency');
    const homeEl = document.getElementById('baseCurrencyConfig');

    // FIXED: Passed a clean arrow function to handle the change event safely
    if (receivedEl) {
        receivedEl.addEventListener('change', () => { 
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        });
    }
    if (homeEl) {
        homeEl.addEventListener('change', () => {
            if (typeof updateBaseCurrencyConfigSymbols === 'function') updateBaseCurrencyConfigSymbols();
            if (typeof updateMatrixData === 'function') updateMatrixData();
        });
    }
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

    // =========================================================================
    // ⚡ FIXED HISTORICAL LOCK DRILL-DOWN: ARITHMETIC WITH SAFETIES
    // =========================================================================
    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        
        // 1. Pull verified values straight from your raw metadata attributes cache
        const invoiceAmt     = parseFloat(logItem.amount) || 0;
        const platformPctVal = parseFloat(logItem.platformPct) || 0;
        const fxRateVal      = parseFloat(logItem.fxRate) || 1;
        const withholdAmtVal = parseFloat(logItem.withholdAmt) || 0;
        const bizExpenseAmt  = parseFloat(logItem.bizExpense) || 0;
        
        // Fetch current global tax rate setting from configuration inputs
        const targetTaxRateInputEl = document.getElementById('baseTaxRateConfig');
        const systemTaxRateConfigVal = targetTaxRateInputEl ? (parseFloat(targetTaxRateInputEl.value) / 100) : 0.15;

        // Formula I Equivalent: Calculated Net Foreign cash flow amount
        const computedNetForeign = invoiceAmt - withholdAmtVal - (invoiceAmt * platformPctVal);
        
        // Formula K Equivalent: Net Home Income (Becomes your exclusive Gross Input baseline)
        gross = parseFloat(logItem.homeIncome) || (computedNetForeign * fxRateVal);

        // Formula H Equivalent: Platform fees calculated flat amount translated to home currency values
        const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
        
        // Formula L Total Equivalent: Total Row Expenses (Biz overheads + Platform fees cash value)
        const logTotalExpenses = bizExpenseAmt + computedPlatformFeeHome;
        
        // Formula M Equivalent: Taxable net row margins profit profiles
        const computedNetProfit = gross - bizExpenseAmt; 

        // Formula N Equivalent: Final calculated tax owed matrix
        const computedFinalTax = computedNetProfit > 0 ? (computedNetProfit * systemTaxRateConfigVal) : 0;
        
        // Formula O Equivalent: Final true net take home row pay
        const computedTakeHome = gross - logTotalExpenses - computedFinalTax;

        // 2. Safely populate every single right hand metrics card text element
        const activeSymbol = window.currentCurrency || '$ ';
        
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${logTotalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${computedFinalTax.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${computedTakeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        // HYDRATE DETAILED BREAKDOWN VALUES FOR SINGLE LOG VIEW
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}0.00`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${bizExpenseAmt.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${computedPlatformFeeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${computedFinalTax.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${withholdAmtVal.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        // 3. Dynamically update your split progress bar indicators layout view
        if (gross > 0) {
            if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(logTotalExpenses / gross) * 100}%`;
            if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(computedFinalTax / gross) * 100}%`;
            if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(computedTakeHome / gross) * 100}%`;
        } else {
            if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `0%`;
            if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `0%`;
            if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `0%`;
        }
        
        // 4. Repaint your live Flow Matrix canvas charts Bezier curves
        expRatio = gross > 0 ? (logTotalExpenses / gross) : 0;
        if (typeof drawFlowLines === 'function') {
            drawFlowLines(expRatio, systemTaxRateConfigVal, computedNetProfit, gross);
        }
        return; // Halt routine loop tracking processing here to prevent live variables spillover!
    }
    // --- STANDARD PIPELINE MANAGEMENT FOR LIVE CHANNELS TRACKING ---
    if (isLiveTrackingMode) {
        gross = totals.gross;
        expRatio = gross > 0 ? (totals.expenses / gross) : 0;
        taxRate = parseFloat(inputTaxRate ? inputTaxRate.value : 15) / 100;

        incomePct = sheetMetrics.activeRatio || 0.65;
        expensePct = sheetMetrics.bizExpRatio || 0.60;
        taxPct = sheetMetrics.incomeTaxRatio || 0.80;

        if (inputRevenue) inputRevenue.value = gross;
        if (inputRatio) inputRatio.value = Math.round(expRatio * 100);
    } else {
        gross = parseFloat(inputRevenue ? inputRevenue.value : 0) || 0;
        expRatio = (parseFloat(inputRatio ? inputRatio.value : 0) || 0) / 100;
        taxRate = (parseFloat(inputTaxRate ? inputTaxRate.value : 0) || 0) / 100;

        incomePct = 0.65; expensePct = 0.60; taxPct = 0.80;
    }

    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = (netProfit > 0 ? netProfit * taxRate : 0) + (isLiveTrackingMode ? totals.taxWithheld : 0);
    const takeHome = gross - totalExpenses - taxReserve;

    const activeSymbol = window.currentCurrency || '$ ';

    if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    // HYDRATE DETAILED BREAKDOWN VALUES FOR GLOBAL LIVE/PREDICTIVE VIEW
    if (isLiveTrackingMode) {
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${(sheetMetrics.incActive || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}${(sheetMetrics.incOthers || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(sheetMetrics.BusinessExpenses || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(sheetMetrics.PlatformFees || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${(sheetMetrics.taxIncome || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${(sheetMetrics.taxWithholding || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
    } else {
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${(gross * incomePct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}${(gross * (1 - incomePct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(totalExpenses * expensePct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(totalExpenses * (1 - expensePct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${(taxReserve * taxPct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${(taxReserve * (1 - taxPct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;
    }

    if (gross > 0) {
        if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }

    if (typeof drawFlowLines === 'function') {
        drawFlowLines(expRatio, taxRate, netProfit, gross);
    }
}

// UPDATED STEPPER MATRIX DRIVER: Resolves variable locking on slide interactions
function adjustSliderStep(sliderId, changeAmount, isMacro = false) {
    const slider = document.getElementById(sliderId);
    if (!slider) return;

    // 1. Fetch current position value as a pure floating-point decimal
    let currentValue = parseFloat(slider.value) || 0;
    let newValue = currentValue + changeAmount;

    // 2. Map strict safety boundary caps matching individual parameters profiles
    // FIXED ID MATCHING: Matches your exact inputs 'inputTaxRate' and 'inputRatio'
    let maxLimit = 100;
    if (sliderId === 'inputTaxRate') maxLimit = 50;
    if (sliderId === 'inputRatio') maxLimit = 90;

    if (newValue < 0) newValue = 0;
    if (newValue > maxLimit) newValue = maxLimit;

    // 3. Force the physical HTML range input slider handle to visually update its position
    slider.value = newValue.toFixed(1);
    // 4. Update the visual text indicators matching the new slider position values
    if (sliderId === 'inputRatio' && document.getElementById('valRatio')) {
        document.getElementById('valRatio').innerText = `${Math.round(newValue)}%`;
    }
    if (sliderId === 'inputTaxRate' && document.getElementById('valTaxRate')) {
        document.getElementById('valTaxRate').innerText = `${newValue.toFixed(1)}%`;
    }
    
    // 5. Trigger UI metrics matrix calculation block cleanly
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();

    // 6. Cloud Database Synchronization Pipelines Execution
    // Wrapped inside clean validation catches to insulate sliders from network drops
    if (isMacro) {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') {
            updateBaseCurrencySettingsInSheet();
        }
    } else {
        if (typeof streamBreakdownProportionsToSheet === 'function') {
            streamBreakdownProportionsToSheet();
        }
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
// Safe execution window size adjustment intercept hook mapping tracker
window.onresize = () => { 
    if (typeof resizeCanvas === 'function') resizeCanvas(); 
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData(); 
    if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
};

