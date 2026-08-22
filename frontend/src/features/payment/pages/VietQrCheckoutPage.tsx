import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentService } from '../services/paymentService';
import { PaymentResponse } from '../types';

const VietQrCheckoutPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [payment, setPayment] = useState<PaymentResponse | null>(null);

    useEffect(() => {
        if (bookingId) {
            // Create payment session on page load
            paymentService.createPayment(bookingId)
                .then(setPayment)
                .catch(err => console.error("Payment Error:", err));
        }
    }, [bookingId]);

    if (!payment) return <div className="p-10 text-center">Initializing payment...</div>;

    return (
        <div className="container mx-auto py-10 flex justify-center min-h-[70vh] items-center">
            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center border-b mb-4">
                    <CardTitle className="text-2xl">VietQR Payment</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Ref: {payment.transactionReference}</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    {/* QR Code Container */}
                    <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-inner">
                        <img
                            src={payment.qrCodeUrl}
                            alt="VietQR code"
                            className="w-64 h-64 object-contain"
                        />
                    </div>

                    <div className="text-center space-y-3 w-full">
                        <div className="bg-primary/5 p-3 rounded-lg">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Amount</p>
                            <p className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground italic font-medium">
                            Scanning this QR will automatically fill amount and description
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VietQrCheckoutPage;