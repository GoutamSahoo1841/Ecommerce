import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';
import { Button } from '../components/ui/Button';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { useGetUserProfileQuery, useProfileMutation } from '../slices/usersApiSlice';
import { MapPin, Plus, Loader2, Check } from 'lucide-react';
import { toast } from 'react-toastify';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const { data: profile, isLoading: loadingProfile } = useGetUserProfileQuery();
  const { data: orders, isLoading: loadingOrders } = useGetMyOrdersQuery();
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(-2); // -2 is uninitialized
  const [isNewAddress, setIsNewAddress] = useState(false);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoadingData = loadingProfile || loadingOrders;

  const uniqueAddresses = useMemo(() => {
    const addrMap = {};
    
    // 1. Add addresses from user profile
    if (profile && profile.addresses) {
      profile.addresses.forEach((addr) => {
        if (addr.address) {
          const key = `${addr.address.trim().toLowerCase()}|${addr.city.trim().toLowerCase()}|${addr.postalCode.trim().toLowerCase()}|${addr.country.trim().toLowerCase()}`;
          addrMap[key] = {
            address: addr.address,
            city: addr.city,
            postalCode: addr.postalCode,
            country: addr.country,
          };
        }
      });
    }

    // 2. Add addresses from order history
    if (orders) {
      orders.forEach((order) => {
        if (order.shippingAddress && order.shippingAddress.address) {
          const key = `${order.shippingAddress.address.trim().toLowerCase()}|${order.shippingAddress.city.trim().toLowerCase()}|${order.shippingAddress.postalCode.trim().toLowerCase()}|${order.shippingAddress.country.trim().toLowerCase()}`;
          addrMap[key] = {
            address: order.shippingAddress.address,
            city: order.shippingAddress.city,
            postalCode: order.shippingAddress.postalCode,
            country: order.shippingAddress.country,
          };
        }
      });
    }

    return Object.values(addrMap);
  }, [orders, profile]);

  useEffect(() => {
    if (selectedAddressIndex === -2 && !isLoadingData) {
      if (uniqueAddresses.length > 0) {
        if (shippingAddress?.address) {
          const matchIdx = uniqueAddresses.findIndex(
            (a) =>
              a.address.toLowerCase() === shippingAddress.address.toLowerCase() &&
              a.city.toLowerCase() === shippingAddress.city.toLowerCase() &&
              a.postalCode.toLowerCase() === shippingAddress.postalCode.toLowerCase() &&
              a.country.toLowerCase() === shippingAddress.country.toLowerCase()
          );
          if (matchIdx !== -1) {
            setSelectedAddressIndex(matchIdx);
            setIsNewAddress(false);
          } else {
            setSelectedAddressIndex(-1);
            setIsNewAddress(true);
            setAddress(shippingAddress.address);
            setCity(shippingAddress.city);
            setPostalCode(shippingAddress.postalCode);
            setCountry(shippingAddress.country);
          }
        } else {
          setSelectedAddressIndex(0);
          setIsNewAddress(false);
        }
      } else {
        setSelectedAddressIndex(-1);
        setIsNewAddress(true);
        if (shippingAddress) {
          setAddress(shippingAddress.address || '');
          setCity(shippingAddress.city || '');
          setPostalCode(shippingAddress.postalCode || '');
          setCountry(shippingAddress.country || '');
        }
      }
    }
  }, [isLoadingData, uniqueAddresses, shippingAddress, selectedAddressIndex]);

  const handleEditAddress = (addr) => {
    setAddress(addr.address);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setCountry(addr.country);
    setSelectedAddressIndex(-1);
    setIsNewAddress(true);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let finalAddress;
    if (isNewAddress) {
      if (!address || !city || !postalCode || !country) {
        toast.error('Please fill in all address fields');
        return;
      }
      finalAddress = { address, city, postalCode, country };
      
      // Save new address to profile in DB
      if (profile) {
        const isAlreadySaved = (profile.addresses || []).some(
          (a) =>
            a.address.trim().toLowerCase() === address.trim().toLowerCase() &&
            a.city.trim().toLowerCase() === city.trim().toLowerCase() &&
            a.postalCode.trim().toLowerCase() === postalCode.trim().toLowerCase() &&
            a.country.trim().toLowerCase() === country.trim().toLowerCase()
        );
        
        if (!isAlreadySaved) {
          try {
            const updatedAddresses = [...(profile.addresses || []), finalAddress];
            await updateProfile({ addresses: updatedAddresses }).unwrap();
          } catch (err) {
            console.error('Failed to save address to profile', err);
          }
        }
      }
    } else {
      if (selectedAddressIndex < 0 || selectedAddressIndex >= uniqueAddresses.length) {
        toast.error('Please select an address');
        return;
      }
      finalAddress = uniqueAddresses[selectedAddressIndex];
    }
    dispatch(saveShippingAddress(finalAddress));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Shipping</h1>
        <p className="text-sm text-muted-foreground">Select or enter your delivery details</p>
      </div>

      {isLoadingData ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-sm text-muted-foreground">Loading addresses...</span>
        </div>
      ) : (
        <form onSubmit={submitHandler} className="space-y-6">
          {uniqueAddresses.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Select Delivery Address
              </label>
              <div className="grid grid-cols-1 gap-3">
                {uniqueAddresses.map((addr, idx) => {
                  const isSelected = selectedAddressIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedAddressIndex(idx);
                        setIsNewAddress(false);
                      }}
                      className={`relative flex items-start bg-card p-4 border rounded-2xl hover:border-primary transition-all cursor-pointer select-none shadow-sm pb-12 ${
                        isSelected ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border/50'
                      }`}
                    >
                      <div className="flex items-center h-5">
                        <input
                          type="radio"
                          name="shippingAddressOption"
                          checked={isSelected}
                          readOnly
                          className="w-4 h-4 text-primary bg-secondary border-border/50 focus:ring-primary/30 cursor-pointer"
                        />
                      </div>
                      <div className="ml-3.5 flex-1 text-sm">
                        <span className="font-bold text-foreground block mb-0.5">
                          Address Option #{idx + 1}
                        </span>
                        <span className="text-muted-foreground leading-relaxed block text-xs">
                          {addr.address}, {addr.city} {addr.postalCode}, {addr.country}
                        </span>
                      </div>
                      {isSelected && (
                        <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-0.5">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      )}
                      <div className="absolute bottom-3 right-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditAddress(addr);
                          }}
                          className="text-xs font-bold text-primary hover:text-primary/80 transition-colors bg-secondary/80 px-2.5 py-1 rounded-lg border border-border/40 hover:border-primary/30"
                        >
                          Edit Address
                        </button>
                      </div>
                    </div>
                  );
                })}

                {/* Option for New Address */}
                <div
                  onClick={() => {
                    setSelectedAddressIndex(-1);
                    setIsNewAddress(true);
                  }}
                  className={`flex items-start bg-card p-4 border rounded-2xl hover:border-primary transition-all cursor-pointer select-none shadow-sm ${
                    selectedAddressIndex === -1 ? 'border-primary bg-primary/5 ring-1 ring-primary/30' : 'border-border/50'
                  }`}
                >
                  <div className="flex items-center h-5">
                    <input
                      type="radio"
                      name="shippingAddressOption"
                      checked={selectedAddressIndex === -1}
                      readOnly
                      className="w-4 h-4 text-primary bg-secondary border-border/50 focus:ring-primary/30 cursor-pointer"
                    />
                  </div>
                  <div className="ml-3.5 flex-1 flex items-center gap-1.5 text-sm font-bold text-foreground">
                    <Plus className="h-4 w-4 text-primary" />
                    Deliver to a new address
                  </div>
                </div>
              </div>
            </div>
          )}

          {isNewAddress && (
            <div className="space-y-4 p-5 bg-card/45 border border-border/50 rounded-2xl shadow-inner animate-in fade-in slide-in-from-top-3 duration-250">
              {uniqueAddresses.length > 0 && (
                <h3 className="text-sm font-bold text-foreground mb-3 pb-1 border-b border-border/20">
                  New Delivery Details
                </h3>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  required={isNewAddress}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  required={isNewAddress}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Postal Code</label>
                <input
                  type="text"
                  placeholder="Enter postal code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  required={isNewAddress}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-muted-foreground">Country</label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-secondary border border-border/50 rounded-xl px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all placeholder:text-muted-foreground/60"
                  required={isNewAddress}
                />
              </div>
            </div>
          )}

          <Button type="submit" disabled={loadingUpdateProfile} className="w-full shadow-md text-white font-bold h-11">
            {loadingUpdateProfile ? 'Saving Details...' : 'Continue to Payment'}
          </Button>
        </form>
      )}
    </FormContainer>
  );
};

export default ShippingScreen;
