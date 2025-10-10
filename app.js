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
        tableTabUnpaid: document.getElementById('table-tab-unpaid'),
        tableTabPaid: document.getElementById('table-tab-paid'),
        tableUnpaidContainer: document.getElementById('table-unpaid-container'),
        tablePaidContainer: document.getElementById('table-paid-container'),
        mobileMenuButton: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        // Modal elements
        discountModal: document.getElementById('discount-modal'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        modalOriginalPrice: document.getElementById('modal-original-price'),
        modalDiscountAmount: document.getElementById('modal-discount-amount'),
        modalFinalPrice: document.getElementById('modal-final-price'),
        // Volumetric elements
        toggleDimsUnpaid: document.getElementById('toggle-dims-unpaid'),
        dimsContainerUnpaid: document.getElementById('dims-container-unpaid'),
        toggleDimsPaid: document.getElementById('toggle-dims-paid'),
        dimsContainerPaid: document.getElementById('dims-container-paid'),
    };

    const contactButtonsHTML = `
        <div class="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a href="tel:+919325552513" class="flex items-center justify-center space-x-2 w-full sm:w-auto bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-orange-600 transition-all duration-200 shadow-lg transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.518.759a11.03 11.03 0 004.28 4.28l.759-1.518a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                <span>Call Now</span>
            </a>
            <a href="https://wa.me/919325552513" target="_blank" class="flex items-center justify-center space-x-2 w-full sm:w-auto bg-green-500 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-600 transition-all duration-200 shadow-lg transform hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.387 1.88 6.06l-1.429 5.215 5.045-1.328zM9.351 8.29c-.196-.288-.45-.447-.72-.451-.271-.004-.543.015-.794.046-.252.031-.539.11-.795.331-.255.22-.525.539-.684.87-.159.331-.318.684-.331 1.054-.013.37.063.73.222 1.074.159.344.38.685.636.99.255.304.574.636.951.99.377.354.795.684 1.238.99.525.344 1.05.623 1.636.82.585.196 1.157.294 1.733.307.576.013 1.14-.098 1.636-.344.496-.246.892-.608 1.157-.99.266-.381.447-.824.524-1.29.078-.466.063-1.012-.046-1.464-.109-.452-.331-.839-.623-1.14-.292-.302-.684-.467-1.129-.496-.445-.028-.89.046-1.29.222-.399.176-.684.451-.927.795-.242.344-.45.73-.623.99s-.331.381-.496.425c-.165.043-.344.031-.509-.046-.165-.078-.381-.222-.636-.425-.255-.203-.541-.466-.867-.795-.325-.331-.608-.719-.824-1.14a4.575 4.575 0 0 1-.585-1.413c-.046-.222-.031-.452.046-.684.078-.231.222-.425.425-.574.203-.148.425-.222.684-.234.259-.013.509.031.703.117.195.086.344.176.45.294s.195.255.255.381c.061.125.093.255.093.381v.004c-.013.125-.061.255-.132.381-.071.125-.176.222-.294.294-.118.071-.255.109-.408.109-.153 0-.3-.046-.425-.118-.125-.07-.222-.176-.294-.294-.07-.118-.109-.255-.109-.408 0-.153.046-.3.118-.425.07-.125.176-.222.294-.294.118-.071.255-.118.408-.118.153 0 .3.046.425.117s.222.176.294.294c.07.118.109.255.109.408v.016c-.013.153-.061.294-.148.425-.086.132-.203.255-.331.344-.128.09-.283.148-.45.176-.168.028-.344.016-.509-.046-.165-.062-.317-.148-.45-.266-.132-.118-.255-.255-.344-.425-.09-.171-.148-.354-.176-.541-.028-.187-.016-.37.031-.541.048-.171.125-.331.222-.48.098-.148.222-.283.361-.399.139-.118.294-.222.466-.294.171-.071.344-.118.539-.132.195-.013.381 0 .56.046.179.047.344.118.496.222.153.105.283.231.381.381.098.151.168.317.203.496.035.179.047.354.031.541-.016.187-.07.354-.148.509-.078.155-.176.294-.294.425-.118.131-.255.255-.408.344-.153.09-.317.168-.496.222-.178.054-.369.086-.56.086-.207 0-.414-.04-.61-.118-.195-.078-.37-.176-.539-.294-.17-.118-.318-.266-.45-.425-.132-.159-.237-.344-.318-.541-.08-.196-.118-.408-.118-.623 0-.222.046-.431.118-.636.072-.205.176-.381.294-.539.118-.159.255-.294.425-.408.171-.114.354-.195.541-.255.187-.061.381-.093.576-.093.207 0 .408.04.585.109.177.07.344.168.496.283.153.114.283.255.399.408.117.153.203.317.266.496.062.179.093.369.093.56v.004z"/></svg>
                <span>Text on WhatsApp</span>
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
            const needsSecondDropdown = ["USA", "Europe"].includes(selectedRegion);
            
            destContainer.classList.toggle('hidden', !needsSecondDropdown);
            const form = regionSelect.closest('form');
            const button = form.querySelector('button[type="submit"]');

            if (needsSecondDropdown) {
                form.classList.replace('sm:grid-cols-3', 'sm:grid-cols-4');
                button.classList.replace('sm:col-start-3', 'sm:col-start-4');
                
                destSelect.innerHTML = '';
                const service = servicesData.find(s => s.region === selectedRegion && s.type === serviceType);
                if (service) {
                    if (selectedRegion === 'USA') {
                        destSelect.add(new Option('Select State', ''));
                        service.destinations.forEach(zone => {
                            const optgroup = document.createElement('optgroup');
                            optgroup.label = zone.name;
                            zone.states.sort().forEach(state => {
                                const option = document.createElement('option');
                                option.value = zone.name;
                                option.textContent = state;
                                optgroup.appendChild(option);
                            });
                            destSelect.appendChild(optgroup);
                        });
                    } else { // Europe
                        destSelect.add(new Option('Select Country', ''));
                        service.destinations.forEach(d => destSelect.add(new Option(d.name, d.name)));
                    }
                }
            } else {
                form.classList.replace('sm:grid-cols-4', 'sm:grid-cols-3');
                button.classList.replace('sm:col-start-4', 'sm:col-start-3');
            }
        },

        createTableHTML: (data) => {
            let table = `<table class="min-w-full divide-y divide-slate-200">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Destination</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Weight Bracket</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rate</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-slate-200">`;

            data.forEach(s => {
                s.destinations.forEach(d => {
                    const rateKeys = Object.keys(d.rates);
                    const rowCount = d.lowWeight ? rateKeys.length + 2 : rateKeys.length;
                    
                    table += `<tr><td class="px-6 py-4 font-medium text-slate-800" rowspan="${rowCount}">${d.name}</td>`;
                    
                    if (d.lowWeight) {
                        table += `<td class="px-6 py-4 text-sm text-slate-700">Up to 0.500 Kg</td><td class="px-6 py-4 text-sm text-slate-700">₹${d.lowWeight.base.toFixed(2)}</td></tr>
                                  <tr><td class="px-6 py-4 text-sm text-slate-700">Additional 500g</td><td class="px-6 py-4 text-sm text-slate-700">₹${d.lowWeight.addl.toFixed(2)}</td></tr>`;
                        rateKeys.forEach(key => {
                            table += `<tr><td class="px-6 py-4 text-sm text-slate-700">${key}kg+ (per kg)</td><td class="px-6 py-4 text-sm text-slate-700">₹${d.rates[key].toFixed(2)}</td></tr>`;
                        });
                    } else {
                        table += `<td class="px-6 py-4 text-sm text-slate-700">Up to ${rateKeys[0]}kg</td><td class="px-6 py-4 text-sm text-slate-700">₹${d.rates[rateKeys[0]]}/kg</td></tr>`;
                        for (let i = 1; i < rateKeys.length; i++) {
                            table += `<tr><td class="px-6 py-4 text-sm text-slate-700">Up to ${rateKeys[i]}kg</td><td class="px-6 py-4 text-sm text-slate-700">₹${d.rates[rateKeys[i]]}/kg</td></tr>`;
                        }
                    }
                });
            });
            table += '</tbody></table>';
            return table;
        },

        populateRateTables: () => {
            dom.tableUnpaidContainer.innerHTML = ui.createTableHTML(servicesData.filter(s => s.type === 'Duty Unpaid'));
            dom.tablePaidContainer.innerHTML = ui.createTableHTML(servicesData.filter(s => s.type === 'Duty Paid'));
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

    // --- CALCULATION LOGIC ---
    const logic = {
        calculateAndDisplay: (destName, weight, resultDiv, dims, serviceType) => {
            resultDiv.innerHTML = '';
            if (!destName || !weight || weight <= 0) {
                resultDiv.innerHTML = `<div class="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800"><p class="font-semibold">Please select a destination and enter a valid weight.</p></div>`;
                return;
            }

            const service = allDestinations.find(s => s.name === destName);
            if (!service) {
                resultDiv.innerHTML = `<div class="bg-red-100 border border-red-300 p-4 rounded-lg text-red-800"><p class="font-semibold">Could not find rates for "${destName}".</p></div>`;
                return;
            }

            let volumetricWeight = 0;
            if (dims.l && dims.w && dims.h) {
                volumetricWeight = (dims.l * dims.w * dims.h) / 5000;
            }
            const billableWeight = Math.max(weight, volumetricWeight);

            let originalCost = 0;
            let calculationDetails = '';

            if (service.lowWeight && billableWeight < 6) {
                if (billableWeight <= 0.5) {
                    originalCost = service.lowWeight.base;
                    calculationDetails = `Base rate for up to 0.5kg.`;
                } else {
                    const additionalHalfKgs = Math.ceil((billableWeight - 0.5) / 0.5);
                    originalCost = service.lowWeight.base + (additionalHalfKgs * service.lowWeight.addl);
                    calculationDetails = `₹${service.lowWeight.base.toFixed(2)} (base) + ${additionalHalfKgs} × ₹${service.lowWeight.addl.toFixed(2)} (add'l).`;
                }
            } else {
                const rateBrackets = Object.keys(service.rates).map(Number).sort((a, b) => a - b);
                let applicableBracket = rateBrackets.filter(b => b <= billableWeight).pop();
                if (!applicableBracket) {
                    applicableBracket = rateBrackets.find(b => billableWeight < b) || rateBrackets[0];
                }
                const applicableRate = service.rates[applicableBracket];
                originalCost = applicableRate * billableWeight;
                calculationDetails = `₹${applicableRate.toFixed(2)}/kg × ${billableWeight.toFixed(2)}kg.`;
            }

            const discountAmount = originalCost * 0.05;
            const finalCost = originalCost - discountAmount;

            window.discountData = {
                original: originalCost,
                discount: discountAmount,
                final: finalCost
            };
            
            let resultHTML = `
                <div class="bg-white border border-slate-200 rounded-xl shadow-lg text-left mt-6">
                    <div class="p-4 bg-slate-50 rounded-t-xl border-b border-slate-200">
                        <h3 class="text-lg font-bold text-slate-800">Your Shipping Summary</h3>
                    </div>
                    <div class="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-4 text-sm">
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Destination</p>
                                    <p class="text-slate-500">${destName.replace(' (DHL)', '')}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Billable Weight</p>
                                    <p class="text-slate-500">${billableWeight.toFixed(2)} kg ${volumetricWeight > weight ? '<span class="text-xs text-orange-500 font-semibold">(Volumetric)</span>' : ''}</p>
                                </div>
                            </div>
                             <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Service</p>
                                    <p class="text-slate-500">${serviceType}</p>
                                </div>
                            </div>
                            <div class="flex items-start">
                                <svg class="w-5 h-5 mr-3 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <div>
                                    <p class="font-semibold text-slate-700">Estimated Delivery</p>
                                    <p class="text-slate-500">${service.tat}</p>
                                </div>
                            </div>
                        </div>
                        <div class="bg-slate-100 rounded-lg p-4 text-center flex flex-col justify-center">
                            <p class="text-sm font-medium text-slate-500">Estimated Total</p>
                            <p class="text-4xl md:text-5xl font-extrabold text-slate-800 my-1">₹${originalCost.toFixed(2)}</p>
                            <p class="text-xs text-slate-400">${calculationDetails}</p>
                        </div>
                    </div>
                </div>
                ${contactButtonsHTML}
                <div class="mt-8 text-center">
                    <button id="claim-discount-btn" class="bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-orange-600 hover:to-red-700 transition-all transform hover:-translate-y-1 shadow-lg">
                        <span class="mr-2">🎁</span> Click for a Surprise Discount!
                    </button>
                </div>
            `;
            
            resultDiv.innerHTML = resultHTML;

            document.getElementById('claim-discount-btn').addEventListener('click', () => {
                dom.modalOriginalPrice.textContent = `₹${window.discountData.original.toFixed(2)}`;
                dom.modalDiscountAmount.textContent = `-₹${window.discountData.discount.toFixed(2)}`;
                dom.modalFinalPrice.textContent = `₹${window.discountData.final.toFixed(2)}`;
                dom.discountModal.classList.add('active');
            });
        }
    };
    
    // --- EVENT BINDING ---
    const events = {
        bind: () => {
            const setupForm = (formId, regionSelect, destContainer, destSelect, weightInput, resultDiv, serviceType, toggleDims, dimsContainer) => {
                const form = document.getElementById(formId);
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const destName = destContainer.classList.contains('hidden') ? regionSelect.value : destSelect.value;
                    const weight = parseFloat(weightInput.value);
                    const dims = {
                        l: parseFloat(dimsContainer.querySelector('input[placeholder="Length"]').value),
                        w: parseFloat(dimsContainer.querySelector('input[placeholder="Width"]').value),
                        h: parseFloat(dimsContainer.querySelector('input[placeholder="Height"]').value)
                    };
                    logic.calculateAndDisplay(destName, weight, resultDiv, dims, serviceType);
                });
                regionSelect.addEventListener('change', () => ui.handleRegionChange(regionSelect, destContainer, destSelect, serviceType));
                toggleDims.addEventListener('click', (e) => {
                    e.preventDefault();
                    dimsContainer.classList.toggle('hidden');
                });
            };

            setupForm('form-unpaid', dom.regionUnpaid, dom.destContainerUnpaid, dom.destUnpaid, document.getElementById('weight-unpaid'), dom.resultUnpaidDiv, 'Duty Unpaid', dom.toggleDimsUnpaid, dom.dimsContainerUnpaid);
            setupForm('form-paid', dom.regionPaid, dom.destContainerPaid, dom.destPaid, document.getElementById('weight-paid'), dom.resultPaidDiv, 'Duty Paid', dom.toggleDimsPaid, dom.dimsContainerPaid);
            
            dom.closeModalBtn.addEventListener('click', () => dom.discountModal.classList.remove('active'));
            dom.discountModal.addEventListener('click', (e) => { if (e.target === dom.discountModal) dom.discountModal.classList.remove('active'); });

            // Tab switching and mobile menu
            dom.calcTabUnpaid.addEventListener('click', () => {
                dom.calcTabPaid.classList.remove('active'); dom.calcTabUnpaid.classList.add('active');
                dom.calcContentPaid.classList.add('hidden'); dom.calcContentUnpaid.classList.remove('hidden');
            });
            dom.calcTabPaid.addEventListener('click', () => {
                dom.calcTabUnpaid.classList.remove('active'); dom.calcTabPaid.classList.add('active');
                dom.calcContentUnpaid.classList.add('hidden'); dom.calcContentPaid.classList.remove('hidden');
            });
            dom.tableTabUnpaid.addEventListener('click', () => {
                dom.tableTabPaid.classList.remove('active'); dom.tableTabUnpaid.classList.add('active');
                dom.tablePaidContainer.classList.add('hidden'); dom.tableUnpaidContainer.classList.remove('hidden');
            });
            dom.tableTabPaid.addEventListener('click', () => {
                dom.tableTabUnpaid.classList.remove('active'); dom.tableTabPaid.classList.add('active');
                dom.tableUnpaidContainer.classList.add('hidden'); dom.tablePaidContainer.classList.remove('hidden');
            });
            dom.mobileMenuButton.addEventListener('click', () => dom.mobileMenu.classList.toggle('hidden'));
            
            // Header scroll effect
            const header = document.querySelector('header');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    header.classList.add('header-scrolled');
                } else {
                    header.classList.remove('header-scrolled');
                }
            });
        }
    };

    // --- INITIALIZATION ---
    async function init() {
        try {
            const response = await fetch('rates.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            servicesData = data.services;
            allDestinations = servicesData.flatMap(s => s.destinations);
            
            ui.populateRegionDropdowns();
            ui.populateRateTables();
            ui.setupAnimations();
            events.bind();
        } catch (error) {
            console.error("Failed to load and initialize rate data:", error);
            const calculatorSection = document.getElementById('calculator');
            if (calculatorSection) {
                 calculatorSection.innerHTML = '<div class="container mx-auto p-8"><p class="text-center text-red-600 font-semibold bg-red-100 p-4 rounded-lg">Error: Could not load pricing data. Please ensure the `rates.json` file is present and correctly formatted. Check the console for more details.</p></div>';
            }
        }
    }

    init();
});