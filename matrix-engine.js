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
    if (!baseCurrency) return;
    try {
        const cleanBase = String(baseCurrency).toUpperCase().trim();
        
        // FIXED ENDPOINT CONTEXT: Added proper URL string parameters mapping
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
window.isMatrixChartDetachedFloating = false;
window.isMatrixCanvasMaximizeViewActive = false;

// 🚀 MASTER WINDOW DEPLOYMENT ENGINE: Re-injecting clean header mappings
window.floatingMatrixWindowCoordinates = { x: null, y: null, width: null, height: null };

// 🚀 REPAIRED POP-OUT ENGINE: Maintains absolute size and grid position
function toggleMatrixChartFloatingState() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    const sliderGroup = document.getElementById('opacitySliderContainer');
    
    // Target both conditional UI buttons present in your HTML code layout
    const btnFloatInline = document.getElementById('btnPinChartFloatInline');
    const btnFloatActive = document.getElementById('btnPinChartFloat');
    
    if (!wrapper || !sliderGroup) return;

    window.isMatrixChartDetachedFloating = !window.isMatrixChartDetachedFloating;

    if (window.isMatrixChartDetachedFloating) {
        // 🚀 CRITICAL TRANSITION: Lifts the chart context above the sidebar/forms layout sheets
        wrapper.classList.add('detached-floating-window');
        sliderGroup.style.display = "flex"; 

        // Update color profiles on whichever button is processing the active session trigger
        if (btnFloatInline) btnFloatInline.style.color = "#f87171";
        if (btnFloatActive) btnFloatActive.style.color = "#f87171";

        const activeOpacitySlider = document.getElementById('chartOpacitySlider');
        if (activeOpacitySlider) {
            wrapper.style.opacity = (parseFloat(activeOpacitySlider.value) / 100);
        }
    } else {
        // Return chart cleanly back down to default baseline workflow depths
        wrapper.classList.remove('detached-floating-window');
        wrapper.style.opacity = ""; 
        sliderGroup.style.display = "none"; 

        if (btnFloatInline) btnFloatInline.style.color = "";
        if (btnFloatActive) btnFloatActive.style.color = "";
    }

    // Force an immediate high-resolution vector redraw pass across the canvas surface
    if (typeof enforceDynamicViewportCanvasSizing === 'function') {
        enforceDynamicViewportCanvasSizing();
    }
}

function initializeMatrixCanvasResizeObserverEngine() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    const canvasElement = document.getElementById('flowChart');
    if (!wrapper || !canvasElement) return;

    if (window.matrixResizeObserverInstance) {
        window.matrixResizeObserverInstance.disconnect();
    }

    window.matrixResizeObserverInstance = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (!window.isMatrixChartDetachedFloating) return;
            const dynamicWidth  = entry.contentRect.width;
            const dynamicHeight = entry.contentRect.height - 34; 
            
            if (dynamicWidth > 0 && dynamicHeight > 0) {
                canvasElement.width  = dynamicWidth;
                canvasElement.height = dynamicHeight;
                if (typeof window.updateMatrixData === 'function') {
                    window.updateMatrixData();
                }
            }
        }
    });
    window.matrixResizeObserverInstance.observe(wrapper);
}

function enforceDynamicViewportCanvasSizing() {
    const canvasElement = document.getElementById('flowChart');
    if (!canvasElement || !canvasElement.parentElement) return;

    const parentContainerBoundingBox = canvasElement.parentElement.getBoundingClientRect();
    
    // Fixed broken tracking parameter cuts:
    canvasElement.width = parentContainerBoundingBox.width;
    canvasElement.height = parentContainerBoundingBox.height;

    if (typeof window.updateMatrixData === 'function') {
        window.updateMatrixData();
    }
}

// Ensure event listener anchors are cleanly attached during boot sequence phases
document.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', enforceDynamicViewportCanvasSizing);
    
    const opacitySlider = document.getElementById('chartOpacitySlider');
    if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
            const wrapper = document.getElementById('matrixFlowChartWrapper');
            if (wrapper && window.isMatrixChartDetachedFloating) {
                wrapper.style.opacity = (parseFloat(e.target.value) / 100);
            }
        });
    }

    const convModeSelector = document.getElementById('formConversionMode');
    if (convModeSelector) {
        convModeSelector.addEventListener('change', () => {
            setTimeout(enforceDynamicViewportCanvasSizing, 50);
        });
    }
});




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

