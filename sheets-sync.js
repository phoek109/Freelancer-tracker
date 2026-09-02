const apiInput = document.getElementById('apiEndpoint');
const mainCatSelect = document.getElementById('formMainCategory');
const subCatSelect = document.getElementById('formSubCategorySelect');
const newSubInput = document.getElementById('formSubCategoryNew');

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    handleMainCategoryChange(); // Populate dropdown lists baseline options
    
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 100);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

// Switch dropdown select parameters based on Parent Categories selections
function handleMainCategoryChange() {
    const mainCat = mainCatSelect.value;
    const subOptions = window.subCategoriesCache[mainCat];
    
    subCatSelect.innerHTML = '';
    subOptions.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.innerText = opt;
        subCatSelect.appendChild(option);
    });

    // Hide or show field dependencies dynamically based on selection rules
    document.getElementById('incomeExtraFields').classList.toggle('hidden', mainCat !== 'income');
    document.getElementById('taxExtraFields').classList.toggle('hidden', mainCat !== 'tax');
}

// Toggle custom category name input textbox
function toggleSubCategoryInput() {
    newSubInput.classList.toggle('hidden');
    subCatSelect.classList.toggle('hidden');
    if (!newSubInput.classList.contains('hidden')) {
        newSubInput.focus();
    }
}

async function sendToGoogleSheets() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Paste your Google Web App URL first!"; return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim();
    const amount = parseFloat(document.getElementById('formAmount').value) || 0;
    const mainCat = mainCatSelect.value;
    
    // Evaluate if user is utilizing custom input vs standard dropdown selector
    let subCat = '';
    if (!newSubInput.classList.contains('hidden') && newSubInput.value.trim() !== '') {
        subCat = newSubInput.value.trim();
        // Dynamically add the custom category to the cache list matrix array pipelines
        if (!window.subCategoriesCache[mainCat].includes(subCat)) {
            window.subCategoriesCache[mainCat].push(subCat);
        }
    } else {
        subCat = subCatSelect.value;
    }

    const fees = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const withholding = document.getElementById('formWithholdingToggle').value;
    const withholdingAmt = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;

    if (!client || amount <= 0 || !subCat) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: Description, Amount & Sub-Category are required!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming to Google Cloud...";

    const totals = window.localHistoryTotals;

    // Reset filler mock values layout immediately upon registering first true history input rows log
    if (totals.gross === 0 && Object.keys(totals.breakdownValues).length <= 7) {
        totals.breakdownValues = {};
    }

    // Accumulate metrics values down across custom branch total indicators
    if (!totals.breakdownValues[subCat]) totals.breakdownValues[subCat] = 0;
    totals.breakdownValues[subCat] += amount;

    if (mainCat === 'income') {
        totals.gross += amount * (1 - fees);
    } else if (mainCat === 'expense') {
        totals.expenses += amount;
    } else if (mainCat === 'tax') {
        totals.taxWithheld += withholdingAmt;
    }

    const payload = {
        data: {
            "Date": date, "Client Name": client, "Invoice Amount": amount, "Category": mainCat,
            "Sub Category": subCat, "Platform Fees": fees, "Withholding Tax Deducted?": withholding, "Withholding Amount": withholdingAmt
        }
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80';
            statusText.innerText = "✔ Success! Dynamic ledger row logged.";
            document.getElementById('formClient').value = '';
            document.getElementById('formAmount').value = '';
            newSubInput.value = '';
            newSubInput.classList.add('hidden');
            subCatSelect.classList.remove('hidden');
            
            handleMainCategoryChange(); // Refresh dropdown lists options
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    }
}
