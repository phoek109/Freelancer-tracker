const apiInput = document.getElementById('apiEndpoint');

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    
    // Load custom sub-categories from memory cache if they exist
    if (localStorage.getItem('customSubCatsCache')) {
        window.subCategoriesCache = JSON.parse(localStorage.getItem('customSubCatsCache'));
    } else {
        // Initialize fallback default categories if cache is empty
        window.subCategoriesCache = {
            income: ['Active Invoice', 'Client Retainers'],
            expense: ['Software/Tools', 'Marketing/Ads', 'Hardware/Office'],
            tax: ['Income Tax Reserve', 'Withholding Vault']
        };
    }
    
    refreshAllDropdowns();
    
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 150);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

// FIXED: Re-compiles all three sub-category dropdown fields simultaneously in parallel
function refreshAllDropdowns() {
    ['income', 'expense', 'tax'].forEach(type => {
        const selectElement = document.getElementById(`select-${type}`);
        if (!selectElement) return;
        
        const activeList = window.subCategoriesCache[type];
        
        // Save the current selection state before wiping the choices
        const previousSelection = selectElement.value;
        
        selectElement.innerHTML = '';
        activeList.forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.innerText = name;
            selectElement.appendChild(opt);
        });
        
        // Restore their selection if that item still exists in the array list
        if (activeList.includes(previousSelection)) {
            selectElement.value = previousSelection;
        }
    });
}

// FIXED: Saves a new sub-category inline directly from its specific layout row text box
function addNewSubCategory(type) {
    const textInput = document.getElementById(`new-${type}-txt`);
    if (!textInput) return;
    
    const rawVal = textInput.value.trim();
    if (!rawVal) return;

    if (!window.subCategoriesCache[type].includes(rawVal)) {
        window.subCategoriesCache[type].push(rawVal);
        localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
        
        // Clear only this specific text box so other values remain visible
        textInput.value = '';
        
        refreshAllDropdowns();
        
        // Instantly force select the brand new sub-category they just created for a clean UX
        document.getElementById(`select-${type}`).value = rawVal;
        
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }
}

// Stream the bundled row inputs out to the Google Apps Script Web App
async function dispatchLedgerTransactionBundle() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Paste your Google Web App URL first!"; return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim() || "Ledger Entry";
    
    // Read amounts from all three permanent fields safely
    const amtIncome = parseFloat(document.getElementById('amt-income').value) || 0;
    const feeIncome = (parseFloat(document.getElementById('fee-income').value) || 0) / 100;
    const subIncome = document.getElementById('select-income').value;

    const amtExpense = parseFloat(document.getElementById('amt-expense').value) || 0;
    const subExpense = document.getElementById('select-expense').value;

    const amtTax = parseFloat(document.getElementById('amt-tax').value) || 0;
    const subTax = document.getElementById('select-tax').value;
    const isWithholding = document.getElementById('toggle-tax').value;

    // Validation check: ensure at least one numerical amount field is logged
    if (amtIncome === 0 && amtExpense === 0 && amtTax === 0) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Input an amount in at least one category pipeline!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming records to Google Cloud...";
    const totals = window.localHistoryTotals;

    // Reset fallback mock demo records upon first true user log stream
    if (totals.gross === 0 && Object.keys(totals.breakdownValues).length <= 7) {
        totals.breakdownValues = {};
    }

    // Process calculations for all active channels in parallel without mutual overwriting crashes
    if (amtIncome > 0) {
        totals.gross += amtIncome * (1 - feeIncome);
        if (!totals.breakdownValues[subIncome]) totals.breakdownValues[subIncome] = 0;
        totals.breakdownValues[subIncome] += amtIncome;
    }
    if (amtExpense > 0) {
        totals.expenses += amtExpense;
        if (!totals.breakdownValues[subExpense]) totals.breakdownValues[subExpense] = 0;
        totals.breakdownValues[subExpense] += amtExpense;
    }
    if (amtTax > 0) {
        if (isWithholding === "Yes") totals.taxWithheld += amtTax;
        if (!totals.breakdownValues[subTax]) totals.breakdownValues[subTax] = 0;
        totals.breakdownValues[subTax] += amtTax;
    }

    // Map a single robust ledger block payload package to push to the spreadsheet receiver
    const payload = {
        data: {
            "Date": date,
            "Client Name": client,
            "Invoice Amount": amtIncome,
            "Currency Recieved": currentCurrency === '$' ? 'USD' : (currentCurrency === '€' ? 'EUR' : 'GBP'),
            "Platform Fees": feeIncome,
            "Business Expenses": amtExpense,
            "Withholding Tax Deducted?": isWithholding,
            "Withholding Amount": isWithholding === "Yes" ? amtTax : 0
        }
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80';
            statusText.innerText = "✔ Success! Row entry streamed to Google Sheets.";
            
            // Clear text numerical cells safely while leaving configurations intact
            document.getElementById('amt-income').value = '';
            document.getElementById('amt-expense').value = '';
            document.getElementById('amt-tax').value = '';
            document.getElementById('formClient').value = '';
            
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    }
}
