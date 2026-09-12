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

// =========================================================================
// 🚀 DYNAMIC LOOKUP OVERHAUL IN MATRIX-ENGINE.JS
// =========================================================================
function updateBaseCurrencyConfigSymbols() {
    const baseElement = document.getElementById('baseCurrencyConfig');
    if (!baseElement) return;
    
    const activeBaseISO = baseElement.value;
    
    // 🚀 ZERO HARDCODING PATCH: Instantly queries the global native browser localization dictionary
    if (typeof getGlobalCurrencySymbolCharacter === 'function') {
        window.currentCurrency = getGlobalCurrencySymbolCharacter(activeBaseISO);
    } else {
        // Safe baseline layout fallback parameter string checks
        if (activeBaseISO === 'USD') window.currentCurrency = '$ ';
        else if (activeBaseISO === 'EUR') window.currentCurrency = '€ ';
        else window.currentCurrency = activeBaseISO + ' ';
    }
    
    const baseTaxInput = document.getElementById('baseTaxRateConfig').value;
    if (inputTaxRate) {
        inputTaxRate.value = baseTaxInput || 15;
    }
    
    if (typeof fetchLiveExchangeRates === 'function') {
        fetchLiveExchangeRates(activeBaseISO);
    }
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

// =========================================================================
// 🚀 REPAIRED POP-OUT ENGINE: REMOVED ABSOLUTE SLIDER DEPENDENCY BLOCKS
// =========================================================================
function toggleMatrixChartFloatingState() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    const sliderGroup = document.getElementById('opacitySliderContainer');
    
    // Target both conditional UI buttons present in your HTML code layout
    const btnFloatInline = document.getElementById('btnPinChartFloatInline');
    const btnFloatActive = document.getElementById('btnPinChartFloat');
    
    // 🚀 THE CRITICAL FIX: Only bail out if the main 'wrapper' is missing!
    // If sliderGroup is missing because we deleted it, the engine passes safely right through.
    if (!wrapper) return;

    window.isMatrixChartDetachedFloating = !window.isMatrixChartDetachedFloating;

    if (window.isMatrixChartDetachedFloating) {
        // Lifts the chart context above the sidebar/forms layout sheets
        wrapper.classList.add('detached-floating-window');
        
        // Safe optional check: only modify sliderGroup if it actually exists in your HTML
        if (sliderGroup) {
            sliderGroup.style.display = "flex"; 
        }

        // Update color profiles on whichever button is processing the active session trigger
        if (btnFloatInline) btnFloatInline.style.color = "#f87171";
        if (btnFloatActive) btnFloatActive.style.color = "#f87171";

        const activeOpacitySlider = document.getElementById('chartOpacitySlider');
        if (activeOpacitySlider) {
            wrapper.style.opacity = (parseFloat(activeOpacitySlider.value) / 100);
        } else {
            // Fallback default to keep the window perfectly visible with your new gesture swipe engine
            wrapper.style.opacity = "0.95";
        }
    } else {
        // Return chart cleanly back down to default baseline workflow depths
        wrapper.classList.remove('detached-floating-window');
        wrapper.style.opacity = ""; 
        
        // Safe optional check: only modify sliderGroup if it actually exists in your HTML
        if (sliderGroup) {
            sliderGroup.style.display = "none"; 
        }

        if (btnFloatInline) btnFloatInline.style.color = "";
        if (btnFloatActive) btnFloatActive.style.color = "";
    }

    // Force an immediate high-resolution vector redraw pass across the canvas surface
    if (typeof enforceDynamicViewportCanvasSizing === 'function') {
        enforceDynamicViewportCanvasSizing();
    }
}

// =========================================================================
// 🚀 REPAIRED OBSERVER ENGINE: STANDARD ADAPTIVE MAPPING FOR ALL STATES
// =========================================================================
function initializeMatrixCanvasResizeObserverEngine() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    const canvasElement = document.getElementById('flowChart');
    if (!wrapper || !canvasElement) return;

    if (window.matrixResizeObserverInstance) {
        window.matrixResizeObserverInstance.disconnect();
    }

    window.matrixResizeObserverInstance = new ResizeObserver(entries => {
        for (let entry of entries) {
            // 🚀 THE FIX: Defer sizing directly to the high-density framework.
            // This strips away all floating-state conditional jumps, ensuring
            // the hardware buffer refreshes smoothly in both inline and pop-out modes.
            if (typeof enforceDynamicViewportCanvasSizing === 'function') {
                enforceDynamicViewportCanvasSizing();
            }
        }
    });
    window.matrixResizeObserverInstance.observe(wrapper);
}

// =========================================================================
// 🚀 HIGH-DENSITY DPR RENDERING ENGINE (ULTRA-OPTIMIZED RETINA EDITION)
// =========================================================================

window.matrixCanvasResizeTimeoutId = null;

