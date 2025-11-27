'use client'

import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { TooltipProvider } from "@/components/ui/tooltip"

import { useOrderForm } from '@/hooks/useOrderForm'
import { OrderCard } from '@/components/order-form/OrderCard'
import { OrderSummary } from '@/components/order-form/OrderSummary'
import { InstructionsAccordion } from '@/components/order-form/InstructionsAccordion'

export default function Home() {
  const {
    items,
    addItem,
    updateItem,
    removeItem,
    getTotalAmount,
    isGenerating,
    draggedOver,
    handlePhotoUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    duplicateItem,
    validateUrl,
    isItemValid,
    handleExportToExcel,
    isFormValid
  } = useOrderForm()

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Форма заказа с 1688 и Taobao
            </h1>
            <p className="text-gray-600">
              Добавьте товары из китайских маркетплейсов для формирования заказа
            </p>
          </div>

          <InstructionsAccordion />

          <div className="space-y-6">
            {items.map((item, index) => (
              <OrderCard
                key={item.id}
                item={item}
                index={index}
                isLastItem={items.length === 1}
                isValid={isItemValid(item)}
                draggedOver={draggedOver === item.id}
                onUpdate={updateItem}
                onRemove={removeItem}
                onDuplicate={duplicateItem}
                onPhotoUpload={handlePhotoUpload}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                validateUrl={validateUrl}
              />
            ))}

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  addItem()
                  toast.success('Товар добавлен')
                }}
                variant="outline"
                className="w-full md:w-auto hover:scale-105 transition-transform"
              >
                <Plus className="w-4 h-4 mr-2" />
                Добавить еще товар
              </Button>
            </div>

            <OrderSummary
              totalAmount={getTotalAmount()}
              itemsCount={items.length}
              validItemsCount={items.filter(isItemValid).length}
              onExport={handleExportToExcel}
              isGenerating={isGenerating}
              isFormValid={isFormValid}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}