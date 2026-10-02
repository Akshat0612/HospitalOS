const API_BASE = "http://localhost:3000/api";
window.API_BASE = API_BASE;

const HOSPITAL_DOCTORS_FALLBACK = [
    { name: "Dr. Sharma", specialization: "Cardiologist" },
    { name: "Dr. Mehta", specialization: "Neurologist" },
    { name: "Dr. Singh", specialization: "Orthopedic" },
    { name: "Dr. Verma", specialization: "Dermatologist" },
    { name: "Dr. Patel", specialization: "Pediatrician" },
    { name: "Dr. Gupta", specialization: "Oncologist" },
    { name: "Dr. Kumar", specialization: "General Surgeon" },
    { name: "Dr. Reddy", specialization: "ENT Specialist" },
    { name: "Dr. Iyer", specialization: "Ophthalmologist" },
    { name: "Dr. Nair", specialization: "Psychiatrist" },
    { name: "Dr. Joshi", specialization: "Gynecologist" },
    { name: "Dr. Rao", specialization: "Urologist" },
    { name: "Dr. Desai", specialization: "Gastroenterologist" },
    { name: "Dr. Malhotra", specialization: "Pulmonologist" },
    { name: "Dr. Banerjee", specialization: "Nephrologist" },
    { name: "Dr. Choudhary", specialization: "Endocrinologist" },
    { name: "Dr. Saxena", specialization: "Rheumatologist" },
    { name: "Dr. Khanna", specialization: "Plastic Surgeon" },
    { name: "Dr. Agarwal", specialization: "Dentist" },
    { name: "Dr. Bhatia", specialization: "Physiotherapist" },
    { name: "Dr. Menon", specialization: "Radiologist" },
    { name: "Dr. Yadav", specialization: "Pathologist" },
    { name: "Dr. Pandey", specialization: "Anesthesiologist" },
    { name: "Dr. Ghosh", specialization: "Hematologist" },
    { name: "Dr. Kapoor", specialization: "General Physician" },
    { name: "Dr. Jain", specialization: "Infectious Disease Specialist" },
    { name: "Dr. Arora", specialization: "Vascular Surgeon" },
    { name: "Dr. Prasad", specialization: "Geriatrician" },
    { name: "Dr. Kaur", specialization: "Sports Medicine Specialist" },
    { name: "Dr. Mishra", specialization: "Allergist & Immunologist" }
];

var doctors = HOSPITAL_DOCTORS_FALLBACK;
window.HOSPITAL_DOCTORS_FALLBACK = HOSPITAL_DOCTORS_FALLBACK;

function getPayload(json) {
    if (json && Object.prototype.hasOwnProperty.call(json, "data")) {
        return json.data;
    }
    return json;
}

function errorMessage(json) {
    if (json.errors && json.errors.length) {
        return json.errors.map((e) => e.msg || e.message).join("; ");
    }
    return json.message || "Request failed";
}

function authHeaders(jsonBody = false) {
    const h = { Authorization: "Bearer " + getToken() };
    if (jsonBody) h["Content-Type"] = "application/json";
    return h;
}

function getToken() {
    return localStorage.getItem("token");
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
        return {};
    }
}

function setMessage(id, msg, type = "error") {
    const el = document.getElementById(id);
    if (!el) return;

    el.innerText = msg;
    el.className = type === "success" ? "success-text" : "error-text";
}

function setLoading(btn, state, text = "Loading...") {
    if (!btn) return;

    if (state) {
        btn.disabled = true;
        btn.dataset.original = btn.innerText;
        btn.innerText = text;
    } else {
        btn.disabled = false;
        btn.innerText = btn.dataset.original || "Submit";
    }
}

function setupRoleNav() {
    const u = getUser();
    document.querySelectorAll(".nav-staff-only").forEach((el) => {
        if (u.role === "staff") {
            el.classList.remove("hidden");
        }
    });
}

function applyPreselectedDoctor() {
    const pre = localStorage.getItem("selectedDoctor");
    if (!pre) return;
    const sel = document.getElementById("doctor");
    if (!sel) return;
    for (const o of sel.options) {
        if (o.value === pre || o.textContent.includes(pre)) {
            sel.value = o.value;
            break;
        }
    }
    localStorage.removeItem("selectedDoctor");
}

