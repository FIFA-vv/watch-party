import jsPDF from 'jspdf';
import { SUBSCRIPTION_PLANS } from '../data/plansData';

export function generateInvoice(
    planId,
    billingCycle,
    userEmail = 'alex.rivera@aurastream.io',
    userName = 'Alex Rivera',
    paymentId = `pay_rzp_${Math.random().toString(36).substring(2, 10)}`,
    orderId = `order_${Math.random().toString(36).substring(2, 10)}`,
    paymentMethod = 'Razorpay Test (UPI / Card)'
) {
    const plan = SUBSCRIPTION_PLANS[planId] || SUBSCRIPTION_PLANS.Free;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const expiry = new Date(now);
    if (billingCycle === 'yearly') {
        expiry.setFullYear(expiry.getFullYear() + 1);
    } else {
        expiry.setMonth(expiry.getMonth() + 1);
    }
    const expiryStr = expiry.toISOString().split('T')[0];

    const rawPrice = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
    const monthlyEquivalent = plan.priceMonthly * 12;
    const discount = billingCycle === 'yearly' ? Math.max(0, monthlyEquivalent - plan.priceYearly) : 0;

    const basePrice = Math.round(rawPrice / 1.18);
    const taxAmount = rawPrice - basePrice;
    const invoiceId = `INV-${now.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    return {
        invoiceId,
        userId: 'usr_wetube_1001',
        userName,
        userEmail,
        planId,
        planName: plan.name,
        billingCycle,
        baseAmount: basePrice,
        discountAmount: discount,
        subtotal: basePrice,
        taxAmount: taxAmount,
        totalAmount: rawPrice,
        currency: '₹',
        paymentId,
        orderId,
        paymentMethod,
        status: 'PAID',
        createdAt: dateStr,
        expiryDate: expiryStr,
        items: [
            {
                description: `WeTube ${plan.name} (${billingCycle.toUpperCase()} Subscription)`,
                amount: basePrice,
            },
        ],
    };
}

export function exportInvoicePDF(invoice) {
    try {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        // Brand Header
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, 210, 40, 'F');

        doc.setTextColor(239, 68, 68); // Red logo
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('WeTube Premium', 15, 20);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Official Subscription Tax Invoice', 15, 28);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`INVOICE: ${invoice.invoiceId}`, 145, 20);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${invoice.createdAt}`, 145, 27);
        doc.text(`Status: ${invoice.status}`, 145, 32);

        // Customer & Details
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Billed To:', 15, 52);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${invoice.userName}`, 15, 58);
        doc.text(`Email: ${invoice.userEmail}`, 15, 64);
        doc.text(`Plan: ${invoice.planName} (${invoice.billingCycle.toUpperCase()})`, 15, 70);

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Payment Gateway Details:', 120, 52);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Payment ID: ${invoice.paymentId}`, 120, 58);
        doc.text(`Order ID: ${invoice.orderId}`, 120, 64);
        doc.text(`Gateway: ${invoice.paymentMethod}`, 120, 70);
        doc.text(`Valid Until: ${invoice.expiryDate}`, 120, 76);

        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, 88, 180, 10, 'F');
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Description', 20, 94);
        doc.text('Billing Cycle', 110, 94);
        doc.text('Amount (INR)', 160, 94);

        // Item Row
        doc.setFont('helvetica', 'normal');
        doc.text(invoice.items[0].description, 20, 106);
        doc.text(invoice.billingCycle.toUpperCase(), 110, 106);
        doc.text(`INR ${invoice.baseAmount.toLocaleString('en-IN')}`, 160, 106);

        doc.setLineWidth(0.3);
        doc.setDrawColor(203, 213, 225);
        doc.line(15, 115, 195, 115);

        // Calculations
        let currentY = 125;
        doc.setFontSize(10);
        doc.text('Base Amount:', 130, currentY);
        doc.text(`INR ${invoice.baseAmount.toLocaleString('en-IN')}`, 165, currentY);

        if (invoice.discountAmount > 0) {
            currentY += 6;
            doc.setTextColor(22, 163, 74);
            doc.text('Yearly Discount:', 130, currentY);
            doc.text(`- INR ${invoice.discountAmount.toLocaleString('en-IN')}`, 165, currentY);
            doc.setTextColor(15, 23, 42);
        }

        currentY += 6;
        doc.text('GST / Tax (18%):', 130, currentY);
        doc.text(`INR ${invoice.taxAmount.toLocaleString('en-IN')}`, 165, currentY);

        currentY += 8;
        doc.setFillColor(239, 68, 68);
        doc.rect(125, currentY - 5, 70, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.text('Total Paid:', 130, currentY + 2);
        doc.text(`INR ${invoice.totalAmount.toLocaleString('en-IN')}`, 165, currentY + 2);

        // Footer
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'italic');
        doc.text('Thank you for subscribing to WeTube! This is a computer-generated tax receipt.', 15, 270);
        doc.text('For any questions or billing queries, contact support@wetube.com', 15, 275);

        doc.save(`${invoice.invoiceId}_WeTube_${invoice.planId}.pdf`);
    } catch (err) {
        console.error('Failed to generate PDF invoice', err);
    }
}
