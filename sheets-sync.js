const apiInput = document.getElementById('apiEndpoint');

// SEARCH AND REPLACE THIS EXACT DEPLOYMENT INNER LIFECYCLE BLOCK IN SHEETS-SYNC.JS

window.addEventListener('DOMContentLoaded', () => {
    // 1. Restore local cache persistent environments safely
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
    
    // =========================================================================
    // 🚀 FIXED RESOLUTION RENDERING LIFE CYCLE: FORCES PRE-RESIZE DRAWING CHANNELS
    // =========================================================================
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(); // Forces canvas pixel density mapping container boundaries instantly!
    }
    if (typeof updateBaseCurrencyConfigSymbols === 'function') {
        updateBaseCurrencyConfigSymbols(); // Updates current active currency characters
    }

    // Short safety window to let CSS Flex grid compute layout geometry before firing updates
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof refreshAllDropdowns === 'function') refreshAllDropdowns();
        
        // =========================================================================
        // 🚀 DATABASE HYDRATION: Fetch and populate global menu items dynamically
        // =========================================================================
        if (typeof dynamicallyHydrateGlobalCurrencies === 'function') {
            dynamicallyHydrateGlobalCurrencies();
        } else {
            // Internal safety fallback to refresh display values if module is detached
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        }
    }, 50);
});

// SEARCH AND REPLACE THIS INPUT LISTENER IN SHEETS-SYNC.JS

apiInput.addEventListener('input', (e) => {
    const urlValue = e.target.value.trim();
    localStorage.setItem('userSheetDB', urlValue);
    
    // =========================================================================
    // 🚀 FIXED: Run data hydration instantly when the user configures the URL!
    // =========================================================================
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

    const payload = {
        configUpdate: true,
        "Base Currency": baseCurrencyValue, // Target row cell cell B1
        "Tax Rate": targetTaxRateValue       // Target row cell cell B2
    };

    try {
        await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
    } catch (e) {
        console.log("Settings synchronization pipeline error.");
    }
}
async function dispatchLedgerTransactionBundle() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Error: Paste your Google Web App URL first!"; 
        return; 
    }

    // ==========================================
    // CRUCIAL ALIGNMENT AREA: REAL HTML TARGETS
    // ==========================================
    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim() || "Ledger Entry";
    
    // Core income input streams
    const amtIncome = parseFloat(document.getElementById('formAmount').value) || 0;
    const feeIncome = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const subIncome = document.getElementById('formCurrency').value; // Currency select dropdown

    // Expense and withholding streams
    const amtExpense = parseFloat(document.getElementById('formExpenses').value) || 0;
    const amtTax = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;
    const isWithholding = document.getElementById('formWithholdingToggle').value;
    // ==========================================

    // Validation check: ensure at least one numerical amount field has data
    if (amtIncome === 0 && amtExpense === 0 && amtTax === 0) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Error: Input an amount in at least one category pipeline!"; 
        return; 
    }

    // =========================================================================
    // 🚀 VISUAL LOADING STATE: BUTTON SWITCHES TO "SAVING..." WITH NEON GREEN ACCENT
    // =========================================================================
    const submitBtn = document.getElementById('btnSubmit');
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.disabled = true;
    submitBtn.innerText = "SAVING...";
    submitBtn.style.borderColor = "#4ade80";
    submitBtn.style.color = "#4ade80";
    submitBtn.style.boxShadow = "0 0 15px rgba(74, 222, 128, 0.4)";

    statusText.style.color = '#eab308'; 
    statusText.innerText = "Streaming records to Google Cloud...";
    const totals = window.localHistoryTotals;

    // Reset fallback mock demo records upon first true user log stream
    if (totals.gross === 0 && Object.keys(totals.breakdownValues).length <= 7) {
        totals.gross = 0; 
        totals.breakdownValues = {};
    }

    // Process local screen calculations for all active channels in parallel
    if (amtIncome > 0) {
        totals.gross += amtIncome * (1 - feeIncome);
        if (!totals.breakdownValues[subIncome]) totals.breakdownValues[subIncome] = 0;
        totals.breakdownValues[subIncome] += amtIncome;
    }
    if (amtExpense > 0) {
        totals.expenses += amtExpense;
    }
    if (amtTax > 0 && isWithholding === "Yes") {
        totals.taxWithheld += amtTax;
    }

    // CRUCIAL DATA PAYLOAD ALIGNMENT: Standardized flat payload keys for Code.gs
    const payload = {
        data: {
            "Date": date,                               // Matches rowData["Date"] in Apps Script
            "Client Name": client,                      // Matches rowData["Client Name"]
            "Invoice Amount": amtIncome,                // Matches rowData["Invoice Amount"]
            "Currency Recieved": subIncome,             // Matches rowData["Currency Recieved"]
            "Platform Fees": feeIncome,                 // Matches rowData["Platform Fees"]
            "Withholding Tax Deducted?": isWithholding, // Matches rowData["Withholding Tax Deducted?"]
            "Withholding Amount": isWithholding === "Yes" ? amtTax : 0, // Matches rowData["Withholding Amount"]
            "Business Expenses": amtExpense             // Matches rowData["Business Expenses"]
        }
    };

    try {
        const response = await fetch(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80'; 
            statusText.innerText = "✔ Success! Row entry streamed to Google Sheets.";
            
            // =========================================================================
            // 🚀 INTERCEPT THE DYNAMIC BREAKDOWN PACKET FROM THE DATABASE BACKEND
            // =========================================================================
            if (result.summary) {
                window.liveSheetMetrics = result.summary;
                window.localHistoryTotals = result.summary.totals;
            }
            // =========================================================================

            // Clear input fields cleanly matching our verified layout IDs
            document.getElementById('formAmount').value = '';
            document.getElementById('formFees').value = '0';
            document.getElementById('formExpenses').value = '0';
            document.getElementById('formWithholdingAmt').value = '0';
            document.getElementById('formClient').value = '';
            
            if (typeof updateMatrixData === 'function') updateMatrixData(); // Refresh matrix layout lines
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    } finally {
        // =========================================================================
        // CLEANUP: Release button interaction blocks and restore styles
        // =========================================================================
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        submitBtn.style.borderColor = "";
        submitBtn.style.color = "";
        submitBtn.style.boxShadow = "";
    }
}

async function dynamicallyHydrateGlobalCurrencies() {
    const endpoint = apiInput.value.trim();
    if (!endpoint) return;

    const payload = { fetchCurrencyCatalog: true };
    const selectReceived = document.getElementById('formCurrency');
    const selectHome = document.getElementById('baseCurrencyConfig');

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success" && result.currencies) {
            selectReceived.innerHTML = "";
            selectHome.innerHTML = "";

            // Flatten multidimensional arrays from Google Sheets instantly into clean text strings
            let rawString = String(result.currencies);
            let cleanCurrencyArray = rawString.split(',').map(item => item.trim()).filter(Boolean);

            cleanCurrencyArray.forEach(code => {
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

            console.log("✔ Global currency dropdown menus successfully populated.");
            
            // =========================================================================
            // 🚀 FIXED: Dynamic Triggers to clear "Initializing feed..." instantly on load!
            // =========================================================================
            setTimeout(() => {
                if (typeof calculateActiveConversionRate === 'function') {
                    calculateActiveConversionRate(); // Pings the backend to update your center label!
                }
                if (typeof updateBaseCurrencyConfigSymbols === 'function') {
                    updateBaseCurrencyConfigSymbols(); // Ensures currency markers ($ / USh) sync
                }
            }, 100); // 100ms safety window gives the browser time to paint dropdown updates
            
        } // Close if(result.status === "success")
    } catch (e) {
        console.log("Failed to fetch currencies from Google Cloud.");
    }
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
            "Income Split": incomeSplitVal,   // Targets row cell B3
            "Expense Split": expenseSplitVal, // Targets row cell B4
            "Tax Split": taxSplitVal          // Targets row cell B5
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
// 🔎 FRONTEND DATA HOOKS: SIDEBAR CARD VIEW GENERATION, SORTING, & SEARCH
// =========================================================================
window.cachedHistoricalLogs = [];

// Intercept data packets following successful sync calls
const originalDispatch = dispatchLedgerTransactionBundle;
dispatchLedgerTransactionBundle = async function() {
    await originalDispatch();
    extractLogsFromActiveSession();
};

function extractLogsFromActiveSession() {
    if (window.liveSheetMetrics && window.liveSheetMetrics.logs) {
        window.cachedHistoricalLogs = window.liveSheetMetrics.logs;
        renderHistoricalSidebarLogs();
    }
}

// Modify initial setup hydration hooks to scan logs immediately upon launching the site
const originalHydrate = dynamicallyHydrateGlobalCurrencies;
dynamicallyHydrateGlobalCurrencies = async function() {
    await originalHydrate();
    
    // Fire a quick blank POST payload to safely read the dashboard summaries on launch
    const endpoint = document.getElementById('apiEndpoint').value.trim();
    if (!endpoint) return;
    try {
        const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify({ fetchCurrencyCatalog: false }) });
        const json = await res.json();
        if (json.status === "success" && json.summary) {
            window.liveSheetMetrics = json.summary;
            window.localHistoryTotals = json.summary.totals;
            if (typeof updateMatrixData === 'function') updateMatrixData();
            extractLogsFromActiveSession();
        }
    } catch(e) { console.log("Failed to load initial history stack."); }
};

