import MonthlyExpensesChart from "@/components/MonthlyExpensesChart";
import TransactionForm from "@/components/Transactionform";
import TransactionList from '@/components/TransactionList';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Personal Finance Tracker</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
        <TransactionForm />
        <TransactionList />


        </div>
        <div className=" p-6 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
          <MonthlyExpensesChart />

        </div>
      </div>
    </main>
  );
}