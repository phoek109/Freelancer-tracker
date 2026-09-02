let currentCurrency = '$';

const inputRevenue = document.getElementById('inputRevenue');
const inputRatio = document.getElementById('inputRatio');
const inputTaxRate = document.getElementById('inputTaxRate');
const canvas = document.getElementById('flowChart');
const apiInput = document.getElementById('apiEndpoint');

// Remember user API configurations across refreshes
window.onload = () => {
    if (localStorage.getItem('userSheetDB')) {
        apiInput.value = localStorage.getItem('userSheetDB');
    }
    document.getElementById('formDate').valueAsDate = new Date();
    resizeCanvas();
    updateMatrixData();
};

apiInput.addEventListener('input', (e) => {
    localStorage.setItem('userSheetDB', e.target.value);
});

function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

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

function drawFlowLines(expRatio, taxRate, netProfit, gross) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const w = canvas.width; const h = canvas.height;
    drawBackgroundGrid(ctx, w, h);

    const startX = 140; const startY = h / 2; const endX = w - 160;

    const taxFactor = netProfit > 0 ? (netProfit * taxRate / gross) : 0;
    const endY_Expenses = startY - (expRatio * (h * 0.35));
    const endY_Tax = startY;
    const endY_TakeHome = startY + ((1 - expRatio - taxFactor) * (h * 0.35));

    const expPercent = Math.round(expRatio * 100);
    const taxPercent = Math.round(taxRate * 100);
    const homePercent = Math.round((1 - expRatio - taxFactor) * 100);

    // Gross Entry Baseline Flow Track
    ctx.beginPath(); ctx.moveTo(0, startY); ctx.lineTo(startX, startY);
    ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 4; ctx.stroke();

    // FIXED: Adjusted visual position label slightly upwards to clear grid overlap clutter
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#38bdf8'; 
    ctx.fillText("GROSS INPUT", 20, startY - 14);

    function drawCurve(endY, color, baseText, percentValue) {
        ctx.beginPath(); ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(startX + (w * 0.25), startY, endX - (w * 0.25), endY, endX, endY);
        ctx.strokeStyle = color; ctx.lineWidth = 4;
        ctx.shadowBlur = 10; ctx.shadowColor = color; ctx.stroke(); ctx.shadowBlur = 0;

        const labelText = `${baseText} (${percentValue}%)`;
        const pillW = ctx.measureText(labelText).width + 24;
        ctx.beginPath(); ctx.roundRect(endX, endY - 11, pillW, 22, 11);
        ctx.fillStyle = color; ctx.fill();
        ctx.fillStyle = '#ffffff'; ctx.fillText(labelText, endX + 12, endY + 4);
    }

    drawCurve(endY_Expenses, '#f87171', 'Expenses', expPercent);
    drawCurve(endY_Tax, '#facc15', 'Tax Reserve', taxPercent);
    drawCurve(endY_TakeHome, '#4ade80', 'Take-Home', homePercent);

    ctx.beginPath(); ctx.arc(startX, startY, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#3b82f6'; ctx.fill();
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center';
    ctx.fillText(currentCurrency, startX, startY + 4); ctx.textAlign = 'left';
}

