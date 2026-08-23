import React, { useState, useEffect } from 'react';

interface Props { expiredAt: string; onExpire: () => void; }

const PaymentCountdown = ({ expiredAt, onExpire }: Props) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        // Return true if expired, false otherwise
        const calculate = () => {
            const diff = Math.floor((new Date(expiredAt).getTime() - Date.now()) / 1000);
            if (diff <= 0) {
                setTimeLeft(0);
                onExpire();
                return true;
            }
            setTimeLeft(diff);
            return false;
        };

        // 1. Initial check on mount
        const isAlreadyExpired = calculate();

        // 2. Only start interval if NOT expired yet
        if (!isAlreadyExpired) {
            const timer = setInterval(() => {
                const done = calculate();
                if (done) clearInterval(timer);
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [expiredAt, onExpire]);

    const format = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="text-lg font-mono font-bold text-red-600 bg-red-50 px-4 py-2 rounded-full border border-red-200 shadow-sm">
            Expires in: {format(timeLeft)}
        </div>
    );
};

export default PaymentCountdown;