import { useState, useEffect, useCallback } from 'react'
import { useOrderStore } from '@/lib/store'
import { toast } from 'sonner'

export function useOrderForm() {
    const { items, addItem, updateItem, removeItem, getTotalAmount } = useOrderStore()
    const [isGenerating, setIsGenerating] = useState(false)
    const [draggedOver, setDraggedOver] = useState<string | null>(null)

    // Автосохранение в localStorage
    useEffect(() => {
        localStorage.setItem('orderItems', JSON.stringify(items))
    }, [items])

    const processImageFile = useCallback((itemId: string, file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Пожалуйста, загрузите изображение')
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            updateItem(itemId, 'photo', reader.result as string)
            toast.success('Фото загружено')
        }
        reader.readAsDataURL(file)
    }, [updateItem])

    const handlePhotoUpload = useCallback((itemId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            processImageFile(itemId, file)
        }
    }, [processImageFile])

    const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
        e.preventDefault()
        setDraggedOver(itemId)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDraggedOver(null)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent, itemId: string) => {
        e.preventDefault()
        setDraggedOver(null)

        const file = e.dataTransfer.files[0]
        if (file) {
            processImageFile(itemId, file)
        }
    }, [processImageFile])

    const duplicateItem = useCallback((itemId: string) => {
        const item = items.find(i => i.id === itemId)
        if (item) {
            addItem()
            // Получаем ID последнего добавленного товара
            setTimeout(() => {
                const newItem = useOrderStore.getState().items.slice(-1)[0]
                if (newItem) {
                    Object.entries(item).forEach(([key, value]) => {
                        if (key !== 'id') {
                            updateItem(newItem.id, key as any, value)
                        }
                    })
                }
                toast.success('Товар продублирован')
                // Скролл к новому товару
                setTimeout(() => {
                    const cards = document.querySelectorAll('[data-item-card]')
                    const lastCard = cards[cards.length - 1]
                    lastCard?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }, 200)
            }, 100)
        }
    }, [items, addItem, updateItem])

    const validateUrl = useCallback((url: string) => {
        if (!url.trim()) return false
        const validDomains = ['1688.com', 'taobao.com', 'tmall.com', 'world.taobao.com']
        return validDomains.some(domain => url.includes(domain))
    }, [])

    const isItemValid = useCallback((item: any) => {
        return validateUrl(item.url) && item.price > 0 && item.quantity > 0
    }, [validateUrl])

    const handleExportToExcel = async () => {
        setIsGenerating(true)

        try {
            const response = await fetch('/api/export-excel', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ items }),
            })

            if (!response.ok) {
                throw new Error('Failed to generate Excel file')
            }

            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            a.download = `order_${new Date().toISOString().split('T')[0]}.xlsx`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)

            toast.success('Excel файл успешно создан и скачан!')
        } catch (error) {
            toast.error('Ошибка при создании Excel файла')
            console.error('Export error:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    const isFormValid = items.some(isItemValid)

    return {
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
    }
}
