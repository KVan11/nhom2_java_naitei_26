import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

const PaymentResultPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const isSuccess = searchParams.get('status') === 'SUCCESS';

    return (
        <div className="container mx-auto py-20 flex justify-center px-4">
            <Card className="w-full max-w-md text-center shadow-2xl border-t-8 border-t-primary">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        {isSuccess ?
                            <CheckCircle2 className="w-20 h-20 text-green-500" /> :
                            <XCircle className="w-20 h-20 text-red-500" />}
                    </div>
                    <CardTitle className="text-2xl">
                        {isSuccess ? "Payment Successful!" : "Payment Expired/Failed"}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        {isSuccess ? "Your booking is now confirmed. Enjoy your trip!" :
                            "The payment session has timed out or failed. Please try again."}
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <Button className="w-full" onClick={() => navigate('/bookings')}>My Bookings</Button>
                    <Button variant="ghost" className="w-full" onClick={() => navigate('/')}>Back to Home</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentResultPage;