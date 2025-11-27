import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface OrderSummaryProps {
    totalAmount: number
    itemsCount: number
    validItemsCount: number
    onExport: () => void
    isGenerating: boolean
    isFormValid: boolean
}

export function OrderSummary({
    totalAmount,
    itemsCount,
    validItemsCount,
    onExport,
    isGenerating,
    isFormValid
}: OrderSummaryProps) {
    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left flex-1">
                        <p className="text-lg font-semibold">
                            Общая сумма: {totalAmount.toFixed(2)} юань
                        </p>
                        <p className="text-base font-medium text-blue-600">
                            С комиссией 5%: {(totalAmount * 1.05).toFixed(2)} юань ≈ {(totalAmount * 1.05 * 12.2).toFixed(2)} руб
                        </p>
                        <p className="text-sm text-gray-600">
                            Всего товаров: {itemsCount} • Заполнено: {validItemsCount}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    onClick={onExport}
                                    disabled={!isFormValid || isGenerating}
                                    className="min-w-[150px]"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    {isGenerating ? 'Создание...' : 'Скачать Excel'}
                                </Button>
                            </TooltipTrigger>
                            {!isFormValid && (
                                <TooltipContent>
                                    <p>Заполните хотя бы один товар с корректными данными</p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
