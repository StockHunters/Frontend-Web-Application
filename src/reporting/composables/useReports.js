import { ref, reactive, computed } from "vue"
import { reportApiService } from "@/reporting/services/report-api.service.js"
import html2pdf from "html2pdf.js"

export function useReports() {
    const loading = ref(false)
    const error = ref(null)
    const apiConnected = ref(false)
    const connectionTested = ref(false)
    const apiInfo = ref(null)

    const reportData = reactive({
        dailySales: [],
        topProducts: [],
        bottomProducts: [],
        totalInventory: 0,
    })

    const localReportData = reactive({
        dailySales: [],
        topProducts: [],
        bottomProducts: [],
        totalInventory: 0,
    })

    const totalSales = computed(() => {
        return reportData.dailySales.reduce((total, day) => total + (day.sales || 0), 0)
    })

    const totalTransactions = computed(() => {
        return reportData.dailySales.reduce((total, day) => total + (day.transactions || 0), 0)
    })

    const chartData = computed(() => {
        return {
            labels: reportData.dailySales.map((item) => item.day),
            datasets: [
                {
                    label: "Ventas",
                    data: reportData.dailySales.map((item) => item.sales),
                    backgroundColor: "#3b82f6",
                },
            ],
        }
    })

    // Cargar datos locales
    const loadLocalReports = () => {
        const stored = localStorage.getItem("local_reports")
        if (stored) {
            try {
                const parsedData = JSON.parse(stored)
                Object.assign(localReportData, parsedData)
                console.log("📦 Reportes locales cargados:", parsedData)
            } catch (error) {
                console.error("❌ Error al cargar reportes locales:", error)
                loadMockData() // Fallback a datos mock
            }
        } else {
            loadMockData() // Si no hay datos locales, cargar mock
        }
    }

    // Guardar datos locales
    const saveLocalReports = () => {
        const dataToSave = {
            dailySales: localReportData.dailySales,
            topProducts: localReportData.topProducts,
            bottomProducts: localReportData.bottomProducts,
            totalInventory: localReportData.totalInventory,
            lastUpdated: new Date().toISOString(),
        }
        localStorage.setItem("local_reports", JSON.stringify(dataToSave))
        console.log("💾 Reportes locales guardados:", dataToSave)
    }

    // Probar conexión a la API
    const testApiConnection = async () => {
        console.log("🔍 Probando conexión a tu fake API de reportes...")
        connectionTested.value = true

        try {
            // Obtener información de la API
            apiInfo.value = await reportApiService.getApiInfo()
            console.log("📊 Información de tu API de reportes:", apiInfo.value)

            const isConnected = await reportApiService.testConnection()
            apiConnected.value = isConnected

            if (isConnected) {
                console.log("✅ Tu fake API de reportes está funcionando correctamente")
                error.value = null
            } else {
                console.log("❌ No se pudo conectar a tu fake API de reportes")
                error.value = "No se pudo conectar a tu fake API de reportes. Usando datos locales."
            }

            return isConnected
        } catch (err) {
            console.error("❌ Error al probar conexión:", err)
            apiConnected.value = false
            error.value = `Error de conexión: ${err.message}`
            return false
        }
    }

    const fetchReports = async () => {
        loading.value = true
        error.value = null

        try {
            // Cargar datos locales primero
            loadLocalReports()

            // Probar conexión a tu API
            const isConnected = await testApiConnection()

            if (isConnected) {
                try {
                    console.log("🔄 Obteniendo reportes de tu fake API...")
                    const data = await reportApiService.getAllReports()

                    // Actualizar datos principales con datos de la API
                    reportData.dailySales = data.dailySales || []
                    reportData.topProducts = data.topProducts || []
                    reportData.bottomProducts = data.bottomProducts || []
                    reportData.totalInventory = data.inventorySummary?.totalProducts || 0

                    console.log("✅ Reportes cargados desde tu API:", {
                        dailySales: reportData.dailySales.length,
                        topProducts: reportData.topProducts.length,
                        bottomProducts: reportData.bottomProducts.length,
                        totalInventory: reportData.totalInventory,
                    })

                    // Guardar datos de la API como respaldo local
                    Object.assign(localReportData, reportData)
                    saveLocalReports()
                } catch (apiError) {
                    console.warn("❌ Error al obtener reportes de tu API:", apiError)
                    apiConnected.value = false
                    // Usar datos locales como fallback
                    Object.assign(reportData, localReportData)
                    error.value = `Error al cargar reportes de tu API: ${apiError.message}`
                }
            } else {
                // Solo usar datos locales
                Object.assign(reportData, localReportData)
                error.value = "Sin conexión a tu fake API de reportes. Mostrando datos guardados localmente."
            }

            console.log("📊 Datos finales mostrados:", {
                dailySales: reportData.dailySales.length,
                topProducts: reportData.topProducts.length,
                bottomProducts: reportData.bottomProducts.length,
                totalInventory: reportData.totalInventory,
                totalSales: totalSales.value,
                totalTransactions: totalTransactions.value,
            })
        } catch (err) {
            console.error("❌ Error general:", err)
            error.value = `Error al cargar reportes: ${err.message}`
            apiConnected.value = false
            // En caso de error, usar datos locales
            Object.assign(reportData, localReportData)
        } finally {
            loading.value = false
        }
    }

    const downloadPDF = async () => {
        try {
            console.log("📄 Generando PDF con datos:", {
                dailySales: reportData.dailySales.length,
                topProducts: reportData.topProducts.length,
                bottomProducts: reportData.bottomProducts.length,
                totalSales: totalSales.value,
                totalTransactions: totalTransactions.value,
            })

            const element = document.createElement("div")
            element.style.fontFamily = "Arial, sans-serif"
            element.style.padding = "20px"
            element.style.color = "#333"
            element.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">📊 Reporte de Ventas</h1>
          <p style="color: #666; font-size: 16px;">Generado el ${new Date().toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}</p>
          <p style="color: #666; font-size: 14px;">Fuente: ${apiConnected.value ? "Tu Fake API" : "Datos Locales"}</p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">📈 Resumen Ejecutivo</h2>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #059669;">S/ ${totalSales.value.toLocaleString()}</div>
              <div style="color: #666;">Total Ventas</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #dc2626;">${totalTransactions.value}</div>
              <div style="color: #666;">Transacciones</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #7c3aed;">${reportData.totalInventory.toLocaleString()}</div>
              <div style="color: #666;">Productos en Stock</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">📅 Ventas Diarias</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background-color: #3b82f6; color: white;">
                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Día</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Ventas</th>
                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Transacciones</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.dailySales
                .map(
                    (item, index) => `
                  <tr style="background-color: ${index % 2 === 0 ? "#f8fafc" : "white"};">
                    <td style="border: 1px solid #ddd; padding: 12px; font-weight: 500;">${item.day}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right; color: #059669; font-weight: 600;">S/ ${item.sales.toLocaleString()}</td>
                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">${item.transactions}</td>
                  </tr>
                `,
                )
                .join("")}
            </tbody>
          </table>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
          <div>
            <h2 style="color: #1e40af; margin-bottom: 15px;">🏆 Productos Más Vendidos</h2>
            <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #059669; color: white;">
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Producto</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Cant.</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Ventas</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.topProducts
                .map(
                    (item, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? "#f0fdf4" : "white"};">
                      <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">${item.name}</td>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.quantity}</td>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: #059669; font-weight: 600;">S/ ${item.sales.toLocaleString()}</td>
                    </tr>
                  `,
                )
                .join("")}
              </tbody>
            </table>
          </div>

          <div>
            <h2 style="color: #1e40af; margin-bottom: 15px;">📉 Productos Menos Vendidos</h2>
            <table style="width: 100%; border-collapse: collapse; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #dc2626; color: white;">
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Producto</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Cant.</th>
                  <th style="border: 1px solid #ddd; padding: 10px; text-align: right;">Ventas</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.bottomProducts
                .map(
                    (item, index) => `
                    <tr style="background-color: ${index % 2 === 0 ? "#fef2f2" : "white"};">
                      <td style="border: 1px solid #ddd; padding: 10px; font-weight: 500;">${item.name}</td>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: right;">${item.quantity}</td>
                      <td style="border: 1px solid #ddd; padding: 10px; text-align: right; color: #dc2626; font-weight: 600;">S/ ${item.sales.toLocaleString()}</td>
                    </tr>
                  `,
                )
                .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div style="margin-top: 30px; padding: 20px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 12px;">
            Reporte generado automáticamente • ${new Date().toLocaleString("es-ES")} • 
            Sistema de Gestión de Inventario
          </p>
        </div>
      `

            const opt = {
                margin: 10,
                filename: `Reporte_Ventas_${new Date().toISOString().split("T")[0]}.pdf`,
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                },
                jsPDF: {
                    unit: "mm",
                    format: "a4",
                    orientation: "portrait",
                },
            }

            console.log("📄 Iniciando generación de PDF...")
            await html2pdf().from(element).set(opt).save()
            console.log("✅ PDF generado exitosamente")
        } catch (err) {
            console.error("❌ Error al generar PDF:", err)
            error.value = "Error al generar el PDF. Intenta nuevamente."

            // Fallback: crear un PDF simple
            try {
                const fallbackContent = `
          REPORTE DE VENTAS
          Fecha: ${new Date().toLocaleDateString()}
          
          RESUMEN:
          - Total Ventas: S/ ${totalSales.value.toLocaleString()}
          - Transacciones: ${totalTransactions.value}
          - Productos en Stock: ${reportData.totalInventory}
          
          VENTAS DIARIAS:
          ${reportData.dailySales.map((day) => `${day.day}: S/ ${day.sales.toLocaleString()}`).join("\n")}
          
          TOP PRODUCTOS:
          ${reportData.topProducts.map((p) => `${p.name}: ${p.quantity} unidades - S/ ${p.sales.toLocaleString()}`).join("\n")}
        `

                const blob = new Blob([fallbackContent], { type: "text/plain" })
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `Reporte_Ventas_${new Date().toISOString().split("T")[0]}.txt`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)

                console.log("✅ Archivo de texto generado como fallback")
            } catch (fallbackError) {
                console.error("❌ Error en fallback:", fallbackError)
            }
        }
    }

    const refreshReports = async () => {
        console.log("🔄 Refrescando reportes desde tu API...")
        await fetchReports()
    }

    const loadMockData = () => {
        const mockData = {
            dailySales: [
                { day: "Lun", sales: 1250, transactions: 18 },
                { day: "Mar", sales: 980, transactions: 14 },
                { day: "Mié", sales: 1680, transactions: 24 },
                { day: "Jue", sales: 1420, transactions: 21 },
                { day: "Vie", sales: 1890, transactions: 28 },
                { day: "Sáb", sales: 2340, transactions: 35 },
                { day: "Dom", sales: 2180, transactions: 32 },
            ],
            topProducts: [
                { name: "Laptop Gaming", quantity: 45, sales: 67500 },
                { name: "Smartphone Pro", quantity: 78, sales: 58500 },
                { name: "Auriculares Bluetooth", quantity: 120, sales: 36000 },
                { name: "Monitor 4K", quantity: 32, sales: 25600 },
                { name: "Teclado Mecánico", quantity: 65, sales: 19500 },
            ],
            bottomProducts: [
                { name: "Cable USB-C", quantity: 8, sales: 240 },
                { name: "Protector Pantalla", quantity: 12, sales: 360 },
                { name: "Adaptador HDMI", quantity: 15, sales: 450 },
                { name: "Funda Tablet", quantity: 18, sales: 540 },
                { name: "Cargador Inalámbrico", quantity: 22, sales: 1100 },
            ],
            totalInventory: 1247,
        }

        Object.assign(localReportData, mockData)
        Object.assign(reportData, mockData)
        console.log("📦 Datos mock cargados:", mockData)
    }

    const clearLocalReports = () => {
        localStorage.removeItem("local_reports")
        loadMockData()
        console.log("🗑️ Reportes locales eliminados, datos mock cargados")
    }

    const getConnectionStatus = () => {
        if (!connectionTested.value) return "⏳ Conectando..."
        return apiConnected.value ? "🟢" : "🔴"
    }

    const forceApiTest = async () => {
        console.log("🔧 Forzando prueba de tu fake API de reportes...")
        await testApiConnection()
        if (apiConnected.value) {
            await fetchReports()
        }
    }

    return {
        loading,
        error,
        apiConnected,
        connectionTested,
        apiInfo,
        reportData,
        totalSales,
        totalTransactions,
        chartData,
        fetchReports,
        downloadPDF,
        refreshReports,
        loadMockData,
        clearLocalReports,
        getConnectionStatus,
        forceApiTest,
    }
}
