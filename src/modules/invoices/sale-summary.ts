import { Invoice } from '../../schemas/invoice.schema';

export interface SalesSummary {
    date: string;
    totalSales: number;
    skuSummary: Record<string, number>;
}

export async function generateSalesSummary(invoices: Invoice[]): Promise<SalesSummary> {
    let totalSales = 0;
    const skuSummary: Record<string, number> = {};

    for (const invoice of invoices) {
        totalSales += invoice.amount;

        for (const item of invoice.items) {
            skuSummary[item.sku] = (skuSummary[item.sku] || 0) + item.qt;
        }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
        date: today.toISOString().split('T')[0],
        totalSales,
        skuSummary,
    };
}



