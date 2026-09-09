// =========================================================================
// 🚀 LOCATED AT THE VERY TOP OF YOUR sheets-sync.js FILE:
// =========================================================================
const apiInput = document.getElementById('apiEndpoint');

// Global dynamic active view tracking target indicators
window.activeMatrixCurrencyScopeMode = "home"; 
window.currentlyPinnedLogIndex = null;
window.cachedHistoricalLogs = [];

window.addEventListener('DOMContentLoaded', () => {
    // Locate this inside window.addEventListener('DOMContentLoaded', () => { ...
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    // 🚀 INJECT THE NEW VAULT TOKEN CACHE LOADER:
    if (localStorage.getItem('userApiShieldToken')) {
        const tokenEl = document.getElementById('apiSecurityTokenInput');
        if (tokenEl) tokenEl.value = localStorage.getItem('userApiShieldToken');
    }

    if (localStorage.getItem('userBaseCurrencyConfig')) {
        document.getElementById('baseCurrencyConfig').value = localStorage.getItem('userBaseCurrencyConfig');
    }
    
    if (localStorage.getItem('userBaseTaxRateConfig')) {
        const cachedTax = localStorage.getItem('userBaseTaxRateConfig');
        if (document.getElementById('baseTaxRateConfig')) {
            document.getElementById('baseTaxRateConfig').value = cachedTax;
        }
        if (document.getElementById('inputTaxRate')) {
            document.getElementById('inputTaxRate').value = cachedTax;
        }
        if (document.getElementById('valTaxRate')) {
            document.getElementById('valTaxRate').innerText = `${parseFloat(cachedTax).toFixed(1)}%`;
        }
    }
    if (document.getElementById('formDate')) {
        document.getElementById('formDate').valueAsDate = new Date();
    }
    
    // 🚀 INJECT THESE MULTIPLE SWEEPS RIGHT HERE TO REMOVE BOOTUP DELAYS:
    if (typeof enforceDynamicViewportCanvasSizing === 'function') {
        enforceDynamicViewportCanvasSizing(); 
    }
    if (typeof updateBaseCurrencyConfigSymbols === 'function') {
        updateBaseCurrencyConfigSymbols();
    }

    // Safety timeout framework execution routines to launch your tickers
    setTimeout(() => {
        // 🚀 INJECT THIS SECOND RE-MEASURING RUN INSIDE THE TIMEOUT BOX TOO:
        if (typeof enforceDynamicViewportCanvasSizing === 'function') {
            enforceDynamicViewportCanvasSizing();
        }
        if (typeof dynamicallyHydrateGlobalCurrencies === 'function') {
            dynamicallyHydrateGlobalCurrencies();
        }
        if (typeof fetchAndHydrateLogCachesFromSheet === 'function') {
            fetchAndHydrateLogCachesFromSheet();
        }
    }, 50);
});

// 📍 REPLACE THIS ENTIRE FUNCTION SITTING RIGHT HERE:
function updateSyncSpinnerState(state) {
    const spinner = document.getElementById('syncSpinner');
    if (!spinner) return;
    
    spinner.className = "neon-spinner-ring";
}

// Helper utility to safely toggle your existing cyberpunk loader states
function updateSyncSpinnerState(state) {
    const spinner = document.getElementById('syncSpinner');
    if (!spinner) return;
    
    // Reset core css configuration framework classes
    spinner.className = "neon-spinner-ring";
    
    if (state === "hide") {
        spinner.style.display = "none";
        return;
    }
    
    spinner.style.display = "block";
    if (state === "loading") spinner.classList.add('state-loading');
    if (state === "success") {
        spinner.classList.add('state-success');
        setTimeout(() => updateSyncSpinnerState("hide"), 2000);
    }
    if (state === "error") {
        spinner.classList.add('state-error');
        setTimeout(() => updateSyncSpinnerState("hide"), 4000);
    }
}


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
    
    if (urlValue.startsWith('https://Script.google.com')) {
        console.log("Valid Google Web App detected. Initializing database hydration stream...");
        if (typeof dynamicallyHydrateGlobalCurrencies === 'function') {
            dynamicallyHydrateGlobalCurrencies();
        }
    }
});

