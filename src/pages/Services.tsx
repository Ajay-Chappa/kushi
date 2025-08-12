import { useState, useEffect } from 'react';
import { Wrench, Plus, Edit, Trash2, Eye, Search, Filter, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import axios from 'axios';

export interface Service {
  id: string;
  title: string;
  description: string;
  details: string;
  image: string;
  price: number;
  rating: number;
  bookingCount: number;
  duration: number;
  category: string;
  tags: string[];
  available: boolean;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    service_name: '',
    service_cost: '',
    service_description: '',
    service_details: '',
    service_image_url: '',
    service_type: '',
    rating: '',
    rating_count: '',
    remarks: '',
    created_by: '',
    updated_by: '',
    create_date: '',
    updated_date: '',
    active: 'Y',
  });

  // ✅ Fetch all services from backend on load
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:8081/customer/all-services');
        const data = response.data;

        const mappedServices = data.map((item: any) => ({
          id: item.id?.toString() || crypto.randomUUID(),
          title: item.service_name,
          description: item.service_description,
          details: item.service_details,
          image: item.service_image_url,
          price: item.service_cost,
          rating: Number(item.rating) || 0,
          bookingCount: Number(item.rating_count) || 0,
          duration: 60,
          category: item.service_type || 'General',
          tags: [],
          available: item.active === 'Y',
        }));

        setServices(mappedServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        create_date: new Date().toISOString().split('T')[0],
        updated_date: new Date().toISOString().split('T')[0],
      };

      const response = await axios.post('http://localhost:8081/customer/add-service', payload);

      const newService: Service = {
        id: response.data.id?.toString() || crypto.randomUUID(),
        title: response.data.service_name,
        description: response.data.service_description,
        details: response.data.service_details,
        image: response.data.service_image_url,
        price: response.data.service_cost,
        rating: Number(response.data.rating) || 0,
        bookingCount: Number(response.data.rating_count) || 0,
        duration: 60,
        category: response.data.service_type || 'General',
        tags: [],
        available: response.data.active === 'Y',
      };

      setServices(prev => [newService, ...prev]);
      setShowForm(false);
      setFormData({
        service_name: '',
        service_cost: '',
        service_description: '',
        service_details: '',
        service_image_url: '',
        service_type: '',
        rating: '',
        rating_count: '',
        remarks: '',
        created_by: '',
        updated_by: '',
        create_date: '',
        updated_date: '',
        active: 'Y',
      });

      alert('Service added successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to add service');
    }
  };

  const toggleAvailability = (serviceId: string) => {
    setServices(prev =>
      prev.map(service =>
        service.id === serviceId ? { ...service, available: !service.available } : service
      )
    );
  };

 const handleDelete = async (serviceId: string) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this service?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:8081/customer/delete-service/1`);
    setServices(prev => prev.filter(service => service.id !== serviceId));
    alert("Service deleted successfully!");
  } catch (error) {
    console.error("Failed to delete service:", error);
    alert("Failed to delete service. Please try again.");
  }
};


  const filteredServices = services.filter(service => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(services.map(service => service.category))];

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <Wrench className="h-6 w-6 text-black" />
          <h1 className="text-xl md:text-2xl font-bold text-black truncate">Services Management</h1>
        </div>
        <Button className="flex-shrink-0" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Add New Service</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 md:p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-black"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredServices.map((service) => (
          <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-video overflow-hidden bg-gray-100">
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <CardContent className="p-3 md:p-4 text-black">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-black text-sm md:text-base leading-tight">{service.title}</h3>
                  <p className="text-xs md:text-sm mt-1">{service.description}</p>
                  {service.details && <p className="text-xs md:text-sm mt-1">{service.details}</p>}
                </div>
                <Badge variant={service.available ? 'success' : 'danger'} className="ml-2 flex-shrink-0">
                  {service.available ? 'Available' : 'Unavailable'}
                </Badge>
              </div>

              <div className="text-xs md:text-sm mt-1">
                <div><b>Rating:</b> {service.rating} | <b>Bookings:</b> {service.bookingCount}</div>
                <div><b>Price:</b> ₹{service.price}</div>
                <div><b>Category:</b> {service.category}</div>
              </div>

              <div className="flex items-center space-x-1 md:space-x-2 flex-wrap gap-1 mt-3">
                <Button size="sm" variant="secondary" className="flex-1">
                  <Eye className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">View</span>
                </Button>
                <Button size="sm" variant="secondary">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={service.available ? 'danger' : 'success'}
                  onClick={() => toggleAvailability(service.id)}
                >
                  {service.available ? 'Disable' : 'Enable'}
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(service.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Service Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded-md shadow-md w-full max-w-lg space-y-4 text-black"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Add New Service</h2>
              <button type="button" onClick={() => setShowForm(false)}>
                <X className="h-5 w-5 text-black" />
              </button>
            </div>
            <input name="service_name" placeholder="Service Name" value={formData.service_name} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" required />
            <input name="service_cost" placeholder="Service Cost" type="number" value={formData.service_cost} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" required />
            <input name="service_description" placeholder="Description" value={formData.service_description} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            
            <input name="service_image_url" placeholder="Image URL" value={formData.service_image_url} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            <input name="service_type" placeholder="Type" value={formData.service_type} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            <input name="rating" placeholder="Rating" value={formData.rating} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            <input name="rating_count" placeholder="Rating Count" value={formData.rating_count} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            
            <input name="created_by" placeholder="Created By" value={formData.created_by} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            <input name="updated_by" placeholder="Updated By" value={formData.updated_by} onChange={handleFormChange} className="input border border-black px-3 py-2 rounded-md text-black placeholder-black" />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit">Add</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
