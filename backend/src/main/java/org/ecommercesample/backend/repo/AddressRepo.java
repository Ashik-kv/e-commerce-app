package org.ecommercesample.backend.repo;

import org.ecommercesample.backend.model.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByUserId(Long userId);
}
