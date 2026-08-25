import React, { useState, useEffect } from 'react';

interface Props {
    expiredAt: any; // Can be ISO string or Array [Y, M, D, H, m, s]
    onExpire: () => void;
}

const PaymentCountdown = ({ expiredAt, onExpire }: Props) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const calculate = () => {
            let expiryDate: Date;

            // Handle Java LocalDateTime array serialization
            if (Array.isArray(expiredAt)) {
                expiryDate = new Date(
                    expiredAt[0],
                    expiredAt[1] - 1, // JS month is 0-indexed
                    expiredAt[2],
                    expiredAt[3],
                    expiredAt[4],
                    expiredAt[5] || 0
                );
            } else {
                expiryDate = new Date(expiredAt);
            }

            const diff = Math.floor((expiryDate.getTime() - Date.now()) / 1000);

            if (diff <= 0) {
                setTimeLeft(0);
                onExpire();
                return true; // Stop
            }

            setTimeLeft(diff);
            return false;
        };

        const isAlreadyExpired = calculate();

        if (!isAlreadyExpired) {
            const timer = setInterval(() => {
                if (calculate()) clearInterval(timer);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [expiredAt, onExpire]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (timeLeft === 0) return null;

    return (
        <div className="text-lg font-mono font-bold text-red-600 bg-red-50 px-6 py-2 rounded-full border border-red-200 shadow-sm animate-pulse">
            Expires in: {formatTime(timeLeft)}
        </div>
    );
};

export default PaymentCountdown;