// =========================================================================
// 🔄 DYNAMIC UI STATE MANAGER: AUTOMATED SWITCHING & HISTORICAL DRILL-DOWN
// =========================================================================

// Global dynamic anchor tracker state reference nodes
window.currentlyPinnedLogIndex = null;

// Synchronizes dashboard currency button groups to match your sidebar setups
function updateDashboardCurrencyPanelButtons(overrideSymbol = null, overrideText = null) {
    const buttonGroup = document.getElementById('dynamicDashboardCurrencyButtonGroup');
    const titleLabel = document.getElementById('displayBaseCurrencyTitle');
    if (!buttonGroup) return;

    buttonGroup.innerHTML = "";

    // Determine target symbols and strings based on active focus state loops
    let activeSymbol = overrideSymbol || window.currentCurrency || '$';
    let labelText = overrideText || document.getElementById('baseCurrencyConfig').value || 'USD';

    // Build the dynamic button element
    const btn = document.createElement('button');
    btn.className = "curr-btn active";
    btn.style.width = "100%";
    btn.setAttribute('data-symbol', activeSymbol);
    btn.innerText = `${labelText} (${activeSymbol.trim()})`;
    
    buttonGroup.appendChild(btn);

    if (window.currentlyPinnedLogIndex !== null) {
        titleLabel.innerHTML = `DISPLAYING HISTORICAL LOG VIEW <span style="color:#a855f7;font-weight:800;">[LOCKED]</span>`;
    } else {
        titleLabel.innerHTML = `DISPLAYING ACTIVE MATRIX TRACKING CURRENCY`;
    }
}

// Hook directly into the standard currency change tracking loops
document.addEventListener('DOMContentLoaded', () => {
    const homeEl = document.getElementById('baseCurrencyConfig');
    if (homeEl) {
        homeEl.addEventListener('change', () => {
            // Drop any historic pin locks to avoid calculations collisions
            window.currentlyPinnedLogIndex = null;
            setTimeout(() => {
                updateDashboardCurrencyPanelButtons();
            }, 150);
        });
    }
});

// Intercepts and overrides the baseline matrix updates inside matrix-engine.js if pinned
const originalUpdateMatrixData = window.updateMatrixData;
window.updateMatrixData = function() {
    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const selectedLog = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        
        // Match base tokens to derive accurate typography components
        let targetSign = '$';
        if (selectedLog.currency === 'EUR') targetSign = '€';
        else if (selectedLog.currency === 'GBP') targetSign = '£';
        else if (selectedLog.currency === 'UGX') targetSign = 'USh ';
        else if (selectedLog.currency === 'KES') targetSign = 'KSh ';
        else if (selectedLog.currency === 'NGN') targetSign = '₦';

        // Swap visual tracking reference matrices instantly
        window.currentCurrency = targetSign;
        
        // Force the text metrics cards across your dashboard layout to render specific row units
        document.getElementById('grossDisplay').innerText = `${targetSign}${selectedLog.homeIncome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        document.getElementById('takeHomeDisplay').innerText = `${targetSign}${selectedLog.takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
        
        // Handle visual slider tracker handles fallback smoothly 
        document.getElementById('valRevenue').innerText = `${targetSign}${selectedLog.homeIncome.toLocaleString()}`;
        document.getElementById('inputRevenue').value = selectedLog.homeIncome;

        // Force canvas drawing pipes to re-evaluate based on the log's exact static ratios
        const canvasEl = document.getElementById('flowChart');
        if (canvasEl) {
            const ctx = canvasEl.getContext('2d');
            ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
            if (typeof drawFlowLines === 'function') {
                // Pin canvas view lines to show 100% processing curves for this specific item log
                drawFlowLines(0.2, parseFloat(document.getElementById('baseTaxRateConfig').value)/100, 0.8, selectedLog.homeIncome);
            }
        }
        updateDashboardCurrencyPanelButtons(targetSign, selectedLog.currency);
        return;
    }

    // Otherwise, fall straight back onto normal operational dashboard pipelines
    if (typeof originalUpdateMatrixData === 'function') {
        originalUpdateMatrixData();
    }
    updateDashboardCurrencyPanelButtons();
};

