import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';

interface Address {
  id?: string;
  label: string;
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export default function AddressFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState<Address>({
    label: '',
    line1: '',
    line2: '',
    city: '',
    postcode: '',
    phone: '',
    latitude: undefined,
    longitude: undefined,
    isDefault: false,
  });

  // Fetch address if editing
  const { data: existingAddress, isLoading } = useQuery({
    queryKey: ['address', id],
    queryFn: async () => {
      const response = await apiClient.get(`/users/addresses/${id}`);
      return response.data as Address;
    },
    enabled: isEdit,
  });

  useEffect(() => {
    if (existingAddress) {
      setFormData(existingAddress);
    }
  }, [existingAddress]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: async (data: Address) => {
      const { id: _, userId: __, ...submitData } = data as any;
      if (isEdit) {
        return apiClient.patch(`/users/addresses/${id}`, submitData);
      } else {
        return apiClient.post('/users/addresses', submitData);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Address updated' : 'Address added');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      navigate('/addresses');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message?.[0] || 'Failed to save address');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleMapPin = async () => {
    // Use browser geolocation OR geocode address
    if (!formData.line1 || !formData.city) {
      toast.error('Please enter street and city to pin location');
      return;
    }

    // Try browser geolocation first
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: Number(position.coords.latitude),
            longitude: Number(position.coords.longitude),
          });
          toast.success('Location pinned from your device');
        },
        (error) => {
          // If geolocation fails, Ask for device Location Permission
          if(error.code === error.PERMISSION_DENIED) {
             toast.error('Please allow location access to pin your address');
          } else {
             toast.error('Failed to get location: ' + error.message);
          }
        }
      );
    } else {
      toast.error('Geolocation not supported by your browser');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || !formData.line1 || !formData.city || !formData.postcode || !formData.phone) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      toast.error('Please pin the location on the map');
      return;
    }
    mutation.mutate(formData);
  };

  if (isEdit && isLoading) {
    return <div className="text-center py-8">Loading address...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-brand-700">
        {isEdit ? 'Edit Address' : 'Add New Address'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-brand-50 border-2 border-brand-200 rounded-lg p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Label *</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="e.g., Home, Work"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Street Address *</label>
          <input
            type="text"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            placeholder="e.g., 123 Main St"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Apt/Suite (Optional)</label>
          <input
            type="text"
            name="line2"
            value={formData.line2}
            onChange={handleChange}
            placeholder="e.g., Apt 4B"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="e.g., New York"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Postal Code *</label>
          <input
            type="text"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            placeholder="e.g., 10001"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Phone Number *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g., +91 98765 43210"
            className="w-full border-2 border-brand-300 rounded px-3 py-2 focus:border-brand-600 focus:outline-none"
            required
          />
        </div>

        {/* Location Coordinates */}
        <div className="bg-gray-800 p-3 rounded border-2 border-blue-800">
          <p className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-1"><MapPin className="w-3 h-3" /> Location Coordinates</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-gray-400 font-semibold">Latitude</p>
              <p className="text-blue-400 font-mono">
                {formData.latitude ? Number(formData.latitude).toFixed(6) : 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 font-semibold">Longitude</p>
              <p className="text-blue-400 font-mono">
                {formData.longitude ? Number(formData.longitude).toFixed(6) : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-brand-700">Set as Default</label>
          <input
            type="checkbox"
            name="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="w-4 h-4 border-2 border-brand-300 rounded"
          />
        </div>

        <div className="border-t pt-4">
          <button
            type="button"
            onClick={handleMapPin}
            className="w-full bg-blue-500 text-white py-2 rounded font-bold hover:bg-blue-600"
          >
            <MapPin className="w-4 h-4 mr-1 inline" /> {formData.latitude ? 'Change Location' : 'Pin Location on Map'}
          </button>
          <p className="text-xs text-gray-400 mt-2">
            {formData.latitude
              ? '✓ Location pinned. Click to change.'
              : 'Click to use your device GPS or open Google Maps'}
          </p>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/addresses')}
            className="flex-1 bg-gray-600 text-gray-200 py-3 rounded font-bold hover:bg-gray-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex-1 bg-brand-600 text-white py-3 rounded font-bold hover:bg-brand-700 disabled:bg-gray-600"
          >
            {mutation.isPending ? 'Saving...' : isEdit ? 'Update Address' : 'Add Address'}
          </button>
        </div>
      </form>
    </div>
  );
}
