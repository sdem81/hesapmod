'use client';

import React, { useState } from 'react';
import { calculateVatBreakdown } from '@/mobile/src/sharedCalculations';

export function QuickCalculator() {
    const [amount, setAmount] = useState<string>('1000');
    const [rate, setRate] = useState<number>(20);

    const { vatAmount, totalAmount } = calculateVatBreakdown({
        amount,
        ratePercent: rate,
        type: 'excluded',
    });

    return (
        <div className="w-full max-w-[640px] mx-auto mt-12 mb-8 bg-card/60 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl overflow-hidden animate-[fade-in-up_0.9s_0.9s_both]">
            <div className="bg-muted/30 border-b border-border/50 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-amber-400/80"></div>
                        <div className="w-3 h-3 rounded-full bg-green-400/80"></div>
                    </div>
                    <span className="text-xs font-mono ml-3 text-muted-foreground tracking-widest uppercase">Canlı Test: KDV Hesaplama</span>
                </div>
                <div className="text-[0.65rem] text-primary bg-primary/10 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                    Anında Sonuç
                </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1 w-full space-y-5 relative">
                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">Tutar (TL)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">₺</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full h-12 pl-8 pr-4 bg-background/50 border border-border rounded-lg outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 text-foreground text-lg transition-all"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5 block">KDV Oranı</label>
                        <div className="flex gap-2">
                            {[1, 10, 20].map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRate(r)}
                                    className={`flex-1 h-10 rounded-md text-sm font-medium transition-all ${rate === r ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-background/50 border border-border text-muted-foreground hover:bg-muted'}`}
                                >
                                    %{r}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="w-px h-32 bg-border/50 hidden md:block"></div>
                <div className="w-full h-px bg-border/50 block md:hidden"></div>

                <div className="flex-[0.8] w-full flex flex-col justify-center">
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-muted-foreground">KDV Tutarı</span>
                            <span className="text-lg font-medium text-foreground">₺{vatAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="w-full h-px bg-border/50"></div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-semibold text-foreground">Toplam Tutar</span>
                            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                ₺{totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
