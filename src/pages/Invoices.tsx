import { useState } from 'react';
import { FileText, Download, Mail, Eye, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { mockInvoices, Invoice } from '../data/mockData';

export function Invoices() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingAmount = invoices.filter(inv => inv.status === 'unpaid').reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices Management</h1>
        </div>
        <Button>Generate Invoice</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">₹{pendingAmount.toLocaleString()}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Amount</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{invoices.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Invoices</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer or invoice ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="unpaid">Unpaid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Invoices ({filteredInvoices.length})
          </h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Invoice ID</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Customer</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Due Date</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left pb-3 text-sm font-medium text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.id}
                    </td>
                    <td className="py-4 text-sm text-gray-900 dark:text-white">
                      {invoice.customerName}
                    </td>
                    <td className="py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(invoice.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm text-gray-900 dark:text-white">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                      ₹{invoice.amount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <Badge variant={
                        invoice.status === 'paid' ? 'success' :
                        invoice.status === 'unpaid' ? 'warning' : 'danger'
                      }>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="secondary">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}