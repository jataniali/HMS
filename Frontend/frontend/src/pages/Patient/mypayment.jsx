import React, { useState, useEffect } from 'react';
import { FiDownload, FiFileText, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { paymentAPI } from '../../api/payments';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyPayment = ({ user }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        if (!user?._id) {
          setError('User information not available');
          return;
        }
        
        const response = await paymentAPI.getPatientPayments(user._id);
        setPayments(response.payments || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError(error.message || 'Failed to load payments');
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [user]);

  const handleDownloadReceipt = (receiptNumber) => {
    // Implement receipt download logic here
    console.log('Downloading receipt:', receiptNumber);
    // This would typically generate or fetch a PDF receipt
  };

  const statusIcon = (status) => {
    return status === 'completed' ? (
      <FiCheckCircle className="text-green-500" />
    ) : status === 'pending' ? (
      <FiFileText className="text-yellow-500" />
    ) : (
      <FiXCircle className="text-red-500" />
    );
  };

  // Format payment data for display
  const formatPaymentData = (payment) => {
    return {
      id: payment._id,
      invoiceNumber: payment.bill ? `INV-${payment.bill._id?.toString().slice(-6).toUpperCase()}` : 'N/A',
      datePaid: payment.createdAt || payment.transactionDate,
      amount: payment.amount || 0,
      paymentMethod: payment.paymentMethod || 'M-Pesa',
      status: payment.paymentStatus || 'pending',
      receiptNumber: payment.mpesaReceiptNumber || `RCPT-${payment._id?.toString().slice(-6).toUpperCase()}`
    };
  };

  const formattedPayments = payments.map(formatPaymentData);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiXCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Payment History</h1>
        
        {/* Payment Summary */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Total Payments</h3>
              <p className="text-sm text-gray-500">Overview of all your payment transactions</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">
                Ksh {formattedPayments
                  .filter(p => p.status === 'completed')
                  .reduce((sum, payment) => sum + payment.amount, 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total paid amount</p>
            </div>
          </div>
        </div>

        {/* Payments - Desktop Table, Mobile Cards */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {formattedPayments.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Paid</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Method</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {formattedPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.datePaid).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          Ksh {payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.paymentMethod}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {statusIcon(payment.status)}
                            <span className="ml-2 text-sm capitalize">{payment.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDownloadReceipt(payment.receiptNumber)}
                            className="text-blue-600 hover:text-blue-900 flex items-center justify-end w-full"
                            disabled={payment.status !== 'completed'}
                          >
                            {payment.status === 'completed' ? (
                              <>
                                <FiDownload className="mr-2" />
                                Download
                              </>
                            ) : (
                              <span className="text-gray-400">N/A</span>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {formattedPayments.map((payment) => (
                  <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{payment.invoiceNumber}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.datePaid).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">Ksh {payment.amount.toLocaleString()}</p>
                        <div className="flex items-center justify-end">
                          {statusIcon(payment.status)}
                          <span className="ml-2 text-sm capitalize">{payment.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="text-gray-900">{payment.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Receipt #:</span>
                        <span className="text-gray-900">{payment.receiptNumber}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleDownloadReceipt(payment.receiptNumber)}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                      disabled={payment.status !== 'completed'}
                    >
                      {payment.status === 'completed' ? (
                        <>
                          <FiDownload className="mr-2" />
                          Download Receipt
                        </>
                      ) : (
                        'Receipt Not Available'
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No payments found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPayment;
