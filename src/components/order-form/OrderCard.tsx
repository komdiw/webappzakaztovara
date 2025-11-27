import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Copy, Upload } from 'lucide-react'
import { OrderItem } from '@/lib/store'
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface OrderCardProps {
    item: OrderItem
    index: number
    isLastItem: boolean
    isValid: boolean
    draggedOver: boolean
    onUpdate: (id: string, field: keyof OrderItem, value: any) => void
    onRemove: (id: string) => void
    onDuplicate: (id: string) => void
    onPhotoUpload: (id: string, event: React.ChangeEvent<HTMLInputElement>) => void
    onDragOver: (e: React.DragEvent, id: string) => void
    onDragLeave: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent, id: string) => void
    validateUrl: (url: string) => boolean
}

export function OrderCard({
    item,
    index,
    isLastItem,
    isValid,
    draggedOver,
    onUpdate,
    onRemove,
    onDuplicate,
    onPhotoUpload,
    onDragOver,
    onDragLeave,
    onDrop,
    validateUrl
}: OrderCardProps) {
    return (
        <Card
            data-item-card
            className={`
        relative animate-in fade-in slide-in-from-bottom-4 duration-300
        ${isValid ? 'border-green-200 bg-green-50/30' : ''}
      `}
        >
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                            Товар {index + 1}
                        </CardTitle>
                        {isValid && (
                            <span className="text-green-600 text-sm flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Готово
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => onDuplicate(item.id)}
                                    className="text-blue-600 hover:text-blue-700"
                                >
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Дублировать товар</p>
                            </TooltipContent>
                        </Tooltip>

                        {!isLastItem && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onRemove(item.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Удалить товар</p>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Левая колонка: URL и Фото */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`url-${item.id}`}>
                                Ссылка на товар *
                            </Label>
                            <Input
                                id={`url-${item.id}`}
                                type="url"
                                placeholder="https://1688.com/... или https://taobao.com/..."
                                value={item.url}
                                onChange={(e) => onUpdate(item.id, 'url', e.target.value)}
                                className={item.url && !validateUrl(item.url) ? 'border-red-500' : ''}
                            />
                            {item.url && !validateUrl(item.url) && (
                                <p className="text-sm text-red-500">
                                    Пожалуйста, введите корректную ссылку с 1688.com, taobao.com или tmall.com
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`photo-${item.id}`}>
                                Фото товара
                            </Label>
                            <div
                                onDragOver={(e) => onDragOver(e, item.id)}
                                onDragLeave={onDragLeave}
                                onDrop={(e) => onDrop(e, item.id)}
                                className={`
                  border-2 border-dashed rounded-lg p-4 transition-all
                  ${draggedOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
                  ${item.photo ? 'bg-gray-50' : ''}
                `}
                            >
                                <Input
                                    id={`photo-${item.id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => onPhotoUpload(item.id, e)}
                                    className="hidden"
                                />

                                {item.photo ? (
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={item.photo}
                                            alt="Товар"
                                            className="w-20 h-20 object-cover rounded border"
                                        />
                                        <div className="flex-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => document.getElementById(`photo-${item.id}`)?.click()}
                                                className="w-full"
                                            >
                                                <Upload className="w-4 h-4 mr-2" />
                                                Изменить фото
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => document.getElementById(`photo-${item.id}`)?.click()}
                                            className="text-sm"
                                        >
                                            Нажмите или перетащите фото
                                        </Button>
                                        <p className="text-xs text-gray-500 mt-1">PNG, JPG до 10MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Правая колонка: Количество, Цена, Цвет, Размер */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor={`quantity-${item.id}`}>
                                Количество *
                            </Label>
                            <Input
                                id={`quantity-${item.id}`}
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => onUpdate(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`price-${item.id}`}>
                                Цена (юань) *
                            </Label>
                            <Input
                                id={`price-${item.id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price || ''}
                                onChange={(e) => onUpdate(item.id, 'price', parseFloat(e.target.value) || 0)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`color-${item.id}`}>
                                Цвет
                            </Label>
                            <Input
                                id={`color-${item.id}`}
                                type="text"
                                placeholder="Например: красный, синий, черный"
                                value={item.color}
                                onChange={(e) => onUpdate(item.id, 'color', e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor={`size-${item.id}`}>
                                Размер
                            </Label>
                            <Input
                                id={`size-${item.id}`}
                                type="text"
                                placeholder="Например: L, XL, 42, 43"
                                value={item.size}
                                onChange={(e) => onUpdate(item.id, 'size', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