// =========================================================================
// 🚀 HIGH-DENSITY DPR RENDERING ENGINE (ULTRA-RESPONSIVE MOBILE STABLE)
// =========================================================================
function enforceDynamicViewportCanvasSizing() {
    const canvasElement = document.getElementById('flowChart');
    if (!canvasElement || !canvasElement.parentElement) return;

    // 🛡️ THE GUARD BYPASS VALVE:
    // If the browser window space drops below limits, exit the script calculation loops early. 
    // This stops the engine from attempting to render coordinates inside a squished canvas box.
    const isScreenCriticallySmall = window.innerWidth <= 480 || window.innerHeight <= 260;
    if (isScreenCriticallySmall && !window.isMatrixChartDetachedFloating) {
        console.warn("⚠️ Viewport specs unsafe. Graphic calculations deferred to guard overlay.");
        return; 
    }

    const ctx = canvasElement.getContext('2d');
    const parentContainerBoundingBox = canvasElement.parentElement.getBoundingClientRect();
    
    // 1. Grab physical pixel density coefficient (Retina/High-DPI aware)
    const devicePixelRatioScale = window.devicePixelRatio || 1;
    
    // 2. Fall back to safe explicit layouts if the container is rendering text changes asynchronously
    let targetWidth  = Math.floor(parentContainerBoundingBox.width);
    let targetHeight = Math.floor(parentContainerBoundingBox.height);

    // 🔒 MOBILE TRANSITION DEFENSE: If heights shrink below boundaries during layout shifts,
    // lock standard crisp structural minimums instead of crashing out to zero!
    if (targetWidth <= 0) targetWidth = canvasElement.parentElement.clientWidth || 343;
    if (targetHeight <= 0) targetHeight = 280; // Hard matches your mobile .flow-chart-wrapper height rule!

    // 3. Clear hardware dimensions instantly to eliminate layout trail freezing
    canvasElement.width  = targetWidth * devicePixelRatioScale;
    canvasElement.height = targetHeight * devicePixelRatioScale;

    // 4. Shrink presentation space back down seamlessly using standard CSS pixels
    canvasElement.style.width  = targetWidth + 'px';
    canvasElement.style.height = targetHeight + 'px';

    // 5. Wrap rendering coordinate systems inside an isolated state frame block
    ctx.save();
    ctx.scale(devicePixelRatioScale, devicePixelRatioScale);

    // 6. Force custom presentation layers to draw matrix lines instantly without timing lags
    if (typeof window.updateMatrixData === 'function') {
        window.updateMatrixData();
    }
    
    ctx.restore(); 
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

// =========================================================================
// 🚀 MULTI-CHART STYLING MANAGEMENT DRIVER
// =========================================================================
window.activeMatrixChartStyle = "sankey"; // Baseline configuration startup state fallback

// 🔄 REPLACE your existing drawFlowLines function with this theme-aware version:
function drawFlowLines(gross, expensesValue, taxValue, takeHomeValue) {
    const canvas = document.getElementById('flowChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width; 
    const h = canvas.height;

    // 🛡️ THE THEME INTERCEPT: Extract the real-time background color from your system property tokens
    const canvasMainBgColor = (typeof getComputedCanvasColorStyleValue === 'function')
        ? getComputedCanvasColorStyleValue('--bg-main', '#0b0f19')
        : '#0b0f19';

    // ✔️ FIXED CANVAS CLEAR: Wipes the hardware drawing canvas surface cleanly matching your light mode choice!
    ctx.fillStyle = canvasMainBgColor;
    ctx.fillRect(0, 0, w, h);

    // 🚀 UPDATED ARCHITECTURAL ROUTER: Continues drawing your four unique chart choices...
    if (window.activeMatrixChartStyle === "bars") {
        executeStackedColumnRenderingEngine(ctx, w, h, gross, expensesValue, taxValue, takeHomeValue);
    } 
    else if (window.activeMatrixChartStyle === "hhoriz") {
        executeHorizontalBarChartRenderingEngine(ctx, w, h, gross, expensesValue, taxValue, takeHomeValue);
    } 
    else if (window.activeMatrixChartStyle === "pie") {
        executeProportionPieRenderingEngine(ctx, w, h, gross, expensesValue, taxValue, takeHomeValue);
    } 
    else {
        executeOriginalSankeyCurvesEngine(ctx, canvas, w, h, gross, expensesValue, taxValue, takeHomeValue);
    }
}

// =========================================================================
// 📈 PRESENTATION LAYER 1: ORIGINAL HIGH-FIDELITY SANKEY ENGINE (RESERVED)
// =========================================================================
function executeOriginalSankeyCurvesEngine(ctx, canvas, w, h, gross, expensesValue, taxValue, takeHomeValue) {
    if (typeof drawBackgroundGrid === 'function') drawBackgroundGrid(ctx, w, h);

    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    
    // 🚀 THE TOP SAFETY BARRIER FOR SANKEY:
    // If on a phone layout, we establish an explicit 76px boundary ceiling.
    // This compresses the vertical field and centers the node connection lines below the pin button!
    const customTopBoundaryClip = isMobileViewport ? 76 : 0;
    const scalableDrawingHeight = h - customTopBoundaryClip;

    const startX = isMobileViewport ? 50 : 140; 
    const startY = customTopBoundaryClip + (scalableDrawingHeight / 2); // Drops center axis away from buttons
    const endX = isMobileViewport ? w - 90 : w - 180;

    const expRatio = gross > 0 ? (expensesValue / gross) : 0;
    const taxRatio = gross > 0 ? (taxValue / gross) : 0;
    const homeRatio = gross > 0 ? (takeHomeValue / gross) : 0;

    // Pull height multipliers from the compressed active height area
    const endY_Expenses = startY - (expRatio * (scalableDrawingHeight * 0.32));
    const endY_Tax = startY;
    const endY_TakeHome = startY + (homeRatio * (scalableDrawingHeight * 0.32));

    const expPercent  = Math.round(expRatio * 100) || 0;
    const taxPercent  = Math.round(taxRatio * 100) || 0;
    const homePercent = Math.round(homeRatio * 100) || 0;

    ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(startX, startY);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();
    
    ctx.font = isMobileViewport ? 'bold 9px "Plus Jakarta Sans", sans-serif' : 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8'; 
    ctx.fillText("GROSS INPUT", isMobileViewport ? 8 : 20, startY - 14);

    function drawCurve(endY, color, baseText, percentValue, numericValue) {
        ctx.beginPath(); ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        
        ctx.shadowBlur = 3; ctx.shadowColor = color; ctx.stroke(); ctx.shadowBlur = 0;

        let labelText;
        
        // 🚀 THE STRIP-FIGURES CLUTTER FILTER TRACK:
        if (isMobileViewport) {
            labelText = `${baseText}: ${percentValue}%`;
        } else {
            const formattedNumericValue = numericValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            labelText = `${baseText} (${percentValue}%) - ${window.currentCurrency || '$'}${formattedNumericValue}`;
        }

        ctx.font = isMobileViewport ? 'bold 9px "JetBrains Mono", monospace' : 'bold 11px "Plus Jakarta Sans", sans-serif';
        const pillW = ctx.measureText(labelText).width + (isMobileViewport ? 14 : 24);
        
        let targetXPosition = endX;
        if ((targetXPosition + pillW) > (w - 10)) {
            targetXPosition = w - pillW - 10;
        }

        const isColorWhite = color.toLowerCase() === '#ffffff' || color.toLowerCase() === '#f5f5f5';
        const isCurrentThemeLight = document.documentElement.getAttribute('data-theme') === 'light';

        ctx.beginPath(); ctx.roundRect(targetXPosition, endY - 11, pillW, 22, 11);
        ctx.fillStyle = color; ctx.fill();
        
        if (isColorWhite && isCurrentThemeLight) {
            ctx.strokeStyle = '#0f172a'; 
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        
        if (isCurrentThemeLight) {
            ctx.fillStyle = isColorWhite ? '#0f172a' : '#ffffff'; 
        } else {
            ctx.fillStyle = isMobileViewport ? '#070a13' : '#ffffff'; 
        }
        
        ctx.fillText(labelText, targetXPosition + (isMobileViewport ? 7 : 12), endY + 4);
    }

    const chartColorExpenses = getComputedCanvasColorStyleValue('--color-expenses', '#f87171');
    const chartColorTax      = getComputedCanvasColorStyleValue('--color-tax', '#facc15');
    const chartColorTakeHome = getComputedCanvasColorStyleValue('--color-takehome', '#4ade80');

    drawCurve(endY_Expenses, chartColorExpenses, 'Expenses', expPercent, expensesValue);
    drawCurve(endY_Tax, chartColorTax, 'Tax Reserve', taxPercent, taxValue);
    drawCurve(endY_TakeHome, chartColorTakeHome, 'Take-Home', homePercent, takeHomeValue);

    ctx.beginPath(); ctx.arc(startX, startY, isMobileViewport ? 9 : 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText((window.currentCurrency || '$').trim(), startX, startY + 4); 
    ctx.textAlign = 'left';
}

// =========================================================================
// 📈 PRESENTATION LAYER 2: SIDE-BY-SIDE COLUMN CHART ENGINE (0% - 100% SCALE)
// =========================================================================
function executeStackedColumnRenderingEngine(ctx, w, h, gross, totalExpenses, taxReserve, takeHome) {
    if (typeof drawBackgroundGrid === 'function') drawBackgroundGrid(ctx, w, h);
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

    // 🚀 HARD-CLAMP CHART CEILING ON MOBILE:
    // Increasing mobile paddingTop to 82px guarantees the tops of your 100% column bars 
    // run completely clear of the absolute floating pin button capsule panel element track!
    const paddingLeft   = isMobileViewport ? 48 : 80;   
    const paddingRight  = isMobileViewport ? 15 : 40;
    const paddingTop    = isMobileViewport ? 110 : 60;   // Injected 82px insulation clearance buffer
    const paddingBottom = isMobileViewport ? 24 : 40;   

    const graphWidth  = w - paddingLeft - paddingRight;
    const graphHeight = h - paddingTop - paddingBottom;
    const baselineY   = h - paddingBottom;

    // 🚀 THE PERCENTAGE FRAMEWORK AXIS: Force axis ceilings directly to 100%
    const yAxisCeilingValue = 100; 

    ctx.save();
    ctx.font = isMobileViewport ? "8px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";

    const totalGridLinesCount = 4;
    for (let i = 0; i <= totalGridLinesCount; i++) {
        const lineRatio = i / totalGridLinesCount;
        const currentLineYPosition = baselineY - (graphHeight * lineRatio);
        
        // Calculate dynamic ticks as standard percentage markings (0%, 25%, 50%, 75%, 100%)
        const currentGridValueMarking = Math.round(yAxisCeilingValue * lineRatio);

        ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(paddingLeft, currentLineYPosition); ctx.lineTo(w - paddingRight, currentLineYPosition); ctx.stroke();

        ctx.fillStyle = getComputedCanvasColorStyleValue('--text-main', '#64748b');
        
        // 🚀 AXIS LABEL RE-BINDING: Injects the standard percentage suffix
        ctx.fillText(`${currentGridValueMarking}%`, paddingLeft - 8, currentLineYPosition);
    }
    ctx.restore();

    if (gross <= 0) return;

    const chartColorExpenses = getComputedCanvasColorStyleValue('--color-expenses', '#f87171');
    const chartColorTax      = getComputedCanvasColorStyleValue('--color-tax', '#facc15');
    const chartColorTakeHome = getComputedCanvasColorStyleValue('--color-takehome', '#4ade80');

    const barsDataPool = [
        { value: totalExpenses, color: chartColorExpenses, title: isMobileViewport ? "EXP" : "EXPENSES", ratio: totalExpenses / gross },
        { value: taxReserve,    color: chartColorTax,      title: isMobileViewport ? "TAX" : "TAX VAULT", ratio: taxReserve / gross },
        { value: takeHome,      color: chartColorTakeHome, title: isMobileViewport ? "HOME" : "TAKE-HOME", ratio: takeHome / gross }
    ];

    const totalColumnsCount = barsDataPool.length;
    const absoluteColumnWidth = (graphWidth / totalColumnsCount) * (isMobileViewport ? 0.65 : 0.55); 
    const gapBetweenColumns  = (graphWidth - (absoluteColumnWidth * totalColumnsCount)) / (totalColumnsCount + 1);

    barsDataPool.forEach((barItem, idx) => {
        const columnStartX = paddingLeft + gapBetweenColumns + (idx * (absoluteColumnWidth + gapBetweenColumns));
        
        // 🚀 HEIGHT CALCULATION FIX: Maps column pixel size straight to its percentage ratio
        const computedColumnPixelHeight = barItem.ratio * graphHeight;
        const columnStartY = baselineY - computedColumnPixelHeight;

        ctx.save();
        ctx.fillStyle = barItem.color;
        ctx.beginPath();
        ctx.roundRect(columnStartX, columnStartY, absoluteColumnWidth, computedColumnPixelHeight > 0 ? computedColumnPixelHeight : 2);
        ctx.fill();

        ctx.font = isMobileViewport ? "bold 9px 'JetBrains Mono', monospace" : "bold 10px 'JetBrains Mono', monospace";
        ctx.fillStyle = barItem.color;
        ctx.textAlign = "center";
        
        // Renders clean percentage metrics text strings inside or above columns
        const percentageLabelString = `${Math.round(barItem.ratio * 100)}%`;
        ctx.fillText(percentageLabelString, columnStartX + (absoluteColumnWidth / 2), columnStartY - 10);

        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "#f8fafc";
        ctx.fillText(barItem.title, columnStartX + (absoluteColumnWidth / 2), baselineY + (isMobileViewport ? 12 : 16));
        ctx.restore();
    });

    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(paddingLeft, baselineY); ctx.lineTo(w - paddingRight, baselineY); ctx.stroke();
}

// =========================================================================
// 📈 PRESENTATION LAYER 3: RESPONSIVE SOLID PROPORTION PIE ENGINE
// =========================================================================
function executeProportionPieRenderingEngine(ctx, w, h, gross, expensesValue, taxValue, takeHomeValue) {
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;
    const themeBgMain = getComputedCanvasColorStyleValue('--bg-main', '#0b0f19');

    // 🚀 Force an absolute hardware clearing pass to prevent artifact layering.
    ctx.fillStyle = themeBgMain;
    ctx.fillRect(0, 0, w, h);

    if (typeof drawBackgroundGrid === 'function') drawBackgroundGrid(ctx, w, h);
    const activeSymbol = window.currentCurrency || '$ ';
    
    // 🎯 PERFECT SYMMETRICAL CENTRAL ANCHORING:
    const centerX = isMobileViewport ? (w / 2) : w * 0.38;
    const centerY = isMobileViewport ? (h * 0.44) : h * 0.50; // Centered beautifully for mobile views
    
    // 🎯 RE-CALCULATED RADIUS BOUNDARY FOR SOLID WEDGES:
    // This defines the exact outer circumference limit since the slices fill completely inward.
    const pieRadius = isMobileViewport ? 120 : Math.min(w, h) * 0.27; 

    if (gross <= 0) return;

    const chartColorExpenses = getComputedCanvasColorStyleValue('--color-expenses', '#f87171');
    const chartColorTax      = getComputedCanvasColorStyleValue('--color-tax', '#facc15');
    const chartColorTakeHome = getComputedCanvasColorStyleValue('--color-takehome', '#4ade80');

    const slices = [
        { value: expensesValue, color: chartColorExpenses, label: "Expenses" },
        { value: taxValue,      color: chartColorTax,      label: "Tax Vault" },
        { value: takeHomeValue, color: chartColorTakeHome, label: "Take-Home" }
    ];

    slices.sort((a, b) => b.value - a.value);
    let currentStartAngle = -Math.PI / 2; 

    // 🚀 THE SOLID PIE WEDGES CONVERGENCE LOOP:
    // This completely completely throws out your old donut ribbon thickness strokes. 
    // It creates true solid geometric wedges that meet cleanly in the middle!
    slices.forEach((slice) => {
        const sliceAngleSize = (slice.value / gross) * (2 * Math.PI);
        if (sliceAngleSize <= 0) return;

        ctx.save();
        ctx.beginPath();
        
        // 1. Move the drawing vector point right to the center vertex coordinate node
        ctx.moveTo(centerX, centerY);
        
        // 2. Sweep out to draw the outer circle line track circumference
        ctx.arc(centerX, centerY, pieRadius, currentStartAngle, currentStartAngle + sliceAngleSize);
        
        // 3. Connect back to the center origin automatically to finalize the slice shape
        ctx.closePath();
        
        ctx.fillStyle = slice.color;
        ctx.fill();
        ctx.restore();

        currentStartAngle += sliceAngleSize;
    });

    // 🎯 THE HOLE REMOVAL REMEDY:
    // Deleted the old inner white cutout path (`ctx.arc` + `ctx.fill()`) along with the 
    // centered "GROSS INCOME" text metrics from here entirely. Slices now converge symmetrically.

    // =========================================================================
    // 🚀 TARGET ANCHOR: LOWER CORNER LEGENDS COMPENSATION
    // =========================================================================
    const originalLegendOrder = [
        { value: expensesValue, color: chartColorExpenses, label: "Expenses" },
        { value: taxValue,      color: chartColorTax,      label: "Tax Vault" },
        { value: takeHomeValue, color: chartColorTakeHome, label: "Take-Home" }
    ];

    const expPercent  = Math.round((expensesValue / gross) * 100) || 0;
    const taxPercent  = Math.round((taxValue / gross) * 100) || 0;
    const homePercent = Math.round((takeHomeValue / gross) * 100) || 0;

    if (document.getElementById('lblMobileExp')) document.getElementById('lblMobileExp').innerText = `EXP: ${expPercent}%`;
    if (document.getElementById('lblMobileTax')) document.getElementById('lblMobileTax').innerText = `TAX: ${taxPercent}%`;
    if (document.getElementById('lblMobileHome')) document.getElementById('lblMobileHome').innerText = `HOME: ${homePercent}%`;

    if (isMobileViewport) {
        const nativeHTMLDeckElement = document.getElementById('mobileNativeLegendDeck');
        if (!nativeHTMLDeckElement || nativeHTMLDeckElement.style.display === 'none') {
            originalLegendOrder.forEach((slice, idx) => {
                const legendX = w * 0.58;
                const legendY = (h * 0.62) + (idx * 20); 
                
                ctx.fillStyle = slice.color;
                ctx.beginPath();
                ctx.arc(legendX, legendY - 3, 4, 0, 2 * Math.PI);
                ctx.fill();

                ctx.font = "bold 9px 'JetBrains Mono', monospace";
                ctx.fillStyle = getComputedCanvasColorStyleValue('--text-white', '#f8fafc');
                
                const percentageString = Math.round((slice.value / gross) * 100);
                ctx.fillText(`${slice.label.toUpperCase()}: ${percentageString}%`, legendX + 10, legendY);
            });
        }
    } else {
        originalLegendOrder.forEach((slice, idx) => {
            const legendX = w * 0.64;
            const legendY = (h * 0.38) + (idx * 24);
            
            ctx.fillStyle = slice.color;
            ctx.beginPath();
            ctx.arc(legendX, legendY - 3, 5, 0, 2 * Math.PI);
            ctx.fill();

            ctx.font = "bold 11px 'Plus Jakarta Sans', sans-serif";
            ctx.fillStyle = getComputedCanvasColorStyleValue('--text-white', '#f8fafc');
            
            const numericString = slice.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const percentageString = Math.round((slice.value / gross) * 100);
            const labelTextString = `${slice.label.toUpperCase()}: ${activeSymbol}${numericString} (${percentageString}%)`;
            
            ctx.fillText(labelTextString, legendX + 10, legendY);
        });
    }

}


// =========================================================================
// 📈 PRESENTATION LAYER 4: STANDALONE HORIZONTAL BAR GRAPH (0% - 100% SCALE)
// =========================================================================
function executeHorizontalBarChartRenderingEngine(ctx, w, h, gross, totalExpenses, taxReserve, takeHome) {
    if (typeof drawBackgroundGrid === 'function') drawBackgroundGrid(ctx, w, h);
    const isMobileViewport = window.matchMedia("(max-width: 768px)").matches;

    // 🚀 HARD-CLAMP HORIZONTAL TRACKS ON MOBILE:
    // Setting paddingTop to 80px compresses the vertical stack, dropping your top bar (Expenses) 
    // out of the button overlay zone permanently.
    const paddingLeft   = isMobileViewport ? 60 : 100;  
    const paddingRight  = isMobileViewport ? 48 : 130;  
    const paddingTop    = isMobileViewport ? 110 : 40;   // Injected 80px insulation clearance buffer
    const paddingBottom = isMobileViewport ? 24 : 40;

    const graphWidth  = w - paddingLeft - paddingRight;
    const graphHeight = h - paddingTop - paddingBottom;
    const baselineX   = paddingLeft;

    // 🚀 THE PERCENTAGE FRAMEWORK AXIS: Force axis ceilings directly to 100%
    const xAxisCeilingValue = 100;

    ctx.save();
    ctx.font = isMobileViewport ? "8px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    const totalGridLinesCount = isMobileViewport ? 3 : 4;
    for (let i = 0; i <= totalGridLinesCount; i++) {
        const lineRatio = i / totalGridLinesCount;
        const currentLineXPosition = baselineX + (graphWidth * lineRatio);
        
        // Calculate dynamic ticks as standard percentage markings (0%, 25%, 50%, 75%, 100%)
        const currentGridValueMarking = Math.round(xAxisCeilingValue * lineRatio);

        ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(currentLineXPosition, paddingTop); ctx.lineTo(currentLineXPosition, h - paddingBottom); ctx.stroke();

        ctx.fillStyle = getComputedCanvasColorStyleValue('--text-main', '#64748b');
        
        // 🚀 AXIS LABEL RE-BINDING: Injects the standard percentage suffix
        ctx.fillText(`${currentGridValueMarking}%`, currentLineXPosition, h - paddingBottom + 8);
    }
    ctx.restore();

    if (gross <= 0) return;

    const chartColorExpenses = getComputedCanvasColorStyleValue('--color-expenses', '#f87171');
    const chartColorTax      = getComputedCanvasColorStyleValue('--color-tax', '#facc15');
    const chartColorTakeHome = getComputedCanvasColorStyleValue('--color-takehome', '#4ade80');

    const barsDataPool = [
        { value: totalExpenses, color: chartColorExpenses, title: isMobileViewport ? "EXP" : "EXPENSES", ratio: totalExpenses / gross },
        { value: taxReserve,    color: chartColorTax,      title: isMobileViewport ? "TAX" : "TAX VAULT", ratio: taxReserve / gross },
        { value: takeHome,      color: chartColorTakeHome, title: isMobileViewport ? "HOME" : "TAKE-HOME", ratio: takeHome / gross }
    ];

    const totalBarsCount = barsDataPool.length;
    const absoluteBarHeight = (graphHeight / totalBarsCount) * 0.50; 
    const gapBetweenBars  = (graphHeight - (absoluteBarHeight * totalBarsCount)) / (totalBarsCount + 1);

    barsDataPool.forEach((barItem, idx) => {
        const barStartY = paddingTop + gapBetweenBars + (idx * (absoluteBarHeight + gapBetweenBars));
        
        // 🚀 WIDTH CALCULATION FIX: Maps horizontal bar pixel size straight to its percentage ratio
        const computedBarPixelWidth = barItem.ratio * graphWidth;

        ctx.save();
        ctx.fillStyle = barItem.color;
        ctx.beginPath();
        ctx.roundRect(baselineX, barStartY, computedBarPixelWidth > 0 ? computedBarPixelWidth : 2, absoluteBarHeight, 6);
        ctx.fill();

        ctx.font = "bold 9px 'JetBrains Mono', monospace"; ctx.fillStyle = "#f8fafc"; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(barItem.title, baselineX - 10, barStartY + (absoluteBarHeight / 2));

        ctx.textAlign = "left"; ctx.font = "bold 9px 'JetBrains Mono', monospace"; ctx.fillStyle = barItem.color;
        const percentageLabelString = `${Math.round(barItem.ratio * 100)}%`;
        
        // Renders clean percentage metrics tokens directly flush right of the bars
        ctx.fillText(percentageLabelString, baselineX + computedBarPixelWidth + 8, barStartY + (absoluteBarHeight / 2));
        ctx.restore();
    });

    ctx.strokeStyle = "#1e293b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(baselineX, paddingTop); ctx.lineTo(baselineX, h - paddingBottom); ctx.stroke();
}

// =========================================================================
// 🚀 MASTER SWITCHER: CLASS-BASED FAILSAFE VISIBILITY HUB (FORCE SYNC)
// =========================================================================
function switchMatrixChartStylePresentationMode(targetStyleName) {
    window.activeMatrixChartStyle = targetStyleName;
    const tabs = ["sankey", "bars", "hhoriz", "pie"]; 
    
    const isCurrentThemeLight = document.documentElement.getAttribute('data-theme') === 'light';

    tabs.forEach(style => {
        let buttonId = `tabChart${style.charAt(0).toUpperCase() + style.slice(1)}`;
        let btn = document.getElementById(buttonId);
        
        if (!btn && style === "hhoriz") btn = document.getElementById("tabChartHHoriz");
        if (!btn && style === "hhoriz") btn = document.getElementById("tabCharthhoriz");
        
        if (!btn) return;
        
        if (style === targetStyleName) {
            if (isCurrentThemeLight) {
                btn.style.background = "#ffffff"; 
                btn.style.color = "#0284c7";      
            } else {
                btn.style.background = "#1e293b"; 
                btn.style.color = "#38bdf8";      
            }
        } else {
            btn.style.background = "none";
            btn.style.color = isCurrentThemeLight ? "#475569" : "#64748b";
        }
    });

    // 🚀 THE BULLETPROOF FAILSAFE LOOP:
    // Instead of relying on a single ID name match which fails if there is a typo, 
    // query the DOM for your exact CSS layout class name (.mobile-only-html-legend).
    // This hunts down and force-toggles every matching box element instantly!
    const activeLegendBoxesPool = document.querySelectorAll('.mobile-only-html-legend');
    
    if (activeLegendBoxesPool && activeLegendBoxesPool.length > 0) {
        const isDeviceWidthMobile = window.innerWidth <= 768;
        
        activeLegendBoxesPool.forEach(boxElement => {
            if (isDeviceWidthMobile && targetStyleName === "pie") {
                // Force display onto the mobile screen *only* on the Pie tab
                boxElement.style.setProperty('display', 'flex', 'important');
            } else {
                // Force it to turn invisible on all other views instantly
                boxElement.style.setProperty('display', 'none', 'important');
            }
        });
    }

    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
}

// =========================================================================
// 🚀 HARDWARE CAPACITIVE TOUCH MONITOR: DETECTS HORIZONTAL VIEWPORT SWIPES
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    const canvasElement = document.getElementById('flowChart');
    if (!canvasElement) return;

    let touchCoordinatesStartX = 0;
    // Locate this at the absolute bottom of matrix-engine.js and confirm the array holds four items:
    const orderedChartsSequence = ["sankey", "bars", "hhoriz", "pie"];

    canvasElement.addEventListener('touchstart', (e) => {
        touchCoordinatesStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    canvasElement.addEventListener('touchend', (e) => {
        const touchCoordinatesEndX = e.changedTouches[0].clientX;
        const totalSwipeVelocityDeltaX = touchCoordinatesEndX - touchCoordinatesStartX;

        // Threshold check (60px): Ensures tiny accidental shakes are safely ignored
        if (Math.abs(totalSwipeVelocityDeltaX) > 60) {
            let activeIndex = orderedChartsSequence.indexOf(window.activeMatrixChartStyle);
            if (activeIndex === -1) activeIndex = 0;
            
            if (totalSwipeVelocityDeltaX < 0) {
                // Swiped Left: Advance forward
                activeIndex = (activeIndex + 1) % orderedChartsSequence.length;
            } else {
                // Swiped Right: Regress backward
                activeIndex = (activeIndex - 1 + orderedChartsSequence.length) % orderedChartsSequence.length;
            }
            switchMatrixChartStylePresentationMode(orderedChartsSequence[activeIndex]);
        }
    }, { passive: true });
});


// Aligned Breakdown Proportions Sliders
const inputIncomeSplit = document.getElementById('inputIncomeSplit');
const inputExpenseSplit = document.getElementById('inputExpenseSplit');
const inputTaxSplit = document.getElementById('inputTaxSplit');

function updateMatrixData() {
    let grossValueCalculated = 0, totalExpensesValueCalculated = 0, taxReserveValueCalculated = 0, takeHomeValueCalculated = 0;
    let gross, expRatio, taxRate;
    let incomePct, expensePct, taxPct;
    
    const totals = window.localHistoryTotals;
    const sheetMetrics = window.liveSheetMetrics || {
        activeRatio: 0.65, bizExpRatio: 0.60, incomeTaxRatio: 0.80,
        totals: { gross: 0, expenses: 0, taxWithheld: 0 }
    };
    
    const activeSymbol = window.currentCurrency || '$ ';
    const startFilterDate = document.getElementById('filterStartDate')?.value || '';
    const endFilterDate = document.getElementById('filterEndDate')?.value || '';
    const isDateRangeFilterActive = (startFilterDate !== '' || endFilterDate !== '');

    // 🚀 NEW HIGH-PRIORITY MULTI-SELECT & DATE INTERCEPTOR NODE
    if ((window.selectedHistoricalLogIndices && window.selectedHistoricalLogIndices.length > 0) || isDateRangeFilterActive) {
        let targetLogPool = [];

        if (window.selectedHistoricalLogIndices && window.selectedHistoricalLogIndices.length > 0) {
            window.selectedHistoricalLogIndices.forEach(idx => {
                if (window.cachedHistoricalLogs && window.cachedHistoricalLogs[idx]) {
                    targetLogPool.push(window.cachedHistoricalLogs[idx]);
                }
            });
        } else if (isDateRangeFilterActive && window.cachedHistoricalLogs) {
            window.cachedHistoricalLogs.forEach(log => {
                if (startFilterDate && log.date < startFilterDate) return;
                if (endFilterDate && log.date > endFilterDate) return;
                targetLogPool.push(log);
            });
        }

        let calculatedBizExpenses = 0, calculatedPlatformFees = 0;
        let calculatedIncomeTaxReserve = 0, calculatedWithholdingTaxHome = 0;

        targetLogPool.forEach(logItem => {
            const invoiceAmt     = parseFloat(logItem.amount) || 0;
            const platformPctVal = parseFloat(logItem.platformPct) || 0;
            const fxRateVal      = parseFloat(logItem.fxRate) || 1;
            const rawWithholdAmt = parseFloat(logItem.withholdAmt) || 0;
            
            grossValueCalculated += (parseFloat(logItem.homeIncome) || parseFloat(logItem.netHomeIncome) || 0);
            calculatedBizExpenses += (parseFloat(logItem.bizExpense) || 0);
            calculatedIncomeTaxReserve += (parseFloat(logItem.finalTaxOwed) || 0);
            takeHomeValueCalculated += (parseFloat(logItem.takeHomePay) || 0);

            const isPlat = (logItem.platformToggle === "YES" || platformPctVal > 0);
            
            // 📍 TRAP THE NaN LEAK BY UPDATING THIS SPECIFIC LINE LIKE THIS:
            const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
            calculatedPlatformFees += isNaN(computedPlatformFeeHome) ? 0 : computedPlatformFeeHome;
            if (logItem.withholdingToggle === "YES" || rawWithholdAmt > 0) {
                calculatedWithholdingTaxHome += (rawWithholdAmt * fxRateVal);
            }
        });

        totalExpensesValueCalculated = calculatedBizExpenses + calculatedPlatformFees;
        taxReserveValueCalculated = calculatedIncomeTaxReserve + calculatedWithholdingTaxHome;
        if (targetLogPool.length === 0) takeHomeValueCalculated = 0;

        // Inside updateMatrixData() -> Find your metric card text innerText injections:
        const activeSymbol = window.currentCurrency || '$ ';

        if (document.getElementById('grossDisplay')) {
            document.getElementById('grossDisplay').innerText = formatHighDensityDashboardMetric(gross, activeSymbol);
        }
        if (document.getElementById('expensesDisplay')) {
            document.getElementById('expensesDisplay').innerText = formatHighDensityDashboardMetric(totalExpenses, activeSymbol);
        }
        if (document.getElementById('taxDisplay')) {
            document.getElementById('taxDisplay').innerText = formatHighDensityDashboardMetric(taxReserve, activeSymbol);
        }
        if (document.getElementById('takeHomeDisplay')) {
            document.getElementById('takeHomeDisplay').innerText = formatHighDensityDashboardMetric(takeHome, activeSymbol);
        }

        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${activeSymbol}${grossValueCalculated.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${activeSymbol}0.00`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${activeSymbol}${calculatedBizExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${activeSymbol}${calculatedPlatformFees.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${activeSymbol}${calculatedIncomeTaxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${activeSymbol}${calculatedWithholdingTaxHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        if (grossValueCalculated > 0) {
            if (document.getElementById('barExpenses')) document.getElementById('barExpenses').style.width = `${(totalExpensesValueCalculated / grossValueCalculated) * 100}%`;
            if (document.getElementById('barTax')) document.getElementById('barTax').style.width = `${(taxReserveValueCalculated / grossValueCalculated) * 100}%`;
            if (document.getElementById('barTakeHome')) document.getElementById('barTakeHome').style.width = `${(takeHomeValueCalculated / grossValueCalculated) * 100}%`;
        }

        if (typeof drawFlowLines === 'function') {
            drawFlowLines(grossValueCalculated, totalExpensesValueCalculated, taxReserveValueCalculated, takeHomeValueCalculated);
        }
        return; 
    }

    // =========================================================================
    // ⚡ SCENARIO A: HISTORICAL DRILL-DOWN BLOCK (PERFECT SHEET ALIGNMENT)
    // =========================================================================
// =========================================================================
// 🚀 REPAIRED PINNED VIEW SCENARIO INSIDE updateMatrixData() IN matrix-engine.js
// =========================================================================
if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
    const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
    
    // Freeze range inputs programmatically while reviewing archival states
    const slidersToLock = ['inputRevenue', 'inputRatio', 'inputTaxRate', 'inputIncomeSplit', 'inputExpenseSplit', 'inputTaxSplit'];
    slidersToLock.forEach(id => {
        const sliderEl = document.getElementById(id);
        if (sliderEl) {
            sliderEl.disabled = true;
            sliderEl.style.cursor = "not-allowed";
            sliderEl.style.opacity = "0.5";
        }
    });

    // 1. Pull core layout values straight from our row cache
    const invoiceAmt        = parseFloat(logItem.amount) || 0;
    const platformPctVal    = parseFloat(logItem.platformPct) || 0;
    const fxRateVal         = parseFloat(logItem.fxRate) || 1;
    const bizExpenseAmt     = parseFloat(logItem.bizExpense) || 0;
    
    gross                   = parseFloat(logItem.homeIncome) || parseFloat(logItem.netHomeIncome) || 0;
    const incomeTaxOwed     = parseFloat(logItem.finalTaxOwed) || 0;
    const takeHome          = parseFloat(logItem.takeHomePay) || 0;

    // ─── 🛡️ FRONTEND HYBRID WITHHOLDING DECODER TRACK ───
    let withholdingTaxHome = 0;
    const rawWithholdColumnValue = parseFloat(logItem.withholdAmt) || 0;

    // If rowTaxRateSetting is undefined, null, or empty string, it's a legacy row entry
    if (logItem.rowTaxRateSetting === undefined || logItem.rowTaxRateSetting === null || String(logItem.rowTaxRateSetting).trim() === "") {
        withholdingTaxHome = rawWithholdColumnValue * fxRateVal; // Legacy absolute cash format
    } else {
        // Modern row entry: Column F is a percentage fraction, multiply by Invoice Amount
        withholdingTaxHome = (invoiceAmt * rawWithholdColumnValue) * fxRateVal; // Percentage format
    }

    const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
    const logTotalExpenses = bizExpenseAmt + computedPlatformFeeHome;
    const computedNetProfit = gross - bizExpenseAmt; 

    // Combined metric card value sum
    const taxReserve = incomeTaxOwed + withholdingTaxHome;

    const logCurrencyCode = logItem.rowCurrencySetting || logItem.currency || "USD";
    const logSymbol = typeof getGlobalCurrencySymbolCharacter === 'function' 
        ? getGlobalCurrencySymbolCharacter(logCurrencyCode) 
        : '$ ';

    window.currentCurrency = logSymbol;

    // 2. Inject figures onto dashboard layout nodes with full decimal precision
    if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${logSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${logSymbol}${logTotalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${logSymbol}${taxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${logSymbol}${takeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    
    if (document.getElementById('valRevenue')) document.getElementById('valRevenue').innerText = `${logSymbol}${gross.toLocaleString()}`;
    
    // Hydrate breakdown panels using the localized log symbol
    if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${logSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${logSymbol}0.00`;
    if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${logSymbol}${bizExpenseAmt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${logSymbol}${computedPlatformFeeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${logSymbol}${incomeTaxOwed.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
    if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${logSymbol}${withholdingTaxHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

    if (gross > 0) {
        document.getElementById('barExpenses').style.width = `${(logTotalExpenses / gross) * 100}%`;
        document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }

    if (typeof drawFlowLines === 'function') {
        drawFlowLines(gross, logTotalExpenses, taxReserve, takeHome);
    }
    
    if (typeof synchronizeDualCurrencyActionButtons === 'function') synchronizeDualCurrencyActionButtons();
    return; 
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
        
        // 🚀 CRITICAL INCOME BREAKDOWN OVERHAUL: Maps gross sum completely to Active Invoice on boot tracking
        if (document.getElementById('incActive')) {
            document.getElementById('incActive').innerText = `${activeSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        }
        if (document.getElementById('incOthers')) {
            document.getElementById('incOthers').innerText = `${activeSymbol}0.00`;
        }
        
        // 🚀 FIXED SCENARIO B LEGEND: Enforce uniform double-decimal formatting across detailed breakdown matrices
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
    }
 
    else {
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
    if (newValue > 1000000000000) newValue = 1000000000000;

    slider.value = newValue;
    
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
}

// =========================================================================
// 🚀 MASTER UPGRADE: ADVANCED REVENUE-AWARE DYNAMIC LONG-PRESS CONTROLLER
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
    let globalStepperIntervalLoop = null;
    let globalStepperDelayTimeout = null;

    // 🔄 REPLACE your existing button search loop with this target-locked patch:
    document.querySelectorAll('.step-btn[data-slider-target]').forEach(button => {
        const targetSliderId = button.getAttribute('data-slider-target');
        const loopDirection  = parseFloat(button.getAttribute('data-direction')) || 1;
        
        let isGlobalMacroAction = (targetSliderId === 'inputRatio');
        let operationalStepWeight = 0.1;
        if (targetSliderId === 'inputTaxRate') {
            operationalStepWeight = 0.5; 
        }

        button.addEventListener('mousedown', (e) => {
            // ✔️ FIXED: Do not intercept actions unless they specifically run the range adjustments
            if (!targetSliderId) return; 
            
            e.preventDefault();
            killActiveStepperTimers();

            if (targetSliderId === 'inputRevenue') {
                if (typeof adjustRevenueViaMultiplier === 'function') adjustRevenueViaMultiplier(loopDirection);
                globalStepperDelayTimeout = setTimeout(() => {
                    globalStepperIntervalLoop = setInterval(() => {
                        if (typeof adjustRevenueViaMultiplier === 'function') adjustRevenueViaMultiplier(loopDirection);
                    }, 40); 
                }, 350);
            } else {
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

        button.addEventListener('mouseup', killActiveStepperTimers);
        button.addEventListener('mouseleave', killActiveStepperTimers);
        
        button.addEventListener('touchstart', (e) => {
            // ✔️ FIXED: Check class structure boundaries to avoid breaking standard form buttons
            if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('step-btn')) return;
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

// =========================================================================
// 🚀 DYNAMIC LAYOUT DEVICE SWAP BROADCASTER CONTROLLER
// =========================================================================

window.isMobileDrawerSheetOpenStateActive = false;

function toggleMobileSidebarTraySheetState() {
    const sidebarPanel = document.getElementById('appInputSidebarPanel');
    const floatingBtn  = document.getElementById('mobileFloatingDrawerTriggerBtn');
    const textLabel    = document.getElementById('mobileTriggerToggleBtnLabelStringText');
    const arrowIcon    = document.getElementById('mobileTriggerToggleBtnVectorIcon');

    if (!sidebarPanel || !floatingBtn) return;

    window.isMobileDrawerSheetOpenStateActive = !window.isMobileDrawerSheetOpenStateActive;

    if (window.isMobileDrawerSheetOpenStateActive) {
        // Slide drawer up into active focus profile view
        sidebarPanel.classList.add('drawer-active-mobile');
        
        // Transform the floating pill design to an entry collapse style framework
        floatingBtn.style.borderColor = "#f87171";
        floatingBtn.style.color = "#f87171";
        if (textLabel) textLabel.innerText = "CLOSE MENU";
        if (arrowIcon) {
            arrowIcon.innerHTML = `<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>`;
        }
    } else {
        // Return tray down out of screen view area bounds
        sidebarPanel.classList.remove('drawer-active-mobile');
        
        // Revert to primary cyan accent configurations profile themes
        floatingBtn.style.borderColor = "#38bdf8";
        floatingBtn.style.color = "#38bdf8";
        if (textLabel) textLabel.innerText = "LOG ENTRY";
        if (arrowIcon) {
            arrowIcon.innerHTML = `<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>`;
        }
    }
}

// Intercept viewport size mutations to manage visibility constraints of the drawer trigger handles
function evaluateResponsiveInterfaceStateAnchors() {
    const mobileBtn = document.getElementById('mobileFloatingDrawerTriggerBtn');
    const sidebarPanel = document.getElementById('appInputSidebarPanel');
    if (!mobileBtn || !sidebarPanel) return;

    if (window.innerWidth <= 768) {
        mobileBtn.style.display = "flex"; // Mount floating trigger card asset element track
    } else {
        mobileBtn.style.display = "none";  // Wipe mobile elements track on standard screen bounds
        sidebarPanel.classList.remove('drawer-active-mobile');
        window.isMobileDrawerSheetOpenStateActive = false;
    }
}

// Attach operational resize triggers natively to the DOM cycle loop tracks
document.addEventListener('DOMContentLoaded', () => {
    evaluateResponsiveInterfaceStateAnchors();
    window.addEventListener('resize', evaluateResponsiveInterfaceStateAnchors);
});

// Auto-collapse bottom drawer tray view sheet right after streaming payload records completes to clear visual paths
const originalDispatchTransactionBundle = window.dispatchLedgerTransactionBundle;
if (typeof originalDispatchTransactionBundle === 'function') {
    // Intercept submit button callbacks down across internal sync engine flows
    const submitBtnActionEl = document.getElementById('btnSubmit');
    if (submitBtnActionEl) {
        submitBtnActionEl.addEventListener('click', () => {
            setTimeout(() => {
                const statusMessageElement = document.getElementById('syncStatus');
                if (statusMessageElement && statusMessageElement.innerText.indexOf("✔") > -1) {
                    if (window.innerWidth <= 768 && window.isMobileDrawerSheetOpenStateActive) {
                        toggleMobileSidebarTraySheetState(); // Auto-dismiss tray upon validation loops completions
                    }
                }
            }, 1200);
        });
    }
}

// =========================================================================
// 🎛 PREMIUM VERTICAL DRAG ENGINE: RIGHT-EDGE GESTURE OPERATOR (PINNED SCROLL ONLY)
// =========================================================================

(function initRightPanelDragGestureEngine() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    const canvas = document.getElementById('flowChart');
    if (!wrapper || !canvas) return;

    let isDraggingOpacity = false;
    let globalOpacityValue = 0.95; 

    function commitNewOpacityLevel(newAlpha) {
        globalOpacityValue = Math.max(0.10, Math.min(1.00, newAlpha)); // Hard clamps opacity between 10% and 100%
        canvas.style.opacity = globalOpacityValue;
        
        // Synchronize detached floating wrapper panel card state visibility seamlessly
        if (wrapper.classList.contains('detached-floating-window')) {
            wrapper.style.opacity = globalOpacityValue;
        }
    }

    // Mathematical boundary filter: Intercept actions occurring strictly in the right 15% width zone
    function checkIsWithinRightSidePanelBounds(clientX, clientY) {
        // 🔒 SCOPE SECURITY GUARD: Exit instantly if the chart is NOT detached/popped out!
        if (!wrapper.classList.contains('detached-floating-window') && !window.isMatrixChartDetachedFloating) {
            return false;
        }

        const wrapperRect = wrapper.getBoundingClientRect();
        const touchXPositionInsideWrapper = clientX - wrapperRect.left;
        const touchYPositionInsideWrapper = clientY - wrapperRect.top;
        
        // 🚀 PROTECTION SHIELD GATE: If the pointer is anywhere near the top 60px action ribbon, 
        // completely ignore it so buttons like Pin and Fullscreen work flawlessly!
        if (touchYPositionInsideWrapper < 60) return false;

        // Returns true only if the user drags inside the far right strip
        return touchXPositionInsideWrapper > (wrapperRect.width * 0.85); 
    }

    function calculateOpacityFromVerticalPosition(clientY) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const touchYPositionInsideWrapper = clientY - wrapperRect.top;
        
        // Vertical sliding scale map logic: sliding UP dims the value, sliding DOWN brightens it
        const rawRatioValue = 1 - (touchYPositionInsideWrapper / wrapperRect.height);
        commitNewOpacityLevel(rawRatioValue);
    }

    // 🖱️ DESKTOP MOUSE INTERACTION CAPTURE HANDLERS
    wrapper.addEventListener('mousedown', (e) => {
        if (checkIsWithinRightSidePanelBounds(e.clientX, e.clientY)) {
            isDraggingOpacity = true;
            wrapper.style.cursor = 'ns-resize'; // Changes cursor symbol to a vertical re-size track
            calculateOpacityFromVerticalPosition(e.clientY);
            e.preventDefault();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingOpacity) return;
        calculateOpacityFromVerticalPosition(e.clientY);
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingOpacity) {
            isDraggingOpacity = false;
            wrapper.style.cursor = '';
        }
    });

    // 📱 SMARTPHONE TOUCH INTERACTION GESTURE HANDLERS
    wrapper.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const mobileFirstTouchPoint = e.touches[0];
        
        if (checkIsWithinRightSidePanelBounds(mobileFirstTouchPoint.clientX, mobileFirstTouchPoint.clientY)) {
            isDraggingOpacity = true;
            calculateOpacityFromVerticalPosition(mobileFirstTouchPoint.clientY);
            e.preventDefault(); // Blocks mobile viewport scrolling while adjusting opacity values
        }
    }, { passive: false });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDraggingOpacity) return;
        if (!e.touches || e.touches.length === 0) return;
        const mobileFirstTouchPoint = e.touches[0];
        
        calculateOpacityFromVerticalPosition(mobileFirstTouchPoint.clientY);
        e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        isDraggingOpacity = false;
    });
})();

/* ========================================================================= */
/* 🎛️ STANDALONE LEFT-EDGE GESTURE ENGINE: CONTROLS GRID LINE VISIBILITY     */
/* ========================================================================= */

// Global tracker state initialized natively for grid lines visibility
window.matrixChartGridLinesOpacity = 0.25; 

(function initLeftPanelGridDragGestureEngine() {
    const wrapper = document.getElementById('matrixFlowChartWrapper');
    if (!wrapper) return;

    let isDraggingGridLines = false;

    // Boundary filter: Intercept actions occurring strictly in the LEFT 15% width zone
    function checkIsWithinLeftSidePanelBounds(clientX, clientY) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const touchXPositionInsideWrapper = clientX - wrapperRect.left;
        const touchYPositionInsideWrapper = clientY - wrapperRect.top;
        
        // 🚀 PROTECTION SHIELD GATE: Avoid reaching the top 60px chart selector ribbon area
        if (touchYPositionInsideWrapper < 60) return false;

        // Returns true ONLY if the user drags inside the far left 15% strip
        return touchXPositionInsideWrapper < (wrapperRect.width * 0.15); 
    }

    function calculateGridOpacityFromVerticalPosition(clientY) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const touchYPositionInsideWrapper = clientY - wrapperRect.top;
        
        // Sliding scale map logic: sliding UP dims lines, sliding DOWN brightens them
        // Hard clamps alpha visibility securely between 0.00 (invisible) and 0.80 (high contrast sharp grid)
        let computedAlphaRatio = 1 - (touchYPositionInsideWrapper / wrapperRect.height);
        window.matrixChartGridLinesOpacity = Math.max(0.00, Math.min(0.80, computedAlphaRatio));
        
        // Force an immediate live visual redraw pass across the canvas surface
        if (typeof window.updateMatrixData === 'function') {
            window.updateMatrixData();
        }
    }

    // 🖱️ DESKTOP MOUSE INTERACTION HANDLERS
    wrapper.addEventListener('mousedown', (e) => {
        if (checkIsWithinLeftSidePanelBounds(e.clientX, e.clientY)) {
            isDraggingGridLines = true;
            wrapper.style.cursor = 'ns-resize'; 
            calculateGridOpacityFromVerticalPosition(e.clientY);
            e.preventDefault();
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDraggingGridLines) return;
        calculateGridOpacityFromVerticalPosition(e.clientY);
    });

    window.addEventListener('mouseup', () => {
        if (isDraggingGridLines) {
            isDraggingGridLines = false;
            wrapper.style.cursor = '';
        }
    });

    // 📱 SMARTPHONE CAPACITIVE TOUCH GESTURE HANDLERS
    wrapper.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const mobileFirstTouchPoint = e.touches[0];
        
        if (checkIsWithinLeftSidePanelBounds(mobileFirstTouchPoint.clientX, mobileFirstTouchPoint.clientY)) {
            isDraggingGridLines = true;
            calculateGridOpacityFromVerticalPosition(mobileFirstTouchPoint.clientY);
            e.preventDefault(); // Stop mobile viewport scrolling while adjusting lines opacity
        }
    }, { passive: false });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDraggingGridLines) return;
        if (!e.touches || e.touches.length === 0) return;
        const mobileFirstTouchPoint = e.touches[0];
        
        calculateGridOpacityFromVerticalPosition(mobileFirstTouchPoint.clientY);
        e.preventDefault();
    }, { passive: false });

    wrapper.addEventListener('touchend', () => {
        isDraggingGridLines = false;
    });
})();

// =========================================================================
// 🚀 THE ULTIMATE POP-OUT BINDER HOOK (FIXES DEAD CLICK TRAAPS)
// =========================================================================

window.addEventListener('DOMContentLoaded', () => {
    // 1. Gather all potential button click targets across desktop and mobile screens
    const mobileTrayBtn  = document.getElementById('inlineActionTrayWrapper');
    const desktopFloatBtn = document.getElementById('btnPinChartFloat');
    const inlineFloatBtn  = document.getElementById('btnPinChartFloatInline');

    // 🎯 MOBILE BINDER: If the user taps anywhere on your new mini left-aligned action tray box
    if (mobileTrayBtn) {
        mobileTrayBtn.addEventListener('click', (e) => {
            console.log("⚡ Success: Mobile Chart Pin click detected!");
            if (typeof toggleMatrixChartFloatingState === 'function') {
                toggleMatrixChartFloatingState();
            }
            e.stopPropagation(); // Prevents touch drag engine from stealing the click asset
        });
        mobileTrayBtn.style.cursor = 'pointer'; // Forces a hand symbol indicator on hover
    }

    // 🎯 DESKTOP BINDERS: Safely attach click handlers to your desktop buttons if present
    if (desktopFloatBtn) {
        desktopFloatBtn.addEventListener('click', () => {
            if (typeof toggleMatrixChartFloatingState === 'function') toggleMatrixChartFloatingState();
        });
    }

    if (inlineFloatBtn) {
        inlineFloatBtn.addEventListener('click', () => {
            if (typeof toggleMatrixChartFloatingState === 'function') toggleMatrixChartFloatingState();
        });
    }
});

// Dynamic Runtime Variable Extraction Utility Hook
function getComputedCanvasColorStyleValue(customPropertyName, defaultFallbackHex) {
    const rawValue = getComputedStyle(document.documentElement).getPropertyValue(customPropertyName).trim();
    return rawValue || defaultFallbackHex;
}

function drawBackgroundGrid(ctx, w, h) {
    const isCurrentThemeLight = document.documentElement.getAttribute('data-theme') === 'light';
    
    // Choose base line colors dynamically depending on the current active theme setting selection
    const r = isCurrentThemeLight ? 148 : 30;
    const g = isCurrentThemeLight ? 163 : 41;
    const b = isCurrentThemeLight ? 184 : 59;
    
    // ✔️ FIXED: Injects the real-time calculated left-edge gesture opacity ratio seamlessly!
    const activeGridOpacityValue = (window.matrixChartGridLinesOpacity !== undefined) 
        ? window.matrixChartGridLinesOpacity 
        : 0.25;

    ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${activeGridOpacityValue})`;
    ctx.lineWidth = 1;
    
    // Draw vertical graph grid alignment markings lines
    for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    // Draw horizontal graph grid metrics tracking grid lines
    for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
}

// 🔄 UPDATE: Inside executeProportionPieRenderingEngine()
// Replace the hardcoded slice arrays definition with this variables extraction hook:
const colorExpenses = getComputedCanvasColorStyleValue('--color-expenses', '#f87171');
const colorTax      = getComputedCanvasColorStyleValue('--color-tax', '#facc15');
const colorTakeHome = getComputedCanvasColorStyleValue('--color-takehome', '#4ade80');
const colorBgMain   = getComputedCanvasColorStyleValue('--bg-main', '#0b0f19');

const slices = [
    { value: expensesValue, color: colorExpenses, label: "Expenses" },
    { value: taxValue,      color: colorTax,      label: "Tax Vault" },
    { value: takeHomeValue, color: colorTakeHome, label: "Take-Home" }
];

// ... Locate the center hollow fill path loop lower in the pie calculation engine:
ctx.beginPath();
ctx.arc(centerX, centerY, donutCenterRadiusTrack - (donutRibbonThickness / 2) - 1, 0, 2 * Math.PI);
ctx.fillStyle = colorBgMain; // ✔️ FIXED: Fills center hole smoothly with theme matching backgrounds
ctx.fill();

// =========================================================================
// 🚀 METRIC PACK FORMATTER: CLEARS DASHBOARD CLUTTER FOR LARGE FIGURES
// =========================================================================
function formatHighDensityDashboardMetric(numericValue, activeSymbol) {
    const cleanNum = parseFloat(numericValue) || 0;
    const isMobile = window.innerWidth <= 768;

    // 🎯 THRESHOLD SWITCH: If values pass 1 Million, use compact M abbreviations on small or crowded viewports
    if (cleanNum >= 10000000) { // Triggers at 10 Million
        return `${activeSymbol}${(cleanNum / 1000000).toFixed(2)}M`;
    } else if (cleanNum >= 1000000) { // Triggers at 1 Million
        return `${activeSymbol}${(cleanNum / 1000000).toFixed(3)}M`;
    }
    
    // Default fallback layout double decimal representation for standard figures
    return `${activeSymbol}${cleanNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
