import { useState, useEffect } from 'react';
import BookingsAPIService from '../services/BookingAPIService';
import { Users, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button'; // ✅ Import your Button component

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    BookingsAPIService.getAllBookings()
      .then((response) => {
        console.log("Fetched bookings:", response.data);
        setBookings(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch bookings:", error);
        setLoading(false);
      });
  }, []);



  const filteredBookings = bookings.filter((booking) =>
    booking.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer_number?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
  setBookings((prevBookings) =>
    prevBookings.filter((booking) => booking.customer_id !== id)
  );
};



  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings by name or number..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="p-6 text-center text-lg font-semibold">Loading bookings...</div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-6 text-center text-lg font-semibold text-red-500">
          No Bookings found.
        </div>
      ) : (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">All Bookings ({filteredBookings.length})</h3>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="py-2">Id</th>
                    <th className="py-2">Customer Name</th>
                    <th className="py-2">Phone Number</th>
                    <th className="py-2">City</th>
                    <th className="py-2">Service Name</th>
                    <th className="py-2">Booking Date</th>
                    <th className="py-2">Booking Time</th>
                    <th className="py-2">Booking Status</th>
                    <th className="py-2">Amount</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.customer_id} className="border-b hover:bg-gray-50">
                      <td className="py-2">{booking.customer_id}</td>
                      <td className="py-2">{booking.customer_name}</td>
                      <td className="py-2">{booking.customer_number}</td>
                      <td className="py-2">{booking.city}</td>
                      <td className="py-2">{booking.booking_service_name}</td>
                      <td className="py-2">
                        {booking.booking_date
                          ? new Date(booking.booking_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td className="py-2">{booking.booking_time}</td>
                      <td className="py-2">{booking.booking_status}</td>
                      <td className="py-2">₹{booking.booking_amount?.toLocaleString() || '0'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          
                          <Button size="sm" variant="secondary">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDelete(booking.customer_id)}
                          >
                            <Trash2 className="h-4 w-4" />
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
      )}
    </div>
  );
}
