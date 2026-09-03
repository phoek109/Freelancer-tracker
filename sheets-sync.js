const apiInput = document.getElementById('apiEndpoint');

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
    
    // Safety delay to make sure all your custom sidebar layout fields have loaded
    setTimeout(() => {
        if (typeof refreshAllDropdowns === 'function') refreshAllDropdowns();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 150);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
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
    }
}