// 🚀 UPGRADED VISUAL ENGINE CORE: Implements Right-Edge Boundary Guards and Lower Neon Aura Intensity
function drawFlowLines(gross, expensesValue, taxValue, takeHomeValue) {
    const canvas = document.getElementById('flowChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width; const h = canvas.height;
    if (typeof drawBackgroundGrid === 'function') drawBackgroundGrid(ctx, w, h);

    // DYNAMIC EDGE COMPENSATOR: Increase endX padding to give long floating strings more buffer room
    const startX = 140; const startY = h / 2; const endX = w - 180;

    const expRatio = gross > 0 ? (expensesValue / gross) : 0;
    const taxRatio = gross > 0 ? (taxValue / gross) : 0;
    const homeRatio = gross > 0 ? (takeHomeValue / gross) : 0;

    const endY_Expenses = startY - (expRatio * (h * 0.35));
    const endY_Tax = startY;
    const endY_TakeHome = startY + (homeRatio * (h * 0.35));

    const expPercent  = Math.round(expRatio * 100) || 0;
    const taxPercent  = Math.round(taxRatio * 100) || 0;
    const homePercent = Math.round(homeRatio * 100) || 0;

    ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(startX, startY);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8'; ctx.fillText("GROSS INPUT", 20, startY - 14);

    function drawCurve(endY, color, baseText, percentValue, numericValue) {
        ctx.beginPath(); ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        
        // REDUCED NEON GLOW INTENSITY: Scaled shadowBlur down from 10 to 3 for a subtle, cleaner look
        ctx.shadowBlur = 3; ctx.shadowColor = color; ctx.stroke(); ctx.shadowBlur = 0;

        const formattedNumericValue = numericValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        const labelText = `${baseText} (${percentValue}%) - ${window.currentCurrency || '$'}${formattedNumericValue}`;
        const pillW = ctx.measureText(labelText).width + 24;
        
        // 🚀 BOUNDARY GUARD INTERCEPTOR: If the label pill goes past the edge of the canvas, 
        // dynamically push its draw position to the left so it never clips off-screen!
        let targetXPosition = endX;
        if ((targetXPosition + pillW) > (w - 10)) {
            targetXPosition = w - pillW - 10;
        }

        const textPaddingWidth = ctx.measureText(labelText).width + 24;
        let absoluteDrawX = endX;

        if ((absoluteDrawX + textPaddingWidth) > (w - 12)) {
            absoluteDrawX = w - textPaddingWidth - 12; // Locks rendering boundaries to prevent trailing clipping leaks
        }

        ctx.beginPath(); ctx.roundRect(targetXPosition, endY - 11, pillW, 22, 11);
        ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText(labelText, targetXPosition + 12, endY + 4);
    }

    drawCurve(endY_Expenses, '#f87171', 'Expenses', expPercent, expensesValue);
    drawCurve(endY_Tax, '#facc15', 'Tax Reserve', taxPercent, taxValue);
    drawCurve(endY_TakeHome, '#4ade80', 'Take-Home', homePercent, takeHomeValue);

    ctx.beginPath(); ctx.arc(startX, startY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
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
    // ⚡ SCENARIO A: HISTORICAL DRILL-DOWN BLOCK (PERFECT SHEET ALIGNMENT)
    // =========================================================================
    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        
        // Freeze range inputs programmatically while reviewing closed transactions
        const slidersToLock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
        slidersToLock.forEach(id => {
            const sliderEl = document.getElementById(id);
            if (sliderEl) {
                sliderEl.disabled = true;
                sliderEl.style.cursor = "not-allowed";
                sliderEl.style.opacity = "0.5";
            }
        });

        // 1. Pull verified values straight from your raw metadata attributes cache
        const invoiceAmt        = parseFloat(logItem.amount) || 0;
        const platformPctVal    = parseFloat(logItem.platformPct) || 0;
        const fxRateVal         = parseFloat(logItem.fxRate) || 1;
        const rawWithholdAmt    = parseFloat(logItem.withholdAmt) || 0;
        const bizExpenseAmt     = parseFloat(logItem.bizExpense) || 0;
        
        // 🚀 ABSOLUTE SHEET TRUTH INGESTION: Grab formula values exactly as written in your columns
        gross                   = parseFloat(logItem.homeIncome) || parseFloat(logItem.netHomeIncome) || 0;
        const incomeTaxOwed     = parseFloat(logItem.finalTaxOwed) || 0;
        const takeHome          = parseFloat(logItem.takeHomePay) || 0;

        // Platform fee formulas matching sheet row column alignments exactly
        const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
        const logTotalExpenses = bizExpenseAmt + computedPlatformFeeHome;
        const computedNetProfit = gross - bizExpenseAmt; 

        // Convert withholding tax from client currency into home currency using the transaction fxRate
        const withholdingTaxHome = rawWithholdAmt * fxRateVal;

        // 🚀 COMBINED VISUAL TAX RESERVE VALUE: Matches your metric card definitions cleanly
        const taxReserve = incomeTaxOwed + withholdingTaxHome;

        const activeSymbol = window.currentCurrency || '$ ';
        // 2. Inject the final absolute figures directly onto the main visual panel cards
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${logTotalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        // Hydrate bottom matrix legend breakdown panels dynamically using log data rows profiles
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}0.00`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${bizExpenseAmt.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${computedPlatformFeeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${incomeTaxOwed.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${withholdingTaxHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

        // 3. Update horizontal progress bar split segment indicators widths matching your log truth
        if (gross > 0) {
            document.getElementById('barExpenses').style.width = `${(logTotalExpenses / gross) * 100}%`;
            document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
        }

        // 4. Force curves to match the absolute data values passed directly from the data cells
        if (typeof drawFlowLines === 'function') {
            const expRatioLog = gross > 0 ? (logTotalExpenses / gross) : 0;
            const taxRatioLog = gross > 0 ? (taxReserve / gross) : 0.05;
            
            drawFlowLines(expRatioLog, taxRatioLog, computedNetProfit, gross);
        }
        return; // Halt process cleanly right here to insulate historical rows maps parameters
    }

    
    // =========================================================================
    // ⚡ SCENARIO B: STANDARD LIVE PIPELINE TRACKING (ELIMINATE SIMULATION LEAK)
    // =========================================================================
    if (isLiveTrackingMode) {
        gross = totals.gross || 0;
        const totalExpenses = totals.expenses || 0;
        const incomeTaxReserveFlat = totals.taxWithheld || 0; 
        const withholdingTaxVaultFlat = sheetMetrics.taxWithholding || 0;
        
        const taxReserve = incomeTaxReserveFlat + withholdingTaxVaultFlat;

        let pureSheetTakeHomeSum = 0;
        if (window.cachedHistoricalLogs && window.cachedHistoricalLogs.length > 0) {
            window.cachedHistoricalLogs.forEach(log => {
                pureSheetTakeHomeSum += parseFloat(log.takeHomePay) || 0;
            });
        }
        const takeHome = pureSheetTakeHomeSum > 0 ? pureSheetTakeHomeSum : (gross - totalExpenses - taxReserve);

        incomePct = sheetMetrics.activeRatio || 0.65;
        expensePct = sheetMetrics.bizExpRatio || 0.60;
        taxPct = sheetMetrics.incomeTaxRatio || 0.80;

        if (inputRevenue) inputRevenue.value = gross;
        
        expRatio = gross > 0 ? (totalExpenses / gross) : 0;
        const dynamicTaxRateCalc = gross > 0 ? (taxReserve / gross) : 0.15;
        
        if (inputRatio) inputRatio.value = Math.round(expRatio * 100);

        const activeSymbol = window.currentCurrency || '$ ';
        
        // 🚀 FIXED SCENARIO B INJECTORS: Enforce uniform double-decimal formatting across primary cards
        if (document.getElementById('grossDisplay')) {
            document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('expensesDisplay')) {
            document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('taxDisplay')) {
            document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('takeHomeDisplay')) {
            document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        // 🚀 FIXED SCENARIO B LEGEND: Enforce uniform double-decimal formatting across detailed breakdown matrices
        if (document.getElementById('incActive')) {
            document.getElementById('incActive').innerText = `${activeSymbol}${(sheetMetrics.incActive || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('incOthers')) {
            document.getElementById('incOthers').innerText = `${activeSymbol}${(sheetMetrics.incOthers || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('expBusinessExpenses')) {
            document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(sheetMetrics.BusinessExpenses || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('expPlatformFees')) {
            document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(sheetMetrics.PlatformFees || 0).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('taxIncome')) {
            document.getElementById('taxIncome').innerText = `${activeSymbol}${incomeTaxReserveFlat.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('taxWithholding')) {
            document.getElementById('taxWithholding').innerText = `${activeSymbol}${withholdingTaxVaultFlat.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }

        if (gross > 0) {
            document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
            document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
        }

        if (typeof drawFlowLines === 'function') {
            // ORDER: (gross, expensesValue, taxValue, takeHomeValue)
            drawFlowLines(gross, totalExpenses, taxReserve, takeHome);
        }
    } else {
        // --- 🚀 PREDICTIVE MODE: DRIVEN DIRECTLY BY USER SLIDER SUBTRACTIONS ---
        gross = parseFloat(inputRevenue ? inputRevenue.value : 0) || 0;
        expRatio = (parseFloat(inputRatio ? inputRatio.value : 0) || 0) / 100;
        taxRate = (parseFloat(inputTaxRate ? inputTaxRate.value : 0) || 0) / 100;

        // Read actual values from your allocation sliders instead of hardcoding them
        incomePct  = parseFloat(inputIncomeSplit ? inputIncomeSplit.value : 65) / 100;
        expensePct = parseFloat(inputExpenseSplit ? inputExpenseSplit.value : 60) / 100;
        taxPct     = parseFloat(inputTaxSplit ? inputTaxSplit.value : 80) / 100;

        
        const slidersToUnlock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
        slidersToUnlock.forEach(id => {
            const sliderEl = document.getElementById(id);
            if (sliderEl) {
                sliderEl.disabled = false;
                sliderEl.style.cursor = "pointer";
                sliderEl.style.opacity = "1";
            }
        });

        // Calculate cash volumes for sandbox mode
        const totalExpenses = gross * expRatio;
        const netProfit = gross - totalExpenses;
        const taxReserve = netProfit > 0 ? (netProfit * taxRate) : 0;
        const takeHome = gross - totalExpenses - taxReserve;

        const activeSymbol = window.currentCurrency || '$ ';
        // Inject your simulation dollars into your main dashboard readout blocks with full decimal precision
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${activeSymbol}${totalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${activeSymbol}${taxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${activeSymbol}${takeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        // Hydrate bottom matrix legend labels dynamically matching your slider split ratios
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${(gross * incomePct).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}${(gross * (1 - incomePct)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${(totalExpenses * expensePct).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${(totalExpenses * (1 - expensePct)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${(taxReserve * taxPct).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${(taxReserve * (1 - taxPct)).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        if (gross > 0) {
            if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
            if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
        }

        if (typeof drawFlowLines === 'function') {
            drawFlowLines(gross, totalExpenses, taxReserve, takeHome);
        }
    }
}

// =========================================================================
// 🚀 DYNAMIC ALLOCATION READOUTS INTERCEPTORS IN MATRIX-ENGINE.JS
// =========================================================================
if (inputIncomeSplit) {
    inputIncomeSplit.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const textLabel = document.getElementById('valIncomeSplitText');
        if (textLabel) {
            // Calculates the dynamic inverse values instantly
            textLabel.innerText = `${Math.round(val)}% / ${Math.round(100 - val)}%`;
        }
        window.updateMatrixData(); 
        if (typeof streamBreakdownProportionsToSheet === 'function') streamBreakdownProportionsToSheet();
    });
}

if (inputExpenseSplit) {
    inputExpenseSplit.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const textLabel = document.getElementById('valExpenseSplitText');
        if (textLabel) {
            textLabel.innerText = `${Math.round(val)}% / ${Math.round(100 - val)}%`;
        }
        window.updateMatrixData(); 
        if (typeof streamBreakdownProportionsToSheet === 'function') streamBreakdownProportionsToSheet();
    });
}

if (inputTaxSplit) {
    inputTaxSplit.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const textLabel = document.getElementById('valTaxSplitText');
        if (textLabel) {
            textLabel.innerText = `${Math.round(val)}% / ${Math.round(100 - val)}%`;
        }
        window.updateMatrixData(); 
        if (typeof streamBreakdownProportionsToSheet === 'function') streamBreakdownProportionsToSheet();
    });
}


// =========================================================================
// 🚀 REPAIRED ENGINE CORE: STANDARD CONSOLE ADJUSTMENT DRIVERS
// =========================================================================
function adjustSliderStep(sliderId, changeAmount, isMacro = false) {
    if (window.currentlyPinnedLogIndex !== null) {
        console.warn(`🔒 Stepper Block: Action denied on ${sliderId}. Pinned transaction view mode is active.`);
        return; 
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

    // Instant textual update synchronization
    if (sliderId === 'inputRatio' && document.getElementById('valRatio')) {
        document.getElementById('valRatio').innerText = `${Math.round(newValue)}%`;
    }
    
    // 🚀 REPAIRED TAX INJECTOR LABEL: Spreads data outward cleanly without pulling background caches
    if (sliderId === 'inputTaxRate' && document.getElementById('valTaxRate')) {
        document.getElementById('valTaxRate').innerText = `${parseFloat(newValue).toFixed(1)}%`;
        
    }

    if (sliderId === 'inputIncomeSplit' && document.getElementById('valIncomeSplitText')) {
        document.getElementById('valIncomeSplitText').innerText = `${Math.round(newValue)}% / ${Math.round(100 - newValue)}%`;
    }
    if (sliderId === 'inputExpenseSplit' && document.getElementById('valExpenseSplitText')) {
        document.getElementById('valExpenseSplitText').innerText = `${Math.round(newValue)}% / ${Math.round(100 - newValue)}%`;
    }
    if (sliderId === 'inputTaxSplit' && document.getElementById('valTaxSplitText')) {
        document.getElementById('valTaxSplitText').innerText = `${Math.round(newValue)}% / ${Math.round(100 - newValue)}%`;
    }
    
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
    
    if (isMacro) {
        if (typeof updateBaseCurrencySettingsInSheet === 'function') updateBaseCurrencySettingsInSheet();
    } else {
        if (typeof streamBreakdownProportionsToSheet === 'function') streamBreakdownProportionsToSheet();
    }
}

// 🚀 REPAIRED REVENUE MULTIPLIER CONTROLLER
function adjustRevenueViaMultiplier(direction) {
    if (window.currentlyPinnedLogIndex !== null) return;
    
    const slider = document.getElementById('inputRevenue');
    const select = document.getElementById('revenueStepSelect');
    if (!slider || !select) return;

    let currentValue = parseFloat(slider.value) || 0;
    const stepMultiplier = parseFloat(select.value) || 1000;

    let newValue = currentValue + (direction * stepMultiplier);

    if (newValue < 0) newValue = 0;
    if (newValue > 1000000000) newValue = 1000000000;

    slider.value = newValue;
    
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
}

// =========================================================================
// 🚀 MASTER UPGRADE: ADVANCED REVENUE-AWARE DYNAMIC LONG-PRESS CONTROLLER
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    let globalStepperIntervalLoop = null;
    let globalStepperDelayTimeout = null;

        // Scan the user view for all active data-stepper buttons
        document.querySelectorAll('.step-btn[data-slider-target]').forEach(button => {
            const targetSliderId = button.getAttribute('data-slider-target');
            const loopDirection  = parseFloat(button.getAttribute('data-direction')) || 1;
            
            // 🚀 CRITICAL FIX: Removed inputTaxRate from this check so it simulates independently!
            let isGlobalMacroAction = (targetSliderId === 'inputRatio');

            // Match the step increment size precisely to the Target Tax Rate ranges
            let operationalStepWeight = 0.1;
            if (targetSliderId === 'inputTaxRate') {
                operationalStepWeight = 0.5; 
            }

        // Capture initial click drop triggers phase
        button.addEventListener('mousedown', (e) => {
            e.preventDefault();
            killActiveStepperTimers();

            // Intercept trace: Check if this specific button runs your Annual Revenue pipeline
            if (targetSliderId === 'inputRevenue') {
                if (typeof adjustRevenueViaMultiplier === 'function') adjustRevenueViaMultiplier(loopDirection);

                globalStepperDelayTimeout = setTimeout(() => {
                    globalStepperIntervalLoop = setInterval(() => {
                        if (typeof adjustRevenueViaMultiplier === 'function') adjustRevenueViaMultiplier(loopDirection);
                    }, 40); 
                }, 350);
            } 
            // Standard Sliders Branch Flow Channel
            else {
                if (typeof adjustSliderStep === 'function') {
                    adjustSliderStep(targetSliderId, loopDirection * operationalStepWeight, isGlobalMacroAction);
                }

                globalStepperDelayTimeout = setTimeout(() => {
                    globalStepperIntervalLoop = setInterval(() => {
                        if (typeof adjustSliderStep === 'function') {
                            adjustSliderStep(targetSliderId, loopDirection * operationalStepWeight, isGlobalMacroAction);
                        }
                    }, 40);
                }, 350);
            }
        });

        // Safe cleanup event listener targets: kill rapid counts when mouse lifts or leaves button area
        button.addEventListener('mouseup', killActiveStepperTimers);
        button.addEventListener('mouseleave', killActiveStepperTimers);
        
        // Mobile layout capacitive touchscreen hardware alignment bindings
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.dispatchEvent(new Event('mousedown'));
        }, { passive: false });
        button.addEventListener('touchend', killActiveStepperTimers);
    });

    function killActiveStepperTimers() {
        if (globalStepperDelayTimeout) clearTimeout(globalStepperDelayTimeout);
        if (globalStepperIntervalLoop) clearInterval(globalStepperIntervalLoop);
        globalStepperDelayTimeout = null;
        globalStepperIntervalLoop = null;
    }
});

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
}
// 🚀 FIXED: Stripped away all network triggers and sidebar overrides from this slider!
// It now operates completely silently, dealing ONLY with the metrics on the right in predictive mode.
if (inputTaxRate) {
    // We only update the small text percent badge (e.g. 24.3%) while dragging so it feels responsive
    inputTaxRate.addEventListener('input', (e) => {
        const valText = document.getElementById('valTaxRate');
        if (valText) {
            valText.innerText = `${parseFloat(e.target.value).toFixed(1)}%`;
        }
        
        // ONLY recalculate visual metrics if we are in predictive mode
        if (window.currentlyPinnedLogIndex === null && !isLiveTrackingMode) {
            if (typeof window.updateMatrixData === 'function') {
                window.updateMatrixData();
            }
        }
    });

}

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

window.onresize = () => { 
    if (typeof resizeCanvas === 'function') resizeCanvas(); 
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData(); 
    if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
};

// 🚀 SIDEBAR COLLAPSE ORCHESTRATOR MODULE
window.isLeftInputSidebarMenuCollapsed = false;

function toggleLeftInputSidebarPanelState() {
    const sidebarPanel = document.getElementById('appInputSidebarPanel');
    const toggleButton = document.getElementById('sidebarToggleArrowTrigger');
    
    if (!sidebarPanel || !toggleButton) return;

    window.isLeftInputSidebarMenuCollapsed = !window.isLeftInputSidebarMenuCollapsed;

    if (window.isLeftInputSidebarMenuCollapsed) {
        sidebarPanel.classList.add('sidebar-collapsed-hidden-state');
        toggleButton.setAttribute('title', 'Expand Sidebar Control Menu');
    } else {
        sidebarPanel.classList.remove('sidebar-collapsed-hidden-state');
        toggleButton.setAttribute('title', 'Collapse Sidebar Control Menu');
    }

    // 🚀 DYNAMIC RE-SIZE BROADCASTER SEED: Fires a cascade of instant canvas updates 
    // to stretch the graphics smoothly alongside the sliding animation curves
    let animationProgressTimer = 0;
    const executionInterval = setInterval(() => {
        if (typeof enforceDynamicViewportCanvasSizing === 'function') {
            enforceDynamicViewportCanvasSizing();
        }
        animationProgressTimer += 30;
        if (animationProgressTimer >= 400) {
            clearInterval(executionInterval); // Terminate loop safely once expansion finishes
        }
    }, 30);
}
