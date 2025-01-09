import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Wallet, ArrowDownCircle, ArrowUpCircle, DollarSign } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';

const TutorWallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: []
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.login);

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      const response = await axiosInstance.get(`payments/tutor-wallet/${user.id}/`);
      setWalletData(response.data);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/tutor-wallet/withdraw/', {
        amount: withdrawAmount,
        tutor_id: user.id
      });
      
      if (response.data.success) {
        alert('Withdrawal initiated successfully');
        fetchWalletData(); // Refresh wallet data
        setWithdrawAmount('');
      }
    } catch (error) {
      alert('Withdrawal failed. Please try again.');
      console.error('Withdrawal error:', error);
    }
    setLoading(false);
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
            <p className="text-gray-400 mt-1">Manage your earnings and withdrawals</p>
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

              <div className="mt-6">
                {/* <div className="flex items-center space-x-4">
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount to withdraw"
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleWithdraw}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Withdraw'}
                  </button>
                </div> */}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {walletData.description.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      {transaction.type === 'credit' ? (
                        <ArrowDownCircle className="w-8 h-8 text-green-400" />
                      ) : (
                        <ArrowUpCircle className="w-8 h-8 text-red-400" />
                      )}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-400">{new Date(transaction.created_at).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TutorWallet;