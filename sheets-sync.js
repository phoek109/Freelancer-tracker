const apiInput = document.getElementById('apiEndpoint');

// Global dynamic active view tracking target indicators
window.activeMatrixCurrencyScopeMode = "home"; // Toggles between "received" or "home" pipelines
window.currentlyPinnedLogIndex = null;
window.cachedHistoricalLogs = [];

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    if (localStorage.getItem('userBaseCurrencyConfig')) {
        document.getElementById('baseCurrencyConfig').value = localStorage.getItem('userBaseCurrencyConfig');
    }
    if (localStorage.getItem('userBaseTaxRateConfig')) {
        document.getElementById('baseTaxRateConfig').value = localStorage.getItem('userBaseTaxRateConfig');
    }
    
    document.getElementById('formDate').valueAsDate = new Date();
    
    if (typeof resizeCanvas === 'function') resizeCanvas();
    if (typeof updateBaseCurrencyConfigSymbols === 'function') updateBaseCurrencyConfigSymbols();

    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        dynamicallyHydrateGlobalCurrencies();
        
        // 🚀 CRUCIAL INITIALIZATION FIX: Enforce instant log card pulling on launch!
        fetchAndHydrateLogCachesFromSheet();
    }, 50);
});

// Also force it to run immediately if a buyer updates or pastes a new URL in the setup input field box
apiInput.addEventListener('input', (e) => {
    const urlValue = e.target.value.trim();
    localStorage.setItem('userSheetDB', urlValue);
    if (urlValue.startsWith('https://google.com')) {
        fetchAndHydrateLogCachesFromSheet();
    }
});

apiInput.addEventListener('input', (e) => {
    const urlValue = e.target.value.trim();
    localStorage.setItem('userSheetDB', urlValue);
    
    if (urlValue.startsWith('https://google.com')) {
        console.log("Valid Google Web App detected. Initializing database hydration stream...");
        if (typeof dynamicallyHydrateGlobalCurrencies === 'function') {
            dynamicallyHydrateGlobalCurrencies();
        }
    }
});

async function updateBaseCurrencySettingsInSheet() {
    if (typeof updateBaseCurrencyConfigSymbols === 'function') updateBaseCurrencyConfigSymbols();
    
    const endpoint = apiInput.value.trim();
    if (!endpoint) return;

    const baseCurrencyValue = document.getElementById('baseCurrencyConfig').value;
    const targetTaxRateValue = (parseFloat(document.getElementById('baseTaxRateConfig').value) || 0) / 100;

    localStorage.setItem('userBaseCurrencyConfig', baseCurrencyValue);
    localStorage.setItem('userBaseTaxRateConfig', document.getElementById('baseTaxRateConfig').value);

    // FIXED: Formatted the settings backup block correctly to prevent 404/CORS crashes
    const payload = {
        configUpdate: true,
        "Base Currency": baseCurrencyValue,
        "Tax Rate": targetTaxRateValue
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();
        if (result.status === "success") {
            console.log("⚡ Logcat Core: Global base configuration values saved.");
        }
    } catch (e) {
        console.log("Configuration tracking network sync lag error.");
    }
}

async function dispatchLedgerTransactionBundle() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "🛑 Error: Paste your Google Web App URL first!"; 
        return; 
    }

    const currencySelectEl = document.getElementById('formCurrency');
    const subIncome = currencySelectEl ? currencySelectEl.value.trim() : "";

    if (!subIncome || subIncome === "" || subIncome.includes("COMPUTING") || subIncome.includes("Loading")) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Blocked: Wait for currency selection lists to mount!";
        return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim();
    const amtIncome = parseFloat(document.getElementById('formAmount').value) || 0;
    
    const rawFeeVal = parseFloat(document.getElementById('formFees').value) || 0;
    const feePercentage = rawFeeVal / 100;

    const amtExpense = parseFloat(document.getElementById('formExpenses').value) || 0;
    const amtTax = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;
    const isWithholding = document.getElementById('formWithholdingToggle').value;
    const platformToggleEl = document.getElementById('formPlatformFeesToggle');
    const isPlatformFeesDeducted = platformToggleEl ? platformToggleEl.value : (feePercentage > 0 ? "YES" : "NO");

    // EXTRACT CONVERSION SYSTEM VALUES FROM THE FORM HANDLE OBJECTS
    const convMode = document.getElementById('formConversionMode').value;
    const exactCashAmt = parseFloat(document.getElementById('formExactCashAmt').value) || 0;
    const customRateVal = parseFloat(document.getElementById('formCustomRateVal').value) || 1;

    if (!date || !client || (amtIncome <= 0 && amtExpense === 0)) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Blocked: Fill out all required fields!";
        return;
    }

    // RIGID SECURE INGESTION STRUCTURAL UNIFIED PAYLOAD BUNDLE
    const payload = {
        data: {
            "Date": date,
            "Client Name": client,
            "Invoice Amount": amtIncome,
            "Currency Received": subIncome.toUpperCase().trim(),
            "Withholding Tax Deducted": isWithholding.toUpperCase().trim(),
            "Withholding Amount": amtTax, 
            "Platform Fees Deducted": isPlatformFeesDeducted.toUpperCase().trim(),
            "Platform Percentage": feePercentage, 
            "Business Expenses": amtExpense,
            // FIXED: Added missing conversion properties to the payload object properties mapping track
            "Conversion Mode": convMode,
            "Exact Cash Input": exactCashAmt,
            "Custom Rate Input": customRateVal
        }
    };

    console.log("⚡ FRONT-END LOGCAT PAYLOAD TRANSMISSION BUNDLE:\n", JSON.stringify(payload, null, 2));

    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = true;
    submitBtn.innerText = "SAVING...";

    try {
        const response = await fetch(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        console.log("🛰️ SERVER RESPONSE RECEIVED: ", JSON.stringify(result, null, 2));

        if (result.status === "success") {
            statusText.style.color = '#4ade80'; 
            statusText.innerText = "✔ Verified transaction successfully logged into Google Sheets!";
            
            document.getElementById('formAmount').value = '';
            document.getElementById('formFees').value = '0';
            document.getElementById('formExpenses').value = '0';
            document.getElementById('formWithholdingAmt').value = '0';
            document.getElementById('formClient').value = '';
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        console.error("🚨 TRANSMISSION CRASH LOG: ", err);
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Streaming failed. Check connection parameter inputs!";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "STREAM TO SHEET";
    }
}

// =========================================================================
// 🚀 UPGRADED: TRUE ZERO-HARDCODING DROPDOWN LOADER WITH ANIMATED SHIMMER
// =========================================================================
async function dynamicallyHydrateGlobalCurrencies() {
    const selectReceived = document.getElementById('formCurrency');
    const selectHome = document.getElementById('baseCurrencyConfig');

    if (!selectReceived || !selectHome) return;

    // Phase A: Inject animated neon state tags onto selector element containers
    selectReceived.classList.add('select-loading-pulse');
    selectHome.classList.add('select-loading-pulse');
    
    selectReceived.innerHTML = "<option>COMPUTING GLOBAL EXCHANGES...</option>";
    selectHome.innerHTML = "<option>INITIALIZING ISO CODES...</option>";

    // Safety timeout to create a beautiful, visible 400ms loading sequence before populating values
    setTimeout(() => {
        try {
            // Query the browser core directly for every single active currency on earth
            let currencyCodes = Intl.supportedValuesOf('currency');
            currencyCodes.sort();

            selectReceived.innerHTML = "";
            selectHome.innerHTML = "";

            currencyCodes.forEach(code => {
                const optRec = document.createElement('option');
                optRec.value = code;
                optRec.innerText = code;
                if (code === "EUR") optRec.selected = true; 
                selectReceived.appendChild(optRec);

                const optHome = document.createElement('option');
                optHome.value = code;
                optHome.innerText = code;
                if (code === "USD") optHome.selected = true; 
                selectHome.appendChild(optHome);
            });

            console.log(`✔ Populated ${currencyCodes.length} currency definitions via local runtime locales.`);
            
        } catch (e) {
            console.log("Local localization tables lagging. Applying baseline defaults.");
            const backups = ["USD", "EUR", "GBP", "UGX", "KES", "NGN", "SEK", "LKR"];
            selectReceived.innerHTML = ""; selectHome.innerHTML = "";
            backups.forEach(code => {
                selectReceived.innerHTML += `<option value="${code}">${code}</option>`;
                selectHome.innerHTML += `<option value="${code}">${code}</option>`;
            });
        } finally {
            // Phase B: Data extraction complete! Drop loading classes to snap layout back to standard state
            selectReceived.classList.remove('select-loading-pulse');
            selectHome.classList.remove('select-loading-pulse');

            // Force visual sync hooks to calculate charts and mount your dual button selectors instantly
            if (typeof synchronizeDualCurrencyActionButtons === 'function') synchronizeDualCurrencyActionButtons();
            if (typeof updateMatrixData === 'function') updateMatrixData();
        }
    }, 400); // 400ms execution frame guarantees the premium shimmer effect paints smoothly
}

let splitSyncTimeout;

function streamBreakdownProportionsToSheet() {
    const endpoint = apiInput.value.trim();
    if (!endpoint) return;

    // Fetch live input floating-point allocation values
    const incomeSplitVal = (parseFloat(document.getElementById('inputIncomeSplit').value) || 0) / 100;
    const expenseSplitVal = (parseFloat(document.getElementById('inputExpenseSplit').value) || 0) / 100;
    const taxSplitVal = (parseFloat(document.getElementById('inputTaxSplit').value) || 0) / 100;

    const payload = {
        configUpdate: true,
        "Income Split": incomeSplitVal,   
        "Expense Split": expenseSplitVal, 
        "Tax Split": taxSplitVal          
    };

    // Debounce optimization: waits 800ms after the user stops sliding before sending a single network call
    clearTimeout(splitSyncTimeout);
    splitSyncTimeout = setTimeout(async () => {
        try {
            await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
            console.log("✔ Proportional matrix splits backed up to Google Sheet.");
        } catch (e) {
            console.log("Database synchronization pipeline lag.");
        }
    }, 800);
}
// =========================================================================
// 🚀 FIXED: ZERO HARDCODING. AUTOMATICALLY EXTRACT ANY GLOBAL SYMBOL
// =========================================================================
function getGlobalCurrencySymbolCharacter(currencyCode) {
    if (!currencyCode) return '$';
    const cleanCode = String(currencyCode).toUpperCase().trim();
    
    try {
        // Native browser engine tricks: extracts the symbol from a formatted sample item
        const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: cleanCode });
        const parts = formatter.formatToParts(1);
        const currencyPart = parts.find(part => part.type === 'currency');
        
        return currencyPart ? currencyPart.value + " " : cleanCode + " ";
    } catch (e) {
        // Fallback safety catch if a strange currency string slips through
        return cleanCode + " ";
    }
}

// Re-evaluates and paints the two custom parallel selector toggle blocks automatically
function synchronizeDualCurrencyActionButtons() {
    const buttonGrid = document.getElementById('dualCurrencyControlGrid');
    const titleLabel = document.getElementById('displayBaseCurrencyTitle');
    const receivedSelect = document.getElementById('formCurrency');
    const homeSelect = document.getElementById('baseCurrencyConfig');

    if (!buttonGrid || !receivedSelect || !homeSelect) return;

    // Extract real-time values from the form inputs instantly
    const valReceived = receivedSelect.value || "EUR";
    const valHome = homeSelect.value || "USD";

    const symbolReceived = getGlobalCurrencySymbolCharacter(valReceived);
    const symbolHome = getGlobalCurrencySymbolCharacter(valHome);

    buttonGrid.innerHTML = "";

    // 1. Build Button Block 1: Received Currency Track
    const btnReceived = document.createElement('button');
    btnReceived.className = `curr-btn ${window.activeMatrixCurrencyScopeMode === "received" ? "active" : ""}`;
    btnReceived.style.flex = "1";
    btnReceived.style.padding = "10px";
    btnReceived.innerText = `${valReceived} (${symbolReceived.trim()})`;
    btnReceived.onclick = () => {
        window.currentlyPinnedLogIndex = null; // Release historic log pinning frames safely
        window.activeMatrixCurrencyScopeMode = "received";
        window.currentCurrency = symbolReceived;
        window.updateMatrixData();
        renderHistoricalSidebarLogs();
    };

    // 2. Build Button Block 2: Home Base Currency Track
    const btnHome = document.createElement('button');
    btnHome.className = `curr-btn ${window.activeMatrixCurrencyScopeMode === "home" ? "active" : ""}`;
    btnHome.style.flex = "1";
    btnHome.style.padding = "10px";
    btnHome.innerText = `${valHome} (${symbolHome.trim()})`;
    btnHome.onclick = () => {
        window.currentlyPinnedLogIndex = null;
        window.activeMatrixCurrencyScopeMode = "home";
        window.currentCurrency = symbolHome;
        window.updateMatrixData();
        renderHistoricalSidebarLogs();
    };

    buttonGrid.appendChild(btnReceived);
    buttonGrid.appendChild(btnHome);

    // Dynamic header visual display notification tracking title modifiers
    if (window.currentlyPinnedLogIndex !== null) {
        titleLabel.innerHTML = `MATRIX TRACKING VIEW: <span style="color:#a855f7;font-weight:800;">HISTORICAL LOG FILE [LOCKED]</span>`;
    } else {
        titleLabel.innerHTML = `MATRIX TRACKING VIEW: <span style="color:#38bdf8;font-weight:700;">LIVE STREAMING CONSOLE</span>`;
    }
}

// Intercept dropdown mutations to trigger instant button updates automatically
document.addEventListener('DOMContentLoaded', () => {
    const receivedEl = document.getElementById('formCurrency');
    const homeEl = document.getElementById('baseCurrencyConfig');

    if (receivedEl) receivedEl.addEventListener('change', () => { synchronizeDualCurrencyActionButtons(); window.updateMatrixData(); });
    if (homeEl) homeEl.addEventListener('change', () => { synchronizeDualCurrencyActionButtons(); window.updateMatrixData(); });
});

// Upgraded matrix driver intercept loop inside matrix-engine.js to cleanly strip hardcoded behaviors
const originalUpdateMatrixData = window.updateMatrixData;
window.updateMatrixData = function() {
    const receivedSelect = document.getElementById('formCurrency');
    const homeSelect = document.getElementById('baseCurrencyConfig');
    
    if (!receivedSelect || !homeSelect) return;

    // SCENARIO A: Historical Archival Drill-down is active
    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        const logSymbol = getGlobalCurrencySymbolCharacter(logItem.currency);

        window.currentCurrency = logSymbol;

        document.getElementById('grossDisplay').innerText = `${logSymbol}${logItem.homeIncome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        document.getElementById('takeHomeDisplay').innerText = `${logSymbol}${logItem.takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        document.getElementById('valRevenue').innerText = `${logSymbol}${logItem.homeIncome.toLocaleString()}`;
        document.getElementById('inputRevenue').value = logItem.homeIncome;

        const canvasEl = document.getElementById('flowChart');
        if (canvasEl && typeof drawFlowLines === 'function') {
            drawFlowLines(0.2, parseFloat(document.getElementById('baseTaxRateConfig').value)/100 || 0.15, 0.8, logItem.homeIncome);
        }
        
        synchronizeDualCurrencyActionButtons();
        return;
    }

    // SCENARIO B: Live tracking modes driven directly by active dropdown status loops
    const activeCurrencyCode = (window.activeMatrixCurrencyScopeMode === "received") ? receivedSelect.value : homeSelect.value;
    window.currentCurrency = getGlobalCurrencySymbolCharacter(activeCurrencyCode);

    if (typeof originalUpdateMatrixData === 'function') {
        originalUpdateMatrixData();
    }
    
    synchronizeDualCurrencyActionButtons();
};

