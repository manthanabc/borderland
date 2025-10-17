export class ImGui {
    constructor() {
        this.panel = null;
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.controls = {};
        this.callbacks = {};
        
        this.init();
    }
    
    init() {
        // Create panel
        this.panel = document.createElement('div');
        this.panel.className = 'imgui-panel';
        document.body.appendChild(this.panel);
        
        // Start FPS counter
        this.updateFPS();
    }
    
    updateFPS() {
        this.frameCount++;
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        
        if (delta >= 1000) {
            this.fps = Math.round((this.frameCount * 1000) / delta);
            this.frameCount = 0;
            this.lastTime = currentTime;
            this.updateFPSDisplay();
        }
        
        requestAnimationFrame(() => this.updateFPS());
    }
    
    updateFPSDisplay() {
        const fpsElement = document.getElementById('imgui-fps-value');
        if (fpsElement) {
            fpsElement.textContent = this.fps;
            
            // Update color based on FPS
            fpsElement.className = 'imgui-stat-value';
            if (this.fps >= 30) {
                fpsElement.classList.add('fps-good');
            } else if (this.fps >= 15) {
                fpsElement.classList.add('fps-medium');
            } else {
                fpsElement.classList.add('fps-bad');
            }
        }
    }
    
    begin(title) {
        this.panel.innerHTML = `<div class="imgui-header">${title}</div>`;
    }
    
    text(label) {
        const div = document.createElement('div');
        div.className = 'imgui-row';
        div.textContent = label;
        this.panel.appendChild(div);
    }
    
    stats(items) {
        const statsDiv = document.createElement('div');
        statsDiv.className = 'imgui-stats';
        
        items.forEach(item => {
            const statItem = document.createElement('div');
            statItem.className = 'imgui-stat-item';
            statItem.innerHTML = `
                <div class="imgui-stat-label">${item.label}</div>
                <div class="imgui-stat-value" id="${item.id}">${item.value}</div>
            `;
            statsDiv.appendChild(statItem);
        });
        
        this.panel.appendChild(statsDiv);
    }
    
    separator(title = null) {
        const section = document.createElement('div');
        section.className = 'imgui-section';
        if (title) {
            section.innerHTML = `<div class="imgui-section-title">${title}</div>`;
        }
        this.panel.appendChild(section);
        return section;
    }
    
    slider(label, id, value, min, max, step, callback) {
        const row = document.createElement('div');
        row.className = 'imgui-row';
        
        const labelDiv = document.createElement('label');
        labelDiv.className = 'imgui-label';
        labelDiv.innerHTML = `${label} <span class="imgui-value" id="${id}-value">${value.toFixed(2)}</span>`;
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'imgui-slider';
        slider.id = id;
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            document.getElementById(`${id}-value`).textContent = val.toFixed(2);
            if (callback) callback(val);
        });
        
        row.appendChild(labelDiv);
        row.appendChild(slider);
        this.panel.appendChild(row);
        
        this.controls[id] = slider;
        return slider;
    }
    
    checkbox(label, id, checked, callback) {
        const row = document.createElement('div');
        row.className = 'imgui-row';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'imgui-checkbox';
        checkbox.id = id;
        checkbox.checked = checked;
        
        const checkboxLabel = document.createElement('label');
        checkboxLabel.className = 'imgui-checkbox-label';
        checkboxLabel.htmlFor = id;
        checkboxLabel.textContent = label;
        
        checkbox.addEventListener('change', (e) => {
            if (callback) callback(e.target.checked);
        });
        
        row.appendChild(checkbox);
        row.appendChild(checkboxLabel);
        this.panel.appendChild(row);
        
        this.controls[id] = checkbox;
        return checkbox;
    }
    
    select(label, id, options, selected, callback) {
        const row = document.createElement('div');
        row.className = 'imgui-row';
        
        const labelDiv = document.createElement('label');
        labelDiv.className = 'imgui-label';
        labelDiv.textContent = label;
        
        const select = document.createElement('select');
        select.className = 'imgui-select';
        select.id = id;
        
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (opt.value === selected) {
                option.selected = true;
            }
            select.appendChild(option);
        });
        
        select.addEventListener('change', (e) => {
            if (callback) callback(e.target.value);
        });
        
        row.appendChild(labelDiv);
        row.appendChild(select);
        this.panel.appendChild(row);
        
        this.controls[id] = select;
        return select;
    }
    
    button(label, callback) {
        const button = document.createElement('button');
        button.className = 'imgui-button';
        button.textContent = label;
        
        button.addEventListener('click', callback);
        
        this.panel.appendChild(button);
        return button;
    }
    
    getValue(id) {
        const control = this.controls[id];
        if (!control) return null;
        
        if (control.type === 'checkbox') {
            return control.checked;
        } else if (control.type === 'range') {
            return parseFloat(control.value);
        } else {
            return control.value;
        }
    }
    
    setValue(id, value) {
        const control = this.controls[id];
        if (!control) return;
        
        if (control.type === 'checkbox') {
            control.checked = value;
        } else if (control.type === 'range') {
            control.value = value;
            const valueDisplay = document.getElementById(`${id}-value`);
            if (valueDisplay) {
                valueDisplay.textContent = parseFloat(value).toFixed(2);
            }
        } else {
            control.value = value;
        }
    }
    
    updateStat(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    end() {
        // Finalize the panel rendering
    }
}
