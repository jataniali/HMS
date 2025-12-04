import React, { useState, useEffect } from 'react';
import { billsAPI } from '../../api/bills';
import { paymentAPI } from '../../api/payments';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBills = ({ user }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Fetch bills from API
  useEffect(() => {
    const fetchBills = async () => {
      try {
        if (!user?._id) {
          setError('User information not available');
          return;
        }
        
        const response = await billsAPI.getPatientBills(user._id);
        setBills(response.bills || []);
      } catch (error) {
        console.error('Error fetching bills:', error);
        setError(error.message || 'Failed to fetch bills');
        toast.error('Failed to load your bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, [user]);

  // Calculate summary - using backend data structure
  const totalBilled = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  const totalPaid = bills
    .filter(bill => bill.status === 'paid')
    .reduce((sum, bill) => sum + (bill.total || 0), 0);
  const totalPending = bills
    .filter(bill => bill.status === 'pending')
    .reduce((sum, bill) => sum + (bill.total || 0), 0);

  const filteredBills = statusFilter === 'All' 
    ? bills 
    : bills.filter(bill => bill.status === statusFilter.toLowerCase());

  const handlePayNow = (bill) => {
    setSelectedBill(bill);
    setShowPaymentModal(true);
    // Pre-fill phone number if available
    setPhoneNumber(user?.phone || '');
  };

  const handleMpesaPayment = async () => {
    console.log('M-Pesa payment button clicked');
    console.log('Phone number:', phoneNumber);
    console.log('Selected bill:', selectedBill);
    console.log('User:', user);

    if (!phoneNumber || !phoneNumber.startsWith('254') || phoneNumber.length !== 12) {
      console.log('Phone validation failed');
      toast.error('Please enter a valid phone number in format 254XXXXXXXXX');
      return;
    }

    if (!selectedBill) {
      console.log('No bill selected');
      toast.error('No bill selected');
      return;
    }

    console.log('Validation passed, setting processing to true');
    setPaymentProcessing(true);

    try {
      // Calculate total amount from bill items
      const amount = selectedBill.items?.reduce((sum, item) => sum + (item.price || 0), 0) || selectedBill.total || 0;

      const paymentData = {
        billId: selectedBill._id,
        patientId: user._id,
        phone: phoneNumber,
        amount: amount
      };

      console.log('Initiating M-Pesa payment with data:', paymentData);

      const response = await paymentAPI.initiateMpesaPayment(paymentData);
      console.log('M-Pesa API response:', response);
      
      toast.success('M-Pesa STK Push sent! Please check your phone to complete payment.');
      
      // Start checking payment status
      setTimeout(() => {
        checkPaymentStatus(response.payment._id);
      }, 5000);

      setShowPaymentModal(false);
      setSelectedBill(null);
      setPhoneNumber('');

    } catch (error) {
      console.error('Error initiating M-Pesa payment:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || error.message || 'Failed to initiate M-Pesa payment');
    } finally {
      console.log('Setting processing to false');
      setPaymentProcessing(false);
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    try {
      const response = await paymentAPI.checkPaymentStatus(paymentId);
      
      if (response.status === 'completed') {
        toast.success('Payment completed successfully!');
        // Refresh bills list
        const billsResponse = await billsAPI.getPatientBills(user._id);
        setBills(billsResponse.bills || []);
      } else if (response.status === 'failed') {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  const statusBadge = (status) => {
    const statusClasses = {
      'paid': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'canceled': 'bg-red-100 text-red-800'
    };

    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);

    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
        {displayStatus}
      </span>
    );
  };

  // Helper function to format bill data for display
  const formatBillData = (bill) => {
    return {
      id: bill._id,
      invoiceNumber: `INV-${bill.createdAt ? new Date(bill.createdAt).getFullYear() : '2025'}-${String(bill._id).slice(-6).toUpperCase()}`,
      service: bill.items && bill.items.length > 0 ? bill.items.map(item => item.name).join(', ') : 'Medical Services',
      date: bill.createdAt,
      amount: bill.total || 0,
      status: bill.status,
      paymentMethod: bill.status === 'paid' ? 'Online Payment' : '',
    };
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your bills...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error loading bills</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">My Bills</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Billed</h3>
            <p className="text-2xl font-bold">Ksh {totalBilled.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Paid</h3>
            <p className="text-2xl font-bold text-green-600">Ksh {totalPaid.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Pending</h3>
            <p className="text-2xl font-bold text-yellow-600">Ksh {totalPending.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center">
            <label htmlFor="statusFilter" className="mr-2 text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2 text-sm"
            >
              <option value="All">All Bills</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        {/* Bills - Desktop Table, Mobile Cards */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBills.length > 0 ? (
                  filteredBills.map((bill) => {
                    const formattedBill = formatBillData(bill);
                    return (
                      <tr key={bill._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formattedBill.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formattedBill.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(formattedBill.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Ksh {formattedBill.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {statusBadge(formattedBill.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formattedBill.paymentMethod || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {formattedBill.status === 'pending' && (
                            <button
                              onClick={() => handlePayNow(bill)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No bills found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredBills.length > 0 ? (
              filteredBills.map((bill) => {
                const formattedBill = formatBillData(bill);
                return (
                  <div key={bill._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{formattedBill.invoiceNumber}</h3>
                        <p className="text-sm text-gray-600">{new Date(formattedBill.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">Ksh {formattedBill.amount.toLocaleString()}</p>
                        {statusBadge(formattedBill.status)}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Service:</span>
                        <span className="text-gray-900 text-right flex-1 ml-2">{formattedBill.service}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment:</span>
                        <span className="text-gray-900">{formattedBill.paymentMethod || '-'}</span>
                      </div>
                    </div>
                    
                    {formattedBill.status === 'pending' && (
                      <button
                        onClick={() => handlePayNow(bill)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No bills found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* M-Pesa Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Complete Payment with M-Pesa</h2>
              
              {selectedBill && (
                <div className="mb-4">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs sm:text-sm text-gray-600">Bill Amount</p>
                    <p className="text-xl sm:text-2xl font-bold text-blue-600">
                      Ksh {(selectedBill.items?.reduce((sum, item) => sum + (item.price || 0), 0) || selectedBill.total || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="254XXXXXXXXX"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your M-Pesa registered phone number
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:space-x-3 sm:gap-0">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBill(null);
                    setPhoneNumber('');
                  }}
                  disabled={paymentProcessing}
                  className="w-full sm:w-auto px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    console.log('Button clicked directly');
                    handleMpesaPayment();
                  }}
                  disabled={paymentProcessing}
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center text-sm"
                >
                  {paymentProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Pay with M-Pesa'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBills;