// Force custom injector hooks to re-draw elements immediately upon completing dropdown hydration runs
const originalHydrateGlobalCurrencies = window.dynamicallyHydrateGlobalCurrencies;
window.dynamicallyHydrateGlobalCurrencies = async function() {
    if (typeof originalHydrateGlobalCurrencies === 'function') {
        await originalHydrateGlobalCurrencies();
    }
    // Fire structural refresh signals to snap buttons into place the exact moment dropdown entries load!
    setTimeout(() => {
        synchronizeDualCurrencyActionButtons();
        window.updateMatrixData();
    }, 180);
};

function extractLogsFromActiveSession() {
    if (window.liveSheetMetrics && window.liveSheetMetrics.logs) {
        window.cachedHistoricalLogs = window.liveSheetMetrics.logs;
        renderHistoricalSidebarLogs();
    }
}

// Re-maps your form properties array fields dynamically
function toggleSidebarFormEditingState(shouldLock) {
    const inputIds = [
        'formDate', 'formClient', 'formAmount', 'formCurrency', 
        'formWithholdingToggle', 'formWithholdingAmt', 
        'formPlatformFeesToggle', 'formFees', 
        'formConversionMode', 'formExactCashAmt', 'formCustomRateVal', 
        'formExpenses'
    ];
    
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = shouldLock;
            // Add visual cue highlighting uneditable status profiles
            if (shouldLock) {
                el.style.opacity = "0.6";
                el.style.cursor = "not-allowed";
                el.style.backgroundColor = "#0f172a";
            } else {
                el.style.opacity = "";
                el.style.cursor = "";
                el.style.backgroundColor = "";
            }
        }
    });

    const submitBtn = document.getElementById('btnSubmit');
    if (submitBtn) {
        if (shouldLock) {
            submitBtn.disabled = true;
            submitBtn.innerText = "LOCKED VIEW";
            submitBtn.style.borderColor = "#a855f7";
            submitBtn.style.color = "#a855f7";
            submitBtn.style.boxShadow = "none";
        } else {
            submitBtn.disabled = false;
            submitBtn.innerText = "STREAM TO SHEET";
            submitBtn.style.borderColor = "";
            submitBtn.style.color = "";
        }
    }
}

