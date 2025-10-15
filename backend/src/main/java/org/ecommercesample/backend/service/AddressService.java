package org.ecommercesample.backend.service;

import org.ecommercesample.backend.model.Address;

import java.util.List;


public interface AddressService {
    Address addAddress(Address address,Long userId);
    List<Address> getAddresses(Long userId);
    void deleteAddress(Long addressId, Long userId);
}
