document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL STATE ---
    let servicesData = [];
    let allDestinations = [];

    // --- DOM ELEMENTS ---
    const dom = {
        calcTabUnpaid: document.getElementById('calc-tab-unpaid'),
        calcTabPaid: document.getElementById('calc-tab-paid'),
        calcContentUnpaid: document.getElementById('calc-content-unpaid'),
        calcContentPaid: document.getElementById('calc-content-paid'),
        formUnpaid: document.getElementById('form-unpaid'),
        formPaid: document.getElementById('form-paid'),
        regionUnpaid: document.getElementById('region-unpaid'),
        regionPaid: document.getElementById('region-paid'),
        destContainerUnpaid: document.getElementById('dest-container-unpaid'),
        destContainerPaid: document.getElementById('dest-container-paid'),
        destUnpaid: document.getElementById('destination-unpaid'),
        destPaid: document.getElementById('destination-paid'),
        resultUnpaidDiv: document.getElementById('result-unpaid'),
        resultPaidDiv: document.getElementById('result-paid'),
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        // Volumetric elements
        toggleDimsUnpaid: document.getElementById('toggle-dims-unpaid'),
        dimsContainerUnpaid: document.getElementById('dims-container-unpaid'),
        toggleDimsPaid: document.getElementById('toggle-dims-paid'),
        dimsContainerPaid: document.getElementById('dims-container-paid'),
    };

    // Helper to generate a pre-filled WhatsApp booking link
    const generateWhatsAppURL = ({ destName, billableWeight, serviceName, tat, cost, isVolumetric }) => {
        const text = 
`Hello Umate Express Team,
I got an instant shipping quote on your website and would like to book a doorstep pickup:

📦 Destination: ${destName}
⚖️ Billable Weight: ${billableWeight.toFixed(2)} kg${isVolumetric ? ' (Volumetric)' : ''}
✈️ Service: ${serviceName}
⏱️ Estimated Delivery: ${tat}
💰 Estimated Total: ₹${cost.toFixed(2)}

Please confirm the booking and schedule my pickup!`;
        return `https://wa.me/919325552513?text=${encodeURIComponent(text)}`;
    };

    const getContactButtonsHTML = (whatsappURL) => `
        <div class="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center gap-2.5 sm:gap-4">
            <a href="tel:+919325552513" class="flex items-center justify-center space-x-2 w-full sm:w-auto bg-orange-500 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-md text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span>Call Now (+91 9325552513)</span>
            </a>
            <a href="${whatsappURL || 'https://wa.me/919325552513'}" target="_blank" class="flex items-center justify-center space-x-2 w-full sm:w-auto bg-green-500 text-white font-semibold px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md text-sm sm:text-base">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.387 1.88 6.06l-1.429 5.215 5.045-1.328zM9.351 8.29c-.196-.288-.45-.447-.72-.451-.271-.004-.543.015-.794.046-.252.031-.539.11-.795.331-.255.22-.525.539-.684.87-.159.331-.318.684-.331 1.054-.013.37.063.73.222 1.074.159.344.38.685.636.99.255.304.574.636.951.99.377.354.795.684 1.238.99.525.344 1.05.623 1.636.82.585.196 1.157.294 1.733.307.576.013 1.14-.098 1.636-.344.496-.246.892-.608 1.157-.99.266-.381.447-.824.524-1.29.078-.466.063-1.012-.046-1.464-.109-.452-.331-.839-.623-1.14-.292-.302-.684-.467-1.129-.496-.445-.028-.89.046-1.29.222-.399.176-.684.451-.927.795-.242.344-.45.73-.623.99s-.331.381-.496.425c-.165.043-.344.031-.509-.046-.165-.078-.381-.222-.636-.425-.255-.203-.541-.466-.867-.795-.325-.331-.608-.719-.824-1.14a4.575 4.575 0 0 1-.585-1.413c-.046-.222-.031-.452.046-.684.078-.231.222-.425.425-.574.203-.148.425-.222.684-.234.259-.013.509.031.703.117.195.086.344.176.45.294s.195.255.255.381c.061.125.093.255.093.381v.004c-.013.125-.061.255-.132.381-.071.125-.176.222-.294.294-.118.071-.255.109-.408.109-.153 0-.3-.046-.425-.118-.125-.07-.222-.176-.294-.294-.07-.118-.109-.255-.109-.408 0-.153.046-.3.118-.425.07-.125.176-.222.294-.294.118-.071.255-.118.408-.118.153 0 .3.046.425.117s.222.176.294.294c.07.118.109.255.109.408v.016c-.013.153-.061.294-.148.425-.086.132-.203.255-.331.344-.128.09-.283.148-.45.176-.168.028-.344.016-.509-.046-.165-.062-.317-.148-.45-.266-.132-.118-.255-.255-.344-.425-.09-.171-.148-.354-.176-.541-.028-.187-.016-.37.031-.541.048-.171.125-.331.222-.48.098-.148.222-.283.361-.399.139-.118.294-.222.466-.294.171-.071.344-.118.539-.132.195-.013.381 0 .56.046.179.047.344.118.496.222.153.105.283.231.381.381.098.151.168.317.203.496.035.179.047.354.031.541-.016.187-.07.354-.148.509-.078.155-.176.294-.294.425-.118.131-.255.255-.408.344-.153.09-.317.168-.496.222-.178.054-.369.086-.56.086-.207 0-.414-.04-.61-.118-.195-.078-.37-.176-.539-.294-.17-.118-.318-.266-.45-.425-.132-.159-.237-.344-.318-.541-.08-.196-.118-.408-.118-.623 0-.222.046-.431.118-.636.072-.205.176-.381.294-.539.118-.159.255-.294.425-.408.171-.114.354-.195.541-.255.187-.061.381-.093.576-.093.207 0 .408.04.585.109.177.07.344.168.496.283.153.114.283.255.399.408.117.153.203.317.266.496.062.179.093.369.093.56v.004z"/></svg>
                <span>Book on WhatsApp</span>
            </a>
        </div>
    `;
    
    // --- UI LOGIC ---
    const ui = {
        populateRegionDropdowns: () => {
             dom.regionUnpaid.innerHTML = '<option value="">Select Destination</option>';
             dom.regionPaid.innerHTML = '<option value="">Select Destination</option>';
             const unpaidRegions = [...new Set(servicesData.filter(s => s.type === 'Duty Unpaid').map(s => s.region))];
             const paidRegions = [...new Set(servicesData.filter(s => s.type === 'Duty Paid').map(s => s.region))];
             unpaidRegions.forEach(region => dom.regionUnpaid.add(new Option(region, region)));
             paidRegions.forEach(region => dom.regionPaid.add(new Option(region, region)));
        },

        handleRegionChange: (regionSelect, destContainer, destSelect, serviceType) => {
            const selectedRegion = regionSelect.value;
            const form = regionSelect.closest('form');
            const resultDiv = serviceType === 'Duty Paid' ? dom.resultPaidDiv : dom.resultUnpaidDiv;
            const service = servicesData.find(s => s.region === selectedRegion && s.type === serviceType);

            // Handle "coming soon" destinations (e.g. UK and Europe in Duty Paid)
            if (service && service.comingSoon) {
                destContainer.classList.add('hidden');
                form.classList.replace('sm:grid-cols-4', 'sm:grid-cols-3');
                resultDiv.innerHTML = `
                    <div class="bg-amber-50 border-2 border-amber-300 rounded-xl p-5 sm:p-6 text-center shadow-md mt-6">
                        <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h4 class="text-lg font-bold text-slate-800 mb-1">Rates Updating Soon</h4>
                        <p class="text-sm sm:text-base text-slate-700 font-medium mb-4">
                            Rates for <strong>${selectedRegion} (Duty Paid)</strong> will be updated soon on website.<br class="hidden sm:inline"> Please contact <strong>+91 9325552513</strong> for rates.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-center items-center gap-3">
                            <a href="tel:+919325552513" class="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                <span>Call 9325552513</span>
                            </a>
                            <a href="https://wa.me/919325552513?text=${encodeURIComponent('Hello, I would like to inquire about Duty Paid shipping rates for ' + selectedRegion + '.')}" target="_blank" class="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow transition-all text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.387 1.88 6.06l-1.429 5.215 5.045-1.328z"/></svg>
                                <span>WhatsApp (+91 9325552513)</span>
                            </a>
                        </div>
                    </div>
                `;
                return;
            } else {
                if (resultDiv && resultDiv.innerHTML.includes('Rates Updating Soon')) {
                    resultDiv.innerHTML = '';
                }
            }

            destContainer.classList.add('hidden');
            form.classList.replace('sm:grid-cols-4', 'sm:grid-cols-3');
            const button = form.querySelector('button[type="submit"]');
            if (button) {
                button.classList.replace('sm:col-start-4', 'sm:col-start-3');
            }
        },

        setupAnimations: () => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            document.querySelectorAll('.animated-section').forEach(section => observer.observe(section));
        }
    };

    // --- AMBIENT FIREWORKS / FIRECRACKER BURSTS ---
    const initFireworks = () => {
        const canvas = document.getElementById('fireworks-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const parent = canvas.parentElement || document.getElementById('calculator');

        let width = 0;
        let height = 0;

        const updateDimensions = () => {
            const rect = canvas.getBoundingClientRect();
            const w = Math.floor(rect.width || (parent ? parent.offsetWidth : 0) || window.innerWidth || 1000);
            const h = Math.floor(rect.height || (parent ? parent.offsetHeight : 0) || 700);
            if (canvas.width !== w || canvas.height !== h) {
                canvas.width = w;
                canvas.height = h;
            }
            width = w;
            height = h;
            return { w, h };
        };

        updateDimensions();

        const particles = [];
        const colors = ['#f59e0b', '#fbbf24', '#f97316', '#ef4444', '#ffffff', '#fed7aa', '#fde047'];

        const createBurst = (x, y, count = 28) => {
            if (width <= 10 || height <= 10) updateDimensions();
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3.8 + 1.2;
                const color = colors[Math.floor(Math.random() * colors.length)];
                particles.push({
                    x: x || (width / 2),
                    y: y || (height * 0.25),
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    color,
                    alpha: 1,
                    decay: Math.random() * 0.018 + 0.012,
                    size: Math.random() * 2.2 + 1.2
                });
            }
        };

        let isVisible = true;
        let animId = null;

        const render = () => {
            if (!isVisible) return;
            if (canvas.width === 0 || canvas.height === 0 || width === 0) {
                updateDimensions();
            }
            ctx.clearRect(0, 0, width, height);

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.04; // subtle gravity
                p.vx *= 0.98; // air friction
                p.vy *= 0.98;
                p.alpha -= p.decay;

                if (p.alpha <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.shadowBlur = 6;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            animId = requestAnimationFrame(render);
        };

        // Periodic ambient bursts in the background sky
        setInterval(() => {
            if (!isVisible) return;
            updateDimensions();
            const x = Math.random() * (width * 0.8) + (width * 0.1);
            const y = Math.random() * (height * 0.35) + 60;
            createBurst(x, y, Math.floor(Math.random() * 12 + 22));
        }, 2200);

        // Initial bursts on load
        setTimeout(() => {
            updateDimensions();
            createBurst(width * 0.25, height * 0.2, 32);
            createBurst(width * 0.75, height * 0.24, 28);
        }, 250);

        setTimeout(() => {
            updateDimensions();
            createBurst(width * 0.5, height * 0.18, 30);
        }, 900);

        // Window resize support
        window.addEventListener('resize', () => {
            updateDimensions();
        });

        // Pause animation when scrolled far away to save CPU
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                    if (isVisible && !animId) {
                        render();
                    } else if (!isVisible && animId) {
                        cancelAnimationFrame(animId);
                        animId = null;
                    }
                });
            }, { threshold: 0.05 });
            observer.observe(parent || canvas);
        }

        render();

        // Celebration burst on rate calculation
        window.triggerCelebrationBurst = () => {
            updateDimensions();
            const cx = width / 2;
            const cy = height * 0.3;
            createBurst(cx - 160, cy, 32);
            createBurst(cx + 160, cy, 32);
        };
    };

    // --- CALCULATION LOGIC ---
    const logic = {
        calculateTargetCost: (target, billableWeight) => {
            let cost = 0;
            let calculationDetails = '';

            // Table-based pricing from Excel (Canada DHL/FedEx/DDP, Australia DHL/FedEx)
            if (target.table) {
                // Courier weight slab rules:
                // <= 20kg: rounded up to nearest 0.5kg (min 0.5kg)
                // > 20kg: rounded up to nearest 1.0kg
                let chargedWeight = billableWeight <= 0.5 ? 0.5 : billableWeight;
                if (chargedWeight <= 20.0) {
                    chargedWeight = Math.ceil(chargedWeight * 2) / 2;
                } else {
                    chargedWeight = Math.ceil(chargedWeight);
                }

                const tableKeys = Object.keys(target.table).map(Number).sort((a, b) => a - b);
                let matchedKey = tableKeys.find(k => k >= chargedWeight);
                if (!matchedKey) {
                    matchedKey = tableKeys[tableKeys.length - 1];
                }
                const entry = target.table[matchedKey.toString()];
                if (chargedWeight <= 5.0) {
                    cost = entry.cost;
                    calculationDetails = `Flat rate for up to ${matchedKey} kg slab.`;
                } else {
                    if (chargedWeight <= tableKeys[tableKeys.length - 1]) {
                        cost = entry.cost;
                    } else {
                        cost = entry.rate * chargedWeight;
                    }
                    calculationDetails = `₹${entry.rate.toFixed(2)}/kg × ${chargedWeight.toFixed(1)}kg.`;
                }
            } else if (target.slabs) {
                // Slabs pricing (USA FedEx, USA DHL, USA UPS)
                if (billableWeight <= 5.0) {
                    const slabKeys = Object.keys(target.slabs).map(Number).sort((a, b) => a - b);
                    const applicableSlab = slabKeys.find(s => s >= billableWeight) || 5.0;
                    cost = target.slabs[applicableSlab];
                    calculationDetails = `Flat rate for up to ${applicableSlab} kg slab.`;
                } else if (billableWeight < 6.0) {
                    // Actual weight × 6 kg per-kg rate, with minimum floor equal to 5 kg slab rate
                    const rate6 = target.rates["6"];
                    const slab5 = target.slabs["5"];
                    const rawCost = billableWeight * rate6;
                    if (rawCost < slab5) {
                        cost = slab5;
                        calculationDetails = `₹${rate6.toFixed(2)}/kg × ${billableWeight.toFixed(2)}kg (min floor ₹${slab5.toFixed(2)} for 5kg slab).`;
                    } else {
                        cost = rawCost;
                        calculationDetails = `₹${rate6.toFixed(2)}/kg × ${billableWeight.toFixed(2)}kg.`;
                    }
                } else {
                    // 6 kg and above (Per Kg rate)
                    const rateBrackets = Object.keys(target.rates).map(Number).sort((a, b) => a - b);
                    let applicableBracket = rateBrackets.filter(b => b <= billableWeight).pop();
                    if (!applicableBracket) {
                        applicableBracket = rateBrackets[0];
                    }
                    const applicableRate = target.rates[applicableBracket];
                    cost = applicableRate * billableWeight;
                    calculationDetails = `₹${applicableRate.toFixed(2)}/kg × ${billableWeight.toFixed(2)}kg.`;
                }
            } else if (target.lowWeight && billableWeight < 6) {
                // Europe low weight logic
                if (billableWeight <= 0.5) {
                    cost = target.lowWeight.base;
                    calculationDetails = `Base rate for up to 0.5kg.`;
                } else {
                    const additionalHalfKgs = Math.ceil((billableWeight - 0.5) / 0.5);
                    cost = target.lowWeight.base + (additionalHalfKgs * target.lowWeight.addl);
                    calculationDetails = `₹${target.lowWeight.base.toFixed(2)} (base) + ${additionalHalfKgs} × ₹${target.lowWeight.addl.toFixed(2)} (add'l).`;
                }
            } else if (target.rates) {
                const rateBrackets = Object.keys(target.rates).map(Number).sort((a, b) => a - b);
                let applicableBracket = rateBrackets.filter(b => b <= billableWeight).pop();
                if (!applicableBracket) {
                    applicableBracket = rateBrackets[0];
                }
                const applicableRate = target.rates[applicableBracket];
                cost = applicableRate * billableWeight;
                calculationDetails = `₹${applicableRate.toFixed(2)}/kg × ${billableWeight.toFixed(2)}kg.`;
            }

            return { cost, calculationDetails };
        },

        calculateAndDisplay: (destName, weight, resultDiv, dims, serviceType, selectedRegion) => {
            resultDiv.innerHTML = '';
            
            // Basic validation
            if (!destName || isNaN(weight) || weight <= 0) {
                resultDiv.innerHTML = `<div class="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800"><p class="font-semibold">Please select a destination and enter a valid weight (greater than 0 kg).</p></div>`;
                return;
            }

            let volumetricWeight = 0;
            if (dims.l && dims.w && dims.h) {
                volumetricWeight = (dims.l * dims.w * dims.h) / 5000;
            }
            const billableWeight = Math.max(weight, volumetricWeight);
            const isVolumetric = volumetricWeight > weight;
            const volumetricBadge = isVolumetric ? '<span class="text-xs text-orange-500 font-semibold">(Volumetric)</span>' : '';

            // Service lookup
            const regionKey = selectedRegion || destName;
            const service = servicesData.find(s => 
                (s.region === regionKey || (regionKey === 'USA (USP)' && s.region === 'USA (UPS)')) && 
                s.type === serviceType
            );

            if (!service) {
                resultDiv.innerHTML = `<div class="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800"><p class="font-semibold">Could not find rates for "${destName}".</p></div>`;
                return;
            }

            // If service is coming soon (e.g. UK / Europe in Duty Paid)
            if (service.comingSoon) {
                ui.handleRegionChange({ value: regionKey, closest: () => resultDiv.closest('form') }, { classList: { add: () => {} } }, null, serviceType);
                return;
            }

            // Comparison view (e.g., USA, Canada, Australia in Duty Unpaid: 1st FedEx Best Value, 2nd DHL Fastest)
            if (service.comparison && service.options) {
                const fedexOption = service.options.find(o => o.carrier === 'FedEx') || service.options[0];
                const dhlOption = service.options.find(o => o.carrier === 'DHL') || service.options[1];

                const fedexCalc = logic.calculateTargetCost(fedexOption, billableWeight);
                const dhlCalc = logic.calculateTargetCost(dhlOption, billableWeight);

                const fedexWhatsApp = generateWhatsAppURL({
                    destName,
                    billableWeight,
                    serviceName: `${fedexOption.name || 'FedEx Express'} (${serviceType})`,
                    tat: fedexOption.tat,
                    cost: fedexCalc.cost,
                    isVolumetric
                });

                const dhlWhatsApp = generateWhatsAppURL({
                    destName,
                    billableWeight,
                    serviceName: `${dhlOption.name || 'DHL Express'} (${serviceType})`,
                    tat: dhlOption.tat,
                    cost: dhlCalc.cost,
                    isVolumetric
                });

                resultDiv.innerHTML = `
                    <div class="mt-6 space-y-6">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 text-left gap-2">
                            <div>
                                <h3 class="text-xl font-bold text-slate-800 flex items-center gap-2">
                                    <span>Available Courier Options for ${destName}</span>
                                </h3>
                                <p class="text-xs text-slate-500">Compare delivery times, cost and choose the best option for your parcel</p>
                            </div>
                            <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 self-start sm:self-auto shadow-sm">
                                ${serviceType}
                            </span>
                        </div>

                        <!-- 1st: FedEx (Best Value) -->
                        <div class="bg-white border-2 border-emerald-300 hover:border-emerald-500 rounded-xl shadow-md hover:shadow-xl transition-all text-left overflow-hidden">
                            <div class="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-white border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center space-x-2.5">
                                    <span class="bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        🏷️ Best Value
                                    </span>
                                    <h4 class="text-lg font-bold text-slate-900">${fedexOption.name || 'FedEx Express'}</h4>
                                </div>
                                <span class="text-xs font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                                    ⏱ ${fedexOption.tat}
                                </span>
                            </div>
                            <div class="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-3 text-sm">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Destination</p>
                                            <p class="text-slate-500">${destName}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Billable Weight</p>
                                            <p class="text-slate-500">${billableWeight.toFixed(2)} kg ${volumetricBadge}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Service</p>
                                            <p class="text-slate-500">${fedexOption.service || 'FedEx Express'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Estimated Delivery</p>
                                            <p class="text-emerald-700 font-semibold">${fedexOption.tat}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-emerald-50/70 rounded-xl p-4 text-center flex flex-col justify-center border border-emerald-100">
                                    <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Most Economical</p>
                                    <p class="text-4xl md:text-5xl font-extrabold text-slate-800 my-1">₹${fedexCalc.cost.toFixed(2)}</p>
                                    <p class="text-xs text-slate-500 mb-3">${fedexCalc.calculationDetails}</p>
                                    <a href="${fedexWhatsApp}" target="_blank" class="inline-flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm shadow hover:shadow-md transform hover:scale-[1.02]">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.387 1.88 6.06l-1.429 5.215 5.045-1.328zM9.351 8.29c-.196-.288-.45-.447-.72-.451-.271-.004-.543.015-.794.046-.252.031-.539.11-.795.331-.255.22-.525.539-.684.87-.159.331-.318.684-.331 1.054-.013.37.063.73.222 1.074.159.344.38.685.636.99.255.304.574.636.951.99.377.354.795.684 1.238.99.525.344 1.05.623 1.636.82.585.196 1.157.294 1.733.307.576.013 1.14-.098 1.636-.344.496-.246.892-.608 1.157-.99.266-.381.447-.824.524-1.29.078-.466.063-1.012-.046-1.464-.109-.452-.331-.839-.623-1.14-.292-.302-.684-.467-1.129-.496-.445-.028-.89.046-1.29.222-.399.176-.684.451-.927.795-.242.344-.45.73-.623.99s-.331.381-.496.425c-.165.043-.344.031-.509-.046-.165-.078-.381-.222-.636-.425-.255-.203-.541-.466-.867-.795-.325-.331-.608-.719-.824-1.14a4.575 4.575 0 0 1-.585-1.413c-.046-.222-.031-.452.046-.684.078-.231.222-.425.425-.574.203-.148.425-.222.684-.234.259-.013.509.031.703.117.195.086.344.176.45.294s.195.255.255.381c.061.125.093.255.093.381v.004c-.013.125-.061.255-.132.381-.071.125-.176.222-.294.294-.118.071-.255.109-.408.109-.153 0-.3-.046-.425-.118-.125-.07-.222-.176-.294-.294-.07-.118-.109-.255-.109-.408 0-.153.046-.3.118-.425.07-.125.176-.222.294-.294.118-.071.255-.118.408-.118.153 0 .3.046.425.117s.222.176.294.294c.07.118.109.255.109.408v.016c-.013.153-.061.294-.148.425-.086.132-.203.255-.331.344-.128.09-.283.148-.45.176-.168.028-.344.016-.509-.046-.165-.062-.317-.148-.45-.266-.132-.118-.255-.255-.344-.425-.09-.171-.148-.354-.176-.541-.028-.187-.016-.37.031-.541.048-.171.125-.331.222-.48.098-.148.222-.283.361-.399.139-.118.294-.222.466-.294.171-.071.344-.118.539-.132.195-.013.381 0 .56.046.179.047.344.118.496.222.153.105.283.231.381.381.098.151.168.317.203.496.035.179.047.354.031.541-.016.187-.07.354-.148.509-.078.155-.176.294-.294.425-.118.131-.255.255-.408.344-.153.09-.317.168-.496.222-.178.054-.369.086-.56.086-.207 0-.414-.04-.61-.118-.195-.078-.37-.176-.539-.294-.17-.118-.318-.266-.45-.425-.132-.159-.237-.344-.318-.541-.08-.196-.118-.408-.118-.623 0-.222.046-.431.118-.636.072-.205.176-.381.294-.539.118-.159.255-.294.425-.408.171-.114.354-.195.541-.255.187-.061.381-.093.576-.093.207 0 .408.04.585.109.177.07.344.168.496.283.153.114.283.255.399.408.117.153.203.317.266.496.062.179.093.369.093.56v.004z"/></svg>
                                        <span>Book FedEx on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- 2nd: DHL (Fastest) -->
                        <div class="bg-white border-2 border-amber-300 hover:border-amber-500 rounded-xl shadow-md hover:shadow-xl transition-all text-left overflow-hidden">
                            <div class="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-white border-b border-amber-100 flex flex-wrap items-center justify-between gap-2">
                                <div class="flex items-center space-x-2.5">
                                    <span class="bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                                        ⚡ Fastest Delivery
                                    </span>
                                    <h4 class="text-lg font-bold text-slate-900">${dhlOption.name || 'DHL Express'}</h4>
                                </div>
                                <span class="text-xs font-semibold bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                                    🚀 ${dhlOption.tat} (Fast Track)
                                </span>
                            </div>
                            <div class="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-3 text-sm">
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Destination</p>
                                            <p class="text-slate-500">${destName}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Billable Weight</p>
                                            <p class="text-slate-500">${billableWeight.toFixed(2)} kg ${volumetricBadge}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Service</p>
                                            <p class="text-slate-500">${dhlOption.service || 'DHL Express'}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-start">
                                        <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        <div>
                                            <p class="font-semibold text-slate-700">Estimated Delivery</p>
                                            <p class="text-amber-700 font-semibold">${dhlOption.tat}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-amber-50/70 rounded-xl p-4 text-center flex flex-col justify-center border border-amber-100">
                                    <p class="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">Fast Track Express</p>
                                    <p class="text-4xl md:text-5xl font-extrabold text-slate-800 my-1">₹${dhlCalc.cost.toFixed(2)}</p>
                                    <p class="text-xs text-slate-500 mb-3">${dhlCalc.calculationDetails}</p>
                                    <a href="${dhlWhatsApp}" target="_blank" class="inline-flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-all text-sm shadow hover:shadow-md transform hover:scale-[1.02]">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.387 1.88 6.06l-1.429 5.215 5.045-1.328zM9.351 8.29c-.196-.288-.45-.447-.72-.451-.271-.004-.543.015-.794.046-.252.031-.539.11-.795.331-.255.22-.525.539-.684.87-.159.331-.318.684-.331 1.054-.013.37.063.73.222 1.074.159.344.38.685.636.99.255.304.574.636.951.99.377.354.795.684 1.238.99.525.344 1.05.623 1.636.82.585.196 1.157.294 1.733.307.576.013 1.14-.098 1.636-.344.496-.246.892-.608 1.157-.99.266-.381.447-.824.524-1.29.078-.466.063-1.012-.046-1.464-.109-.452-.331-.839-.623-1.14-.292-.302-.684-.467-1.129-.496-.445-.028-.89.046-1.29.222-.399.176-.684.451-.927.795-.242.344-.45.73-.623.99s-.331.381-.496.425c-.165.043-.344.031-.509-.046-.165-.078-.381-.222-.636-.425-.255-.203-.541-.466-.867-.795-.325-.331-.608-.719-.824-1.14a4.575 4.575 0 0 1-.585-1.413c-.046-.222-.031-.452.046-.684.078-.231.222-.425.425-.574.203-.148.425-.222.684-.234.259-.013.509.031.703.117.195.086.344.176.45.294s.195.255.255.381c.061.125.093.255.093.381v.004c-.013.125-.061.255-.132.381-.071.125-.176.222-.294.294-.118.071-.255.109-.408.109-.153 0-.3-.046-.425-.118-.125-.07-.222-.176-.294-.294-.07-.118-.109-.255-.109-.408 0-.153.046-.3.118-.425.07-.125.176-.222.294-.294.118-.071.255-.118.408-.118.153 0 .3.046.425.117s.222.176.294.294c.07.118.109.255.109.408v.016c-.013.153-.061.294-.148.425-.086.132-.203.255-.331.344-.128.09-.283.148-.45.176-.168.028-.344.016-.509-.046-.165-.062-.317-.148-.45-.266-.132-.118-.255-.255-.344-.425-.09-.171-.148-.354-.176-.541-.028-.187-.016-.37.031-.541.048-.171.125-.331.222-.48.098-.148.222-.283.361-.399.139-.118.294-.222.466-.294.171-.071.344-.118.539-.132.195-.013.381 0 .56.046.179.047.344.118.496.222.153.105.283.231.381.381.098.151.168.317.203.496.035.179.047.354.031.541-.016.187-.07.354-.148.509-.078.155-.176.294-.294.425-.118.131-.255.255-.408.344-.153.09-.317.168-.496.222-.178.054-.369.086-.56.086-.207 0-.414-.04-.61-.118-.195-.078-.37-.176-.539-.294-.17-.118-.318-.266-.45-.425-.132-.159-.237-.344-.318-.541-.08-.196-.118-.408-.118-.623 0-.222.046-.431.118-.636.072-.205.176-.381.294-.539.118-.159.255-.294.425-.408.171-.114.354-.195.541-.255.187-.061.381-.093.576-.093.207 0 .408.04.585.109.177.07.344.168.496.283.153.114.283.255.399.408.117.153.203.317.266.496.062.179.093.369.093.56v.004z"/></svg>
                                        <span>Book DHL on WhatsApp</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    ${getContactButtonsHTML(fedexWhatsApp)}
                `;
                return;
            }

            // Single Destination Result (USA (UPS), Canada Duty Paid, Rest of Europe, etc.)
            let destination = (service.destinations || []).find(d => d.name === destName);
            if (!destination) {
                destination = (service.destinations && service.destinations[0]) || service;
            }

            const { cost, calculationDetails } = logic.calculateTargetCost(destination, billableWeight);
            const displayServiceName = destination.service || serviceType;
            const singleWhatsApp = generateWhatsAppURL({
                destName,
                billableWeight,
                serviceName: displayServiceName,
                tat: destination.tat || '6-12 DAYS',
                cost,
                isVolumetric
            });

            resultDiv.innerHTML = `
                <div class="bg-white border border-slate-200 rounded-xl shadow-lg text-left mt-6">
                    <div class="p-4 bg-slate-50 rounded-t-xl border-b border-slate-200 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-800">Your Shipping Summary</h3>
                        <span class="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">${serviceType}</span>
                    </div>
                    <div class="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4 text-sm">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Destination</p>
                                    <p class="text-slate-500">${destName}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Billable Weight</p>
                                    <p class="text-slate-500">${billableWeight.toFixed(2)} kg ${volumetricBadge}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Service</p>
                                    <p class="text-slate-500">${displayServiceName}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Estimated Delivery</p>
                                    <p class="text-slate-500 font-semibold">${destination.tat || '6-12 DAYS'}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-100 rounded-lg p-4 text-center flex flex-col justify-center">
                            <p class="text-sm font-medium text-slate-500">Estimated Total</p>
                            <p class="text-4xl md:text-5xl font-extrabold text-slate-800 my-1">₹${cost.toFixed(2)}</p>
                            <p class="text-xs text-slate-500">${calculationDetails}</p>
                        </div>
                    </div>
                </div>
                ${getContactButtonsHTML(singleWhatsApp)}
            `;
        }
    };
    
    // --- EVENT BINDING ---
    const events = {
        bind: () => {
            const setupForm = (formId, regionSelect, destContainer, destSelect, weightInput, resultDiv, serviceType, toggleDims, dimsContainer) => {
                const form = document.getElementById(formId);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const selectedRegion = regionSelect.value;
                    const service = servicesData.find(s => s.region === selectedRegion && s.type === serviceType);
                    if (service && service.comingSoon) {
                        ui.handleRegionChange(regionSelect, destContainer, destSelect, serviceType);
                        return;
                    }
                    const destName = destContainer.classList.contains('hidden') ? regionSelect.value : destSelect.value;
                    const weight = parseFloat(weightInput.value);
                    const dims = {
                        l: parseFloat(dimsContainer.querySelector('input[placeholder="Length"]').value),
                        w: parseFloat(dimsContainer.querySelector('input[placeholder="Width"]').value),
                        h: parseFloat(dimsContainer.querySelector('input[placeholder="Height"]').value)
                    };
                    logic.calculateAndDisplay(destName, weight, resultDiv, dims, serviceType, selectedRegion);
                    if (typeof window.triggerCelebrationBurst === 'function') {
                        window.triggerCelebrationBurst();
                    }
                });
                regionSelect.addEventListener('change', () => ui.handleRegionChange(regionSelect, destContainer, destSelect, serviceType));
                toggleDims.addEventListener('click', (e) => {
                    e.preventDefault();
                    dimsContainer.classList.toggle('hidden');
                });
            };

            setupForm('form-unpaid', dom.regionUnpaid, dom.destContainerUnpaid, dom.destUnpaid, document.getElementById('weight-unpaid'), dom.resultUnpaidDiv, 'Duty Unpaid', dom.toggleDimsUnpaid, dom.dimsContainerUnpaid);
            setupForm('form-paid', dom.regionPaid, dom.destContainerPaid, dom.destPaid, document.getElementById('weight-paid'), dom.resultPaidDiv, 'Duty Paid', dom.toggleDimsPaid, dom.dimsContainerPaid);
            
            // Tab switching and mobile menu
            dom.calcTabUnpaid.addEventListener('click', () => {
                dom.calcTabPaid.classList.remove('active'); dom.calcTabUnpaid.classList.add('active');
                dom.calcContentPaid.classList.add('hidden'); dom.calcContentUnpaid.classList.remove('hidden');
            });
            dom.calcTabPaid.addEventListener('click', () => {
                dom.calcTabUnpaid.classList.remove('active'); dom.calcTabPaid.classList.add('active');
                dom.calcContentUnpaid.classList.add('hidden'); dom.calcContentPaid.classList.remove('hidden');
            });
            
            dom.mobileMenuButton.addEventListener('click', () => dom.mobileMenu.classList.toggle('hidden'));
            
            // Header scroll effect
            const header = document.querySelector('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 30) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    };

    // Start ambient festive fireworks immediately on load
    initFireworks();

    // --- INITIALIZATION ---
    async function init() {
        try {
            const response = await fetch('rates.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            servicesData = data.services;
            allDestinations = servicesData.flatMap(s => s.destinations || []);
            
            ui.populateRegionDropdowns();
            ui.setupAnimations();
            events.bind();
        } catch (error) {
            console.error("Failed to load and initialize rate data:", error);
            const unpaidForm = document.getElementById('form-unpaid');
            if (unpaidForm) {
                const errBox = document.createElement('div');
                errBox.className = "col-span-full p-4 bg-red-100 border border-red-300 text-red-800 text-sm font-semibold rounded-lg text-center";
                errBox.innerHTML = "⚠️ Error loading rate data (`rates.json`). Please ensure <code>rates.json</code> is uploaded to your GitHub repository root.";
                unpaidForm.prepend(errBox);
            }
        }
    }

    init();
});