function selectAndPinHistoricalLogCard(index) {
    if (window.currentlyPinnedLogIndex === index) {
        // SCENARIO A: Release pin lock and restore standard entry states
        window.currentlyPinnedLogIndex = null;
        console.log("Database drill-down lock released. Restoring active tracking profiles.");
        
        // Clean out form text blocks safely (Your verified complete property stack)
        document.getElementById('formClient').value = '';
        document.getElementById('formAmount').value = '';
        document.getElementById('formWithholdingAmt').value = '0';
        document.getElementById('formFees').value = '0';
        document.getElementById('formExpenses').value = '0';
        document.getElementById('formExactCashAmt').value = '0';
        document.getElementById('formCustomRateVal').value = '1';
        document.getElementById('formDate').valueAsDate = new Date();
        
        // Reset toggle selections back to standard layout properties states
        if (document.getElementById('formWithholdingToggle')) document.getElementById('formWithholdingToggle').value = "No";
        if (document.getElementById('formPlatformFeesToggle')) document.getElementById('formPlatformFeesToggle').value = "No";
        if (document.getElementById('formConversionMode')) document.getElementById('formConversionMode').value = "exact_cash";
        
        // Unfreeze input attributes natively
        toggleSidebarFormEditingState(false);
    } else {
        // SCENARIO B: Lock matrix console onto historical transaction row variables array
        window.currentlyPinnedLogIndex = index;
        const logItem = window.cachedHistoricalLogs[index];
        console.log(`Matrix console locked on historical transaction row index: [${index}]`);
        
        // Populate inputs with original logging attributes explicitly
        if (document.getElementById('formDate')) document.getElementById('formDate').value = logItem.date;
        if (document.getElementById('formClient')) document.getElementById('formClient').value = logItem.client;
        if (document.getElementById('formAmount')) document.getElementById('formAmount').value = logItem.amount;
        if (document.getElementById('formCurrency')) document.getElementById('formCurrency').value = logItem.currency;
        
        // Populate custom conversion logic inputs safely from cached row log parameters
        if (document.getElementById('formConversionMode')) document.getElementById('formConversionMode').value = logItem.conversionMode || "exact_cash";
        if (document.getElementById('formExactCashAmt')) document.getElementById('formExactCashAmt').value = logItem.exactCashInput || 0;
        if (document.getElementById('formCustomRateVal')) document.getElementById('formCustomRateVal').value = logItem.customRateInput || 1;
        if (document.getElementById('formExpenses')) document.getElementById('formExpenses').value = logItem.bizExpense || 0;
        if (document.getElementById('formWithholdingAmt')) document.getElementById('formWithholdingAmt').value = logItem.withholdAmt || 0;
        if (document.getElementById('formFees')) document.getElementById('formFees').value = (logItem.platformPct || 0) * 100;
        
        if (document.getElementById('formWithholdingToggle')) document.getElementById('formWithholdingToggle').value = logItem.withholdAmt > 0 ? "Yes" : "No";
        if (document.getElementById('formPlatformFeesToggle')) document.getElementById('formPlatformFeesToggle').value = logItem.platformPct > 0 ? "Yes" : "No";

        // Hard-lock sidebar fields to prevent updates
        toggleSidebarFormEditingState(true);
    }

    // Force right-hand metrics calculation drivers to redraw canvas dashboards loops instantly!
    if (typeof updateMatrixData === 'function') updateMatrixData();
    renderHistoricalSidebarLogs();
}

function renderHistoricalSidebarLogs() {
    const container = document.getElementById('sidebarLogContainer');
    if (!container) return;
    container.innerHTML = "";

    // Safely look up if the cache holds rows array profiles
    if (!window.cachedHistoricalLogs || window.cachedHistoricalLogs.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No records streamed yet.</div>`;
        return;
    }

    const searchQuery = document.getElementById('logSearchInput') ? document.getElementById('logSearchInput').value.toLowerCase().trim() : '';
    const sortMode = document.getElementById('logSortSelect') ? document.getElementById('logSortSelect').value : 'date_desc';

    // Build indexing links maps
    let logItemsWithIndices = window.cachedHistoricalLogs.map((item, originalIndex) => {
        return { data: item, id: originalIndex };
    });

    // Execute Search filters criteria variables safe
    let filtered = logItemsWithIndices.filter(item => {
        const clientMatch = item.data.client ? item.data.client.toLowerCase().includes(searchQuery) : false;
        const currencyMatch = item.data.currency ? item.data.currency.toLowerCase().includes(searchQuery) : false;
        return clientMatch || currencyMatch;
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No matching records found.</div>`;
        return;
    }

    // Sort matching algorithms framework configurations
    filtered.sort((a, b) => {
        if (sortMode === "date_desc") return new Date(b.data.date) - new Date(a.data.date);
        if (sortMode === "date_asc") return new Date(a.data.date) - new Date(b.data.date);
        if (sortMode === "amt_desc") return (b.data.amount || 0) - (a.data.amount || 0);
        if (sortMode === "client_asc") return String(a.data.client).localeCompare(String(b.data.client));
        return 0;
    });

    filtered.forEach(item => {
        const log = item.data;
        const card = document.createElement('div');
        const isPinned = (window.currentlyPinnedLogIndex === item.id);
        
        card.className = `transaction-card ${isPinned ? 'pinned-active' : ''}`;
        card.setAttribute('onclick', `selectAndPinHistoricalLogCard(${item.id})`);
        card.style.cursor = "pointer";

        // FIXED: Added safe fallbacks for camelCase properties matching your console log layout view
        const rawAmt = parseFloat(log.amount) || 0;
        const rawHomeIncome = parseFloat(log.homeIncome) || 0;
        const displayCurrency = String(log.currency || "USD").toUpperCase().trim();

        card.innerHTML = `
            <div class="card-row-top">
                <span>${log.date || "2026-09-06"} ${isPinned ? '<strong style="color:#a855f7;">[PINNED]</strong>' : ''}</span>
                <span style="color:#38bdf8; font-weight:700;">${displayCurrency}</span>
            </div>
            <div class="card-client-title">${log.client || "Ledger Entry"}</div>
            <div class="card-row-metrics">
                <span>Invoice: <strong>${rawAmt.toLocaleString(undefined, {minimumFractionDigits:2})}</strong></span>
                <span>Net Home: <strong style="color:#4ade80;">${window.currentCurrency || '$ '}${rawHomeIncome.toLocaleString(undefined, {maximumFractionDigits:0})}</strong></span>
            </div>
        `;
        container.appendChild(card);
    });
}

