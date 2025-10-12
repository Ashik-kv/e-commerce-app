package org.ecommercesample.backend.service;

import org.ecommercesample.backend.model.Address;
import org.springframework.stereotype.Service;

import java.util.List;


public interface AddressService {
    Address addAddress(Address address,Long userId);
    List<Address> getAddresses(Long userId);
}
