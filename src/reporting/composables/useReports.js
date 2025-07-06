import { ref, reactive, computed } from 'vue';
import { reportApiService } from '@/reporting/services/report-api.service.js';
import { ReportAssembler } from '@/reporting/services/report.assembler.js';
import jsPDF from 'jspdf';
import html2pdf from 'html2pdf.js';

export function useReports() {
    const loading = ref(false);
    const error = ref(null);

    const reportData = reactive({
        dailySales: [],
        topProducts: [],
        bottomProducts: [],
        totalInventory: 0
    });

    const totalSales = computed(() => {
        return ReportAssembler.calculateTotalSales(reportData.dailySales);
    });

    const totalTransactions = computed(() => {
        return ReportAssembler.calculateTotalTransactions(reportData.dailySales);
    });

    const chartData = computed(() => {
        return ReportAssembler.transformDailySalesForChart(reportData.dailySales);
    });

    const fetchReports = async () => {
        loading.value = true;
        error.value = null;

        try {
            const data = await reportApiService.getAllReports();

            reportData.dailySales = data.dailySales || [];
            reportData.topProducts = data.topProducts || [];
            reportData.bottomProducts = data.bottomProducts || [];
            reportData.totalInventory = data.inventorySummary?.totalProducts || 0;

        } catch (err) {
            error.value = 'Error al cargar los reportes';
            console.error('Error fetching reports:', err);
        } finally {
            loading.value = false;
        }
    };

    const downloadPDF = async () => {
        try {
            const element = document.createElement('div');
            element.style.fontFamily = 'Arial, sans-serif';
            element.style.padding = '20px';
            element.innerHTML = `
                <h1 style="text-align: center;">Reporte de Ventas</h1>
                <h2 style="color: #333;">Resumen Generado: ${new Date().toLocaleDateString()}</h2>
                
                <h3>Ventas Diarias</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Día</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Ventas</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Transacciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.dailySales.map(item => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.day}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">$${item.sales}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.transactions}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Productos Más Vendidos</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.topProducts.map(item => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">$${item.sales}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Productos Menos Vendidos</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="background-color: #f2f2f2;">
                            <th style="border: 1px solid #ddd; padding: 8px;">Producto</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                            <th style="border: 1px solid #ddd; padding: 8px;">Ventas</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reportData.bottomProducts.map(item => `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">$${item.sales}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <h3>Resumen de Inventario</h3>
                <p>Total de productos en inventario: ${reportData.totalInventory}</p>
                <p>Total de ventas: $${totalSales.value}</p>
                <p>Total de transacciones: ${totalTransactions.value}</p>
            `;

            const opt = {
                margin: 10,
                filename: `Reporte_Ventas_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().from(element).set(opt).save();

            alert('PDF generado exitosamente');
        } catch (err) {
            console.error('Error al generar PDF:', err);
            alert('Error al generar el PDF');
        }
    };

    const refreshReports = async () => {
        await fetchReports();
    };

    const loadMockData = () => {
        reportData.dailySales = [
            { day: 'Lun', sales: 800, transactions: 12 },
            { day: 'Mar', sales: 600, transactions: 8 },
            { day: 'Mie', sales: 1200, transactions: 18 },
            { day: 'Jue', sales: 1100, transactions: 15 },
            { day: 'Vie', sales: 900, transactions: 13 },
            { day: 'Sab', sales: 1400, transactions: 20 },
            { day: 'Dom', sales: 1600, transactions: 22 }
        ];

        reportData.topProducts = [
            { name: 'Producto A', quantity: 120, sales: 2400 },
            { name: 'Producto B', quantity: 150, sales: 3000 },
            { name: 'Producto C', quantity: 30, sales: 900 }
        ];

        reportData.bottomProducts = [
            { name: 'Producto X', quantity: 5, sales: 100 },
            { name: 'Producto Y', quantity: 8, sales: 160 },
            { name: 'Producto Z', quantity: 12, sales: 240 }
        ];

        reportData.totalInventory = 350;
    };

    return {
        loading,
        error,
        reportData,
        totalSales,
        totalTransactions,
        chartData,
        fetchReports,
        downloadPDF,
        refreshReports,
        loadMockData
    };
}