// =========================================================================
// 🚀 AUTOMATED RE-HYDRATION CORE: FORCES INITIAL LOG DATA ON BOOTUP
// =========================================================================
async function fetchAndHydrateLogCachesFromSheet() {
    const endpoint = apiInput.value.trim();
    const container = document.getElementById('sidebarLogContainer');
    
    // FIXED: Updated prefix filter validation to match real script domains
    if (!endpoint || !endpoint.startsWith('https://google.com')) {
        console.warn("Logcat Engine Trace: Valid Google script URL not set yet.");
        return;
    }

    if (container) {
        container.innerHTML = `<div class="empty-tray-text" style="color: #38bdf8;">LOADING LEDGER FROM CLOUD...</div>`;
    }

    console.log("⚡ Boot Sync Engine: Requesting historical spreadsheet records cache...");

    try {
        // A clean GET request to your deployment app activates your doGet handler route loop
        const response = await fetch(endpoint, { method: 'GET' });
        const result = await response.json();

        // If your server is on the production script framework, it returns your logs summary array!
        if (result.status === "success" && result.summary) {
            window.liveSheetMetrics = result.summary;
            window.localHistoryTotals = result.summary.totals;
            window.cachedHistoricalLogs = result.summary.logs || [];
            
            console.log(`✔ Boot Sync Engine: Loaded ${window.cachedHistoricalLogs.length} historical entries smoothly.`);
            
            // Force your visual charts and card panels to redraw automatically on launch
            if (typeof updateMatrixData === 'function') updateMatrixData();
            if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
        } else {
            // If the backend returns a mock string layout, trigger a parallel POST setup frame block
            const postResponse = await fetch(endpoint, { 
                method: 'POST', 
                body: JSON.stringify({ configUpdate: false, data: null }) 
            });
            const postResult = await postResponse.json();
            
            if (postResult.summary) {
                window.liveSheetMetrics = postResult.summary;
                window.localHistoryTotals = postResult.summary.totals;
                window.cachedHistoricalLogs = postResult.summary.logs || [];
                if (typeof updateMatrixData === 'function') updateMatrixData();
                if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
            }
        }
    } catch (err) {
        console.error("🚨 Boot Sync Engine Failure: ", err);
        if (container) {
            container.innerHTML = `<div class="empty-tray-text" style="color: #f87171;">Database Sync Failed. Check URL connection parameters!</div>`;
        }
    }
}
