export interface PaymentResponse {
    id: number;
    bookingId: string;
    amount: number;
    transactionReference: string;
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
    qrCodeUrl: string;
    createdAt: string;
    expiredAt: string;
}