// =========================================================================
// 🚀 PASTE THE NEW TOKEN BINDING LISTENER RIGHT HERE:
// =========================================================================
const tokenInputEl = document.getElementById('apiSecurityTokenInput');
if (tokenInputEl) {
    tokenInputEl.addEventListener('input', (e) => {
        // Automatically caches the private shield password as the user types
        localStorage.setItem('userApiShieldToken', e.target.value.trim());
    });
}
async function updateBaseCurrencySettingsInSheet() {
    if (typeof updateBaseCurrencyConfigSymbols === 'function') updateBaseCurrencyConfigSymbols();
    
    const endpoint = apiInput.value.trim();
    if (!endpoint) return;

    const baseCurrencyValue = document.getElementById('baseCurrencyConfig').value;
    const targetTaxRateValue = (parseFloat(document.getElementById('baseTaxRateConfig').value) || 0) / 100;

    localStorage.setItem('userBaseCurrencyConfig', baseCurrencyValue);
    localStorage.setItem('userBaseTaxRateConfig', document.getElementById('baseTaxRateConfig').value);

    // 🚀 THE SECURE UPGRADE: Extract the current password pin from the hidden UI tray block
    const secureAuthPassword = document.getElementById('apiSecurityTokenInput')?.value.trim() || "";

    const payload = {
        apiToken: secureAuthPassword, // 🛡️ SENDS PASSWORD HANDSHAKE TO SERVER
        configUpdate: true,
        "Base Currency": baseCurrencyValue,
        "Tax Rate": targetTaxRateValue
    };

    // SPINNER ACTIVATION HOOK
    if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("loading");

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();
        if (result.status === "success") {
            console.log("⚡ Logcat Core: Global base configuration values saved.");
            if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("success");
        } else {
            console.error("🛑 Server Error: " + result.message);
            if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("error");
        }
    } catch (e) {
        console.log("Configuration tracking network sync lag error.");
        if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("error");
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

    const convMode = document.getElementById('formConversionMode').value;
    const exactCashAmt = parseFloat(document.getElementById('formExactCashAmt').value) || 0;
    const customRateVal = parseFloat(document.getElementById('formCustomRateVal').value) || 1;

    if (!date || !client || (amtIncome <= 0 && amtExpense === 0)) {
        statusText.style.color = '#f87171';
        statusText.innerText = "🛑 Blocked: Fill out all required fields!";
        return;
    }

    // =========================================================================
    // 🚀 NEW INTERCEPT GUARD: IDENTITY RULES IF TARGET CURRENCIES MATCH
    // =========================================================================
    const homeCurrencyCode     = String(document.getElementById('baseCurrencyConfig')?.value || "").toUpperCase().trim();
    const receivedCurrencyCode = String(subIncome).toUpperCase().trim();

    if (receivedCurrencyCode === homeCurrencyCode && receivedCurrencyCode !== "") {
        
        // CHECK THRESHOLD A: User mistakenly has Option B (Custom Rate) active
        if (convMode === "custom_rate") {
            statusText.style.color = '#f87171';
            statusText.innerHTML = "🛑 <strong>Data Conflict:</strong> Received Currency matches your Base Home Currency! Please switch your FX Portal configuration to <strong>Option A (Enter Exact Cash Landed)</strong> and enter an identical amount to that of the invoice amount, or else check your preferred currency codes.";
            return; // Terminate streaming completely
        }
        
        // CHECK THRESHOLD B: User has Option A active but cash landed does not equal invoice amount
        if (convMode === "exact_cash" && exactCashAmt !== amtIncome) {
            statusText.style.color = '#f87171';
            statusText.innerHTML = `🛑 <strong>Math Discrepancy:</strong> Currencies match perfectly. Your <strong>Exact Cash Arrived</strong> (${exactCashAmt}) must equal your <strong>Invoice Amount</strong> (${amtIncome}) because the exchange rate is exactly 1:1, or else check your preferred currency codes.`;
            
            const cashInputBox = document.getElementById('formExactCashAmt');
            if (cashInputBox) {
                cashInputBox.style.borderColor = "#f87171";
                cashInputBox.focus();
            }
            return; // Terminate streaming completely
        }
    } else {
        if (document.getElementById('formExactCashAmt')) {
            document.getElementById('formExactCashAmt').style.borderColor = "";
        }
    }
    // =========================================================================
    // 🚀 LOCATED INSIDE dispatchLedgerTransactionBundle() IN sheets-sync.js
    // =========================================================================
    
    // Extract real-time visual system snapshots active on the left sidebar configs right now
    const selectedHomeBaseCurrencyCode = String(document.getElementById('baseCurrencyConfig')?.value || "USD").toUpperCase().trim();
    const selectedInstantSystemTaxRate = (parseFloat(document.getElementById('baseTaxRateConfig')?.value) || 0) / 100;
    const secureAuthPassword = document.getElementById('apiSecurityTokenInput')?.value.trim() || "";

    const payload = {
        apiToken: secureAuthPassword, // 🚀 AUTOMATIC SERVER PASSKEY HANDSHAKE
        data: {
            "Date": date,
            "Client Name": client,
            "Invoice Amount": parseFloat(amtIncome) || 0, // Force pure float number
            "Currency Received": subIncome.toUpperCase().trim(),
            "Withholding Tax Deducted": String(isWithholding).toUpperCase().trim(),
            "Withholding Amount": parseFloat(amtTax) || 0, // Force pure float number
            "Platform Fees Deducted": String(isPlatformFeesDeducted).toUpperCase().trim(),
            "Platform Percentage": parseFloat(feePercentage) || 0, // Force pure float number
            "Business Expenses": parseFloat(amtExpense) || 0, // Force pure float number
            "Conversion Mode": String(convMode).trim().toLowerCase(),
            "Exact Cash Input": parseFloat(exactCashAmt) || 0,
            "Custom Rate Input": parseFloat(customRateVal) || 1,
            
            "System Home Base Currency": selectedHomeBaseCurrencyCode,
            "System Snapshot Tax Rate": parseFloat(selectedInstantSystemTaxRate) || 0 // Fix payload leakage
        }
    };


    const submitBtn = document.getElementById('btnSubmit');
    submitBtn.disabled = true;
    submitBtn.innerText = "SAVING...";
    
    // SPINNER ACTIVATION HOOK
    if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("loading");

    try {
        const response = await fetch(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80'; 
            statusText.innerText = "✔ Verified transaction successfully logged into Google Sheets!";
            
            // SPINNER SUCCESS HOOK
            if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("success");
            
            document.getElementById('formAmount').value = '';
            document.getElementById('formFees').value = '0';
            document.getElementById('formExpenses').value = '0';
            document.getElementById('formWithholdingAmt').value = '0';
            document.getElementById('formClient').value = '';
            
            // Core Re-hydration refresh triggers
            if (result.summary) {
                window.liveSheetMetrics = result.summary;
                window.localHistoryTotals = result.summary.totals;
                window.cachedHistoricalLogs = result.summary.logs || [];
                if (typeof updateMatrixData === 'function') updateMatrixData();
                if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
            }
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        console.error("🚨 TRANSMISSION CRASH LOG: ", err);
        statusText.style.color = '#f87171'; 
        statusText.innerText = "Streaming failed. Check connection parameter inputs!";
        
        // SPINNER ERROR HOOK
        if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("error");
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

    // 🚀 THE SECURE UPGRADE: Grab private token key dynamically
    const secureAuthPassword = document.getElementById('apiSecurityTokenInput')?.value.trim() || "";

    const payload = {
        apiToken: secureAuthPassword, // 🛡️ AUTHORIZES SLIDER SYNC OPERATION ON THE SHEET
        configUpdate: true,
        "Income Split": incomeSplitVal,   
        "Expense Split": expenseSplitVal, 
        "Tax Split": taxSplitVal          
    };

    // Debounce optimization: waits 800ms after the user stops sliding before sending a single network call
    clearTimeout(splitSyncTimeout);
    splitSyncTimeout = setTimeout(async () => {
        try {
            const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
            const result = await response.json();
            
            if (result.status === "success") {
                console.log("✔ Proportional matrix splits backed up to Google Sheet.");
            } else {
                console.warn("⚠️ Sync Blocked by Server: " + result.message);
            }
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

    // 🚀 Force highlights synchronization hooks inside coordinate checks inside sheets-sync.js
    const btnHome = document.createElement('button');
    // If the pinned index is active, force match base validation indicators checks cleanly
    const isHomeActive = (window.activeMatrixCurrencyScopeMode === "home" || window.currentlyPinnedLogIndex !== null);
    btnHome.className = `curr-btn ${isHomeActive ? 'active' : ''}`;
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
// =========================================================================
// 🚀 LOCATED INSIDE THE CO-DRIVER INTERCEPT IN sheets-sync.js
// =========================================================================
window.updateMatrixData = function() {
    const receivedSelect = document.getElementById('formCurrency');
    const homeSelect = document.getElementById('baseCurrencyConfig');
    
    if (!receivedSelect || !homeSelect) return;

    // SCENARIO A: Historical Archival Drill-down is active
    if (window.currentlyPinnedLogIndex !== null && window.cachedHistoricalLogs && window.cachedHistoricalLogs[window.currentlyPinnedLogIndex]) {
        const logItem = window.cachedHistoricalLogs[window.currentlyPinnedLogIndex];
        
        // 🚀 CRITICAL FIX: Extract the true canonical row base currency symbol directly 
        // from the specific row snapshot data instead of hardcoded lookups!
        const logCurrencyCode = logItem.rowCurrencySetting || logItem.currency || "USD";
        const logSymbol = typeof getGlobalCurrencySymbolCharacter === 'function' 
            ? getGlobalCurrencySymbolCharacter(logCurrencyCode) 
            : '$ ';

        // Hard-lock the active application currency state to match the log snapshot character
        window.currentCurrency = logSymbol;

        const gross             = parseFloat(logItem.homeIncome) || parseFloat(logItem.netHomeIncome) || 0;
        const bizExpenseAmt     = parseFloat(logItem.bizExpense) || 0;
        const invoiceAmt        = parseFloat(logItem.amount) || 0;
        const platformPctVal    = parseFloat(logItem.platformPct) || 0;
        const fxRateVal         = parseFloat(logItem.fxRate) || 1;
        const rawWithholdAmt    = parseFloat(logItem.withholdAmt) || 0;
        
        const computedFinalTax  = parseFloat(logItem.finalTaxOwed) || 0;
        const computedTakeHome  = parseFloat(logItem.takeHomePay) || 0;

        const computedPlatformFeeHome = invoiceAmt * platformPctVal * fxRateVal;
        const logTotalExpenses = bizExpenseAmt + computedPlatformFeeHome;
        const withholdingTaxHome = rawWithholdAmt * fxRateVal;
        const taxReserve = computedFinalTax + withholdingTaxHome;

        // 🚀 ENFORCE THE REPAIRED SYMBOL DOWN ACROSS ALL PRIMARY DISPLAY NODES
        if (document.getElementById('grossDisplay')) document.getElementById('grossDisplay').innerText = `${logSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expensesDisplay')) document.getElementById('expensesDisplay').innerText = `${logSymbol}${logTotalExpenses.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxDisplay')) document.getElementById('taxDisplay').innerText = `${logSymbol}${taxReserve.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('takeHomeDisplay')) document.getElementById('takeHomeDisplay').innerText = `${logSymbol}${computedTakeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        
        if (document.getElementById('valRevenue')) document.getElementById('valRevenue').innerText = `${logSymbol}${gross.toLocaleString()}`;
        
        // Hydrate breakdown panels using the localized log symbol
        if (document.getElementById('incActive')) document.getElementById('incActive').innerText = `${logSymbol}${gross.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('incOthers')) document.getElementById('incOthers').innerText = `${logSymbol}0.00`;
        if (document.getElementById('expBusinessExpenses')) document.getElementById('expBusinessExpenses').innerText = `${logSymbol}${bizExpenseAmt.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('expPlatformFees')) document.getElementById('expPlatformFees').innerText = `${logSymbol}${computedPlatformFeeHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxIncome')) document.getElementById('taxIncome').innerText = `${logSymbol}${computedFinalTax.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;
        if (document.getElementById('taxWithholding')) document.getElementById('taxWithholding').innerText = `${logSymbol}${withholdingTaxHome.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}`;

        if (gross > 0) {
            document.getElementById('barExpenses').style.width = `${(logTotalExpenses / gross) * 100}%`;
            document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
            document.getElementById('barTakeHome').style.width = `${(computedTakeHome / gross) * 100}%`;
        }

        const canvasEl = document.getElementById('flowChart');
        if (canvasEl && typeof drawFlowLines === 'function') {
            // Re-render curves layout with synchronized row values parameter boundaries
            drawFlowLines(gross, logTotalExpenses, taxReserve, computedTakeHome);
        }
        
        if (typeof synchronizeDualCurrencyActionButtons === 'function') synchronizeDualCurrencyActionButtons();
        return; 
    }

    // SCENARIO B: Clean fallback pipeline tracks continue normally below...

    // SCENARIO B: Fall-through cleanly to use our newly streamlined matrix-engine core!
    const activeCurrencyCode = (window.activeMatrixCurrencyScopeMode === "received") ? receivedSelect.value : homeSelect.value;
    if (typeof getGlobalCurrencySymbolCharacter === 'function') {
        window.currentCurrency = getGlobalCurrencySymbolCharacter(activeCurrencyCode);
    }

    if (typeof originalUpdateMatrixData === 'function') {
        originalUpdateMatrixData();
    }
    
    if (typeof synchronizeDualCurrencyActionButtons === 'function') synchronizeDualCurrencyActionButtons();
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

// Locate this function inside sheets-sync.js and verify it locks the global panel elements as well
function toggleSidebarFormEditingState(shouldLock) {
    const inputIds = [
        'formDate', 'formClient', 'formAmount', 'formCurrency', 
        'formWithholdingToggle', 'formWithholdingAmt', 
        'formPlatformFeesToggle', 'formFees', 
        'formConversionMode', 'formExactCashAmt', 'formCustomRateVal', 
        'formExpenses',
        // 🚀 ADD THE GLOBAL CONFIGURATION INPUTS TO THE LOCK POOL
        'baseCurrencyConfig', 'baseTaxRateConfig' 
    ];
    
    inputIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.disabled = shouldLock;
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
            submitBtn.innerText = "PINNED LOCK VIEW";
            submitBtn.style.borderColor = "#a855f7";
            submitBtn.style.color = "#a855f7";
        } else {
            submitBtn.disabled = false;
            submitBtn.innerText = "STREAM TO SHEET";
            submitBtn.style.borderColor = "";
            submitBtn.style.color = "";
        }
    }
}

// =========================================================================
// 🚀 UPDATED ACTIVE APPLICATION STATES IN SHEETS-SYNC.JS
// =========================================================================
window.activeMatrixCurrencyScopeMode = "home"; 
window.cachedHistoricalLogs = [];

// 🚀 REPAIRED OVERHAUL: Tracks a group pool array list map instead of one slot indicator
window.selectedHistoricalLogIndices = []; 

// 🚀 SECURITY GUARD ENFORCER: Freezes simulation controls across all historical states
function evaluateGlobalArchivalFreezeState() {
    const btnPredictiveToggle = document.getElementById('btnToggleMode');
    const currencyControlTabs = document.getElementById('dualCurrencyControlGrid');
    const rightPanelSettingsGrid = document.querySelector('.settings-grid');
    const annualRevenueControlBlock = document.querySelector('.full-width-control');

    const startFilterDate = document.getElementById('filterStartDate')?.value || '';
    const endFilterDate = document.getElementById('filterEndDate')?.value || '';
    const isDateRangeFilterActive = (startFilterDate !== '' || endFilterDate !== '');
    
    // 🎯 TRUE CONDITION: Freeze if a row is single pinned, bulk multi-selected, or filtered by date window!
    const isArchivalViewActive = (
        (window.currentlyPinnedLogIndex !== null) || 
        (window.selectedHistoricalLogIndices && window.selectedHistoricalLogIndices.length > 0) || 
        isDateRangeFilterActive
    );

    if (isArchivalViewActive) {
        // Enforce the layout freeze lock parameters securely
        if (btnPredictiveToggle) btnPredictiveToggle.classList.add('predictive-toggle-frozen');
        if (currencyControlTabs) currencyControlTabs.classList.add('currency-tabs-frozen');
        if (rightPanelSettingsGrid) rightPanelSettingsGrid.classList.add('predictive-sliders-frozen');
        if (annualRevenueControlBlock) annualRevenueControlBlock.classList.add('predictive-sliders-frozen');
        
        toggleSidebarFormEditingState(true);
    } else {
        // Safely unfreeze elements back to live active workspace parameters
        if (btnPredictiveToggle) btnPredictiveToggle.classList.remove('predictive-toggle-frozen');
        if (currencyControlTabs) currencyControlTabs.classList.remove('currency-tabs-frozen');
        if (rightPanelSettingsGrid) rightPanelSettingsGrid.classList.remove('predictive-sliders-frozen');
        if (annualRevenueControlBlock) annualRevenueControlBlock.classList.remove('predictive-sliders-frozen');
        
        toggleSidebarFormEditingState(false);
    }
}

function clearAllHistoricalCardSelections() {
    window.selectedHistoricalLogIndices = [];
    const clearBtn = document.getElementById('btnBulkSelectClear');
    if (clearBtn) clearBtn.style.display = "none";
    
    // Reset tracker text instantly on selection wipes clear actions
    const countTextPanel = document.getElementById('selectedLogsCountDisplay');
    if (countTextPanel && window.cachedHistoricalLogs) {
        countTextPanel.innerText = `Showing: ${window.cachedHistoricalLogs.length} | Selected: 0`;
    }
    
    if (typeof evaluateGlobalArchivalFreezeState === 'function') evaluateGlobalArchivalFreezeState();
    if (typeof window.updateMatrixData === 'function') window.updateMatrixData();
    renderHistoricalSidebarLogs();
}

function selectAndPinHistoricalLogCard(index) {
    const existingIndexPosition = window.selectedHistoricalLogIndices.indexOf(index);

    if (existingIndexPosition > -1) {
        window.selectedHistoricalLogIndices.splice(existingIndexPosition, 1);
    } else {
        window.selectedHistoricalLogIndices.push(index);
    }

    const clearBtn = document.getElementById('btnBulkSelectClear');
    if (clearBtn) {
        clearBtn.style.display = (window.selectedHistoricalLogIndices.length > 0) ? "block" : "none";
    }

    // 🚀 CRITICAL UPDATE: If precisely ONE row card is active, force inputs to match its snapshot
    if (window.selectedHistoricalLogIndices.length === 1) {
        const singleLog = window.cachedHistoricalLogs[window.selectedHistoricalLogIndices[0]];
        const historicalRowBaseCurrency = singleLog.rowCurrencySetting || "USD";
        const historicalRowTaxRate = (parseFloat(singleLog.rowTaxRateSetting) || 0) * 100;

        if (document.getElementById('baseCurrencyConfig')) document.getElementById('baseCurrencyConfig').value = historicalRowBaseCurrency;
        if (document.getElementById('baseTaxRateConfig')) document.getElementById('baseTaxRateConfig').value = historicalRowTaxRate.toFixed(1);
        if (document.getElementById('inputTaxRate')) document.getElementById('inputTaxRate').value = historicalRowTaxRate.toFixed(1);
        if (document.getElementById('valTaxRate')) document.getElementById('valTaxRate').innerText = `${historicalRowTaxRate.toFixed(1)}%`;
    }

    // 🚀 TRIGGER GLOBAL SECURITY RE-EVALUATION PASSTHROUGH
    evaluateGlobalArchivalFreezeState();

    if (typeof updateMatrixData === 'function') window.updateMatrixData();
    renderHistoricalSidebarLogs();
}

// 🚀 OVERHAULED DYNAMIC CARD AND DATE FILTER PACK RENDERING ENGINE
function renderHistoricalSidebarLogs() {
    const container = document.getElementById('sidebarLogContainer');
    if (!container) return;
    container.innerHTML = "";

    if (!window.cachedHistoricalLogs || window.cachedHistoricalLogs.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No records streamed yet.</div>`;
        return;
    }

    const searchQuery = document.getElementById('logSearchInput') ? document.getElementById('logSearchInput').value.toLowerCase().trim() : '';
    const sortMode = document.getElementById('logSortSelect') ? document.getElementById('logSortSelect').value : 'date_desc';
    
    // Read date range slider parameter configurations
    const rawStartFilter = document.getElementById('filterStartDate')?.value || '';
    const rawEndFilter = document.getElementById('filterEndDate')?.value || '';

    let logItemsWithIndices = window.cachedHistoricalLogs.map((item, originalIndex) => {
        return { data: item, id: originalIndex };
    });

    // Execute Search and Date Range filters criteria checks simultaneously
    let filtered = logItemsWithIndices.filter(item => {
        const clientMatch = item.data.client ? item.data.client.toLowerCase().includes(searchQuery) : false;
        const currencyMatch = item.data.currency ? item.data.currency.toLowerCase().includes(searchQuery) : false;
        const textSearchMatch = clientMatch || currencyMatch;
        
        // Date Interval boundaries validation match blocks
        if (rawStartFilter && item.data.date < rawStartFilter) return false;
        if (rawEndFilter && item.data.date > rawEndFilter) return false;
        
        return textSearchMatch;
    });

    // =========================================================================
    // 🚀 NEW BINDING NODE: RE-CALCULATE LOG QUANTITIES AND BATCH COUNT READOUTS
    // =========================================================================
    const countTextPanel = document.getElementById('selectedLogsCountDisplay');
    if (countTextPanel) {
        const totalItemsInActiveFilteredView = filtered.length;
        const totalItemsCurrentlySelectedInPool = window.selectedHistoricalLogIndices.length;
        
        // Staps text strings cleanly into the box row element nodes layout grid
        countTextPanel.innerText = `Showing: ${totalItemsInActiveFilteredView} | Selected: ${totalItemsCurrentlySelectedInPool}`;
    }

    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-tray-text">No matching records found within boundaries.</div>`;
        return;
    }

    // =========================================================================
    // 🚀 ADVANCED FINANCIAL SORTING ENGINES GRID IN SHEETS-SYNC.JS
    // =========================================================================
    filtered.sort((a, b) => {
        // A. Chronological Flows
        if (sortMode === "date_desc") return new Date(b.data.date) - new Date(a.data.date);
        if (sortMode === "date_asc") return new Date(a.data.date) - new Date(b.data.date);
        
        // B. Invoiced Amounts & Cash Volume
        if (sortMode === "amt_desc") return (b.data.amount || 0) - (a.data.amount || 0);
        if (sortMode === "amt_asc") return (a.data.amount || 0) - (b.data.amount || 0);
        if (sortMode === "home_desc") return (b.data.homeIncome || 0) - (a.data.homeIncome || 0);
        if (sortMode === "home_asc") return (a.data.homeIncome || 0) - (b.data.homeIncome || 0);
        
        // C. Overhead Operational Loss Costs
        if (sortMode === "exp_desc") return (b.data.bizExpense || 0) - (a.data.bizExpense || 0);
        if (sortMode === "plat_desc") {
            const feeA = (a.data.amount || 0) * (a.data.platformPct || 0) * (a.data.fxRate || 1);
            const feeB = (b.data.amount || 0) * (b.data.platformPct || 0) * (b.data.fxRate || 1);
            return feeB - feeA;
        }
        
        // D. Tax Reserves & Deductions
        if (sortMode === "tax_desc") return (b.data.finalTaxOwed || 0) - (a.data.finalTaxOwed || 0);
        if (sortMode === "withhold_desc") return (b.data.withholdAmt || 0) - (a.data.withholdAmt || 0);
        
        // E. Textual Client Metadata Strings Strings Lookups
        if (sortMode === "client_asc") return String(a.data.client).localeCompare(String(b.data.client));
        if (sortMode === "client_desc") return String(b.data.client).localeCompare(String(a.data.client));
        
        return 0;
    });

    filtered.forEach(item => {
        const log = item.data;
        const card = document.createElement('div');
        
        // 🚀 CHECK ARRAY MEMBERSHIP: Verify if this specific card index sits inside the selected pool map
        const isSelected = window.selectedHistoricalLogIndices.includes(item.id);
        
        card.className = `transaction-card ${isSelected ? 'multi-selected-active' : ''}`;
        card.setAttribute('onclick', `selectAndPinHistoricalLogCard(${item.id})`);
        card.style.position = "relative";
        card.style.cursor = "pointer";

        const rawAmt = parseFloat(log.amount) || 0;
        const rawHomeIncome = parseFloat(log.homeIncome) || 0;
        const displayCurrency = String(log.currency || "USD").toUpperCase().trim();
        const displayLogSymbol = typeof getGlobalCurrencySymbolCharacter === 'function' ? getGlobalCurrencySymbolCharacter(displayCurrency) : '$ ';

        card.innerHTML = `
            <div class="card-row-top">
                <span>${log.date || "2026-09-06"} ${isSelected ? '<strong style="color:#38bdf8;">[SELECTED]</strong>' : ''}</span>
                <span style="color:#38bdf8; font-weight:700;">${displayCurrency}</span>
            </div>
            <div class="card-client-title">${log.client || "Ledger Entry"}</div>
            <div class="card-row-metrics">
                <span>Invoice: <strong>${displayLogSymbol}${rawAmt.toLocaleString(undefined, {minimumFractionDigits:2})}</strong></span>
                <span>Net Home: <strong style="color:#4ade80;">${window.currentCurrency || '$ '}${rawHomeIncome.toLocaleString(undefined, {maximumFractionDigits:0})}</strong></span>
            </div>
        `;
        // Add as the first executing line inside renderHistoricalSidebarLogs() in sheets-sync.js
        if (typeof evaluateGlobalArchivalFreezeState === 'function') evaluateGlobalArchivalFreezeState();

        container.appendChild(card);
    });
}

async function fetchAndHydrateLogCachesFromSheet() {
    const endpoint = apiInput.value.trim();
    const container = document.getElementById('sidebarLogContainer');
    const connectBtn = document.getElementById('btnConnectVault');
    
    if (!endpoint || !endpoint.startsWith('https://google.com')) {
        console.warn("⚠️ Logcat Engine Trace: Please paste a valid Google Web App URL.");
        if (container) {
            container.innerHTML = `<div class="empty-tray-text" style="color: #64748b;">Waiting for a valid Google Script Web App URL...</div>`;
        }
        return;
    }

    if (container) {
        container.innerHTML = `<div class="empty-tray-text" style="color: #38bdf8;">LOADING SECURE LEDGER FROM CLOUD...</div>`;
    }

    // 🚀 VISUAL FEEDBACK: Lock button and show active tracking state
    if (connectBtn) {
        connectBtn.disabled = true;
        connectBtn.innerText = "AUTHENTICATING VAULT...";
        connectBtn.style.borderColor = "#eab308";
        connectBtn.style.color = "#eab308";
    }

    const buyerInputPassword = document.getElementById('apiSecurityTokenInput')?.value.trim() || "";
    const payload = {
        apiToken: buyerInputPassword,
        bootLoad: true 
    };

    if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("loading");

    try {
        const response = await fetch(endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        });
        const result = await response.json();

        if (result.status === "success" && result.summary) {
            window.liveSheetMetrics = result.summary;
            window.localHistoryTotals = result.summary.totals;
            window.cachedHistoricalLogs = result.summary.logs || [];
            
            console.log(`✔ Cache Synchronized: Loaded ${window.cachedHistoricalLogs.length} isolated rows.`);
 
            if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("success");

            // 🚀 SUCCESS FEEDBACK STATE
            if (connectBtn) {
                connectBtn.innerText = "SECURELY CONNECTED ✔";
                connectBtn.style.borderColor = "#4ade80";
                connectBtn.style.color = "#4ade80";
            }

            if (typeof updateMatrixData === 'function') updateMatrixData();
            if (typeof renderHistoricalSidebarLogs === 'function') renderHistoricalSidebarLogs();
        
        } else {
            console.error("🛑 Security Exception: " + result.message);
            if (container) {
                container.innerHTML = `<div class="empty-tray-text" style="color: #f87171; font-weight:700;">🔒 SECURE ACCESS DENIED: Check your API Shield Password Token!</div>`;
            }
            if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("error");
            
            // 🛑 BREAK FEEDBACK STATE
            if (connectBtn) {
                connectBtn.innerText = "AUTHENTICATION FAILED 🛑";
                connectBtn.style.borderColor = "#f87171";
                connectBtn.style.color = "#f87171";
            }
        }
    } catch (err) {
        console.error("🚨 Boot Sync Engine Failure: ", err);
        if (container) {
            container.innerHTML = `<div class="empty-tray-text" style="color: #f87171;">Database Sync Failed. Check URL connection parameters!</div>`;
        }
        if (typeof updateSyncSpinnerState === 'function') updateSyncSpinnerState("error");
        
        if (connectBtn) {
            connectBtn.innerText = "SERVER CONNECTION FAILED";
            connectBtn.style.borderColor = "#f87171";
            connectBtn.style.color = "#f87171";
        }
    } finally {
        // 🚀 TIMEOUT RESET: Re-enable the button after 3 seconds so users can adjust fields if they failed
        setTimeout(() => {
            if (connectBtn) {
                connectBtn.disabled = false;
                
                // If it was a success, keep a clean indicator, otherwise reset to default prompt text strings
                if (connectBtn.innerText.includes("CONNECTED")) {
                    connectBtn.innerText = "REFRESH VAULT CONNECTION";
                    connectBtn.style.borderColor = "#4ade80";
                    connectBtn.style.color = "#4ade80";
                } else {
                    connectBtn.innerText = "CONNECT & AUTHENTICATE";
                    connectBtn.style.borderColor = "#38bdf8";
                    connectBtn.style.color = "#38bdf8";
                }
            }
        }, 3000);
    }
}

// NEW VISIBILITY CONTROL HUB: Handles Option A vs Option B form block switching dynamically
function toggleConversionInputFields() {
    const modeSelect = document.getElementById('formConversionMode');
    const groupExact = document.getElementById('groupExactCash');
    const groupRate  = document.getElementById('groupCustomRate');
    
    if (!modeSelect || !groupExact || !groupRate) return;
    
    const selectedMode = modeSelect.value;
    
    if (selectedMode === "exact_cash") {
        groupExact.style.display = "flex";  // Open Cash Landed Input
        groupRate.style.display  = "none";  // Wipe Custom Exchange Rate Input
        
        // Auto-fill behavior: If currencies match, fill down matching amounts instantly
        const homeCode = String(document.getElementById('baseCurrencyConfig')?.value || "").toUpperCase().trim();
        const recCode  = String(document.getElementById('formCurrency')?.value || "").toUpperCase().trim();
        const invoiceAmt = parseFloat(document.getElementById('formAmount')?.value) || 0;
        
        if (homeCode === recCode && recCode !== "" && invoiceAmt > 0) {
            const cashBox = document.getElementById('formExactCashAmt');
            if (cashBox) cashBox.value = invoiceAmt;
        }
    } else if (selectedMode === "custom_rate") {
        groupExact.style.display = "none";  // Wipe Cash Landed Input
        groupRate.style.display  = "flex";  // Open Custom Exchange Rate Input
    }
}

// Attach change interception tracking loops inside the main DOM thread framework initialization
document.addEventListener('DOMContentLoaded', () => {
    const convModeSelector = document.getElementById('formConversionMode');
    if (convModeSelector) {
        convModeSelector.addEventListener('change', toggleConversionInputFields);
    }
    const invoiceAmtInput = document.getElementById('formAmount');
    if (invoiceAmtInput) {
        invoiceAmtInput.addEventListener('input', toggleConversionInputFields);
    }
});


// 🚀 CONTROL ENGINE HOOK 2: Fullscreen modal presentation view control toggle engine handler
function toggleMatrixChartFullscreenViewMode() {
    const mainMatrixContainerBox = document.querySelector('.matrix-container');
    const button = document.getElementById('btnFullscreenChart');
    
    if (!mainMatrixContainerBox || !button) return;

    // Direct protection: If floating mode is currently engaged, clear it out before expanding
    if (window.isMatrixChartDetachedFloating) {
        toggleMatrixChartFloatingState();
    }

    window.isMatrixCanvasMaximizeViewActive = !window.isMatrixCanvasMaximizeViewActive;

    if (window.isMatrixCanvasMaximizeViewActive) {
        mainMatrixContainerBox.classList.add('canvas-maximize-presentation-view');
        button.style.color = "#a855f7"; // Switch icon alert status hue to vibrant purple
        button.setAttribute('title', 'Exit Fullscreen Canvas');
        
        // Change full layout SVG internal graphics path vector maps to an un-expand collapse icon symbol
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 0h-6v6"></path>
            </svg>
        `;
    } else {
        mainMatrixContainerBox.classList.remove('canvas-maximize-presentation-view');
        button.style.color = "";
        button.setAttribute('title', 'Toggle Fullscreen Canvas');
        
        // Restore standard expand lines SVG path
        button.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
        `;
    }

    // Force an immediate re-measurement pass to update the canvas grid coordinate mapping tracking frames
    setTimeout(enforceDynamicViewportCanvasSizing, 20);
}

