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

// REPAIRED CORE FOREX CHANNEL: Stops name resolution crashes instantly
async function fetchLiveExchangeRates(baseCurrency) {
    if (!baseCurrency) return;
    try {
        const cleanBase = String(baseCurrency).toUpperCase().trim();
        
        // FIXED ENDPOINT CONTEXT: Clean template literals integration
        const response = await fetch(`https://er-api.com{cleanBase}`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.rates) {
                exchangeRatesCache = data.rates;
                console.log(`✔ Forex Engine Sync Successful for Base: ${cleanBase}`);
                
                if (typeof window.updateMatrixData === 'function') {
                    window.updateMatrixData();
                }
            }
        }
    } catch (e) {
        console.warn("Forex Cloud Matrix Offline. Falling back to local cache definitions.", e);
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

    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        
        const slidersToLock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
        slidersToLock.forEach(id => {
            const sliderEl = document.getElementById(id);
            if (sliderEl) {
                sliderEl.disabled = true;
                sliderEl.style.cursor = "not-allowed";
                sliderEl.style.opacity = "0.5"; // Visual grey-out cue
            }
        });

        // 1. Pull verified values straight from your raw metadata attributes cache
        const invoiceAmt     = parseFloat(logItem.amount) || 0;
        const platformPctVal = parseFloat(logItem.platformPct) || 0;
        const fxRateVal      = parseFloat(logItem.fxRate) || 1;
        const withholdAmtVal = parseFloat(logItem.withholdAmt) || 0;
        const bizExpenseAmt  = parseFloat(logItem.bizExpense) || 0;
        
        // 🚀 FIXED: Extract outputs directly from spreadsheet formulas variables to prevent local mismatch issues
        gross                = parseFloat(logItem.homeIncome) || parseFloat(logItem.netHomeIncome) || 0;
        const computedFinalTax = parseFloat(logItem.finalTaxOwed) || 0;
        const computedTakeHome = parseFloat(logItem.takeHomePay) || 0;

        // Platform fee formulas matching sheet row column alignments exactly
        const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
        const logTotalExpenses = bizExpenseAmt + computedPlatformFeeHome;
        const computedNetProfit = gross - bizExpenseAmt; 

        // 2. Safely populate every single right hand metrics card text element
        const activeSymbol = window.currentCurrency || '$ ';
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${logTotalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${computedFinalTax.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${computedTakeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

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
        
        // 4. Repaint your live Flow Matrix canvas charts Bezier curves using historical weight allocations
        expRatio = gross > 0 ? (logTotalExpenses / gross) : 0;
        const historicalTaxRateProportion = computedNetProfit > 0 ? (computedFinalTax / gross) : 0.05;
        
        if (typeof drawFlowLines === 'function') {
            drawFlowLines(expRatio, historicalTaxRateProportion, computedNetProfit, gross);
        }
        return; // Halt routine loop tracking processing here to prevent live variables spillover!
    }

    
    // =========================================================================
    // ⚡ SCENARIO B: STANDARD LIVE PIPELINE TRACKING (ELIMINATE SIMULATION LEAK)
    // =========================================================================
    // =========================================================================
    // ⚡ SCENARIO B: STANDARD LIVE PIPELINE TRACKING (ELIMINATE SIMULATION LEAK)
    // =========================================================================
    if (isLiveTrackingMode) {
        // Pull exact running summary values directly out of your sheet data rows totals object
        gross = totals.gross || 0;
        const totalExpenses = totals.expenses || 0;
        const taxReserve = totals.taxWithheld || 0;
        
        // 🚀 REPAIRED MATH SYNC: Pull your exact spreadsheet pre-calculated column sum 
        // directly out of your summary data package to eliminate double platform cut deductions!
        const takeHome = totals.takeHomePay || sheetMetrics.totals.takeHomePay || (gross - totalExpenses - taxReserve);

        incomePct = sheetMetrics.activeRatio || 0.65;
        expensePct = sheetMetrics.bizExpRatio || 0.60;
        taxPct = sheetMetrics.incomeTaxRatio || 0.80;

        if (inputRevenue) inputRevenue.value = gross;
        
        // Match the slider positioning hooks onto true current database proportions
        expRatio = gross > 0 ? (totalExpenses / gross) : 0;
        const dynamicTaxRateCalc = gross > 0 ? (taxReserve / gross) : 0.15;

        
             if (inputRatio) inputRatio.value = Math.round(expRatio * 100);

        // FULL LOCKDOWN CORE: Programmatically disable inputs during live display states
        const slidersToLock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
        slidersToLock.forEach(id => {
            const sliderEl = document.getElementById(id);
            if (sliderEl) {
                sliderEl.disabled = true;
                sliderEl.style.cursor = "not-allowed";
                sliderEl.style.opacity = "0.5";
            }
        });

        // Inject the absolute balanced figures directly onto the main visual panel cards
        const activeSymbol = window.currentCurrency || '$ ';
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        // HYDRATE DETAILED BREAKDOWN VALUES FOR GLOBAL LIVE TRACKING CONSOLE
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${(sheetMetrics.incActive || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}${(sheetMetrics.incOthers || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(sheetMetrics.BusinessExpenses || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(sheetMetrics.PlatformFees || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${(sheetMetrics.taxIncome || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${(sheetMetrics.taxWithholding || 0).toLocaleString(undefined, {maximumFractionDigits:0})}`;

        if (gross > 0) {
            document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
            document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
        }

        if (typeof drawFlowLines === 'function') {
            const computedNetProfitLive = gross - (sheetMetrics.BusinessExpenses || 0);
            drawFlowLines(expRatio, dynamicTaxRateCalc, computedNetProfitLive, gross);
        }
    } else {
        // --- PREDICTIVE USER MARCO SIMULATION CHANNEL (RESTORE FUNCTIONALITY) ---
        gross = parseFloat(inputRevenue ? inputRevenue.value : 0) || 0;
        expRatio = (parseFloat(inputRatio ? inputRatio.value : 0) || 0) / 100;
        taxRate = (parseFloat(inputTaxRate ? inputTaxRate.value : 0) || 0) / 100;

        incomePct = 0.65; expensePct = 0.60; taxPct = 0.80;

        const slidersToUnlock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
        slidersToUnlock.forEach(id => {
            const sliderEl = document.getElementById(id);
            if (sliderEl) {
                sliderEl.disabled = false;
                sliderEl.style.cursor = "pointer";
                sliderEl.style.opacity = "1";
            }
        });

        const totalExpenses = gross * expRatio;
        const netProfit = gross - totalExpenses;
        const taxReserve = netProfit > 0 ? (netProfit * taxRate) : 0;
        const takeHome = gross - totalExpenses - taxReserve;

        const activeSymbol = window.currentCurrency || '$ ';

        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${(gross * incomePct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}${(gross * (1 - incomePct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(totalExpenses * expensePct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(totalExpenses * (1 - expensePct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${(taxReserve * taxPct).toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${(taxReserve * (1 - taxPct)).toLocaleString(undefined, {maximumFractionDigits:0})}`;

        if (gross > 0) {
            if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
            if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
        }

        if (typeof drawFlowLines === 'function') {
            drawFlowLines(expRatio, taxRate, netProfit, gross);
        }
    }
}

// UPDATED MICRO-ADJUSTMENT STEP CONTROLLER WITH LIVE MODE GUARDS
function adjustSliderStep(sliderId, changeAmount, isMacro = false) {
    // 🚀 STEPPER SECURITY GUARD: Immediately block any button execution loop if live tracking is active
    if (window.currentlyPinnedLogIndex !== null || isLiveTrackingMode) {
        console.warn(`🔒 Stepper Block: Action denied on ${sliderId}. Turn off Live Tracking to simulate metrics.`);
        return; // Exit out instantly so nothing changes!
    }

    const slider = document.getElementById(sliderId);
    if (!slider) return;

    let currentValue = parseFloat(slider.value) || 0;
    let newValue = currentValue + changeAmount;

    let maxLimit = 100;
    if (sliderId === 'inputTaxRate') maxLimit = 50;
    if (sliderId === 'inputRatio') maxLimit = 90;

    if (newValue < 0) newValue = 0;
    if (newValue > maxLimit) newValue = maxLimit;

    slider.value = newValue.toFixed(1);

    if (sliderId === 'inputRatio' && document.getElementById('valRatio')) {
        document.getElementById('valRatio').innerText = `${Math.round(newValue)}%`;
    }
    if (sliderId === 'inputTaxRate' && document.getElementById('valTaxRate')) {
        document.getElementById('valTaxRate').innerText = `${newValue.toFixed(1)}%`;
    }
    
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
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

// FIXED: Removed heavy network config setters from the direct drag listeners
if (inputRatio) {
    inputRatio.addEventListener('input', () => { 
        // Sync local text percentage values instantly
        if (document.getElementById('valRatio')) {
            document.getElementById('valRatio').innerText = `${Math.round(inputRatio.value)}%`;
        }
        window.updateMatrixData(); 
    });
    // Save to Google Sheets ONLY when the user lets go of the slider mouse handle
    inputRatio.addEventListener('change', () => {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') updateBaseCurrencySettingsInSheet();
    });
}

// Updates the percentage readout text smoothly while blocking calculations if view is locked
if (inputTaxRate) inputTaxRate.addEventListener('input', (e) => {
    // 1. Keep the slider label highly responsive
    const valText = document.getElementById('valTaxRate');
    if (valText) valText.innerText = `${parseFloat(e.target.value).toFixed(1)}%`;
    
    // 2. Only redraw the right-hand dashboard metrics if live tracking mode is explicitly active
    if (window.currentlyPinnedLogIndex === null && isLiveTrackingMode) {
        if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
    }
});

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
// =========================================================================
// 🚀 PASTE THE NEW DRAG DRIVERS RIGHT HERE:
// =========================================================================
if (inputRatio) {
    inputRatio.addEventListener('change', () => {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') updateBaseCurrencySettingsInSheet();
    });
}

// Triggers the cloud spreadsheet synchronization ONLY when you release the mouse click handle
if (inputTaxRate) inputTaxRate.addEventListener('change', (e) => {
    const baseTaxInputBox = document.getElementById('baseTaxRateConfig');
    if (baseTaxInputBox) baseTaxInputBox.value = e.target.value;
    
    // Broadcast parameters only if live tracking is running without archival card locks
    if (window.currentlyPinnedLogIndex === null && isLiveTrackingMode) {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') updateBaseCurrencySettingsInSheet();
    }
});

// =========================================================================
// THIS IS THE ORIGINAL RESIZE HOOK THAT CLOSES THE FILE (LEAVE THIS AT THE BOTTOM)
// =========================================================================
window.onresize = () => { 
    if (typeof resizeCanvas === 'function') resizeCanvas(); 
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData(); 
    if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
};

