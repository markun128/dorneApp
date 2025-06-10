class TestApp {
    constructor() {
        this.data = [];
        this.form = document.getElementById('dataForm');
        this.dataList = document.getElementById('dataList');
        this.nameInput = document.getElementById('name');
        this.emailInput = document.getElementById('email');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.loadData();
        this.renderData();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        const name = this.nameInput.value.trim();
        const email = this.emailInput.value.trim();
        
        if (name && email) {
            this.addData(name, email);
            this.clearForm();
        }
    }
    
    addData(name, email) {
        const newItem = {
            id: Date.now(),
            name: name,
            email: email,
            timestamp: new Date().toLocaleString('ja-JP')
        };
        
        this.data.push(newItem);
        this.saveData();
        this.renderData();
    }
    
    clearForm() {
        this.nameInput.value = '';
        this.emailInput.value = '';
        this.nameInput.focus();
    }
    
    renderData() {
        if (this.data.length === 0) {
            this.dataList.innerHTML = '<div class="empty-message">データがありません</div>';
            return;
        }
        
        const html = this.data.map(item => `
            <div class="data-item">
                <strong>名前:</strong> ${this.escapeHtml(item.name)}<br>
                <strong>メール:</strong> ${this.escapeHtml(item.email)}<br>
                <strong>登録日時:</strong> ${item.timestamp}
            </div>
        `).join('');
        
        this.dataList.innerHTML = html;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    saveData() {
        try {
            localStorage.setItem('testAppData', JSON.stringify(this.data));
        } catch (error) {
            console.error('データの保存に失敗しました:', error);
        }
    }
    
    loadData() {
        try {
            const saved = localStorage.getItem('testAppData');
            if (saved) {
                this.data = JSON.parse(saved);
            }
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            this.data = [];
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TestApp();
});