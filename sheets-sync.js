const apiInput = document.getElementById('apiEndpoint');

// Global dynamic active view tracking target indicators
window.activeMatrixCurrencyScopeMode = "home"; // Toggles between "received" or "home" pipelines
window.currentlyPinnedLogIndex = null;
window.cachedHistoricalLogs = [];

// =========================================================================
// 🚀 FIXED: IMMEDIATE LOCAL HYDRATION ENFORCED UPON LAUNCHING CORES
// =========================================================================
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
    
    if (typeof resizeCanvas === 'function') {
        resizeCanvas(); 
    }
    if (typeof updateBaseCurrencyConfigSymbols === 'function') {
        updateBaseCurrencyConfigSymbols(); 
    }

    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof refreshAllDropdowns === 'function') refreshAllDropdowns();
        
        // CRUCIAL: Force browser-locale generation to execute immediately on boot!
        dynamicallyHydrateGlobalCurrencies();
    }, 50);
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
    const convMode = document.getElementById('formConversionMode').value;
    const exactCashAmt = parseFloat(document.getElementById('formExactCashAmt').value) || 0;

    localStorage.setItem('userBaseCurrencyConfig', baseCurrencyValue);
    localStorage.setItem('userBaseTaxRateConfig', document.getElementById('baseTaxRateConfig').value);

    // Dynamic Payload Sync across configuration elements
    const payload = {
        configUpdate: true,
        "Base Currency": baseCurrencyValue,
        "Tax Rate": targetTaxRateValue,
        "Conversion Mode": convMode,
        "Exact Cash Input": exactCashAmt
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
    
    // 1. Hard-Block: Verify API Setup is Present
    if (!endpoint) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "🚨 Error: Paste your Google Web App URL first!"; 
        return; 
    }

    // 2. Fetch and Check Currency Dropdown Status Safely
    const currencySelectEl = document.getElementById('formCurrency');
    const subIncome = currencySelectEl ? currencySelectEl.value.trim() : "";

    // 🛑 STRICT FINANCIAL ENFORCEMENT: Block submission if currency dropdown is empty or still loading markets
    if (!subIncome || subIncome === "" || subIncome.includes("COMPUTING") || subIncome.includes("Loading")) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Transaction Blocked: Wait for Forex market tables to finish loading!";
        currencySelectEl.focus();
        currencySelectEl.style.borderColor = "#f87171";
        return;
    } else {
        currencySelectEl.style.borderColor = "";
    }

    // 3. Collect form fields
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

    // 🛑 STRICT FINANCIAL ENFORCEMENT: Enforce Date, Client, and Base Amount Parameters
    if (!date) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Transaction Blocked: You must select a valid Transaction Date!";
        document.getElementById('formDate').focus();
        return;
    }
    if (!client) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Transaction Blocked: Client Name cannot be left blank!";
        document.getElementById('formClient').focus();
        return;
    }
    if (amtIncome <= 0 && amtExpense === 0 && amtTax === 0) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "🛑 Transaction Blocked: Enter an Invoice Amount greater than 0!"; 
        document.getElementById('formAmount').focus();
        return; 
    }

    // 4. Handle Operational Mode Parameters Safely
    const convMode = document.getElementById('formConversionMode').value;
    const exactCashAmt = parseFloat(document.getElementById('formExactCashAmt').value) || 0;
    const customRateVal = parseFloat(document.getElementById('formCustomRateVal').value) || 1;

    // 🛑 STRICT FINANCIAL ENFORCEMENT: Validate Options based on Chosen Mode Path
    if (convMode === "exact_cash" && exactCashAmt <= 0) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Transaction Blocked: For Option A, Exact Cash Arrived cannot be 0!";
        document.getElementById('formExactCashAmt').focus();
        return;
    }
    if (convMode === "custom_rate" && customRateVal <= 0) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Transaction Blocked: For Option B, Custom Exchange Rate must be greater than 0!";
        document.getElementById('formCustomRateVal').focus();
        return;
    }

    // --- Core Valuations Passed! Execute Secure Transmission Network Streams ---
    const submitBtn = document.getElementById('btnSubmit');
    const originalBtnText = submitBtn.innerText;
    
    submitBtn.disabled = true;
    submitBtn.innerText = "SAVING...";
    submitBtn.style.borderColor = "#4ade80";
    submitBtn.style.color = "#4ade80";
    submitBtn.style.boxShadow = "0 0 15px rgba(74, 222, 128, 0.4)";

    statusText.style.color = '#eab308'; 
    statusText.innerText = "Streaming verified record bundle to Google Cloud...";

    const payload = {
        data: {
            "Date": date,
            "Client Name": client,
            "Invoice Amount": amtIncome,
            "Currency Received": subIncome.toUpperCase().trim(),
            "Withholding Tax Deducted": (isWithholding.toUpperCase() === "YES") ? "YES" : "NO",
            "Withholding Amount": amtTax, 
            "Platform Fees Deducted": (isPlatformFeesDeducted.toUpperCase() === "YES") ? "YES" : "NO",
            "Platform Percentage": feePercentage, 
            "Business Expenses": amtExpense,
            "Conversion Mode": convMode,
            "Exact Cash Input": exactCashAmt,
            "Custom Rate Input": customRateVal
        }
    };

    try {
        // Sync operation matrix setup mode indicators first
        await fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                configUpdate: true,
                "Conversion Mode": convMode,
                "Exact Cash Input": exactCashAmt
            })
        });

        const response = await fetch(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80'; 
            statusText.innerText = "✔ Verified transaction successfully logged into Google Sheets!";
            
            if (result.summary) {
                window.liveSheetMetrics = result.summary;
                window.localHistoryTotals = result.summary.totals;
            }

            // Clean input boxes safely
            document.getElementById('formAmount').value = '';
            document.getElementById('formFees').value = '0';
            document.getElementById('formExpenses').value = '0';
            document.getElementById('formWithholdingAmt').value = '0';
            document.getElementById('formClient').value = '';
            
            if (typeof updateMatrixData === 'function') updateMatrixData();
            extractLogsFromActiveSession();
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = originalBtnText;
        submitBtn.style.borderColor = "";
        submitBtn.style.color = "";
        submitBtn.style.boxShadow = "";
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

function selectAndPinHistoricalLogCard(index) {
    if (window.currentlyPinnedLogIndex === index) {
        window.currentlyPinnedLogIndex = null;
        console.log("Database drill-down lock released. Restoring active tracking profiles.");
    } else {
        window.currentlyPinnedLogIndex = index;
        console.log(`Matrix console locked on historical transaction row: Index [${index}]`);
    }

    window.updateMatrixData();
    renderHistoricalSidebarLogs();
}

function renderHistoricalSidebarLogs() {
    const container = document.getElementById('sidebarLogContainer');
    const searchQuery = document.getElementById('logSearchInput') ? document.getElementById('logSearchInput').value.toLowerCase().trim() : '';
    const sortMode = document.getElementById('logSortSelect') ? document.getElementById('logSortSelect').value : 'date_desc';
    
    if (!container) return;
    container.innerHTML = "";

    if (!window.cachedHistoricalLogs || window.cachedHistoricalLogs.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No records streamed yet.</div>`;
        return;
    }

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

    filtered.sort((a, b) => {
        if (sortMode === "date_desc") return new Date(b.data.date) - new Date(a.data.date);
        if (sortMode === "date_asc") return new Date(a.data.date) - new Date(b.data.date);
        if (sortMode === "amt_desc") return b.data.amount - a.data.amount;
        if (sortMode === "client_asc") return a.data.client.localeCompare(b.data.client);
        return 0;
    });

    filtered.forEach(item => {
        const log = item.data;
        const card = document.createElement('div');
        
        const isPinned = (window.currentlyPinnedLogIndex === item.id);
        card.className = `transaction-card ${isPinned ? 'pinned-active' : ''}`;
        card.setAttribute('onclick', `selectAndPinHistoricalLogCard(${item.id})`);
        card.style.cursor = "pointer";

        card.innerHTML = `
            <div class="card-row-top">
                <span>${log.date} ${isPinned ? '<strong style="color:#a855f7;">[PINNED]</strong>' : ''}</span>
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
