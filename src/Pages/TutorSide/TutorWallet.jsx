import React, { useState, useEffect } from 'react';
import { Wallet, Menu } from 'lucide-react';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  const WithdrawalModal = () => {
    if (!showModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">Withdraw Funds</h2>
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
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-700 text-gray-100 rounded hover:bg-gray-600 text-sm sm:text-base"
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
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Sidebar - visible on medium screens and up */}
      <aside className="hidden md:block w-64 lg:w-72 flex-shrink-0 bg-gray-800 h-full overflow-y-auto">
        <TutorSidebar />
      </aside>

      {/* Main content area - always full width on mobile, adjusted width on larger screens */}
      <div className="flex flex-col flex-grow w-full md:w-[calc(100%-16rem)] lg:w-[calc(100%-18rem)] overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-gray-800 p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Tutor Dashboard</h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-b border-gray-700 p-4">
            <TutorSidebar />
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:block">
          <TutorTopbar />
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">My Wallet</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Manage your earnings and view transaction history</p>
            </div>

            {/* Balance Card */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg mb-6">
              <div className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Available Balance</p>
                    <p className="text-2xl sm:text-3xl font-bold mt-1">${walletData.balance.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-4 self-stretch sm:self-auto w-full sm:w-auto">
                    <button
                      onClick={() => setShowModal(true)}
                      className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                      disabled={walletData.balance <= 0}
                    >
                      Withdraw Funds
                    </button>
                    <div className="hidden sm:flex h-12 w-12 bg-blue-600/20 rounded-lg items-center justify-center">
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
              <div className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold mb-4">Transaction History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs sm:text-sm text-left text-gray-400">
                    <thead className="text-xs sm:text-sm">
                      <tr>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-200">Date</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-200">Type</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-200">Details</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-200">Amount</th>
                        <th className="px-2 sm:px-6 py-3 sm:py-4 font-medium text-gray-200">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {walletData.transactions.length > 0 ? (
                        walletData.transactions.map((transaction, index) => (
                          <tr key={index} className="bg-gray-700 rounded-lg">
                            <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-2 sm:px-6 py-3 sm:py-4 capitalize whitespace-nowrap">
                              {transaction.transaction_type || 'N/A'}
                            </td>
                            <td className="px-2 sm:px-6 py-3 sm:py-4 max-w-[100px] sm:max-w-none truncate">
                              {transaction.transaction_details || 'N/A'}
                            </td>
                            <td className="px-2 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                              {transaction.transaction_type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                            </td>
                            <td className="px-2 sm:px-6 py-3 sm:py-4 text-right whitespace-nowrap">
                              ${transaction.balance.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
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