async function login() {
    const btn = document.getElementById("loginBtn");

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        setMessage("error", "Enter all fields");
        return;
    }

    setLoading(btn, true, "Logging in...");

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const json = await res.json();
        const payload = getPayload(json);

        if (json.success && payload.token) {
            localStorage.setItem("token", payload.token);
            localStorage.setItem("user", JSON.stringify(payload.user || {}));
            window.location.href = "dashboard.html";
        } else {
            setMessage("error", errorMessage(json));
        }
    } catch {
        setMessage("error", "Server error");
    }

    setLoading(btn, false);
}

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

async function register() {
    const btn = document.getElementById("registerBtn");

    const name = document.getElementById("regName").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const password = document.getElementById("regPass").value.trim();
    const staffEl = document.getElementById("staffCode");
    const staffCode = staffEl ? staffEl.value.trim() : "";

    if (!name || !email || !password) {
        setMessage("regError", "All fields required");
        return;
    }

    setLoading(btn, true, "Creating...");

    try {
        const body = { name, email, password };
        if (staffCode) body.staffCode = staffCode;

        const res = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const json = await res.json();

        if (json.success) {
            setMessage("regError", "Registration successful", "success");
            setTimeout(() => (window.location.href = "index.html"), 1000);
        } else {
            setMessage("regError", errorMessage(json));
        }
    } catch {
        setMessage("regError", "Server error");
    }

    setLoading(btn, false);
}

function checkAuth() {
    if (!getToken()) {
        window.location.href = "index.html";
    }
}

function requireStaff() {
    checkAuth();
    if (getUser().role !== "staff") {
        window.location.href = "dashboard.html";
    }
}

function collectServicesForBill() {
    const services = [];
    if (document.getElementById("consult")?.checked) services.push("Consultation");
    if (document.getElementById("medicine")?.checked) services.push("Medicine");
    if (document.getElementById("surgery")?.checked) services.push("Surgery");

    if (services.length === 0) {
        const sel = document.getElementById("service");
        if (sel && sel.value) services.push(sel.value);
    }
    return services;
}

