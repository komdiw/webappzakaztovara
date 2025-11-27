import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export function InstructionsAccordion() {
    return (
        <Accordion type="single" collapsible className="mb-6">
            <AccordionItem value="instructions" className="bg-blue-50 border-blue-200 rounded-lg border px-6">
                <AccordionTrigger className="hover:no-underline">
                    <h3 className="font-semibold text-blue-800">Как использовать форму:</h3>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm ml-2">
                        <li>Введите ссылку на товар с 1688.com, taobao.com или tmall.com</li>
                        <li>Добавьте фото товара (опционально)</li>
                        <li>Укажите количество, цену, цвет и размер</li>
                        <li>Добавьте еще товары при необходимости</li>
                        <li>Нажмите "Скачать Excel" для получения бланка заказа</li>
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
