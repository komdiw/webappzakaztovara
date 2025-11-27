import { NextRequest, NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

interface OrderItem {
  id: string
  url: string
  photo: string | null
  quantity: number
  color: string
  size: string
  price: number
}

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: OrderItem[] } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      )
    }

    // Constants
    const COMMISSION_RATE = 0.05 // 5%
    const EXCHANGE_RATE = 12.2 // рубль к юаню

    // Create a new workbook
    const workbook = new ExcelJS.Workbook()
    
    // Create main worksheet
    const worksheet = workbook.addWorksheet('Заказ')

    // Calculate totals first
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalCommission = totalPrice * COMMISSION_RATE
    const totalWithCommission = totalPrice + totalCommission
    const totalInRubles = totalWithCommission * EXCHANGE_RATE

    // Add header section
    worksheet.mergeCells('A1:C1')
    worksheet.getCell('A1').value = 'Бланк заказа 1688/Taobao'
    worksheet.getCell('A1').font = { size: 16, bold: true }
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getRow(1).height = 30

    // Add summary info
    worksheet.mergeCells('A2:B2')
    worksheet.getCell('A2').value = 'Дата заказа:'
    worksheet.getCell('C2').value = new Date().toLocaleDateString('ru-RU')
    
    worksheet.mergeCells('E2:F2')
    worksheet.getCell('E2').value = 'Общая цена:'
    worksheet.getCell('G2').value = totalPrice.toFixed(2)
    worksheet.getCell('H2').value = 'юань'
    
    worksheet.mergeCells('A3:B3')
    worksheet.getCell('A3').value = 'Всего товаров:'
    worksheet.getCell('C3').value = items.length
    
    worksheet.mergeCells('E3:F3')
    worksheet.getCell('E3').value = 'Комиссия 5%:'
    worksheet.getCell('G3').value = totalCommission.toFixed(2)
    worksheet.getCell('H3').value = 'юань'

    worksheet.mergeCells('A4:B4')
    worksheet.getCell('A4').value = 'Всего кол-во:'
    worksheet.getCell('C4').value = totalQuantity

    worksheet.mergeCells('E4:F4')
    worksheet.getCell('E4').value = 'Итого с комиссией:'
    worksheet.getCell('G4').value = totalWithCommission.toFixed(2)
    worksheet.getCell('H4').value = 'юань'

    worksheet.mergeCells('E5:F5')
    worksheet.getCell('E5').value = 'Комиссия (%):'
    worksheet.getCell('G5').value = COMMISSION_RATE * 100
    worksheet.getCell('H5').value = '%'
    worksheet.getCell('G5').name = 'CommissionRate'
    worksheet.getCell('G5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } }

    worksheet.mergeCells('E6:F6')
    worksheet.getCell('E6').value = 'Курс (руб/юань):'
    worksheet.getCell('G6').value = EXCHANGE_RATE
    worksheet.getCell('H6').value = 'руб/юань'
    worksheet.getCell('G6').name = 'ExchangeRate'
    worksheet.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } }

    worksheet.mergeCells('E7:F7')
    worksheet.getCell('E7').value = 'Итого в рублях:'
    worksheet.getCell('G7').value = { formula: '=G4*G6', result: totalInRubles }
    worksheet.getCell('H7').value = 'руб'
    worksheet.getCell('E7').font = { bold: true, size: 12 }
    worksheet.getCell('G7').font = { bold: true, size: 12 }
    worksheet.getCell('E7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } }
    worksheet.getCell('F7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } }
    worksheet.getCell('G7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } }
    worksheet.getCell('H7').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD700' } }
    worksheet.getCell('G7').numFmt = '#,##0.00'

    // Style summary section
    for (let row = 2; row <= 7; row++) {
      worksheet.getRow(row).height = 22
      for (let col = 1; col <= 8; col++) {
        const cell = worksheet.getCell(row, col)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        if (col === 1 || col === 5) {
          if (row < 7) { // Don't override gold background on row 7
            cell.font = { bold: true }
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F3FF' } }
          } else {
            cell.font = { bold: true }
          }
        }
        cell.alignment = { vertical: 'middle' }
      }
    }
    
    // Define columns starting from row 9
    worksheet.columns = [
      { key: 'number', width: 6 },
      { key: 'photo', width: 15 },
      { key: 'url', width: 45 },
      { key: 'size', width: 12 },
      { key: 'color', width: 12 },
      { key: 'quantity', width: 10 },
      { key: 'price', width: 12 },
      { key: 'total', width: 14 },
      { key: 'commission', width: 14 },
      { key: 'totalWithCommission', width: 16 },
      { key: 'totalRub', width: 14 }
    ]

    // Add table header at row 9
    const headerRow = worksheet.getRow(9)
    headerRow.values = [
      '№',
      'Фото',
      'Ссылка на товар',
      'Размер',
      'Цвет',
      'Кол-во',
      'Цена за 1 (юань)',
      'Сумма (юань)',
      'Комиссия 5%',
      'Итого с комиссией (юань)',
      'Итого (руб)'
    ]
    
    // Style table header
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } }
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' }
    }
    headerRow.height = 35
    headerRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }

    // Add data rows starting from row 10
    let rowNumber = 10
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const row = worksheet.getRow(rowNumber)
      row.getCell(1).value = i + 1
      row.getCell(2).value = '' // Empty for photo
      
      // Make URL clickable
      if (item.url) {
        row.getCell(3).value = {
          text: item.url,
          hyperlink: item.url,
          tooltip: 'Открыть ссылку'
        }
        row.getCell(3).font = { color: { argb: 'FF0000FF' }, underline: true }
      } else {
        row.getCell(3).value = ''
      }
      
      row.getCell(4).value = item.size || ''
      row.getCell(5).value = item.color || ''
      row.getCell(6).value = item.quantity || 0
      row.getCell(7).value = item.price || 0
      
      // Formula: Сумма = Цена * Количество
      row.getCell(8).value = { formula: `=G${rowNumber}*F${rowNumber}`, result: item.price * item.quantity }
      
      // Formula: Комиссия = Сумма * (CommissionRate/100)
      row.getCell(9).value = { formula: `=H${rowNumber}*($G$5/100)`, result: item.price * item.quantity * COMMISSION_RATE }
      
      // Formula: Итого с комиссией = Сумма + Комиссия
      row.getCell(10).value = { formula: `=H${rowNumber}+I${rowNumber}`, result: item.price * item.quantity * (1 + COMMISSION_RATE) }
      
      // Formula: Итого (руб) = Итого с комиссией * ExchangeRate
      row.getCell(11).value = { formula: `=J${rowNumber}*$G$6`, result: item.price * item.quantity * (1 + COMMISSION_RATE) * EXCHANGE_RATE }

      // Add image if exists
      if (item.photo) {
        try {
          // Convert base64 to buffer
          const base64Data = item.photo.replace(/^data:image\/(png|jpg|jpeg);base64,/, '')
          const imageBuffer = Buffer.from(base64Data, 'base64')
          
          // Add image to Excel
          const imageId = workbook.addImage({
            buffer: imageBuffer,
            extension: item.photo.includes('png') ? 'png' : 'jpeg',
          })

          // Add image to worksheet and position it in the photo column
          worksheet.addImage(imageId, {
            tl: { col: 1, row: rowNumber - 1 }, // Column B (index 1), current row
            ext: { width: 80, height: 80 }
          })

          // Adjust row height to fit image
          row.height = 85
        } catch (error) {
          console.error(`Error adding image for item ${i + 1}:`, error)
          // If image fails, add text indicator
          row.getCell(2).value = 'Фото (ошибка)'
        }
      } else {
        row.height = 25
      }

      // Style data row
      row.alignment = { vertical: 'middle', wrapText: true }
      
      // Add borders and alignment to data cells
      for (let col = 1; col <= 11; col++) {
        const cell = row.getCell(col)
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        }
        // Center align numeric columns
        if (col >= 6 && col <= 11) {
          cell.alignment = { vertical: 'middle', horizontal: 'center' }
        }
        // Number format for price columns
        if (col >= 7 && col <= 11) {
          cell.numFmt = '#,##0.00'
        }
      }
      
      rowNumber++
    }

    // Add total row at the bottom of table
    const totalRow = worksheet.getRow(rowNumber)
    const lastDataRow = rowNumber - 1
    
    totalRow.getCell(1).value = 'ИТОГО:'
    totalRow.getCell(2).value = ''
    totalRow.getCell(3).value = ''
    totalRow.getCell(4).value = ''
    totalRow.getCell(5).value = ''
    
    // Formula: Sum of all quantities
    totalRow.getCell(6).value = { formula: `=SUM(F10:F${lastDataRow})`, result: totalQuantity }
    totalRow.getCell(7).value = ''
    
    // Formula: Sum of all totals
    totalRow.getCell(8).value = { formula: `=SUM(H10:H${lastDataRow})`, result: totalPrice }
    
    // Formula: Sum of all commissions
    totalRow.getCell(9).value = { formula: `=SUM(I10:I${lastDataRow})`, result: totalCommission }
    
    // Formula: Sum of all totals with commission
    totalRow.getCell(10).value = { formula: `=SUM(J10:J${lastDataRow})`, result: totalWithCommission }
    
    // Formula: Sum of all rubles
    totalRow.getCell(11).value = { formula: `=SUM(K10:K${lastDataRow})`, result: totalInRubles }
    
    // Also update the summary section with formulas
    worksheet.getCell('G2').value = { formula: `=H${rowNumber}`, result: totalPrice }
    worksheet.getCell('G2').numFmt = '#,##0.00'
    worksheet.getCell('G3').value = { formula: `=I${rowNumber}`, result: totalCommission }
    worksheet.getCell('G3').numFmt = '#,##0.00'
    worksheet.getCell('G4').value = { formula: `=J${rowNumber}`, result: totalWithCommission }
    worksheet.getCell('G4').numFmt = '#,##0.00'

    // Style total row
    totalRow.font = { bold: true, size: 11 }
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' }
    }
    totalRow.height = 30
    
    // Add borders and formatting to total row
    for (let col = 1; col <= 11; col++) {
      const cell = totalRow.getCell(col)
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      }
      cell.alignment = { vertical: 'middle', horizontal: 'center' }
      if (col >= 7 && col <= 11) {
        cell.numFmt = '#,##0.00'
      }
    }
    
    // Add borders to header row
    for (let col = 1; col <= 11; col++) {
      const cell = headerRow.getCell(col)
      cell.border = {
        top: { style: 'medium' },
        left: { style: 'thin' },
        bottom: { style: 'medium' },
        right: { style: 'thin' }
      }
    }

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer()

    // Create response
    const response = new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="order_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })

    return response
  } catch (error) {
    console.error('Error generating Excel:', error)
    return NextResponse.json(
      { error: 'Failed to generate Excel file' },
      { status: 500 }
    )
  }
}