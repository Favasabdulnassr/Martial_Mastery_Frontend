import React, { useState, useEffect } from 'react';
import { Wallet, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import axiosInstance from '@/services/interceptor';
import TutorSidebar from '@/Components/TutorSidebar';
import TutorTopbar from '@/Components/TutorTopbar';
import { toast } from 'react-toastify';
import { useTutorSidebar } from '@/Components/TutorSidebarProvider';

const TutorWallet = () => {
  const [walletData, setWalletData] = useState({
    balance: 0,
    transactions: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const { user } = useSelector((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSidebarTutorOpen } = useTutorSidebar();

  useEffect(() => {
    fetchWalletData();
  }, [user]);

  const fetchWalletData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const WithdrawalModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white p-4 sm:p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Withdraw Funds</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-600 hover:text-gray-800 text-2xl"
            >
              ×
            </button>
          </div>
          
          <form onSubmit={handleWithdrawalSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Amount ($)
                </label>
                <input
                  id="amount"
                  type="number"
                  min="0"
                  max={walletData.balance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-800"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <p className="text-sm text-gray-600">
                Available balance: ${walletData.balance.toFixed(2)}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded text-white relative text-sm sm:text-base ${
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
    <div className="flex min-h-screen bg-gray-50 text-gray-800 w-full">
      {/* Sidebar - Fixed position on large screens, hidden or overlay on mobile */}
      <div className={`fixed top-0 left-0 h-full w-72 lg:w-80 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 z-20 ${
        isSidebarTutorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <TutorSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 lg:ml-80 bg-gray-50 min-w-0 w-full">
        {/* Topbar */}
        <TutorTopbar />

        {/* Page Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Wallet</h1>
            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your earnings and view transaction history</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white border border-gray-200 rounded-lg mb-6 overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1 text-gray-800">${walletData.balance.toFixed(2)}</p>
                </div>
                <div className="flex items-center space-x-4 self-stretch sm:self-auto w-full sm:w-auto">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={walletData.balance <= 0}
                  >
                    Withdraw Funds
                  </button>
                  <div className="hidden sm:flex h-12 w-12 bg-blue-100 rounded-lg items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Modal */}
          <WithdrawalModal />

          {/* Mobile View */}
          <div className="bg-white border border-gray-200 rounded-lg block md:hidden overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
              
              {walletData.transactions.length > 0 ? (
                <div className="space-y-4 divide-y divide-gray-200">
                  {walletData.transactions.map((transaction, index) => (
                    <div key={index} className="pt-4 first:pt-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {transaction.transaction_type || 'N/A'}
                        </span>
                        <span className={`text-sm font-medium ${transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        <span>Balance: ${transaction.balance.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {transaction.transaction_details || 'N/A'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-600">
                  No transactions found
                </div>
              )}
            </div>
          </div>

          {/* Desktop View */}
          <div className="bg-white border border-gray-200 rounded-lg hidden md:block overflow-hidden shadow-sm">
            <div className="p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-4 text-gray-800">Transaction History</h2>
              <div className="overflow-x-auto -mx-4 sm:-mx-6">
                <div className="inline-block min-w-full align-middle px-4 sm:px-6">
                  <table className="min-w-full text-xs sm:text-sm text-left text-gray-600">
                    <thead className="text-xs sm:text-sm">
                      <tr>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-700">Date</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-700">Type</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-700">Details</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-700 text-right">Amount</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-700 text-right">Balance</th>
                      </tr>
                    </thead>
                  <tbody>
                    {walletData.transactions.length > 0 ? (
                      walletData.transactions.map((transaction, index) => (
                        <tr key={index} className="bg-gray-50 hover:bg-gray-100 border-b border-gray-200 last:border-0">
                          <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            {new Date(transaction.date).toLocaleDateString()}
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 capitalize whitespace-nowrap">
                            {transaction.transaction_type || 'N/A'}
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 max-w-[150px] sm:max-w-xs truncate">
                            {transaction.transaction_details || 'N/A'}
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                            <span className={transaction.transaction_type === 'credit' ? 'text-green-600' : 'text-red-600'}>
                              {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </span>
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                            ${transaction.balance.toFixed(2)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-600">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorWallet;