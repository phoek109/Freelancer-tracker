const apiInput = document.getElementById('apiEndpoint');
const subCatSelect = document.getElementById('formSubCategorySelect');
const newSubInput = document.getElementById('newSubCatNameInput');
const tagsContainer = document.getElementById('subCategoryTagsContainer');

let activeMainCategory = 'income';

window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    
    if (localStorage.getItem('customSubCatsCache')) {
        window.subCategoriesCache = JSON.parse(localStorage.getItem('customSubCatsCache'));
    }
    
    refreshSubCategoryUI();
    selectMainCategory('income'); // Lock baseline view on boot
    
    setTimeout(() => {
        if (typeof resizeCanvas === 'function') resizeCanvas();
        if (typeof updateMatrixData === 'function') updateMatrixData();
    }, 150);
});

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

// FIXED: Form interface dynamically morphs labels to make clear they are distinct logs
function selectMainCategory(categoryName) {
    activeMainCategory = categoryName;
    
    document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`catBtn-${categoryName}`).classList.add('active');
    
    // Clear out the value in the amount box so stale data isn't left visible
    document.getElementById('formAmount').value = '';
    document.getElementById('formClient').value = '';

    // Dynamically warp text tags based on chosen operation type
    const lblDesc = document.getElementById('lblDescription');
    const lblSub = document.getElementById('lblSubCategory');
    const lblAmt = document.getElementById('lblAmount');
    const txtClient = document.getElementById('formClient');
    const txtAmount = document.getElementById('formAmount');

    if (categoryName === 'income') {
        lblDesc.innerText = "Description / Client";
        txtClient.placeholder = "e.g., Website Project Retainer";
        lblSub.innerText = "Income Sub-Category Target";
        lblAmt.innerText = "Invoice Amount (Gross Earnings)";
        txtAmount.placeholder = "Enter gross invoice value...";
    } else if (categoryName === 'expense') {
        lblDesc.innerText = "Expense / Vendor Item";
        txtClient.placeholder = "e.g., Monthly Hosting Bill, Adobe License";
        lblSub.innerText = "Expense Sub-Category Target";
        lblAmt.innerText = "Expense Outflow Cost";
        txtAmount.placeholder = "Enter expense cost numerical value...";
    } else if (categoryName === 'tax') {
        lblDesc.innerText = "Tax Event Notes";
        txtClient.placeholder = "e.g., Q2 Estimated Payment";
        lblSub.innerText = "Tax Vault Category Target";
        lblAmt.innerText = "Tax Adjustment Amount";
        txtAmount.placeholder = "Enter tax adjustment numerical value...";
    }
    
    document.getElementById('incomeExtraFields').classList.toggle('hidden', categoryName !== 'income');
    document.getElementById('taxExtraFields').classList.toggle('hidden', categoryName !== 'tax');
    
    refreshSubCategoryUI();
}

function refreshSubCategoryUI() {
    const activeList = window.subCategoriesCache[activeMainCategory];
    
    subCatSelect.innerHTML = '';
    activeList.forEach(name => {
        const opt = document.createElement('option');
        opt.value = name;
        opt.innerText = name;
        subCatSelect.appendChild(opt);
    });

    tagsContainer.innerHTML = '';
    activeList.forEach((name, idx) => {
        const tag = document.createElement('div');
        tag.className = 'subcat-tag';
        tag.innerHTML = `
            <span>${name}</span>
            <button type="button" onclick="deleteSubCategoryByIndex(${idx})">×</button>
        `;
        tagsContainer.appendChild(tag);
    });
}

function addNewSubCategoryFromSidebar() {
    const rawVal = newSubInput.value.trim();
    if (!rawVal) return;

    if (!window.subCategoriesCache[activeMainCategory].includes(rawVal)) {
        window.subCategoriesCache[activeMainCategory].push(rawVal);
        localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
        newSubInput.value = '';
        refreshSubCategoryUI();
    }
}

function deleteSubCategoryByIndex(indexNumber) {
    const activeList = window.subCategoriesCache[activeMainCategory];
    activeList.splice(indexNumber, 1);
    localStorage.setItem('customSubCatsCache', JSON.stringify(window.subCategoriesCache));
    refreshSubCategoryUI();
    if (typeof updateMatrixData === 'function') updateMatrixData();
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
    const subCat = subCatSelect.value;

    const fees = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const withholding = document.getElementById('formWithholdingToggle').value;
    const withholdingAmt = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;

    if (!client || amount <= 0 || !subCat) {
        statusText.style.color = '#f87171'; statusText.innerText = "Error: All transaction details are required!"; return;
    }

    statusText.style.color = '#eab308'; statusText.innerText = "Streaming to Google Cloud...";
    const totals = window.localHistoryTotals;

    if (totals.gross === 0 && Object.keys(totals.breakdownValues).length <= 7) {
        totals.breakdownValues = {};
    }

    if (!totals.breakdownValues[subCat]) totals.breakdownValues[subCat] = 0;
    totals.breakdownValues[subCat] += amount;

    if (activeMainCategory === 'income') {
        totals.gross += amount * (1 - fees);
    } else if (activeMainCategory === 'expense') {
        totals.expenses += amount;
    } else if (activeMainCategory === 'tax') {
        totals.taxWithheld += withholdingAmt;
    }

    const payload = {
        data: {
            "Date": date, "Client Name": client, "Invoice Amount": amount, "Category": activeMainCategory,
            "Sub Category": subCat, "Platform Fees": fees, "Withholding Tax Deducted?": withholding, "Withholding Amount": withholdingAmt
        }
    };

    try {
        const response = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload) });
        const result = await response.json();

        if (result.status === "success") {
            statusText.style.color = '#4ade80';
            statusText.innerText = "✔ Success! Row logged to Google Sheets.";
            document.getElementById('formClient').value = '';
            document.getElementById('formAmount').value = '';
            if (typeof updateMatrixData === 'function') updateMatrixData(); 
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171'; statusText.innerText = "Connection Failed. Check your Deployment Web App URL.";
    }
}