function selectAndPinHistoricalLogCard(index) {
    // If user clicks the exact same card twice, unlock the screen back to live metrics mode
    if (window.currentlyPinnedLogIndex === index) {
        window.currentlyPinnedLogIndex = null;
        console.log("Database drill-down lock released. Restoring active tracking profiles.");
    } else {
        window.currentlyPinnedLogIndex = index;
        console.log(`Matrix console locked on historical transaction row: Index [${index}]`);
    }

    // Refresh layout view configurations instantly across the screen workspace
    window.updateMatrixData();
    renderHistoricalSidebarLogs();
}

function renderHistoricalSidebarLogs() {
    const container = document.getElementById('sidebarLogContainer');
    const searchQuery = document.getElementById('logSearchInput').value.toLowerCase().trim();
    const sortMode = document.getElementById('logSortSelect').value;
    
    if (!container) return;
    container.innerHTML = "";

    if (!window.cachedHistoricalLogs || window.cachedHistoricalLogs.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No records streamed yet.</div>`;
        return;
    }

    // 1. Run structural filters over tracking arrays
    let logItemsWithIndices = window.cachedHistoricalLogs.map((item, originalIndex) => {
        return { data: item, id: originalIndex };
    });

    let filtered = logItemsWithIndices.filter(item => {
        return item.data.client.toLowerCase().includes(searchQuery) || 
               item.data.currency.toLowerCase().includes(searchQuery);
    });

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No matching records found.</div>`;
        return;
    }

    // 2. Execute sorting rules
    filtered.sort((a, b) => {
        if (sortMode === "date_desc") return new Date(b.data.date) - new Date(a.data.date);
        if (sortMode === "date_asc") return new Date(a.data.date) - new Date(b.data.date);
        if (sortMode === "amt_desc") return b.data.amount - a.data.amount;
        if (sortMode === "client_asc") return a.data.client.localeCompare(b.data.client);
        return 0;
    });

    // 3. Render actionable data card items
    filtered.forEach(item => {
        const log = item.data;
        const card = document.createElement('div');
        
        // Apply active CSS highlight wrapper outlines if this node matches the tracking pin lock state
        const isPinned = (window.currentlyPinnedLogIndex === item.id);
        card.className = `transaction-card ${isPinned ? 'pinned-active' : ''}`;
        
        // Attach interactive click handler to trigger dashboard data substitution loops
        card.setAttribute('onclick', `selectAndPinHistoricalLogCard(${item.id})`);
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div class="card-row-top">
                <span>${log.date} ${isPinned ? '<strong style="color:#a855f7;">[PINNED VIEW]</strong>' : ''}</span>
                <span style="color:#38bdf8; font-weight:700;">${log.currency}</span>
            </div>
            <div class="card-client-title">${log.client}</div>
            <div class="card-row-metrics">
                <span>Invoice: <strong style="color:#f8fafc;">${log.amount.toLocaleString(undefined,{minimumFractionDigits:2})}</strong></span>
                <span>Net Base: <strong style="color:#4ade80;">${window.currentCurrency}${log.homeIncome.toLocaleString(undefined,{maximumFractionDigits:0})}</strong></span>
            </div>
        `;
        container.appendChild(card);
    });
}
