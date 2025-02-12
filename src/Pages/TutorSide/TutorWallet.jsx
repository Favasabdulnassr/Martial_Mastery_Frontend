import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';

const TutorWallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
  });
  const { user } = useSelector((state) => state.login);

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const response = await axiosInstance.get(`tutor-wallet/${user.id}/`);
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-100">
      <TutorSidebar />
      <div className="flex-1 lg:ml-80">
        <TutorTopbar />
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">My Wallet</h1>
            <p className="text-gray-400 mt-1">Manage your earnings and view transaction history</p>
          </div>

          {/* Balance Card */}
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Available Balance</p>
                  <p className="text-3xl font-bold mt-1">${walletData.balance.toFixed(2)}</p>
                </div>
                <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History Table */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-gray-400">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 font-medium text-gray-200">Date</th>
                      <th className="px-6 py-4 font-medium text-gray-200">Transaction Type</th>
                      <th className="px-6 py-4 font-medium text-gray-200">Details</th>
                      <th className="px-6 py-4 font-medium text-gray-200">Amount</th>
                      <th className="px-6 py-4 font-medium text-gray-200">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {walletData.transactions.map((transaction, index) => (
                      <tr key={index} className="bg-gray-700 rounded-lg">
                        <td className="px-6 py-4">{new Date(transaction.date).toLocaleString()}</td>
                        <td className="px-6 py-4 capitalize">
                          {transaction.transaction_type || 'N/A'}
                        </td>
                        <td className="px-6 py-4">{transaction.transaction_details || 'N/A'}</td>
                        <td className="px-6 py-4 text-right">
                          {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">${transaction.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorWallet;
