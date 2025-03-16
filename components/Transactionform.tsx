'use client';
import { toast } from 'sonner';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) !== 0, {
    message: 'Amount must be a non-zero number',
  }),
  date: z.string().min(1, 'Date is required'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export default function TransactionForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit: SubmitHandler<TransactionFormValues> = async (data) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to add transaction');

      toast.success("Transaction Added Successfully");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Some error Occured");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className='space-y-2'>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              placeholder="Enter amount"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" className='bg-gray-500 placeholder:text-black' {...register('date')} />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full">
            Add Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}