async function bookAppointment() {
    const doctor = document.getElementById("doctor").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!doctor || !date || !time) {
        setMessage("apptMsg", "Fill all fields");
        return;
    }

    const btn = document.querySelector('button[onclick="bookAppointment()"]');
    if (btn) btn.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/appointments`, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ doctor, date, time })
        });

        const json = await res.json();

        if (json.success && json.data) {
            const { appointment, consultationFee, totalWithTax, redirectToBilling } = json.data;
            
            // Store pending appointment data for billing page
            if (redirectToBilling) {
                localStorage.setItem("pendingAppointment", JSON.stringify({
                    appointmentId: appointment._id,
                    doctor: doctor,
                    date: date,
                    time: time,
                    consultationFee: consultationFee,
                    totalWithTax: totalWithTax
                }));
                
                setMessage("apptMsg", "Appointment created! Redirecting to payment...", "success");
                
                // Redirect to billing after short delay
                setTimeout(() => {
                    window.location.href = "billing.html?fromAppointment=true";
                }, 1500);
            } else {
                setMessage("apptMsg", json.message, "success");
                loadAppointments();
            }
        } else {
            setMessage("apptMsg", errorMessage(json), "error");
        }
    } catch (e) {
        console.error(e);
        setMessage("apptMsg", "Failed to book", "error");
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function updateAppointmentStatus(id, status) {
    try {
        const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
            method: "PUT",
            headers: authHeaders(true),
            body: JSON.stringify({ status })
        });
        const json = await res.json();
        if (json.success) {
            loadAppointments();
        } else {
            alert(errorMessage(json));
        }
    } catch {
        alert("Could not update appointment");
    }
}

async function loadAppointments() {
    const list = document.getElementById("apptList");
    if (!list) return;

    const u = getUser();
    const qs =
        u.role === "staff" && window.location.pathname.includes("staff")
            ? "?view=all&limit=50"
            : "?limit=50";

    try {
        const res = await fetch(`${API_BASE}/appointments${qs}`, {
            headers: authHeaders()
        });

        const json = await res.json();
        const payload = getPayload(json);
        const data = payload.appointments || [];

        list.innerHTML = "";

        if (!data.length) {
            list.innerHTML = "<li class='list-card empty-state'>No appointments yet</li>";
            return;
        }

        const isStaff = u.role === "staff" && window.location.pathname.includes("staff");

        data.forEach((a) => {
            const li = document.createElement("li");
            li.className = "list-card";

            // Status badge with color coding
            const statusColors = {
                pending_payment: "#f59e0b",
                booked: "#3b82f6",
                confirmed: "#10b981",
                completed: "#6366f1",
                cancelled: "#6b7280",
                refunded: "#8b5cf6"
            };
            const badgeColor = statusColors[a.status] || "#6b7280";
            const badge = `<span class="status-badge" style="background: ${badgeColor}20; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">${a.status.replace(/_/g, ' ')}</span>`;
            
            // Payment status indicator
            let paymentInfo = "";
            if (a.paymentStatus) {
                const paymentColors = { unpaid: "#ef4444", partial: "#f59e0b", paid: "#10b981", refunded: "#8b5cf6" };
                paymentInfo = `<span style="font-size: 0.8rem; color: ${paymentColors[a.paymentStatus] || '#666'};">💰 ${a.paymentStatus}${a.amountPaid > 0 ? ` (₹${a.amountPaid})` : ''}</span>`;
            }
            
            // Refund info
            let refundInfo = "";
            if (a.refundAmount > 0) {
                refundInfo = `<div style="font-size: 0.8rem; color: #8b5cf6; margin-top: 0.25rem;">↩️ Refund: ₹${a.refundAmount}</div>`;
            }

            let actions = "";

            if (isStaff) {
                if (a.status === "pending_payment") {
                    actions += `<button type="button" class="btn-secondary btn-compact" onclick="location.href='billing.html'">View Bill</button>`;
                }
                if (a.status === "booked") {
                    actions += `<button type="button" class="btn-secondary btn-compact" onclick="updateAppointmentStatus('${a._id}','confirmed')">Confirm</button>`;
                }
                if (a.status === "confirmed") {
                    actions += `<button type="button" class="btn-secondary btn-compact" onclick="updateAppointmentStatus('${a._id}','completed')">Complete</button>`;
                }
                if (a.status !== "cancelled" && a.status !== "completed" && a.status !== "refunded") {
                    actions += `<button type="button" class="btn-danger btn-compact" onclick="cancelAppointment('${a._id}')">Cancel</button>`;
                }
            } else {
                // Patient view - no Pay Now button, user navigates to billing separately
                if (["pending_payment", "booked", "confirmed"].includes(a.status)) {
                    actions += `<button type="button" class="btn-danger btn-compact" onclick="cancelAppointment('${a._id}')">Cancel</button>`;
                }
            }

            li.innerHTML = `
                <div class="list-card-head">
                    <div>
                        <strong>${a.doctor}</strong>
                        <div style="font-size: 0.8rem; color: #64748b;">${a.date} · ${a.time}</div>
                    </div>
                    ${badge}
                </div>
                ${paymentInfo ? `<div style="margin-top: 0.25rem;">${paymentInfo}</div>` : ""}
                ${a.consultationFee ? `<div style="font-size: 0.8rem; color: #64748b;">Fee: ₹${a.consultationFee}</div>` : ""}
                ${refundInfo}
                ${actions ? `<div class="list-card-actions" style="margin-top: 0.5rem;">${actions}</div>` : ""}
            `;
            list.appendChild(li);
        });
    } catch {
        list.innerHTML = "<li class='list-card'>Error loading appointments</li>";
    }
}

// Cancel appointment with refund calculation
async function cancelAppointment(id) {
    const reason = prompt("Enter cancellation reason (optional):");
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/appointments/${id}/cancel`, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ reason: reason || "User cancelled" })
        });
        
        const json = await res.json();
        if (json.success) {
            const refundMsg = json.data.refundDetails.refundAmount > 0 
                ? `Refund of ₹${json.data.refundDetails.refundAmount} will be processed.` 
                : "No refund applicable.";
            alert(`Appointment cancelled. ${refundMsg}`);
            loadAppointments();
        } else {
            alert(errorMessage(json));
        }
    } catch {
        alert("Failed to cancel appointment");
    }
}

async function createBill() {
    const services = collectServicesForBill();

    if (services.length === 0) {
        setMessage("billMsg", "Select at least one service");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/billing`, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({ services })
        });

        const json = await res.json();
        const payload = getPayload(json);

        if (json.success && payload.bill) {
            setMessage("billMsg", json.message, "success");
            loadBills();
        } else {
            setMessage("billMsg", errorMessage(json), "error");
        }
    } catch {
        setMessage("billMsg", "Server error");
    }
}

async function markBillPaid(id) {
    try {
        const res = await fetch(`${API_BASE}/billing/${id}/pay`, {
            method: "PATCH",
            headers: authHeaders()
        });
        const json = await res.json();
        if (json.success) loadBills();
        else alert(errorMessage(json));
    } catch {
        alert("Payment update failed");
    }
}

async function downloadReceiptPdf(id) {
    try {
        const res = await fetch(`${API_BASE}/billing/${id}/receipt`, {
            headers: authHeaders()
        });
        if (!res.ok) {
            const j = await res.json().catch(() => ({}));
            alert(j.message || "Could not download receipt");
            return;
        }
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `receipt-${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch {
        alert("Download failed");
    }
}

async function loadBills() {
    const list = document.getElementById("billList");
    const empty = document.getElementById("noBills");
    const searchInput = document.getElementById("billSearch");
    const statusFilter = document.getElementById("statusFilter");

    if (!list) return;

    try {
        let url = `${API_BASE}/billing?limit=50`;
        if (searchInput && searchInput.value.trim()) {
            url += `&search=${encodeURIComponent(searchInput.value.trim())}`;
        }
        if (statusFilter && statusFilter.value) {
            url += `&paymentStatus=${encodeURIComponent(statusFilter.value)}`;
        }

        const res = await fetch(url, { headers: authHeaders() });
        const json = await res.json();
        const payload = getPayload(json);
        const data = payload.bills || [];

        list.innerHTML = "";

        if (!data.length) {
            if (empty) empty.classList.remove("hidden");
            return;
        }

        if (empty) empty.classList.add("hidden");

        data.forEach((b) => {
            const li = document.createElement("li");
            li.className = "list-card";
            const status = b.paymentStatus || "pending";
            
            // Status badge with appropriate color
            const statusColors = {
                paid: "#15803d",
                pending: "#d97706",
                partial: "#0369a1",
                cancelled: "#dc2626",
                draft: "#6b7280",
                refunded: "#7c3aed"
            };
            const statusColor = statusColors[status] || "#6b7280";
            const statusBadge = `<span class="status-badge" style="background:${statusColor}20;color:${statusColor}">${status.toUpperCase()}</span>`;
            
            // Payment info
            let paymentInfo = "";
            if (status === "paid") {
                paymentInfo = `<span style="color:#15803d;font-weight:600">Paid: ₹${b.amountPaid}</span>`;
            } else if (status === "partial") {
                paymentInfo = `<span style="color:#0369a1">Paid: ₹${b.amountPaid} · Due: ₹${b.balanceDue}</span>`;
            } else if (status === "cancelled") {
                paymentInfo = `<span style="color:#dc2626">Cancelled</span>`;
            } else {
                paymentInfo = `<span style="color:#d97706">Due: ₹${b.balanceDue || b.totalAmount}</span>`;
            }

            // Action buttons based on status
            let actions = `<button type="button" class="btn-secondary btn-compact" onclick="downloadReceiptPdf('${b._id}')">PDF</button>`;
            
            if (status === "pending" || status === "partial") {
                actions += ` <button type="button" class="btn-secondary btn-compact" onclick="recordBillPayment('${b._id}', ${b.balanceDue || 0})">Pay</button>`;
                actions += ` <button type="button" class="btn-danger btn-compact" onclick="cancelBill('${b._id}')">Cancel</button>`;
            }
            
            li.innerHTML = `
                <div class="list-card-head">
                    <div>
                        <strong>${b.patientName}</strong>
                        <div style="font-size:0.8rem;color:#64748b">${b.doctor?.name || "Unknown Doctor"}</div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="muted">
                    ${b.invoiceNumber} · Bill: ₹${b.totalAmount} · ${new Date(b.billDate).toLocaleDateString("en-IN")}
                </div>
                <div style="margin-top:0.5rem;font-size:0.85rem">${paymentInfo}</div>
                <div class="list-card-actions">${actions}</div>
            `;
            list.appendChild(li);
        });
    } catch {
        list.innerHTML = "<li class='list-card'>Error loading bills</li>";
    }
}

async function recordBillPayment(billId, balanceDue) {
    const amount = prompt(`Enter payment amount (Balance due: ₹${balanceDue}):`, balanceDue);
    if (!amount || isNaN(amount) || amount <= 0) return;
    
    const methods = ["cash", "card", "upi", "netbanking", "insurance", "wallet"];
    const method = prompt(`Payment method:\n1. Cash\n2. Card\n3. UPI\n4. Net Banking\n5. Insurance\n6. Wallet\n\nEnter number (1-6):`, "1");
    const methodMap = { "1": "cash", "2": "card", "3": "upi", "4": "netbanking", "5": "insurance", "6": "wallet" };
    
    try {
        const res = await fetch(`${API_BASE}/billing/${billId}/pay`, {
            method: "PATCH",
            headers: authHeaders(true),
            body: JSON.stringify({
                amount: parseFloat(amount),
                paymentMethod: methodMap[method] || "cash"
            })
        });
        const json = await res.json();
        if (json.success) {
            loadBills();
        } else {
            alert(errorMessage(json));
        }
    } catch {
        alert("Payment recording failed");
    }
}

async function cancelBill(billId) {
    if (!confirm("Are you sure you want to cancel this bill?")) return;
    
    try {
        const res = await fetch(`${API_BASE}/billing/${billId}/cancel`, {
            method: "PATCH",
            headers: authHeaders()
        });
        const json = await res.json();
        if (json.success) {
            loadBills();
        } else {
            alert(errorMessage(json));
        }
    } catch {
        alert("Failed to cancel bill");
    }
}

let selectedSymptoms = [];

function toggleSymptom(btn, symptom) {
    btn.classList.toggle("active");

    if (selectedSymptoms.includes(symptom)) {
        selectedSymptoms = selectedSymptoms.filter((s) => s !== symptom);
    } else {
        selectedSymptoms.push(symptom);
    }
}

function renderOfflineTriage(severity, box) {
    let risk = "Low Risk";
    let advice = "Monitor condition";

    if (severity === "High" || selectedSymptoms.includes("chest pain")) {
        risk = "High Risk";
        advice = "Seek immediate care";
    } else if (severity === "Medium") {
        risk = "Moderate Risk";
        advice = "Consult doctor";
    }

    box.innerHTML = `
        <div class="ai-card">
            <h3>Offline result</h3>
            <p class="muted">Server unreachable — showing local fallback only.</p>
            <p><b>Symptoms:</b> ${selectedSymptoms.join(", ")}</p>
            <p><b>Risk:</b> ${risk}</p>
            <p><b>Advice:</b> ${advice}</p>
        </div>
    `;
}

async function loadTriageHistory() {
    const list = document.getElementById("triageHistory");
    const noHistory = document.getElementById("noHistory");
    if (!list) return;

    try {
        const res = await fetch(`${API_BASE}/triage/history?limit=10`, {
            headers: authHeaders()
        });
        const json = await res.json();
        const payload = getPayload(json);
        const cases = payload.cases || [];
        list.innerHTML = "";
        
        if (!cases.length) {
            if (noHistory) noHistory.style.display = "block";
            return;
        }
        
        if (noHistory) noHistory.style.display = "none";
        
        cases.forEach((c) => {
            const li = document.createElement("li");
            li.className = "list-card";
            
            // Urgency badge with color
            const urgencyColors = {
                emergency: "#dc2626",
                same_day: "#d97706",
                routine: "#16a34a"
            };
            const urgencyColor = urgencyColors[c.urgency] || "#6b7280";
            const urgencyLabel = c.urgency ? c.urgency.replace("_", " ").toUpperCase() : "UNKNOWN";
            
            // Doctor recommendations summary
            let doctorsText = "";
            if (c.recommendedDoctors && c.recommendedDoctors.length > 0) {
                doctorsText = `<div style="margin-top: 0.5rem; font-size: 0.8rem; color: #0d9488;">
                    👨‍⚕️ ${c.recommendedDoctors.slice(0, 2).map(d => d.name).join(", ")}
                </div>`;
            }
            
            // Possible conditions
            let conditionsText = "";
            if (c.possibleConditions && c.possibleConditions.length > 0) {
                conditionsText = `<div style="margin-top: 0.5rem;">
                    ${c.possibleConditions.slice(0, 3).map(cond => 
                        `<span style="background: #dbeafe; color: #1e40af; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.75rem; margin-right: 0.25rem;">${cond}</span>`
                    ).join("")}
                </div>`;
            }
            
            // Emergency indicator
            const emergencyIndicator = c.isEmergency ? `<span style="color: #dc2626; font-weight: 600;">🚨 EMERGENCY</span>` : "";
            
            li.innerHTML = `
                <div class="list-card-head">
                    <div>
                        <strong>${(c.symptoms || []).slice(0, 3).join(", ")}${(c.symptoms || []).length > 3 ? "..." : ""}</strong>
                        ${emergencyIndicator}
                    </div>
                    <span class="status-badge" style="background: ${urgencyColor}20; color: ${urgencyColor};">${urgencyLabel}</span>
                </div>
                <div class="muted small">${new Date(c.createdAt).toLocaleString()} · AI Confidence: ${(c.confidence * 100).toFixed(0)}%</div>
                ${c.suggestedDepartment ? `<div style="font-size: 0.8rem; color: #64748b; margin-top: 0.25rem;">Department: ${c.suggestedDepartment}</div>` : ""}
                ${doctorsText}
                ${conditionsText}
            `;
            list.appendChild(li);
        });
    } catch {
        list.innerHTML = "<li class='list-card'>Could not load history</li>";
    }
}

async function loadStaffAnalytics() {
    const el = document.getElementById("analyticsPanel");
    if (!el) return;

    try {
        const res = await fetch(`${API_BASE}/analytics/summary`, {
            headers: authHeaders()
        });
        const json = await res.json();
        if (!json.success) {
            el.innerHTML = `<p class="error-text">${errorMessage(json)}</p>`;
            return;
        }
        const d = getPayload(json);
        const statusRows = (d.appointmentsByStatus || [])
            .map((x) => `<tr><td>${x._id}</td><td>${x.count}</td></tr>`)
            .join("");
        const svcRows = (d.topServices || [])
            .map((x) => `<tr><td>${x._id}</td><td>${x.count}</td></tr>`)
            .join("");
        el.innerHTML = `
            <div class="analytics-grid">
                <div class="metric-card">
                    <h4>Paid revenue (sim)</h4>
                    <p class="metric-value">₹${d.revenuePaidInr || 0}</p>
                </div>
                <div class="metric-card">
                    <h4>New appointments (7d)</h4>
                    <p class="metric-value">${d.appointmentsCreatedLast7Days ?? 0}</p>
                </div>
            </div>
            <h4 class="table-title">Appointments by status</h4>
            <table class="data-table"><thead><tr><th>Status</th><th>Count</th></tr></thead><tbody>${statusRows || "<tr><td colspan='2'>No data</td></tr>"}</tbody></table>
            <h4 class="table-title">Top services billed</h4>
            <table class="data-table"><thead><tr><th>Service</th><th>Count</th></tr></thead><tbody>${svcRows || "<tr><td colspan='2'>No data</td></tr>"}</tbody></table>
        `;
    } catch {
        el.innerHTML = "<p class='error-text'>Could not load analytics</p>";
    }
}

async function runAI() {
    const severity = document.getElementById("severity").value;
    const box = document.getElementById("aiResultBox");

    if (!severity || selectedSymptoms.length === 0) {
        box.innerHTML = "<p class='error-text'>Select inputs</p>";
        return;
    }

    box.innerHTML = "<p>Analyzing…</p>";

    try {
        const res = await fetch(`${API_BASE}/triage`, {
            method: "POST",
            headers: authHeaders(true),
            body: JSON.stringify({
                symptoms: selectedSymptoms,
                severity
            })
        });

        const json = await res.json();

        if (json.success) {
            const d = getPayload(json);
            const confPct = (d.confidence * 100).toFixed(0);
            box.innerHTML = `
                <div class="ai-card">
                    <h3>Triage assessment (simulation)</h3>
                    <p><b>Urgency tier:</b> ${d.urgency.replace(/_/g, " ")}</p>
                    <p><b>Model confidence:</b> ${confPct}% (non-clinical heuristic)</p>
                    <p><b>Recommendation:</b> ${d.recommendation}</p>
                    <p class="disclaimer">${d.disclaimer}</p>
                </div>
            `;
            await loadTriageHistory();
        } else {
            box.innerHTML = `<p class='error-text'>${errorMessage(json)}</p>`;
        }
    } catch {
        renderOfflineTriage(severity, box);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            login();
        });
    }

    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            register();
        });
    }

    setupRoleNav();
    applyPreselectedDoctor();

    const path = window.location.pathname;
    if (
        path.includes("dashboard") ||
        path.includes("appointment") ||
        path.includes("billing") ||
        path.includes("ai") ||
        path.includes("doctors") ||
        path.includes("staff")
    ) {
        checkAuth();
        if (path.includes("staff") && getUser().role !== "staff") {
            window.location.href = "dashboard.html";
            return;
        }
        loadAppointments();
        loadBills();
        if (path.includes("staff")) {
            loadStaffAnalytics();
        }
        if (path.includes("ai")) {
            loadTriageHistory();
        }
    }
});