function updateMatrixData() {
    const gross = parseFloat(inputRevenue.value) || 0;
    const expRatio = (parseFloat(inputRatio.value) || 0) / 100;
    const taxRate = (parseFloat(inputTaxRate.value) || 0) / 100;

    const totalExpenses = gross * expRatio;
    const netProfit = gross - totalExpenses;
    const taxReserve = netProfit > 0 ? netProfit * taxRate : 0;
    const takeHome = netProfit - taxReserve;

    // Advanced dynamic sub-category calculation updates
    const incActive = gross * 0.65;
    const incRetainer = gross * 0.35;
    const software = totalExpenses * 0.4;
    const marketing = totalExpenses * 0.35;
    const hardware = totalExpenses * 0.25;
    const taxIncome = taxReserve * 0.8;
    const taxWithholding = taxReserve * 0.2;

    document.getElementById('valRevenue').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('valRatio').innerText = `${inputRatio.value}%`;
    document.getElementById('valTaxRate').innerText = `${inputTaxRate.value}%`;

    document.getElementById('grossDisplay').innerText = `${currentCurrency}${gross.toLocaleString()}`;
    document.getElementById('expensesDisplay').innerText = `${currentCurrency}${totalExpenses.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxDisplay').innerText = `${currentCurrency}${taxReserve.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('takeHomeDisplay').innerText = `${currentCurrency}${takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    // Map calculated numbers out to all three breakdown panel sections
    document.getElementById('incActive').innerText = `${currentCurrency}${incActive.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('incRetainer').innerText = `${currentCurrency}${incRetainer.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expSoftware').innerText = `${currentCurrency}${software.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expMarketing').innerText = `${currentCurrency}${marketing.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('expHardware').innerText = `${currentCurrency}${hardware.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxIncome').innerText = `${currentCurrency}${taxIncome.toLocaleString(undefined, {maximumFractionDigits:0})}`;
    document.getElementById('taxWithholding').innerText = `${currentCurrency}${taxWithholding.toLocaleString(undefined, {maximumFractionDigits:0})}`;

    if (gross > 0) {
        document.getElementById('barExpenses').style.width = `${(totalExpenses / gross) * 100}%`;
        document.getElementById('barTax').style.width = `${(taxReserve / gross) * 100}%`;
        document.getElementById('barTakeHome').style.width = `${(takeHome / gross) * 100}%`;
    }
    drawFlowLines(expRatio, taxRate, netProfit, gross);
}

// Free Google Apps Script execution stream pipeline
async function sendToGoogleSheets() {
    const endpoint = apiInput.value.trim();
    const statusText = document.getElementById('syncStatus');
    
    if (!endpoint) {
        statusText.style.color = '#f87171';
        statusText.innerText = "Error: Paste your Google Web App URL first!";
        return;
    }

    const date = document.getElementById('formDate').value;
    const client = document.getElementById('formClient').value.trim();
    const amount = parseFloat(document.getElementById('formAmount').value) || 0;
    const currency = document.getElementById('formCurrency').value;
    const fees = (parseFloat(document.getElementById('formFees').value) || 0) / 100;
    const expenses = parseFloat(document.getElementById('formExpenses').value) || 0;
    const withholding = document.getElementById('formWithholdingToggle').value;
    const withholdingAmt = parseFloat(document.getElementById('formWithholdingAmt').value) || 0;

    if (!client || amount <= 0) {
        statusText.style.color = '#f87171';
        statusText.innerText = "Error: Client Name & Invoice Amount are required!";
        return;
    }

    statusText.style.color = '#eab308';
    statusText.innerText = "Streaming to Google Cloud...";

    const payload = {
        data: {
            "Date": date,
            "Client Name": client,
            "Invoice Amount": amount,
            "Currency Recieved": currency,
            "Platform Fees": fees,
            "Business Expenses": expenses,
            "Withholding Tax Deducted?": withholding,
            "Withholding Amount": withholdingAmt
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
            statusText.innerText = "✔ Success! Row logged into Google Sheets.";
            document.getElementById('formClient').value = '';
            document.getElementById('formAmount').value = '';
        } else {
            throw new Error(result.message);
        }
    } catch (err) {
        statusText.style.color = '#f87171';
        statusText.innerText = "Connection Failed. Check your Google Deployment Web App URL.";
    }
}

inputRevenue.addEventListener('input', updateMatrixData);
inputRatio.addEventListener('input', updateMatrixData);
inputTaxRate.addEventListener('input', updateMatrixData);

document.querySelectorAll('.curr-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.curr-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentCurrency = e.target.getAttribute('data-symbol');
        updateMatrixData();
    });
});
window.onresize = () => { resizeCanvas(); updateMatrixData(); };
