import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { paymentService } from '../services/paymentService';
import { PaymentResponse } from '../types';
import PaymentCountdown from '../components/PaymentCountdown';

const VietQrCheckoutPage = () => {
    const { bookingId } = useParams<{ bookingId: string }>();
    const [payment, setPayment] = useState<PaymentResponse | null>(null);
    const navigate = useNavigate();

    // Wrap handleExpire with useCallback to prevent unnecessary re-renders
    const handleExpire = useCallback(() => {
        navigate(`/payment/result?status=EXPIRED`);
    }, [navigate]);

    // Logic polling: Check status every 5s
    useEffect(() => {
        if (!payment || payment.status !== 'PENDING') return;

        const interval = setInterval(async () => {
            try {
                const data = await paymentService.getPaymentStatus(payment.id);
                //  Stop polling if status is no longer PENDING (SUCCESS, FAILED, EXPIRED)
                if (data.status !== 'PENDING') {
                    clearInterval(interval);
                    navigate(`/payment/result?status=${data.status}`);
                }
            } catch (err) {
                console.error("Polling error:", err);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [payment, navigate]);

    useEffect(() => {
        if (bookingId) {
            // Create payment session on page load
            paymentService.createPayment(bookingId)
                .then(setPayment)
                .catch(err => console.error("Payment Error:", err));
        }
    }, [bookingId]);

    if (!payment) return <div className="p-10 text-center text-primary">Initializing payment...</div>;

    return (
        <div className="container mx-auto py-10 flex flex-col items-center justify-center min-h-[70vh] space-y-6">
            <PaymentCountdown expiredAt={payment.expiredAt} onExpire={handleExpire} />

            <Card className="w-full max-w-md shadow-lg border-primary/20">
                <CardHeader className="text-center border-b mb-4 bg-primary/5">
                    <CardTitle className="text-2xl text-primary">VietQR Payment</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Ref: {payment.transactionReference}</p>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6 pt-4">
                    <div className="bg-white p-4 rounded-xl border-2 border-primary shadow-inner">
                        <img
                            src={payment.qrCodeUrl}
                            alt="VietQR code"
                            className="w-64 h-64 object-contain"
                        />
                    </div>

                    <div className="text-center space-y-3 w-full">
                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                            <p className="text-sm font-medium text-muted-foreground uppercase">Total Amount</p>
                            <p className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(payment.amount)}
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground italic">
                            Scan QR to pay via banking app
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default VietQrCheckoutPage;