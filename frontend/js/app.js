// ==============================================
// Horse Racing Database - Admin Portal (Frontend Logic)
// Purpose: Handles tab navigation, form validation, and API calls for races, owners, horses, and trainers.
// ==============================================

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ==============================================
// CONFIGURATION
// API Base URL
const API_URL = 'http://localhost:3000/api';
// ==============================================
// STATE MANAGEMENT
class AppState {
    constructor() {
        this.currentTab = 'add-race';
        this.resultCount = 1;
    }
    static getInstance() {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }
    getCurrentTab() {
        return this.currentTab;
    }
    setCurrentTab(tab) {
        this.currentTab = tab;
    }
    getResultCount() {
        return this.resultCount;
    }
    incrementResultCount() {
        this.resultCount++;
    }
    decrementResultCount() {
        if (this.resultCount > 1) {
            this.resultCount--;
        }
    }
    resetResultCount() {
        this.resultCount = 1;
    }
}
// ==============================================
// UTILITIES
class Utils {
    static showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type} show`;
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    static formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }
    static validateForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;
        inputs.forEach((input) => {
            const htmlInput = input;
            if (!htmlInput.value.trim()) {
                htmlInput.style.borderColor = 'var(--danger-color)';
                isValid = false;
            }
            else {
                htmlInput.style.borderColor = 'var(--border-color)';
            }
        });
        return isValid;
    }
    static clearForm(form) {
        form.reset();
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach((input) => {
            const htmlInput = input;
            htmlInput.style.borderColor = 'var(--border-color)';
        });
    }
}
// ==============================================
// TABS: Navigation and Content Switching
class TabManager {
    constructor() {
        this.state = AppState.getInstance();
        this.initializeTabs();
    }
    initializeTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                if (tabId) {
                    this.switchTab(tabId);
                }
            });
        });
    }
    switchTab(tabId) {
        var _a, _b;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        (_a = document.querySelector(`[data-tab="${tabId}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        (_b = document.getElementById(tabId)) === null || _b === void 0 ? void 0 : _b.classList.add('active');
        this.state.setCurrentTab(tabId);
    }
}
// ==============================================
// RACES: Create race and manage dynamic result entries
class RaceManager {
    constructor() {
        this.state = AppState.getInstance();
        this.form = document.getElementById('addRaceForm');
        this.resultsContainer = document.getElementById('resultsContainer');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        const addResultBtn = document.getElementById('addResultBtn');
        addResultBtn === null || addResultBtn === void 0 ? void 0 : addResultBtn.addEventListener('click', () => this.addResultEntry());
    }
    addResultEntry() {
        const index = this.state.getResultCount();
        this.state.incrementResultCount();
        const resultEntry = document.createElement('div');
        resultEntry.className = 'result-entry';
        resultEntry.setAttribute('data-index', index.toString());
        resultEntry.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label>Horse ID *</label>
                    <input type="text" name="horseId[]" required placeholder="e.g., horse1">
                </div>
                <div class="form-group">
                    <label>Result *</label>
                    <select name="result[]" required>
                        <option value="">Select Result</option>
                        <option value="first">First</option>
                        <option value="second">Second</option>
                        <option value="third">Third</option>
                        <option value="fourth">Fourth</option>
                        <option value="fifth">Fifth</option>
                        <option value="last">Last</option>
                        <option value="no show">No Show</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Prize Money</label>
                    <input type="number" name="prize[]" step="0.01" min="0" placeholder="0.00">
                </div>
                <div class="form-group">
                    <button type="button" class="btn-remove" onclick="removeResult(${index})">Remove</button>
                </div>
            </div>
        `;
        this.resultsContainer.appendChild(resultEntry);
    }
    removeResultEntry(index) {
        const entry = document.querySelector(`[data-index="${index}"]`);
        if (entry && this.resultsContainer.children.length > 1) {
            entry.remove();
            this.state.decrementResultCount();
        }
        else {
            Utils.showToast('At least one result entry is required', 'warning');
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        if (!Utils.validateForm(this.form)) {
            Utils.showToast('Please fill in all required fields', 'error');
            return;
        }
        const formData = new FormData(this.form);
        const race = {
            raceId: formData.get('raceId'),
            raceName: formData.get('raceName'),
            trackName: formData.get('trackName'),
            raceDate: formData.get('raceDate'),
            raceTime: formData.get('raceTime')
        };
        const horseIds = formData.getAll('horseId[]');
        const results = formData.getAll('result[]');
        const prizes = formData.getAll('prize[]');
        const raceResults = horseIds.map((horseId, index) => ({
            horseId,
            result: results[index],
            prize: parseFloat(prizes[index]) || 0
        }));
        this.addRaceToDatabase(race, raceResults);
    }
    addRaceToDatabase(race, results) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${API_URL}/races`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ race, results })
                });
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to add race');
                }
                Utils.showToast('Race added successfully to database!', 'success');
                Utils.clearForm(this.form);
                this.resetResultsContainer();
            }
            catch (error) {
                console.error('Error adding race:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Failed to add race'}`, 'error');
            }
        });
    }
    resetResultsContainer() {
        this.resultsContainer.innerHTML = `
            <div class="result-entry" data-index="0">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Horse ID *</label>
                        <input type="text" name="horseId[]" required placeholder="e.g., horse1">
                    </div>
                    <div class="form-group">
                        <label>Result *</label>
                        <select name="result[]" required>
                            <option value="">Select Result</option>
                            <option value="first">First</option>
                            <option value="second">Second</option>
                            <option value="third">Third</option>
                            <option value="fourth">Fourth</option>
                            <option value="fifth">Fifth</option>
                            <option value="last">Last</option>
                            <option value="no show">No Show</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Prize Money</label>
                        <input type="number" name="prize[]" step="0.01" min="0" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <button type="button" class="btn-remove" onclick="removeResult(0)">Remove</button>
                    </div>
                </div>
            </div>
        `;
        this.state.resetResultCount();
    }
}
// ==============================================
// OWNERS: Lookup and delete owner with related records
class OwnerManager {
    constructor() {
        this.form = document.getElementById('deleteOwnerForm');
        this.searchBtn = document.getElementById('searchOwnerBtn');
        this.ownerInfo = document.getElementById('ownerInfo');
        this.ownerDetails = document.getElementById('ownerDetails');
        this.horsesTable = document.getElementById('horsesTable');
        this.cancelBtn = document.getElementById('cancelDeleteBtn');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchOwner());
        this.form.addEventListener('submit', (e) => this.handleDelete(e));
        this.cancelBtn.addEventListener('click', () => this.hideOwnerInfo());
        const ownerIdInput = document.getElementById('ownerId');
        ownerIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchOwner();
            }
        });
    }
    searchOwner() {
        return __awaiter(this, void 0, void 0, function* () {
            const ownerIdInput = document.getElementById('ownerId');
            const ownerId = ownerIdInput.value.trim();
            if (!ownerId) {
                Utils.showToast('Please enter an Owner ID', 'warning');
                return;
            }
            try {
                const response = yield fetch(`${API_URL}/owners/${ownerId}`);
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Owner not found');
                }
                this.displayOwnerInfo(data.owner, data.horses);
                Utils.showToast('Owner found successfully', 'success');
            }
            catch (error) {
                console.error('Error searching owner:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Owner not found'}`, 'error');
                this.hideOwnerInfo();
            }
        });
    }
    displayOwnerInfo(owner, horses) {
        this.ownerDetails.innerHTML = `
            <div class="info-row">
                <span class="info-label">Owner ID:</span>
                <span class="info-value"><strong>${owner.ownerId}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">First Name:</span>
                <span class="info-value">${owner.fname || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Last Name:</span>
                <span class="info-value">${owner.lname || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Total Horses Owned:</span>
                <span class="info-value"><strong>${horses.length}</strong></span>
            </div>
        `;
        if (horses && horses.length > 0) {
            const genderMap = {
                'F': 'Filly', 'C': 'Colt', 'M': 'Mare', 'S': 'Stallion', 'G': 'Gelding'
            };
            const horsesHtml = horses.map(horse => `
                <tr>
                    <td>${horse.horseId}</td>
                    <td><strong>${horse.horseName}</strong></td>
                    <td>${horse.age} yrs</td>
                    <td>${genderMap[horse.gender] || horse.gender}</td>
                    <td>${horse.stableName}</td>
                    <td>${horse.location}</td>
                </tr>
            `).join('');
            this.horsesTable.innerHTML = `
                <table class="horses-table">
                    <thead>
                        <tr>
                            <th>Horse ID</th>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Type</th>
                            <th>Stable</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${horsesHtml}
                    </tbody>
                </table>
            `;
        }
        else {
            this.horsesTable.innerHTML = `<div class="no-horses">No horses owned by this owner.</div>`;
        }
        this.ownerInfo.style.display = 'block';
        this.ownerInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    hideOwnerInfo() {
        this.ownerInfo.style.display = 'none';
    }
    handleDelete(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            const ownerIdInput = document.getElementById('ownerId');
            const ownerId = ownerIdInput.value.trim();
            const confirmed = confirm(`⚠️ WARNING: Are you absolutely sure you want to delete owner "${ownerId}" and ALL related information?\n\nThis will:\n• Delete the owner record\n• Delete all ownership relationships\n• This action CANNOT be undone!\n\nClick OK to confirm deletion.`);
            if (!confirmed)
                return;
            try {
                const response = yield fetch(`${API_URL}/owners/${ownerId}`, {
                    method: 'DELETE'
                });
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to delete owner');
                }
                Utils.showToast(`Owner "${ownerId}" and all related information deleted successfully!`, 'success');
                this.ownerInfo.style.display = 'none';
                ownerIdInput.value = '';
            }
            catch (error) {
                console.error('Error deleting owner:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Failed to delete owner'}`, 'error');
            }
        });
    }
}
// ==============================================
// HORSES: Lookup and move horse between stables
class HorseManager {
    constructor() {
        this.currentHorse = null;
        this.stableNames = {
            'stable1': '🏇 Zobair Farm - Riyadh (Orange)',
            'stable2': '🏇 Zayed Farm - Dubai (Kiwi)',
            'stable3': '🏇 Zahra Farm - Jeddah (Cinnamon)',
            'stable4': '🏇 Sunny Stables - Jubail (Lemon)',
            'stable5': '🏇 Ajman Stables - Ajman (Lemon)',
            'stable6': '🏇 Dubai Stables - Dubai (Bright Blue)'
        };
        this.form = document.getElementById('moveHorseForm');
        this.searchBtn = document.getElementById('searchHorseBtn');
        this.horseInfo = document.getElementById('horseInfo');
        this.horseDetails = document.getElementById('horseDetails');
        this.movePreview = document.getElementById('movePreview');
        this.cancelBtn = document.getElementById('cancelMoveBtn');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.searchHorse());
        this.form.addEventListener('submit', (e) => this.handleMove(e));
        this.cancelBtn.addEventListener('click', () => this.hideHorseInfo());
        const stableSelect = document.getElementById('newStableId');
        stableSelect.addEventListener('change', () => this.showMovePreview());
        const horseIdInput = document.getElementById('moveHorseId');
        horseIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.searchHorse();
            }
        });
    }
    searchHorse() {
        return __awaiter(this, void 0, void 0, function* () {
            const horseIdInput = document.getElementById('moveHorseId');
            const horseId = horseIdInput.value.trim();
            if (!horseId) {
                Utils.showToast('Please enter a Horse ID', 'warning');
                return;
            }
            try {
                const response = yield fetch(`${API_URL}/horses/${horseId}`);
                const horse = yield response.json();
                if (!response.ok) {
                    throw new Error(horse.error || 'Horse not found');
                }
                this.currentHorse = horse;
                this.displayHorseInfo(horse);
                Utils.showToast('Horse found successfully', 'success');
            }
            catch (error) {
                console.error('Error searching horse:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Horse not found'}`, 'error');
                this.hideHorseInfo();
            }
        });
    }
    displayHorseInfo(horse) {
        const genderMap = {
            'F': 'Filly (young female)',
            'C': 'Colt (young male)',
            'M': 'Mare (older female)',
            'S': 'Stallion (older male)',
            'G': 'Gelding (older neutered male)'
        };
        this.horseDetails.innerHTML = `
            <div class="info-row">
                <span class="info-label">Horse ID:</span>
                <span class="info-value"><strong>${horse.horseId}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Name:</span>
                <span class="info-value"><strong>${horse.horseName}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Age:</span>
                <span class="info-value">${horse.age} years old</span>
            </div>
            <div class="info-row">
                <span class="info-label">Gender:</span>
                <span class="info-value">${genderMap[horse.gender] || horse.gender}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Registration:</span>
                <span class="info-value">#${horse.registration}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Current Stable:</span>
                <span class="info-value"><strong>${horse.stableName || horse.stableId}</strong></span>
            </div>
            <div class="info-row">
                <span class="info-label">Location:</span>
                <span class="info-value">${horse.location || 'N/A'}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Stable Colors:</span>
                <span class="info-value">${horse.colors || 'N/A'}</span>
            </div>
        `;
        this.horseInfo.style.display = 'block';
        this.movePreview.style.display = 'none';
        const stableSelect = document.getElementById('newStableId');
        stableSelect.value = '';
        this.horseInfo.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    showMovePreview() {
        if (!this.currentHorse)
            return;
        const stableSelect = document.getElementById('newStableId');
        const newStableId = stableSelect.value;
        if (!newStableId) {
            this.movePreview.style.display = 'none';
            return;
        }
        if (newStableId === this.currentHorse.stableId) {
            Utils.showToast('Horse is already in this stable!', 'warning');
            stableSelect.value = '';
            this.movePreview.style.display = 'none';
            return;
        }
        const fromStable = document.getElementById('fromStable');
        const toStable = document.getElementById('toStable');
        fromStable.textContent = this.stableNames[this.currentHorse.stableId] || this.currentHorse.stableId;
        toStable.textContent = this.stableNames[newStableId] || newStableId;
        this.movePreview.style.display = 'block';
    }
    hideHorseInfo() {
        this.horseInfo.style.display = 'none';
        this.movePreview.style.display = 'none';
        this.currentHorse = null;
        const horseIdInput = document.getElementById('moveHorseId');
        const stableSelect = document.getElementById('newStableId');
        horseIdInput.value = '';
        stableSelect.value = '';
    }
    handleMove(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (!this.currentHorse) {
                Utils.showToast('Please search for a horse first', 'warning');
                return;
            }
            const newStableSelect = document.getElementById('newStableId');
            const newStableId = newStableSelect.value;
            if (!newStableId) {
                Utils.showToast('Please select a new stable', 'warning');
                return;
            }
            if (newStableId === this.currentHorse.stableId) {
                Utils.showToast('Horse is already in this stable', 'warning');
                return;
            }
            const fromStableName = this.stableNames[this.currentHorse.stableId] || this.currentHorse.stableId;
            const toStableName = this.stableNames[newStableId] || newStableId;
            const confirmed = confirm(`Confirm horse transfer:\n\n` +
                `Horse: ${this.currentHorse.horseName} (${this.currentHorse.horseId})\n` +
                `From: ${fromStableName}\n` +
                `To: ${toStableName}\n\n` +
                `Proceed with transfer?`);
            if (!confirmed)
                return;
            try {
                const response = yield fetch(`${API_URL}/horses/${this.currentHorse.horseId}/stable`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newStableId })
                });
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to move horse');
                }
                Utils.showToast(`${this.currentHorse.horseName} successfully moved to new stable!`, 'success');
                this.hideHorseInfo();
            }
            catch (error) {
                console.error('Error moving horse:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Failed to move horse'}`, 'error');
            }
        });
    }
}
// ==============================================
// TRAINERS: Approve and add new trainer to a stable
class TrainerManager {
    constructor() {
        this.stableDetails = {
            'stable1': { name: 'Zobair Farm', location: 'Riyadh', colors: 'Orange', trainers: 2, horses: 7 },
            'stable2': { name: 'Zayed Farm', location: 'Dubai', colors: 'Kiwi', trainers: 1, horses: 5 },
            'stable3': { name: 'Zahra Farm', location: 'Jeddah', colors: 'Cinnamon', trainers: 2, horses: 4 },
            'stable4': { name: 'Sunny Stables', location: 'Jubail', colors: 'Lemon', trainers: 1, horses: 3 },
            'stable5': { name: 'Ajman Stables', location: 'Ajman', colors: 'Lemon', trainers: 1, horses: 0 },
            'stable6': { name: 'Dubai Stables', location: 'Dubai', colors: 'Bright Blue', trainers: 2, horses: 4 }
        };
        this.form = document.getElementById('approveTrainerForm');
        this.trainerPreview = document.getElementById('trainerPreview');
        this.stableInfo = document.getElementById('stableInfo');
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleApprove(e));
        this.form.addEventListener('reset', () => this.hidePreview());
        const trainerIdInput = document.getElementById('trainerId');
        const fnameInput = document.getElementById('trainerFname');
        const lnameInput = document.getElementById('trainerLname');
        const stableSelect = document.getElementById('trainerStableId');
        trainerIdInput.addEventListener('input', () => this.updatePreview());
        fnameInput.addEventListener('input', () => this.updatePreview());
        lnameInput.addEventListener('input', () => this.updatePreview());
        stableSelect.addEventListener('change', () => {
            this.updatePreview();
            this.showStableInfo();
        });
    }
    updatePreview() {
        const trainerId = document.getElementById('trainerId').value.trim();
        const fname = document.getElementById('trainerFname').value.trim();
        const lname = document.getElementById('trainerLname').value.trim();
        const stableId = document.getElementById('trainerStableId').value;
        if (!trainerId && !fname && !lname && !stableId) {
            this.trainerPreview.style.display = 'none';
            return;
        }
        const previewTrainerId = document.getElementById('previewTrainerId');
        const previewTrainerName = document.getElementById('previewTrainerName');
        const previewStable = document.getElementById('previewStable');
        previewTrainerId.textContent = trainerId || '-';
        previewTrainerName.textContent = (fname && lname) ? `${fname} ${lname}` : (fname || lname || '-');
        if (stableId && this.stableDetails[stableId]) {
            const stable = this.stableDetails[stableId];
            previewStable.textContent = `${stable.name} (${stable.location})`;
        }
        else {
            previewStable.textContent = stableId || '-';
        }
        this.trainerPreview.style.display = 'block';
    }
    showStableInfo() {
        const stableSelect = document.getElementById('trainerStableId');
        const stableId = stableSelect.value;
        if (!stableId || !this.stableDetails[stableId]) {
            this.stableInfo.style.display = 'none';
            return;
        }
        const stable = this.stableDetails[stableId];
        const stableDetailsDiv = document.getElementById('stableDetails');
        stableDetailsDiv.innerHTML = `
            <div class="details-card">
                <div class="info-row">
                    <span class="info-label">Stable Name:</span>
                    <span class="info-value"><strong>${stable.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Location:</span>
                    <span class="info-value">${stable.location}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Racing Colors:</span>
                    <span class="info-value">${stable.colors}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Current Trainers:</span>
                    <span class="info-value">${stable.trainers} trainer(s)</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Horses in Stable:</span>
                    <span class="info-value">${stable.horses} horse(s)</span>
                </div>
            </div>
        `;
        this.stableInfo.style.display = 'block';
    }
    hidePreview() {
        this.trainerPreview.style.display = 'none';
        this.stableInfo.style.display = 'none';
    }
    handleApprove(event) {
        return __awaiter(this, void 0, void 0, function* () {
            event.preventDefault();
            if (!Utils.validateForm(this.form)) {
                Utils.showToast('Please fill in all required fields', 'error');
                return;
            }
            const formData = new FormData(this.form);
            const trainer = {
                trainerId: formData.get('trainerId'),
                fname: formData.get('trainerFname'),
                lname: formData.get('trainerLname'),
                stableId: formData.get('trainerStableId')
            };
            const stableInfo = this.stableDetails[trainer.stableId];
            const stableName = stableInfo ? stableInfo.name : trainer.stableId;
            const confirmed = confirm(`Approve new trainer?\n\n` +
                `Trainer ID: ${trainer.trainerId}\n` +
                `Name: ${trainer.fname} ${trainer.lname}\n` +
                `Stable: ${stableName}\n\n` +
                `Click OK to add this trainer to the system.`);
            if (!confirmed)
                return;
            try {
                const response = yield fetch(`${API_URL}/trainers`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(trainer)
                });
                const data = yield response.json();
                if (!response.ok) {
                    throw new Error(data.error || 'Failed to add trainer');
                }
                // Update trainer count for the stable
                if (this.stableDetails[trainer.stableId]) {
                    this.stableDetails[trainer.stableId].trainers++;
                    // Refresh the stable info display if it's visible
                    const stableSelect = document.getElementById('trainerStableId');
                    if (stableSelect.value === trainer.stableId) {
                        this.showStableInfo();
                    }
                }
                Utils.showToast(`Trainer ${trainer.fname} ${trainer.lname} approved successfully!`, 'success');
                Utils.clearForm(this.form);
                this.hidePreview();
            }
            catch (error) {
                console.error('Error approving trainer:', error);
                Utils.showToast(`Error: ${error instanceof Error ? error.message : 'Failed to add trainer'}`, 'error');
            }
        });
    }
}
// ==============================================
// GLOBAL UTIL: remove result entry (referenced in inline onclick)
function removeResult(index) {
    const raceManager = window.raceManager;
    if (raceManager) {
        raceManager.removeResultEntry(index);
    }
}
// ==============================================
// APP INIT
document.addEventListener('DOMContentLoaded', () => {
    console.log('Horse Racing Database System - Admin Portal Initialized (MySQL Connected)');
    new TabManager();
    const raceManager = new RaceManager();
    new OwnerManager();
    new HorseManager();
    new TrainerManager();
    window.raceManager = raceManager;
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            Utils.showToast('Logging out...', 'success');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        }
    });
});