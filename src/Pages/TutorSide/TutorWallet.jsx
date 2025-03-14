import React, { useState, useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { toast } from 'react-toastify';

const TutorWallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const { user } = useSelector((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);


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

  const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      toast.warning("Please enter a valid withdrawal amount");
      return;
    }

    if (parseFloat(withdrawalAmount) > walletData.balance) {
      toast.warn("Withdrawal amount exceeds available balance");
      return;
    }
    setIsSubmitting(true);


    try {
      await axiosInstance.post('tutor-withdrawal/', {
        amount: parseFloat(withdrawalAmount),
        user_id: user.id
      });

      toast.success("Withdrawal requested. Check your email for further instructions.");
      setShowModal(false);
      setWithdrawalAmount('');
      fetchWalletData(); // Refresh wallet data
    } catch (error) {
      toast.warning("Failed to process withdrawal request");
    }finally{
      setIsSubmitting(false);

    }
  };

  const WithdrawalModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-100">Withdraw Funds</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleWithdrawalSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-2">
                  Withdrawal Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  // step="0.01"
                  min="0"
                  max={walletData.balance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-100"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <p className="text-sm text-gray-400">
                Available balance: ${walletData.balance.toFixed(2)}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded text-white relative ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed opacity-75' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Submit Withdrawal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
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
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Available Balance</p>
                  <p className="text-3xl font-bold mt-1">${walletData.balance.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={walletData.balance <= 0}
                  >
                    Withdraw Funds
                  </button>
                  <div className="h-12 w-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Modal */}
          <WithdrawalModal />

          {/* Transaction History Table */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Transaction History</h2>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorWallet;